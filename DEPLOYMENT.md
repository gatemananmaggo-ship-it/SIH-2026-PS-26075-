# CAPACITY CONNECT — Deployment Guide

**Architecture:** Netlify (frontend) + AWS EC2 (backend) + MongoDB Atlas + JaaS (live classroom)

> ⚠️ **Never commit real credentials.** All secrets are managed through deployment platform environment variables, not source files.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Frontend — Netlify](#frontend--netlify)
3. [Backend — AWS EC2](#backend--aws-ec2)
4. [Database — MongoDB Atlas](#database--mongodb-atlas)
5. [JaaS — Live Classroom](#jaas--live-classroom)
6. [Cross-Origin Cookie Notes](#cross-origin-cookie-notes)
7. [Health Check](#health-check)
8. [PM2 Process Management](#pm2-process-management)
9. [Environment Variables Reference](#environment-variables-reference)

---

## Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 18.x LTS |
| npm | 9.x |
| MongoDB Atlas | M0 or higher |
| JaaS Account | [jaas.8x8.vc](https://jaas.8x8.vc) |

---

## Frontend — Netlify

### Build Settings

In your Netlify dashboard under **Site configuration → Build & deploy**:

| Setting | Value |
|---|---|
| Base directory | `frontend` |
| Build command | `npm install && npm run build` |
| Publish directory | `frontend/dist` |

### Environment Variables (Netlify)

Add in **Site configuration → Environment variables**:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://<your-backend-domain>/api` |

> ✅ This is the **only** frontend environment variable. No secrets go here.

### SPA Routing

The `frontend/public/_redirects` file is already configured:
```
/*    /index.html   200
```
This ensures React handles all client-side navigation routes correctly (no 404 on refresh).

---

## Backend — AWS EC2

### Setup Steps

```bash
# 1. SSH into your EC2 instance
ssh -i your-key.pem ubuntu@<ec2-ip>

# 2. Install Node.js 18 LTS (if not already)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone / upload the project
git clone <your-repo-url> /srv/capacity-connect
cd /srv/capacity-connect/backend

# 4. Install production dependencies
npm install --omit=dev

# 5. Create .env from example and fill in real values
cp .env.example .env
nano .env

# 6. Set NODE_ENV=production in .env (critical for cookies and CORS)

# 7. Start with PM2 (see PM2 section below)
```

### Environment Variables (EC2 `.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
SESSION_SECRET=<strong-random-secret-min-32-chars>
FRONTEND_URL=https://<your-netlify-app>.netlify.app
NODE_ENV=production

JAAS_APP_ID=vpaas-magic-cookie-<your-app-id>
JAAS_KEY_ID=vpaas-magic-cookie-<your-app-id>/<your-key-id>
JAAS_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n<base64-key-content>\n-----END RSA PRIVATE KEY-----
JAAS_DOMAIN=8x8.vc
```

> ⚠️ For `JAAS_PRIVATE_KEY`, replace each real newline with `\n` so it fits on one line in `.env`.  
> The backend utility (`jaasJwt.js`) automatically expands `\n` → real newlines before signing.

### Nginx Reverse Proxy (HTTPS Termination)

The backend must be served over HTTPS. Install Nginx and Certbot:

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Certbot auto-configures HTTPS
sudo certbot --nginx -d api.your-domain.com
```

Nginx config (`/etc/nginx/sites-available/capacity-connect`):
```nginx
server {
    listen 443 ssl;
    server_name api.your-domain.com;

    # SSL managed by Certbot
    ssl_certificate     /etc/letsencrypt/live/api.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.your-domain.com/privkey.pem;

    location / {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.your-domain.com;
    return 301 https://$host$request_uri;
}
```

> ✅ `app.set('trust proxy', 1)` is already configured in `app.js` when `NODE_ENV=production`, which is required for Express to trust the `X-Forwarded-Proto` header from Nginx.

---

## Database — MongoDB Atlas

1. Create a cluster (M0 Free or higher)
2. Create a database user with a strong password
3. Under **Network Access**, add your EC2 instance's **public IP** (or `0.0.0.0/0` for testing, then restrict)
4. Copy the **Connection String** (SRV format) into `MONGO_URI`

---

## JaaS — Live Classroom

JWT signing happens **server-side only** on EC2. The private key never touches the frontend.

### Getting Credentials

1. Go to [https://jaas.8x8.vc/#/apikeys](https://jaas.8x8.vc/#/apikeys)
2. Click **Generate new key**
3. Download the `.pem` private key file — **save it immediately**, it cannot be retrieved again
4. Copy the **App ID** and **Key ID** from the dashboard

### JWT Claims

The backend generates tokens with:

| Claim | Value |
|---|---|
| `iss` | `"chat"` |
| `sub` | Your JaaS App ID |
| `aud` | `"jitsi"` |
| `exp` | `now + 4 hours` |
| `nbf` | `now - 10s` |
| `room` | Session `meetingRoom` value |
| `kid` | Your JaaS Key ID |
| `context.user.moderator` | `true` for trainers, `false` for trainees |

### Room Stability

Each CAPACITY CONNECT session stores a `meetingRoom` value (e.g. `capacity-connect-abc123f4`) in MongoDB.  
- Same room is used every time the same session is started/rejoined
- Trainer and trainee always join the same room
- Refreshing the page → backend reissues a new JWT for the same room

---

## Cross-Origin Cookie Notes

Because Netlify and EC2 are on **different origins**, session cookies require:

| Cookie Attribute | Value | Why |
|---|---|---|
| `secure` | `true` | Required with `sameSite: none` |
| `sameSite` | `none` | Required for cross-origin requests |
| `httpOnly` | `true` | Prevents JS access (XSS protection) |

> ✅ These are automatically applied when `NODE_ENV=production` is set in the backend `.env`.

> ⚠️ If the backend is NOT behind HTTPS, `secure: true` cookies will be silently dropped by browsers. **HTTPS is mandatory for production.**

---

## Health Check

Once deployed, verify the backend is running:

```bash
curl https://api.your-domain.com/health
# Expected: {"status":"ok","service":"capacity-connect-backend","timestamp":"..."}
```

---

## PM2 Process Management

```bash
# Install PM2 globally
npm install -g pm2

# Start the backend
cd /srv/capacity-connect/backend
pm2 start src/server.js --name capacity-connect-backend

# Save PM2 process list (auto-restart after reboot)
pm2 save
pm2 startup  # Follow the printed command to enable on boot

# Useful commands
pm2 logs capacity-connect-backend    # View logs
pm2 status                           # Check process status
pm2 restart capacity-connect-backend # Restart after .env changes
```

---

## Environment Variables Reference

### Backend (EC2 `.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port Express listens on (default: 5000) |
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `SESSION_SECRET` | Yes | Strong random string for session signing |
| `FRONTEND_URL` | Yes | Netlify production URL (e.g. `https://your-app.netlify.app`) |
| `NODE_ENV` | Yes | Set to `production` on EC2 |
| `JAAS_APP_ID` | Yes | JaaS App ID from dashboard |
| `JAAS_KEY_ID` | Yes | JaaS Key ID (`appId/keyId` format) |
| `JAAS_PRIVATE_KEY` | Yes | RSA private key (PEM, `\n`-escaped for single-line) |
| `JAAS_DOMAIN` | No | Default `8x8.vc` |

### Frontend (Netlify environment variables)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | Full backend API URL (e.g. `https://api.your-domain.com/api`) |

> ⚠️ Do **not** add any other variables here. JaaS private keys and MongoDB URIs must **never** appear in Netlify environment variables.

---

## Final Deployment Checklist

```
[ ] EC2 is running and accessible via SSH
[ ] Node.js 18+ installed on EC2
[ ] backend/.env filled with real production values
[ ] NODE_ENV=production set in backend/.env
[ ] Nginx configured with HTTPS (Certbot cert obtained)
[ ] PM2 running the backend (pm2 save + startup configured)
[ ] MongoDB Atlas network access includes EC2 IP
[ ] Netlify build settings configured (base dir, build cmd, publish dir)
[ ] VITE_API_BASE_URL set in Netlify environment variables
[ ] FRONTEND_URL in backend .env matches exact Netlify URL
[ ] GET /health returns {"status":"ok"} from production domain
[ ] Login flow works cross-origin (cookie is set)
[ ] Session persists after browser refresh
[ ] Logout destroys session
[ ] Trainer can create and start a session
[ ] JaaS embedded classroom opens (no meet.jit.si warning)
[ ] Trainee joins same room as trainer
[ ] No real secrets committed to git
```
