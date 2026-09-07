import React, { useState, useCallback } from 'react';
import { JaaSMeeting } from '@jitsi/react-sdk';
import { Video, AlertCircle, Loader2, Users, ShieldCheck } from 'lucide-react';

/**
 * JaasClassroom — Embedded JaaS (8x8.vc) live classroom component.
 *
 * Security model:
 *  - All join credentials (appId, roomName, jwt) are supplied by the backend
 *    after full authorization verification.
 *  - This component NEVER generates room names or JWTs.
 *  - User identity (displayName, email) comes from the authenticated currentUser
 *    object from AppContext — not from free-text input.
 *
 * Props:
 *   jaas        { appId, roomName, jwt, domain? } — from backend response
 *   currentUser — authenticated user from AppContext
 *   session     — session object (for display metadata)
 *   isTrainer   — whether the local user is the session moderator
 *   onConferenceJoined  — optional event callback
 *   onConferenceLeft    — optional event callback
 *   onReadyToClose      — called when JaaS signals it's ready to close
 *   onParticipantJoined — optional event callback
 *   onParticipantLeft   — optional event callback
 */
export const JaasClassroom = ({
  jaas,
  currentUser,
  session,
  isTrainer = false,
  onConferenceJoined,
  onConferenceLeft,
  onReadyToClose,
  onParticipantJoined,
  onParticipantLeft
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [participantCount, setParticipantCount] = useState(1);

  // Validate all required JaaS join credentials
  const appId = jaas?.appId;
  const roomName = jaas?.roomName;
  const jwt = jaas?.jwt;

  const roleLabel = isTrainer ? ' (Trainer / Faculty)' : ' (Officer)';
  const displayName = `${currentUser?.name?.trim() || (isTrainer ? 'MoES Faculty' : 'MoES Trainee Officer')}${roleLabel}`;

  const userInfo = {
    displayName,
    email: currentUser?.email || ''
  };

  const handleApiReady = useCallback((externalApi) => {
    setLoading(false);
    setConnectionStatus('connecting');

    externalApi.on('videoConferenceJoined', (data) => {
      setConnectionStatus('connected');
      onConferenceJoined?.(data);
    });

    externalApi.on('videoConferenceLeft', (data) => {
      setConnectionStatus('disconnected');
      onConferenceLeft?.(data);
    });

    externalApi.on('readyToClose', () => {
      setConnectionStatus('disconnected');
      onReadyToClose?.();
    });

    externalApi.on('participantJoined', (data) => {
      setParticipantCount((prev) => prev + 1);
      onParticipantJoined?.(data);
    });

    externalApi.on('participantLeft', (data) => {
      setParticipantCount((prev) => Math.max(1, prev - 1));
      onParticipantLeft?.(data);
    });
  }, [onConferenceJoined, onConferenceLeft, onReadyToClose, onParticipantJoined, onParticipantLeft]);

  // Guard: credentials must all be present
  if (!appId || !roomName || !jwt) {
    return (
      <div className="w-full h-[600px] flex flex-col items-center justify-center bg-slate-900 rounded-2xl border border-amber-800/50 text-slate-300 p-6 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-amber-500" />
        <h3 className="text-base font-bold text-white">Live Classroom Not Available</h3>
        <p className="text-xs text-slate-400 max-w-md">
          {!appId
            ? 'JaaS credentials are not configured on the server. Add JAAS_APP_ID, JAAS_KEY_ID, and JAAS_PRIVATE_KEY to the backend .env file.'
            : 'Authorization data is incomplete. Please try leaving and re-joining the session.'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[600px] flex flex-col items-center justify-center bg-slate-900 rounded-2xl border border-red-900/50 text-slate-300 p-6 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <h3 className="text-base font-bold text-white">Unable to Connect to Live Classroom</h3>
        <p className="text-xs text-slate-400 max-w-md">{error}</p>
        <button
          onClick={() => setError(null)}
          className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 flex flex-col">
      {/* Classroom Status Sub-bar */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-semibold text-white">
            <Video className="w-3.5 h-3.5 text-sky-400" />
            <span className="truncate max-w-[200px]">{roomName}</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                  : 'bg-amber-500 animate-ping'
              }`}
            />
            <span className="capitalize">
              {connectionStatus === 'connected' ? 'Secure JaaS Live Link' : 'Connecting...'}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{participantCount} In Meeting</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 text-[11px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
            <ShieldCheck className="w-3 h-3" />
            <span>{displayName}</span>
          </span>
        </div>
      </div>

      {/* Embedded JaaS Meeting Container */}
      <div className="relative w-full h-[620px] sm:h-[680px] lg:h-[740px] bg-black">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 text-white space-y-4">
            <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-sm font-bold">Joining Live Classroom...</p>
              <p className="text-xs text-slate-400">Authenticating secure JaaS session on 8x8.vc</p>
            </div>
          </div>
        )}

        <JaaSMeeting
          appId={appId}
          roomName={roomName}
          jwt={jwt}
          configOverwrite={{
            startWithAudioMuted: !isTrainer,
            startWithVideoMuted: false,
            disableDeepLinking: true,
            prejoinPageEnabled: false,
            enableWelcomePage: false,
            enableClosePage: false,
            defaultLanguage: 'en',
            toolbarButtons: [
              'camera',
              'chat',
              'closedcaptions',
              'desktop',
              'filmstrip',
              'fullscreen',
              'hangup',
              'microphone',
              'participants-pane',
              'raisehand',
              'select-background',
              'settings',
              'tileview',
              'toggle-camera',
              'videoquality',
              ...(isTrainer ? ['mute-everyone', 'mute-video-everyone', 'recording', 'stats'] : [])
            ]
          }}
          interfaceConfigOverwrite={{
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            DEFAULT_BACKGROUND: '#061329',
            HIDE_INVITE_MORE_HEADER: true
          }}
          userInfo={userInfo}
          onApiReady={handleApiReady}
          getIFrameRef={(iframeRef) => {
            if (iframeRef) {
              iframeRef.style.height = '100%';
              iframeRef.style.width = '100%';
              iframeRef.style.border = '0';
            }
          }}
        />
      </div>
    </div>
  );
};
