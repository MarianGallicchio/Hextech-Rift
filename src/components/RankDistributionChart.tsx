import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { RANK_DISTRIBUTION_DATA, RankDistributionDataPoint } from '../data/analyticsData';
import { Award, PieChart, BarChart3, Users, Shield } from 'lucide-react';
import { hextechAudio } from '../utils/audio';

export const RankDistributionChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [chartMode, setChartMode] = useState<'donut' | 'bar'>('donut');
  const [selectedRank, setSelectedRank] = useState<RankDistributionDataPoint | null>(
    RANK_DISTRIBUTION_DATA[5] // Default to Esmeralda
  );

  const totalPlayers = RANK_DISTRIBUTION_DATA.reduce((acc, d) => acc + d.count, 0);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = 320;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const data = RANK_DISTRIBUTION_DATA;

    if (chartMode === 'donut') {
      const radius = Math.min(width, height) / 2 - 20;
      const innerRadius = radius * 0.62;

      const g = svg
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      const pie = d3
        .pie<RankDistributionDataPoint>()
        .value((d) => d.count)
        .sort(null)
        .padAngle(0.025);

      const arc = d3
        .arc<d3.PieArcDatum<RankDistributionDataPoint>>()
        .innerRadius(innerRadius)
        .outerRadius(radius)
        .cornerRadius(4);

      const arcHover = d3
        .arc<d3.PieArcDatum<RankDistributionDataPoint>>()
        .innerRadius(innerRadius - 4)
        .outerRadius(radius + 8)
        .cornerRadius(6);

      // Slices
      const slices = g
        .selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d) => d.data.color)
        .attr('stroke', '#060b13')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .style('transition', 'all 0.2s ease');

      slices
        .on('mouseenter', function (event, d) {
          d3.select(this)
            .attr('d', arcHover as any)
            .attr('stroke', '#f0e6d2')
            .attr('stroke-width', 2);
          setSelectedRank(d.data);
          hextechAudio.playClick();
        })
        .on('mouseleave', function (event, d) {
          d3.select(this)
            .attr('d', arc as any)
            .attr('stroke', '#060b13')
            .attr('stroke-width', 2);
        });

      // Center Text Readout
      const centerGroup = g.append('g').attr('text-anchor', 'middle');

      centerGroup
        .append('text')
        .attr('dy', '-0.6em')
        .attr('fill', selectedRank?.color || '#0ac8b9')
        .attr('font-size', '16px')
        .attr('font-family', 'Cinzel, serif')
        .attr('font-weight', 'bold')
        .text(selectedRank?.name || 'Distribución');

      centerGroup
        .append('text')
        .attr('dy', '0.9em')
        .attr('fill', '#f0e6d2')
        .attr('font-size', '20px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text(selectedRank ? `${selectedRank.count} Inv.` : `${totalPlayers} Inv.`);

      centerGroup
        .append('text')
        .attr('dy', '2.5em')
        .attr('fill', '#94a3b8')
        .attr('font-size', '11px')
        .attr('font-family', 'monospace')
        .text(selectedRank ? `${selectedRank.percentage}% del total` : '100%');
    } else {
      // Bar Chart Mode
      const margin = { top: 25, right: 25, bottom: 50, left: 50 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, innerWidth])
        .padding(0.25);

      const yScale = d3
        .scaleLinear()
        .domain([0, (d3.max(data, (d) => d.count) || 400) * 1.15])
        .nice()
        .range([innerHeight, 0]);

      // Grid
      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(() => ''))
        .selectAll('line')
        .attr('stroke', '#1e293b')
        .attr('stroke-dasharray', '2,2');
      g.selectAll('.domain').remove();

      // Bars
      g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.name) || 0)
        .attr('y', (d) => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => innerHeight - yScale(d.count))
        .attr('fill', (d) => d.color)
        .attr('rx', 4)
        .style('cursor', 'pointer')
        .on('mouseenter', function (event, d) {
          d3.select(this).attr('fill', d.accentColor);
          setSelectedRank(d);
          hextechAudio.playClick();
        })
        .on('mouseleave', function (event, d) {
          d3.select(this).attr('fill', d.color);
        });

      // Axes
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .attr('transform', 'rotate(-30)')
        .style('text-anchor', 'end');

      g.append('g')
        .call(d3.axisLeft(yScale).ticks(5))
        .selectAll('text')
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace');
    }
  }, [chartMode, selectedRank?.tier]);

  return (
    <div className="rounded-2xl hextech-card p-5 border border-[#c89b3c]/30 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">
              DISTRIBUCIÓN DE RANGOS RIOT API
            </span>
            <span className="text-xs font-mono text-slate-400">Total: {totalPlayers} Invocadores</span>
          </div>
          <h3 className="text-base font-cinzel font-bold text-[#f0e6d2] flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Curva de Clasificación & Rangos de la Comunidad
          </h3>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-black/60 rounded-lg border border-slate-800 shrink-0 text-xs font-mono">
          <button
            onClick={() => {
              hextechAudio.playClick();
              setChartMode('donut');
            }}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
              chartMode === 'donut' ? 'bg-[#c89b3c] text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Radial Donut</span>
          </button>
          <button
            onClick={() => {
              hextechAudio.playClick();
              setChartMode('bar');
            }}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
              chartMode === 'bar' ? 'bg-[#0ac8b9] text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Histograma</span>
          </button>
        </div>
      </div>

      {/* SVG Container */}
      <div ref={containerRef} className="w-full flex justify-center items-center py-1">
        <svg ref={svgRef} className="w-full overflow-visible" />
      </div>

      {/* Selected Rank Detail Ribbon */}
      {selectedRank && (
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <span className="text-slate-400 text-[10px] block">Rango Seleccionado</span>
            <span className="font-bold text-sm" style={{ color: selectedRank.color }}>
              {selectedRank.name}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Invocadores Registrados</span>
            <span className="font-bold text-[#f0e6d2] text-sm tabular-nums">
              {selectedRank.count} ({selectedRank.percentage}%)
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Rating ELO Promedio</span>
            <span className="font-bold text-[#0ac8b9] text-sm tabular-nums">
              ~{selectedRank.avgElo} ELO
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Torneos Habilitados</span>
            <span className="font-bold text-amber-300 text-sm tabular-nums">
              {selectedRank.tournamentsEligible} Circuitos
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
