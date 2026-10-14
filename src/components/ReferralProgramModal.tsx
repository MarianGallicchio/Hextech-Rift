import React, { useState, useEffect } from 'react';
import { X, Gift, Users, Copy, Check, Sparkles, Trophy, ExternalLink, Shield, ArrowRight } from 'lucide-react';
import { hextechAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ReferralProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  summonerName: string;
}

interface InvitedFriend {
  id: string;
  summonerName: string;
  tagLine: string;
  date: string;
  status: 'REGISTERED' | 'TOURNAMENT_COMPLETED' | 'REWARD_CLAIMED';
  rewardRP: number;
}

export const ReferralProgramModal: React.FC<ReferralProgramModalProps> = ({
  isOpen,
  onClose,
  summonerName
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [claimedRewardId, setClaimedRewardId] = useState<string | null>(null);

  const referralCode = `${summonerName.replace(/\s+/g, '').toUpperCase().substring(0, 6)}2026`;
  const referralLink = `https://hextourneys.gg/ref/${referralCode}`;

  const [friends, setFriends] = useState<InvitedFriend[]>([
    {
      id: 'f_01',
      summonerName: 'ShadowReaper',
      tagLine: 'LAS',
      date: '08 Oct 2026',
      status: 'TOURNAMENT_COMPLETED',
      rewardRP: 650
    },
    {
      id: 'f_02',
      summonerName: 'SilverBullet',
      tagLine: 'LAS',
      date: '10 Oct 2026',
      status: 'TOURNAMENT_COMPLETED',
      rewardRP: 650
    },
    {
      id: 'f_03',
      summonerName: 'DarkLantern',
      tagLine: 'LAS',
      date: '12 Oct 2026',
      status: 'REGISTERED',
      rewardRP: 650
    }
  ]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hextechAudio.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    hextechAudio.playClick();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    hextechAudio.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleClaimRP = (friendId: string) => {
    hextechAudio.playVictory();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, status: 'REWARD_CLAIMED' } : f))
    );
    setClaimedRewardId(friendId);
    setTimeout(() => setClaimedRewardId(null), 3000);
  };

  const completedCount = friends.filter((f) => f.status !== 'REGISTERED').length;
  const totalEarnedRP = friends
    .filter((f) => f.status === 'REWARD_CLAIMED')
    .reduce((acc, f) => acc + f.rewardRP, 0);

  const pendingClaims = friends.filter((f) => f.status === 'TOURNAMENT_COMPLETED').length;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          hextechAudio.playClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl bg-[#08101e] border-2 border-[#c89b3c]/50 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col cursor-default"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#060b13] border-b border-[#c89b3c]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40">
              <Gift className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-cinzel font-bold text-[#f0e6d2]">
                Programa de Referidos Hextech · Recompensas RP
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Invita invocadores y gana Riot Points garantizados en su primer torneo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              hextechAudio.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs font-mono">
          {/* Hero Banner Box */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-r from-[#121c2e] via-[#091428] to-[#1a1c14] border border-[#c89b3c]/40 overflow-hidden space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  +650 RP POR CADA AMIGO QUE COMPLETE SU 1ER TORNEO
                </span>
                <h3 className="text-xl font-cinzel font-bold text-[#f0e6d2] mt-2">
                  Construye tu Hermandad de Invocadores
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed max-w-xl">
                  Comparte tu enlace exclusivo. Cuando tus compañeros jueguen su primera partida de torneo en la plataforma, ambos desbloquean bonificaciones oficiales de Riot Points acreditadas al instante.
                </p>
              </div>

              {/* RP Summary Gauge */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/40 text-center shrink-0 min-w-[130px]">
                <span className="text-[10px] text-slate-400 uppercase block">RP Reclamados</span>
                <span className="text-2xl font-bold text-amber-400 tabular-nums">
                  {totalEarnedRP} RP
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  {pendingClaims > 0 ? `+${pendingClaims * 650} RP pendientes` : 'Al día'}
                </span>
              </div>
            </div>

            {/* Invite Links Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full flex items-center gap-2 p-2 rounded-xl bg-black/70 border border-slate-700">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 px-2 text-xs text-[#0ac8b9] bg-transparent focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copiado' : 'Copiar Enlace'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-black/70 border border-slate-700 shrink-0">
                <span className="text-slate-400 pl-1">Código:</span>
                <span className="text-amber-400 font-bold">{referralCode}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Copiar código de referido"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Tier Milestones Progress */}
          <div className="p-4 rounded-xl hextech-card border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#f0e6d2] uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Escalafón de Recompensas por Amigos ({completedCount}/10)
              </h4>
              <span className="text-slate-400 text-[11px]">{completedCount * 10}% Completado</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">1 Amigo</span>
                <span className="text-sm font-bold text-amber-300 block mt-0.5">+650 RP</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">✓ Desbloqueado</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">3 Amigos</span>
                <span className="text-sm font-bold text-amber-300 block mt-0.5">+1,820 RP</span>
                <span className="text-[10px] text-cyan-300 block mt-0.5">+ Cofre Hextech</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">5 Amigos</span>
                <span className="text-sm font-bold text-amber-300 block mt-0.5">+3,500 RP</span>
                <span className="text-[10px] text-purple-300 block mt-0.5">+ Skin Guardián</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">10 Amigos</span>
                <span className="text-sm font-bold text-amber-300 block mt-0.5">+7,200 RP</span>
                <span className="text-[10px] text-rose-300 block mt-0.5">+ Skin Mítica</span>
              </div>
            </div>
          </div>

          {/* Invited Friends Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-[#f0e6d2] uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0ac8b9]" />
                Tus Invocadores Invitados ({friends.length})
              </h4>
              <span className="text-slate-400 text-[11px]">Acreditación Automática</span>
            </div>

            <div className="space-y-2">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-[#c89b3c]/40 flex items-center justify-center font-bold text-amber-300 font-cinzel">
                      {friend.summonerName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-[#f0e6d2]">{friend.summonerName}</span>{' '}
                      <span className="text-slate-400 text-[10px]">#{friend.tagLine}</span>
                      <span className="text-slate-500 text-[10px] block mt-0.5">Invitado el {friend.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {friend.status === 'REGISTERED' && (
                      <span className="text-[11px] font-mono text-slate-400 px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                        Pendiente 1er Torneo
                      </span>
                    )}

                    {friend.status === 'TOURNAMENT_COMPLETED' && (
                      <button
                        type="button"
                        onClick={() => handleClaimRP(friend.id)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 text-black font-bold text-xs font-mono transition-all shadow-[0_0_12px_rgba(251,191,36,0.3)] cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Reclamar +{friend.rewardRP} RP</span>
                      </button>
                    )}

                    {friend.status === 'REWARD_CLAIMED' && (
                      <span className="text-[11px] font-mono text-emerald-400 font-bold px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>RP Acreditados</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="px-6 py-4 bg-[#060b13] border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-slate-500">
            Los Riot Points se vinculan automáticamente a tu cuenta registrada
          </span>
          <button
            type="button"
            onClick={() => {
              hextechAudio.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-slate-900 border border-slate-700 transition-colors cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
