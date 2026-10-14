import React, { useState } from 'react';
import { TournamentImpactChart } from './TournamentImpactChart';
import { RankDistributionChart } from './RankDistributionChart';
import { CashFlowTimelineChart } from './CashFlowTimelineChart';
import { ANALYTICS_METRICS_SUMMARY } from '../data/analyticsData';
import {
  BarChart3,
  DollarSign,
  Users,
  Cpu,
  Trophy,
  Sparkles,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { hextechAudio } from '../utils/audio';

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState('2026_SPLIT_1');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleExportData = () => {
    hextechAudio.playVictory();
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Hero */}
      <div className="p-6 rounded-3xl hextech-card border border-[#c89b3c]/35 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#c89b3c]/20 border border-[#c89b3c]/40 text-[#f0e6d2]">
              HEXTECH RIFT BUSINESS INTELLIGENCE
            </span>
            <span className="text-xs font-mono text-[#0ac8b9] flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> Gráficos Interactivos D3.js v7
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#f0e6d2]">
            Panel Avanzado de Analíticas & Economía de Torneos
          </h1>

          <p className="text-xs text-slate-300 mt-1 max-w-2xl font-sans leading-relaxed">
            Monitoreo en tiempo real del impacto competitivo, distribución de rangos de los jugadores registrados y flujo financiero del pozo acumulado a lo largo de las temporadas.
          </p>
        </div>

        {/* Filters & Export */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedSeason}
            onChange={(e) => {
              hextechAudio.playClick();
              setSelectedSeason(e.target.value);
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-[#f0e6d2] text-xs font-mono focus:border-[#c89b3c] focus:outline-none cursor-pointer"
          >
            <option value="2026_SPLIT_1">Temporada 2026 · Split 1</option>
            <option value="2025_SPLIT_3">Temporada 2025 · Split 3</option>
            <option value="ALL_TIME">Histórico Completo</option>
          </select>

          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:from-[#e0b04c] text-black font-cinzel font-bold text-xs transition-all shadow-[0_0_15px_rgba(200,155,60,0.3)] cursor-pointer flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{copiedNotification ? '¡Reporte Copiado!' : 'Exportar Datos'}</span>
          </button>
        </div>
      </div>

      {/* 4-KPI Executive Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl hextech-card border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Pozo Total Liquidado</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            ${ANALYTICS_METRICS_SUMMARY.totalPrizeDistributedUSD.toLocaleString()} USD
          </div>
          <span className="text-[10px] text-emerald-400 font-mono block">
            +38.5% respecto al mes anterior
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl hextech-card border border-[#0ac8b9]/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Comunidad Activa</span>
            <Users className="w-4 h-4 text-[#0ac8b9]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#f0e6d2] tabular-nums">
            {ANALYTICS_METRICS_SUMMARY.totalUniquePlayers.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">
            {ANALYTICS_METRICS_SUMMARY.totalTeamsRegistered} Escuadras registradas
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl hextech-card border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Automatización Riot API</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {ANALYTICS_METRICS_SUMMARY.matchAutomationSuccessRate}
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">
            Duración prom: {ANALYTICS_METRICS_SUMMARY.averageMatchDurationMinutes}
          </span>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl hextech-card border border-purple-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Riot Points Entregados</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300 tabular-nums">
            {ANALYTICS_METRICS_SUMMARY.totalRPValueDistributed.toLocaleString()} RP
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">
            En torneos gratis & referidos
          </span>
        </div>
      </div>

      {/* Main D3 Visualizations Grid */}
      <div className="space-y-8">
        {/* CHART 1: Full-Width Tournament Impact Chart */}
        <TournamentImpactChart />

        {/* CHARTS 2 & 3: Side-by-Side Dual D3 Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RankDistributionChart />
          <CashFlowTimelineChart />
        </div>
      </div>

      {/* Strategic Insights & Analysis Footer Box */}
      <div className="p-6 rounded-2xl hextech-card border border-[#c89b3c]/25 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-cinzel font-bold text-[#f0e6d2]">
              Hallazgos Clave del Circuito Competitivo Hextech Rift 2026
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">Actualizado cada 15 minutos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="font-bold text-[#f0e6d2] font-mono block text-xs">
              1. Concentración de Rango (Plata y Oro)
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              El 44.5% del padrón total de invocadores se ubica entre Plata y Oro, representando el segmento más competitivo y con mayor tasa de inscripción en torneos de fin de semana.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="font-bold text-[#f0e6d2] font-mono block text-xs">
              2. Liquidez & Comisiones de Ligas
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              El modelo económico garantiza un 75% del fondo recaudado directamente en premios en metálico, con pagos automáticos acreditados en menos de 24 horas y comisiones sostenibles para organizadores amateurs.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="font-bold text-[#f0e6d2] font-mono block text-xs">
              3. Confiabilidad de Tournament Draft
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              La conexión directa con la API de Riot Games resolvió 99.4% de los encuentros mediante webhooks de caída del nexo, eliminando disputas manuales y garantizando un avance de llaves fluido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
