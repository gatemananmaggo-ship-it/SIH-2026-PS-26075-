import React, { useState, useCallback, useMemo } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Video, AlertCircle, Loader2, Users } from 'lucide-react';

/**
 * Safely extracts the Jitsi room name from a canonical meeting URL.
 * Example: 'https://meet.jit.si/capacity-connect-a1b2c3d4' -> 'capacity-connect-a1b2c3d4'
 */
export const extractJitsiRoomName = (meetingUrl) => {
  if (!meetingUrl || typeof meetingUrl !== 'string') return null;
  try {
    const parsed = new URL(meetingUrl);
    const pathname = parsed.pathname.replace(/^\/+/, '');
    return pathname || null;
  } catch {
    // If a relative path or direct room name was passed
    const clean = meetingUrl.replace(/^https?:\/\/[^/]+\//, '').replace(/^\/+/, '');
    return clean || null;
  }
};

export const JitsiClassroom = ({
  meetingUrl,
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
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting' | 'connected' | 'disconnected'
  const [participantCount, setParticipantCount] = useState(1);

  const roomName = useMemo(() => extractJitsiRoomName(meetingUrl), [meetingUrl]);

  const domain = 'meet.jit.si';

  const userInfo = useMemo(() => {
    const roleLabel = isTrainer ? ' (Trainer / Faculty)' : ' (Officer)';
    const baseName = currentUser?.name?.trim() || (isTrainer ? 'MoES Faculty' : 'MoES Trainee Officer');
    return {
      displayName: `${baseName}${roleLabel}`,
      email: currentUser?.email || undefined
    };
  }, [currentUser, isTrainer]);

  const handleApiReady = useCallback((externalApi) => {
    setLoading(false);
    setConnectionStatus('connecting');

    // Register event listeners on Jitsi external API instance
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

  if (!meetingUrl || !roomName) {
    return (
      <div className="w-full h-[600px] flex flex-col items-center justify-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-300 p-6 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-amber-500" />
        <h3 className="text-base font-bold text-white">Classroom Room Unavailable</h3>
        <p className="text-xs text-slate-400 max-w-md">
          The live meeting room link has not been generated or is invalid. Please contact the session administrator or retry joining.
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
            <span>Room: {roomName}</span>
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
            <span className="capitalize">{connectionStatus === 'connected' ? 'Secure Jitsi Live Link' : 'Connecting...'}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{participantCount} In Meeting</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
            {userInfo.displayName}
          </span>
        </div>
      </div>

      {/* Embedded Jitsi Meeting Container */}
      <div className="relative w-full h-[620px] sm:h-[680px] lg:h-[740px] bg-black">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 text-white space-y-4">
            <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-sm font-bold">Joining Live Classroom...</p>
              <p className="text-xs text-slate-400">Connecting securely to MoES Jitsi Meeting Server</p>
            </div>
          </div>
        )}

        <JitsiMeeting
          domain={domain}
          roomName={roomName}
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
              'download',
              'etherpad',
              'feedback',
              'filmstrip',
              'fullscreen',
              'hangup',
              'help',
              'highlight',
              'invite',
              'linktosalesforce',
              'livestreaming',
              'microphone',
              'mute-everyone',
              'mute-video-everyone',
              'participants-pane',
              'profile',
              'raisehand',
              'recording',
              'security',
              'select-background',
              'settings',
              'shareaudio',
              'sharedvideo',
              'shortcuts',
              'stats',
              'tileview',
              'toggle-camera',
              'videoquality',
              'whiteboard'
            ]
          }}
          interfaceConfigOverwrite={{
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: '',
            DEFAULT_BACKGROUND: '#061329',
            DISABLE_VIDEO_BACKGROUND: false,
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
