import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { TOURNAMENT_IMPACT_HISTORY, TournamentImpactDataPoint } from '../data/analyticsData';
import { TrendingUp, Users, Swords, Eye } from 'lucide-react';
import { hextechAudio } from '../utils/audio';

export const TournamentImpactChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'teams' | 'matches' | 'viewers'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<TournamentImpactDataPoint | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = TOURNAMENT_IMPACT_HISTORY;

    // Scales
    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.2);

    // Dynamic Y domain based on metric
    const maxTeams = d3.max(data, (d) => d.registeredTeams) || 150;
    const maxMatches = d3.max(data, (d) => d.matchesCompleted) || 300;
    const maxViewers = d3.max(data, (d) => d.viewerPeak) || 13000;

    const yScaleLeft = d3
      .scaleLinear()
      .domain([0, selectedMetric === 'viewers' ? maxViewers : Math.max(maxTeams, maxMatches) * 1.15])
      .nice()
      .range([innerHeight, 0]);

    // Defs: Gradients & Shadows
    const defs = svg.append('defs');

    // Hextech Blue Area Gradient
    const gradientBlue = defs
      .append('linearGradient')
      .attr('id', 'impact-blue-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    gradientBlue.append('stop').attr('offset', '0%').attr('stop-color', '#0ac8b9').attr('stop-opacity', 0.45);
    gradientBlue.append('stop').attr('offset', '100%').attr('stop-color', '#0ac8b9').attr('stop-opacity', 0.0);

    // Hextech Gold Area Gradient
    const gradientGold = defs
      .append('linearGradient')
      .attr('id', 'impact-gold-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    gradientGold.append('stop').attr('offset', '0%').attr('stop-color', '#c89b3c').attr('stop-opacity', 0.4);
    gradientGold.append('stop').attr('offset', '100%').attr('stop-color', '#c89b3c').attr('stop-opacity', 0.0);

    // Grid lines
    const yAxisGrid = d3
      .axisLeft(yScaleLeft)
      .ticks(5)
      .tickSize(-innerWidth)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'grid')
      .call(yAxisGrid)
      .selectAll('line')
      .attr('stroke', '#1e293b')
      .attr('stroke-dasharray', '2,2');
    g.selectAll('.domain').remove();

    // Area and Line Generators
    if (selectedMetric === 'all' || selectedMetric === 'matches') {
      const areaMatches = d3
        .area<TournamentImpactDataPoint>()
        .x((d) => xScale(d.label) || 0)
        .y0(innerHeight)
        .y1((d) => yScaleLeft(d.matchesCompleted))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'url(#impact-blue-gradient)')
        .attr('d', areaMatches);

      const lineMatches = d3
        .line<TournamentImpactDataPoint>()
        .x((d) => xScale(d.label) || 0)
        .y((d) => yScaleLeft(d.matchesCompleted))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#0ac8b9')
        .attr('stroke-width', 2.5)
        .attr('d', lineMatches);
    }

    if (selectedMetric === 'all' || selectedMetric === 'teams') {
      const areaTeams = d3
        .area<TournamentImpactDataPoint>()
        .x((d) => xScale(d.label) || 0)
        .y0(innerHeight)
        .y1((d) => yScaleLeft(d.registeredTeams))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'url(#impact-gold-gradient)')
        .attr('d', areaTeams);

      const lineTeams = d3
        .line<TournamentImpactDataPoint>()
        .x((d) => xScale(d.label) || 0)
        .y((d) => yScaleLeft(d.registeredTeams))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#c89b3c')
        .attr('stroke-width', 2.5)
        .attr('d', lineTeams);
    }

    if (selectedMetric === 'viewers') {
      const areaViewers = d3
        .area<TournamentImpactDataPoint>()
        .x((d) => xScale(d.label) || 0)
        .y0(innerHeight)
        .y1((d) => yScaleLeft(d.viewerPeak))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'url(#impact-blue-gradient)')
        .attr('d', areaViewers);

      const lineViewers = d3
        .line<TournamentImpactDataPoint>()
        .x((d) => xScale(d.label) || 0)
        .y((d) => yScaleLeft(d.viewerPeak))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#38bdf8')
        .attr('stroke-width', 2.5)
        .attr('d', lineViewers);
    }

    // Circles for points
    data.forEach((d) => {
      const x = xScale(d.label) || 0;
      if (selectedMetric === 'all' || selectedMetric === 'matches') {
        g.append('circle')
          .attr('cx', x)
          .attr('cy', yScaleLeft(d.matchesCompleted))
          .attr('r', 4)
          .attr('fill', '#0ac8b9')
          .attr('stroke', '#060b13')
          .attr('stroke-width', 2);
      }
      if (selectedMetric === 'all' || selectedMetric === 'teams') {
        g.append('circle')
          .attr('cx', x)
          .attr('cy', yScaleLeft(d.registeredTeams))
          .attr('r', 4)
          .attr('fill', '#c89b3c')
          .attr('stroke', '#060b13')
          .attr('stroke-width', 2);
      }
      if (selectedMetric === 'viewers') {
        g.append('circle')
          .attr('cx', x)
          .attr('cy', yScaleLeft(d.viewerPeak))
          .attr('r', 4)
          .attr('fill', '#38bdf8')
          .attr('stroke', '#060b13')
          .attr('stroke-width', 2);
      }
    });

    // Axes
    const xAxis = d3.axisBottom(xScale);
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    const yAxis = d3.axisLeft(yScaleLeft).ticks(5);
    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Invisible Overlay for Hover Events
    const bisect = d3.bisector<TournamentImpactDataPoint, string>((d) => d.label).center;

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
  }, [selectedMetric]);

  return (
    <div className="rounded-2xl hextech-card p-5 border border-[#c89b3c]/30 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0ac8b9]/20 border border-[#0ac8b9]/40 text-[#0ac8b9]">
              D3.JS DATA ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">Circuito LoL 2026</span>
          </div>
          <h3 className="text-base font-cinzel font-bold text-[#f0e6d2] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#c89b3c]" />
            Impacto, Concurrencia y Crecimiento de Torneos
          </h3>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-black/60 rounded-lg border border-slate-800 shrink-0 text-xs font-mono">
          <button
            onClick={() => {
              hextechAudio.playClick();
              setSelectedMetric('all');
            }}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              selectedMetric === 'all' ? 'bg-[#c89b3c] text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            General
          </button>
          <button
            onClick={() => {
              hextechAudio.playClick();
              setSelectedMetric('teams');
            }}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              selectedMetric === 'teams' ? 'bg-[#c89b3c] text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Escuadras
          </button>
          <button
            onClick={() => {
              hextechAudio.playClick();
              setSelectedMetric('matches');
            }}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              selectedMetric === 'matches' ? 'bg-[#0ac8b9] text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Partidas
          </button>
          <button
            onClick={() => {
              hextechAudio.playClick();
              setSelectedMetric('viewers');
            }}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              selectedMetric === 'viewers' ? 'bg-sky-400 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Espectadores
          </button>
        </div>
      </div>

      {/* SVG Container */}
      <div ref={containerRef} className="w-full relative overflow-hidden">
        <svg ref={svgRef} className="w-full overflow-visible" />
      </div>

      {/* Hover Info Banner / Tooltip */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono flex flex-wrap items-center justify-between gap-3">
        {hoveredPoint ? (
          <>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#f0e6d2]">{hoveredPoint.label}</span>
              <span className="text-slate-500">({hoveredPoint.date})</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-amber-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#c89b3c]" />
                <strong>{hoveredPoint.registeredTeams}</strong> Escuadras ({hoveredPoint.activePlayers} jugadores)
              </span>
              <span className="text-[#0ac8b9] flex items-center gap-1">
                <Swords className="w-3.5 h-3.5 text-[#0ac8b9]" />
                <strong>{hoveredPoint.matchesCompleted}</strong> Partidas
              </span>
              <span className="text-sky-300 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <strong>{hoveredPoint.viewerPeak.toLocaleString()}</strong> Espectadores pico
              </span>
            </div>
          </>
        ) : (
          <div className="text-slate-400 flex items-center justify-between w-full">
            <span>Pasa el cursor por el gráfico para explorar cada semana del split</span>
            <span className="text-emerald-400 font-bold">+187% Crecimiento MoM</span>
          </div>
        )}
      </div>
    </div>
  );
};
