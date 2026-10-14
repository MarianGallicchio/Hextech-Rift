import React from 'react';
import {
  UserPlus, Swords, Cpu, Trophy, Shield, ChevronDown,
  ArrowRight, BadgeDollarSign, Sparkles
} from 'lucide-react';
import { hextechAudio } from '../utils/audio';
import { ELO_TIERS } from '../utils/elo';
import type { TournamentTier } from '../types/tournament';

interface LandingSectionsProps {
  totalPrizePoolUSD: number;
  teamsCount: number;
  tournamentsCount: number;
  onCreateTournament: () => void;
  onBrowseTournaments: () => void;
}

const STEPS = [
  {
    icon: UserPlus,
    step: 'Paso 01',
    title: 'Crea tu escuadra',
    text: 'Registra tu equipo 5v5 con roles TOP, JUNGLE, MID, ADC y SUPPORT. Invita con tu código Hextech y deja el roster listo.'
  },
  {
    icon: Swords,
    step: 'Paso 02',
    title: 'Inscríbete por división',
    text: 'Elige torneos de tu tier ELO — de Hierro a Challenger — con inscripción gratuita o paga con pozo en metálico garantizado.'
  },
  {
    icon: Cpu,
    step: 'Paso 03',
    title: 'Juega con código Riot',
    text: 'Recibe el código de torneo en el cliente de LoL, juega la partida y el resultado se verifica automáticamente.'
  }
];

