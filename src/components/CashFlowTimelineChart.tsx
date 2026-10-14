import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { CASH_FLOW_HISTORY, CashFlowDataPoint } from '../data/analyticsData';
import { DollarSign, TrendingUp, Trophy, Calculator, Sparkles } from 'lucide-react';
import { hextechAudio } from '../utils/audio';

export const CashFlowTimelineChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeLayer, setActiveLayer] = useState<'stacked' | 'cumulative'>('stacked');
  const [hoveredPoint, setHoveredPoint] = useState<CashFlowDataPoint | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = CASH_FLOW_HISTORY;

    // Defs: Gradients
    const defs = svg.append('defs');

    // Prize Payouts (Gold)
    const gradPrizes = defs
      .append('linearGradient')
      .attr('id', 'flow-prizes-gradient')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    gradPrizes.append('stop').attr('offset', '0%').attr('stop-color', '#c89b3c').attr('stop-opacity', 0.6);
    gradPrizes.append('stop').attr('offset', '100%').attr('stop-color', '#c89b3c').attr('stop-opacity', 0.1);

    // Commissions (Purple)
    const gradComms = defs
      .append('linearGradient')
      .attr('id', 'flow-comms-gradient')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    gradComms.append('stop').attr('offset', '0%').attr('stop-color', '#a855f7').attr('stop-opacity', 0.6);
    gradComms.append('stop').attr('offset', '100%').attr('stop-color', '#a855f7').attr('stop-opacity', 0.1);

    // Cumulative (Cyan)
    const gradCumul = defs
      .append('linearGradient')
      .attr('id', 'flow-cumul-gradient')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    gradCumul.append('stop').attr('offset', '0%').attr('stop-color', '#0ac8b9').attr('stop-opacity', 0.5);
    gradCumul.append('stop').attr('offset', '100%').attr('stop-color', '#0ac8b9').attr('stop-opacity', 0.05);

    // Scales
    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.2);

    if (activeLayer === 'stacked') {
      const maxY = d3.max(data, (d) => d.grossEntryPoolUSD) || 5000;
      const yScale = d3.scaleLinear().domain([0, maxY * 1.15]).nice().range([innerHeight, 0]);

      // Grid
      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(() => ''))
        .selectAll('line')
        .attr('stroke', '#1e293b')
        .attr('stroke-dasharray', '2,2');
      g.selectAll('.domain').remove();

      // Stack generation for prizes and commissions
      const stack = d3
        .stack<CashFlowDataPoint>()
        .keys(['prizesPaidUSD', 'organizerCommissionsUSD', 'platformReserveUSD']);

      const stackedSeries = stack(data);

      const area = d3
        .area<d3.SeriesPoint<CashFlowDataPoint>>()
        .x((d) => xScale(d.data.label) || 0)
        .y0((d) => yScale(d[0]))
        .y1((d) => yScale(d[1]))
        .curve(d3.curveMonotoneX);

      const colors = ['#c89b3c', '#a855f7', '#0ac8b9'];

      stackedSeries.forEach((series, i) => {
        g.append('path')
          .datum(series)
          .attr('fill', colors[i])
          .attr('fill-opacity', 0.45)
          .attr('stroke', colors[i])
          .attr('stroke-width', 2)
          .attr('d', area);
      });

      // Circles on top line
      data.forEach((d) => {
        g.append('circle')
          .attr('cx', xScale(d.label) || 0)
          .attr('cy', yScale(d.grossEntryPoolUSD))
          .attr('r', 4.5)
          .attr('fill', '#f0e6d2')
          .attr('stroke', '#060b13')
          .attr('stroke-width', 2);
      });

      // Axes
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace');

      g.append('g')
        .call(d3.axisLeft(yScale).ticks(5).tickFormat((d) => `$${d}`))
        .selectAll('text')
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace');
    } else {
      // Cumulative Mode
      const maxY = d3.max(data, (d) => d.cumulativePrizePoolUSD) || 10000;
      const yScale = d3.scaleLinear().domain([0, maxY * 1.15]).nice().range([innerHeight, 0]);

      // Grid
      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(() => ''))
        .selectAll('line')
        .attr('stroke', '#1e293b')
        .attr('stroke-dasharray', '2,2');
      g.selectAll('.domain').remove();

      // Cumulative Area
      const areaCumul = d3
        .area<CashFlowDataPoint>()
        .x((d) => xScale(d.label) || 0)
        .y0(innerHeight)
        .y1((d) => yScale(d.cumulativePrizePoolUSD))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'url(#flow-cumul-gradient)')
        .attr('d', areaCumul);

      const lineCumul = d3
        .line<CashFlowDataPoint>()
        .x((d) => xScale(d.label) || 0)
        .y((d) => yScale(d.cumulativePrizePoolUSD))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#0ac8b9')
        .attr('stroke-width', 3)
        .attr('d', lineCumul);

      // Points
      data.forEach((d) => {
        g.append('circle')
          .attr('cx', xScale(d.label) || 0)
          .attr('cy', yScale(d.cumulativePrizePoolUSD))
          .attr('r', 5)
          .attr('fill', '#0ac8b9')
          .attr('stroke', '#060b13')
          .attr('stroke-width', 2);
      });

      // Axes
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace');

      g.append('g')
        .call(d3.axisLeft(yScale).ticks(5).tickFormat((d) => `$${d}`))
        .selectAll('text')
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace');
    }

    // Overlay for Mouse Events
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .on('mousemove', (event) => {
        const [xm] = d3.pointer(event, g.node());
        const domain = xScale.domain();
        const step = xScale.step();
        const index = Math.max(0, Math.min(domain.length - 1, Math.round(xm / step)));
        const point = data[index] || null;
        setHoveredPoint(point);
      })
      .on('mouseleave', () => {
        setHoveredPoint(null);
      });
  }, [activeLayer]);

  return (
    <div className="rounded-2xl hextech-card p-5 border border-[#c89b3c]/30 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">
              ECONOMÍA COMPETITIVA & FLUJO FINANCIERO
            </span>
            <span className="text-xs font-mono text-slate-400">Temporada 2026</span>
          </div>
          <h3 className="text-base font-cinzel font-bold text-[#f0e6d2] flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            Flujo de Efectivo del Pozo Total en el Tiempo
          </h3>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-black/60 rounded-lg border border-slate-800 shrink-0 text-xs font-mono">
          <button
            onClick={() => {
              hextechAudio.playClick();
              setActiveLayer('stacked');
            }}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeLayer === 'stacked' ? 'bg-[#c89b3c] text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Desglose Mensual
          </button>
          <button
            onClick={() => {
              hextechAudio.playClick();
              setActiveLayer('cumulative');
            }}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeLayer === 'cumulative' ? 'bg-[#0ac8b9] text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pozo Acumulado
          </button>
        </div>
      </div>

      {/* SVG Container */}
      <div ref={containerRef} className="w-full relative overflow-hidden">
        <svg ref={svgRef} className="w-full overflow-visible" />
      </div>

      {/* Legend & Hover Details */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {hoveredPoint ? (
          <div className="flex items-center justify-between w-full flex-wrap gap-2">
            <div>
              <span className="font-bold text-[#f0e6d2]">{hoveredPoint.label} 2026:</span>
              <span className="text-amber-400 font-bold ml-1.5">
                ${hoveredPoint.grossEntryPoolUSD.toLocaleString()} USD recaudados
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] flex-wrap">
              <span className="text-amber-300">
                Premios: <strong>${hoveredPoint.prizesPaidUSD} USD</strong>
              </span>
              <span className="text-purple-300">
                Comisión Organizadores: <strong>${hoveredPoint.organizerCommissionsUSD} USD</strong>
              </span>
              <span className="text-[#0ac8b9]">
                Pozo Acumulado Histórico: <strong>${hoveredPoint.cumulativePrizePoolUSD.toLocaleString()} USD</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full flex-wrap gap-2">
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c89b3c]" />
                <span className="text-slate-300">Premios en Metálico (75%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                <span className="text-slate-300">Comisión Organizador (17.5%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0ac8b9]" />
                <span className="text-slate-300">Reserva Hextech (7.5%)</span>
              </span>
            </div>
            <span className="text-amber-400 font-bold">$9,520 USD Total Liquidado</span>
          </div>
        )}
      </div>
    </div>
  );
};
