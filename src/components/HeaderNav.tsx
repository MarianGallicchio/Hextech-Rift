import React, { useState } from 'react';
import { Player, AppNotification } from '../types/tournament';
import { Bell, Shield, Volume2, VolumeX, Sparkles, User, Trophy, Users, Award, Gift, Menu, X } from 'lucide-react';
import { hextechAudio } from '../utils/audio';
import { RANK_TIERS_INFO } from '../data/champions';

interface HeaderNavProps {
  player: Player;
  activeTab: 'tournaments' | 'team' | 'scrims' | 'elo' | 'analytics' | 'admin';
  setActiveTab: (tab: 'tournaments' | 'team' | 'scrims' | 'elo' | 'analytics' | 'admin') => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onOpenReferrals: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  player,
  activeTab,
  setActiveTab,
  notifications,
  onOpenNotifications,
  onOpenProfile,
  onOpenAdmin,
  onOpenReferrals,
  soundEnabled,
  setSoundEnabled
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const rankInfo = RANK_TIERS_INFO[player.rankTier];

  const handleNavClick = (tab: 'tournaments' | 'team' | 'scrims' | 'elo' | 'analytics' | 'admin') => {
    hextechAudio.playClick();
    setMobileMenuOpen(false);
    if (tab === 'admin') {
      onOpenAdmin();
    } else {
      setActiveTab(tab);
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    hextechAudio.enabled = next;
    if (next) hextechAudio.playClick();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#060b13]/95 backdrop-blur-md border-b border-[#c89b3c]/25 px-4 lg:px-8 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Wordmark & Tagline */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#c89b3c] via-[#785a28] to-[#091428] p-[1px] shadow-[0_0_15px_rgba(200,155,60,0.3)]">
            <div className="w-full h-full bg-[#060b13] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#c89b3c]" />
            </div>
          </div>
          <button
            onClick={() => handleNavClick('tournaments')}
            className="text-left group cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-cinzel font-bold tracking-wider text-[#f0e6d2] group-hover:text-[#c89b3c] transition-colors whitespace-nowrap">
                HEXTECH RIFT
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#c89b3c]/20 border border-[#c89b3c]/40 text-[#f0e6d2]">
                PRO 2026
              </span>
            </div>
            <span className="hidden sm:block text-[10px] font-mono text-[#0ac8b9] tracking-tight">
              Torneos & Circuitos LoL
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single line, no pills) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium tracking-wide">
          <button
            onClick={() => handleNavClick('tournaments')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'tournaments'
                ? 'text-[#f0e6d2] border-b-2 border-[#c89b3c] pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-[#c89b3c]" />
            <span>Torneos & Ligas</span>
          </button>

          <button
            onClick={() => handleNavClick('scrims')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'scrims'
                ? 'text-[#f0e6d2] border-b-2 border-[#c89b3c] pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4 text-[#0ac8b9]" />
            <span>Amistosos & Scrims</span>
          </button>

          <button
            onClick={() => handleNavClick('team')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'team'
                ? 'text-[#f0e6d2] border-b-2 border-[#c89b3c] pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-[#c89b3c]" />
            <span>Mi Equipo & Roster</span>
          </button>

          <button
            onClick={() => handleNavClick('elo')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'elo'
                ? 'text-[#f0e6d2] border-b-2 border-[#c89b3c] pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Rating ELO & Divisiones</span>
          </button>

          <button
            onClick={() => handleNavClick('analytics')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'analytics'
                ? 'text-[#f0e6d2] border-b-2 border-[#c89b3c] pb-0.5'
                : 'text-slate-400 hover:text-[#0ac8b9]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#0ac8b9]" />
            <span>Analíticas D3</span>
          </button>

          <button
            onClick={() => onOpenAdmin()}
            className="flex items-center gap-2 text-slate-400 hover:text-[#c89b3c] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Panel Admin (APIs)</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Summoner HUD */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Referral RP Bonus Button */}
          <button
            onClick={() => {
              hextechAudio.playClick();
              onOpenReferrals();
            }}
            className="relative px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-700/20 hover:from-amber-500/30 hover:to-amber-700/30 border border-amber-500/50 hover:border-amber-400 transition-all flex items-center gap-2 cursor-pointer group shadow-[0_0_15px_rgba(245,158,11,0.15)]"
            title="Programa de Referidos: Gana Riot Points invitando amigos"
          >
            <Gift className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="text-left font-mono leading-none">
              <span className="text-[10px] text-amber-300 block font-bold">Referidos RP</span>
              <span className="text-[9px] text-emerald-400 hidden sm:block">+650 RP gratis</span>
            </div>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar sonidos Hextech' : 'Activar efectos'}
            className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50 text-slate-400 hover:text-[#f0e6d2] hover:border-[#c89b3c]/40 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#0ac8b9]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => {
              hextechAudio.playClick();
              onOpenNotifications();
            }}
            className="relative p-2 rounded-lg bg-slate-900/60 border border-slate-700/50 text-slate-300 hover:text-[#f0e6d2] hover:border-[#c89b3c]/40 transition-colors cursor-pointer"
            title="Centro de Notificaciones y Avisos de Partida"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Player Summoner Badge */}
          <button
            onClick={() => {
              hextechAudio.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-2.5 sm:gap-3 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3 py-1.5 rounded-xl bg-gradient-to-r from-[#091428] to-[#101e33] border border-[#c89b3c]/35 hover:border-[#c89b3c] hover:shadow-[0_0_20px_rgba(200,155,60,0.25)] transition-all cursor-pointer text-left"
            title="Ver perfil de invocador y estadísticas Riot API"
          >
            <div className="relative w-8 h-8 rounded-full border-2 border-[#c89b3c] overflow-hidden shrink-0 shadow-[0_0_10px_rgba(200,155,60,0.4)]">
              <img
                src={player.avatarUrl}
                alt={player.summonerName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#f0e6d2] truncate max-w-[110px]">
                  {player.summonerName}
                </span>
                <span className="text-[10px] font-mono text-slate-400">#{player.tagLine}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono tabular-nums text-slate-400">
                <span className={`${rankInfo.color} font-bold`}>{rankInfo.name} {player.division}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#0ac8b9] font-bold">{player.eloRating} ELO</span>
              </div>
            </div>
            <User className="w-3.5 h-3.5 text-slate-400 sm:hidden" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => {
              hextechAudio.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 lg:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 space-y-2 font-mono text-xs">
          <button
            onClick={() => handleNavClick('tournaments')}
            className={`w-full p-2.5 rounded-lg flex items-center gap-2 text-left ${
              activeTab === 'tournaments' ? 'bg-[#c89b3c]/20 text-[#f0e6d2] font-bold' : 'text-slate-400'
            }`}
          >
            <Trophy className="w-4 h-4 text-[#c89b3c]" />
            <span>Torneos & Ligas</span>
          </button>
          <button
            onClick={() => handleNavClick('scrims')}
            className={`w-full p-2.5 rounded-lg flex items-center gap-2 text-left ${
              activeTab === 'scrims' ? 'bg-[#c89b3c]/20 text-[#f0e6d2] font-bold' : 'text-slate-400'
            }`}
          >
            <Shield className="w-4 h-4 text-[#0ac8b9]" />
            <span>Amistosos & Scrims</span>
          </button>
          <button
            onClick={() => handleNavClick('team')}
            className={`w-full p-2.5 rounded-lg flex items-center gap-2 text-left ${
              activeTab === 'team' ? 'bg-[#c89b3c]/20 text-[#f0e6d2] font-bold' : 'text-slate-400'
            }`}
          >
            <Users className="w-4 h-4 text-[#c89b3c]" />
            <span>Mi Equipo & Roster</span>
          </button>
          <button
            onClick={() => handleNavClick('elo')}
            className={`w-full p-2.5 rounded-lg flex items-center gap-2 text-left ${
              activeTab === 'elo' ? 'bg-[#c89b3c]/20 text-[#f0e6d2] font-bold' : 'text-slate-400'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Rating ELO & Divisiones</span>
          </button>
          <button
            onClick={() => handleNavClick('analytics')}
            className={`w-full p-2.5 rounded-lg flex items-center gap-2 text-left ${
              activeTab === 'analytics' ? 'bg-[#0ac8b9]/20 text-[#0ac8b9] font-bold' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#0ac8b9]" />
            <span>Analíticas D3</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="w-full p-2.5 rounded-lg flex items-center gap-2 text-left text-purple-300 bg-purple-950/30"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Panel Admin (APIs Oficiales)</span>
          </button>
        </div>
      )}
    </header>
  );
};
