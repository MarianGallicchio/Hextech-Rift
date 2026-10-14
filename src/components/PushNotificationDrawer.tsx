import React, { useState } from 'react';
import { AppNotification } from '../types/tournament';
import { X, Bell, CheckCircle2, Swords, Trophy, ExternalLink, Zap, AlertCircle } from 'lucide-react';
import { hextechAudio } from '../utils/audio';

interface PushNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onSendTestNotification: () => void;
  onSelectAction: (notification: AppNotification) => void;
}

export const PushNotificationDrawer: React.FC<PushNotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSendTestNotification,
  onSelectAction
}) => {
  const [permissionStatus, setPermissionStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );

  if (!isOpen) return null;

  const handleRequestPushPermission = async () => {
    hextechAudio.playClick();
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPermissionStatus(perm);
        if (perm === 'granted') {
          hextechAudio.playVictory();
          new Notification('Hextech Rift · Notificaciones Activadas', {
            body: 'Recibirás avisos automáticos 15 minutos antes de tus partidas de torneo.',
            icon: '/favicon.ico'
          });
        }
      } catch {
        // Fallback
      }
    }
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'MATCH_ALERT':
        return <Swords className="w-4 h-4 text-rose-400" />;
      case 'LOBBY_CODE':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'RESULT_VERIFIED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'PRIZE_WON':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-[#c89b3c]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-[#08101e] border-l-2 border-[#c89b3c]/40 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 bg-[#060b13] border-b border-[#c89b3c]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#c89b3c]" />
            <h3 className="text-base font-cinzel font-bold text-[#f0e6d2]">
              Alertas & Próximos Encuentros
            </h3>
          </div>
          <button
            onClick={() => {
              hextechAudio.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Web Push Permission Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c192e] to-[#07101e] border border-[#0ac8b9]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#f0e6d2]">
                Notificaciones Push en Navegador
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">
                {permissionStatus === 'granted' ? 'Activado' : 'Pendiente'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recibe notificaciones en tu escritorio o móvil cuando tu sala esté creada y cuando falten 15 minutos para tu partida.
            </p>

            {permissionStatus !== 'granted' ? (
              <button
                onClick={handleRequestPushPermission}
                className="w-full py-2 rounded-lg bg-[#0ac8b9] hover:bg-[#0fd9c9] text-black font-semibold text-xs font-mono transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Permitir Notificaciones Push</span>
              </button>
            ) : (
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Push del sistema habilitado</span>
              </div>
            )}
          </div>

          {/* Test Push Simulator */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-mono text-slate-400">
              Notificaciones ({notifications.length})
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  hextechAudio.playClick();
                  onSendTestNotification();
                }}
                className="text-xs font-mono text-[#0ac8b9] hover:underline cursor-pointer"
              >
                + Simular Aviso Próximo
              </button>
              <button
                onClick={() => {
                  hextechAudio.playClick();
                  onMarkAllAsRead();
                }}
                className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
              >
                Marcar leídas
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No tienes avisos pendientes en la Grieta.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                    n.read
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                      : 'bg-slate-900/90 border-[#c89b3c]/40 text-slate-200 shadow-[0_0_15px_rgba(200,155,60,0.1)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-black/40 border border-slate-700">
                        {getNotificationIcon(n.type)}
                      </div>
                      <h4 className="text-xs font-bold text-[#f0e6d2]">{n.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {n.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pl-7">
                    {n.message}
                  </p>

                  {n.actionLabel && (
                    <div className="pl-7 pt-1">
                      <button
                        onClick={() => {
                          hextechAudio.playClick();
                          onSelectAction(n);
                        }}
                        className="text-xs font-mono font-semibold text-[#0ac8b9] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{n.actionLabel}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#060b13] border-t border-slate-800 text-center text-[11px] font-mono text-slate-500">
          Sincronizado con Tournament Scheduler
        </div>
      </div>
    </div>
  );
};