const TIER_META: { tier: TournamentTier; label: string; elos: string; color: string }[] = [
  { tier: 'TIER_I', label: 'Tier I · Master — Challenger', elos: 'ELO 3000+', color: 'text-purple-300 border-purple-500/40 bg-purple-950/30' },
  { tier: 'TIER_II', label: 'Tier II · Esmeralda — Diamante', elos: 'ELO 2400 – 2999', color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/30' },
  { tier: 'TIER_III', label: 'Tier III · Oro — Platino', elos: 'ELO 1800 – 2399', color: 'text-yellow-300 border-yellow-500/40 bg-yellow-950/30' },
  { tier: 'TIER_IV', label: 'Tier IV · Hierro — Plata', elos: 'ELO 0 – 1799', color: 'text-slate-300 border-slate-500/40 bg-slate-900/40' },
  { tier: 'TIER_OPEN', label: 'Open Cash · Todas las divisiones', elos: 'Sin restricción', color: 'text-amber-300 border-amber-500/40 bg-amber-950/30' }
];

const FAQS = [
  {
    q: '¿Necesito pagar para competir?',
    a: 'No. Hay torneos gratuitos con premios en Riot Points y torneos pagos con pozo en metálico. Cada tarjeta indica la modalidad antes de inscribirte.'
  },
  {
    q: '¿Cómo recibo el código de sala de Riot?',
    a: 'Al inscribir tu equipo recibes una notificación con el código de torneo. Lo pegas en el cliente de League of Legends y entras directo a la sala oficial.'
  },
  {
    q: '¿Cómo se verifican los resultados?',
    a: 'Cada partida ligada a un código de torneo se verifica contra la API de Riot. Si conectas el proxy local con tu API key, la verificación usa datos reales; si no, el simulador integrado.'
  },
  {
    q: '¿Cuándo y cómo cobro mi premio?',
    a: 'Los premios en metálico se liquidan dentro de las 24 horas posteriores a la final. El reparto estándar es 60% campeón, 30% subcampeón y 10% tercer puesto.'
  },
  {
    q: '¿Qué pasa si un equipo no se presenta?',
    a: 'El rival presente avanza por walkover tras 15 minutos de tolerancia. Los abandonos reiterados bajan la prioridad de inscripción del equipo.'
  }
];

export const LandingSections: React.FC<LandingSectionsProps> = ({
  totalPrizePoolUSD,
  teamsCount,
  tournamentsCount,
  onCreateTournament,
  onBrowseTournaments
}) => {
  return (
    <div className="space-y-8">
      {/* Cómo funciona */}
      <section aria-labelledby="how-it-works" className="p-6 sm:p-8 rounded-3xl hextech-card border border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#0ac8b9]" />
          <span className="text-xs font-mono font-bold tracking-widest text-[#0ac8b9]">DEL LOBBY AL PODIO EN 3 PASOS</span>
        </div>
        <h2 id="how-it-works" className="text-xl sm:text-2xl font-cinzel font-bold text-[#f0e6d2]">
          Cómo funciona Hextech Rift
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {STEPS.map((s) => (
            <div key={s.step} className="p-5 rounded-2xl bg-black/40 border border-slate-800 hover:border-[#c89b3c]/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-[#c89b3c]/15 border border-[#c89b3c]/40 text-[#c89b3c]">
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 tracking-widest">{s.step}</span>
              </div>
              <h3 className="mt-3 text-base font-cinzel font-bold text-[#f0e6d2]">{s.title}</h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span><strong className="text-[#f0e6d2] tabular-nums">{tournamentsCount}</strong> torneos activos</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#0ac8b9]" />
            <span><strong className="text-[#f0e6d2] tabular-nums">{teamsCount}</strong> escuadras registradas</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <BadgeDollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span><strong className="text-amber-400 tabular-nums">${totalPrizePoolUSD.toLocaleString()} USD</strong> en juego</span>
          </span>
        </div>
      </section>

      {/* Divisiones */}
      <section aria-labelledby="divisions" className="p-6 sm:p-8 rounded-3xl hextech-card border border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-[#c89b3c]" />
          <span className="text-xs font-mono font-bold tracking-widest text-[#c89b3c]">COMPITE CONTRA TU NIVEL</span>
        </div>
        <h2 id="divisions" className="text-xl sm:text-2xl font-cinzel font-bold text-[#f0e6d2]">
          Divisiones por ELO real
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Tu rating ELO ({ELO_TIERS.length} escalones de Hierro IV a Challenger) define en qué división puedes jugar.
          Sin smurfs en tus partidas: cada torneo filtra por rango.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
          {TIER_META.map((t) => (
            <div key={t.tier} className={`p-4 rounded-2xl border ${t.color}`}>
              <div className="text-xs font-cinzel font-bold leading-snug">{t.label}</div>
              <div className="mt-1 text-[11px] font-mono tabular-nums opacity-80">{t.elos}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="p-6 sm:p-8 rounded-3xl hextech-card border border-slate-800">
        <h2 id="faq" className="text-xl sm:text-2xl font-cinzel font-bold text-[#f0e6d2]">
          Preguntas frecuentes
        </h2>
        <div className="mt-4 divide-y divide-slate-800">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-sm font-semibold text-slate-100 hover:text-[#c89b3c] transition-colors">
                <span>{f.q}</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed max-w-3xl">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section aria-labelledby="final-cta" className="relative overflow-hidden rounded-3xl border border-[#c89b3c]/40 bg-gradient-to-r from-[#171106] via-[#0a1322] to-[#04110f] p-6 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,155,60,0.15),transparent_60%)]" aria-hidden="true" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h2 id="final-cta" className="text-2xl sm:text-3xl font-cinzel font-bold text-[#f0e6d2] leading-tight">
              Tu Grieta te espera, invocador
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Crea tu primer torneo en menos de un minuto o explora el circuito activo.
              Códigos Riot, brackets y premios — todo en un solo lugar.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => { hextechAudio.playClick(); onBrowseTournaments(); }}
              className="px-5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-[#0ac8b9] text-xs font-mono text-[#0ac8b9] transition-all cursor-pointer flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Explorar torneos</span>
            </button>
            <button
              onClick={() => { hextechAudio.playClick(); onCreateTournament(); }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:from-[#e0b04c] hover:to-[#8c6930] text-black font-cinzel font-bold text-xs transition-all shadow-[0_0_20px_rgba(200,155,60,0.3)] cursor-pointer flex items-center gap-2"
            >
              <span>Crear torneo gratis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
