/**
 * jaasJwt.js — Server-side JaaS JWT generation utility.
 *
 * SECURITY:
 *  - All credentials are read from process.env, never from client input.
 *  - The private key is NEVER returned to the frontend.
 *  - The generated JWT is short-lived (4 hours by default).
 *  - Do NOT log privateKey, jwt, or any credential value.
 */

const jwt = require("jsonwebtoken");

/**
 * Reads and validates JaaS environment configuration.
 * Throws a descriptive error at boot-time if vars are missing.
 */
const getJaasConfig = () => {
    const appId = process.env.JAAS_APP_ID;
    const keyId = process.env.JAAS_KEY_ID;
    const domain = process.env.JAAS_DOMAIN || "8x8.vc";

    // Private key may contain literal \n (from .env) — normalize to real newlines
    let privateKey = process.env.JAAS_PRIVATE_KEY || "";
    if (privateKey && !privateKey.includes("\n")) {
        privateKey = privateKey.replace(/\\n/g, "\n");
    }

    if (!appId || !keyId || !privateKey) {
        throw new Error(
            "JaaS configuration is incomplete. Set JAAS_APP_ID, JAAS_KEY_ID, and JAAS_PRIVATE_KEY in your backend .env file."
        );
    }

    return { appId, keyId, domain, privateKey };
};

/**
 * Generates a short-lived JaaS JWT for a specific user and meeting room.
 *
 * @param {object} user        - Authenticated req.user object from session
 * @param {string} roomName    - The JaaS room name (e.g. "capacity-connect-abc123")
 * @param {boolean} isModerator - true for trainer (moderator), false for trainee (participant)
 * @param {number} [expiresInSeconds=14400] - JWT lifetime (default 4 hours)
 * @returns {object} { jwt, appId, roomName, domain }
 */
const generateJaasJwt = (user, roomName, isModerator = false, expiresInSeconds = 14400) => {
    const { appId, keyId, domain, privateKey } = getJaasConfig();

    const now = Math.floor(Date.now() / 1000);

    const payload = {
        // Standard JWT claims
        iss: "chat",
        sub: appId,
        aud: "jitsi",
        exp: now + expiresInSeconds,
        nbf: now - 10, // 10-second leeway
        iat: now,
        room: roomName,

        // JaaS user context
        context: {
            user: {
                id: String(user._id || user.id || ""),
                name: user.name || "CAPACITY CONNECT User",
                email: user.email || "",
                moderator: isModerator,
                "hidden-from-recorder": false
            },
            features: {
                livestreaming: false,
                "outbound-call": false,
                "sip-outbound-call": false,
                transcription: false,
                recording: isModerator // Only moderator can record
            }
        }
    };

    const token = jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        keyid: keyId,
        header: {
            alg: "RS256",
            kid: keyId,
            typ: "JWT"
        }
    });

    return {
        jwt: token,
        appId,
        roomName,
        domain
    };
};

/**
 * Extracts the stable room suffix from a legacy meet.jit.si URL, or returns
 * the raw value if it is already just a room name.
 *
 * Examples:
 *   "https://meet.jit.si/capacity-connect-abc123" -> "capacity-connect-abc123"
 *   "capacity-connect-abc123"                     -> "capacity-connect-abc123"
 *
 * @param {string} value - meetingUrl or meetingRoom field from the database
 * @returns {string|null}
 */
const extractRoomName = (value) => {
    if (!value || typeof value !== "string") return null;

    try {
        // If it looks like a URL, extract the pathname
        if (value.startsWith("http://") || value.startsWith("https://")) {
            const url = new URL(value);
            const room = url.pathname.replace(/^\/+/, "").trim();
            return room || null;
        }
    } catch {
        // Not a valid URL — fall through
    }

    // Already a plain room name
    return value.trim() || null;
};

module.exports = { generateJaasJwt, extractRoomName, getJaasConfig };
