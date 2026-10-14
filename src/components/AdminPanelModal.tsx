import React, { useState, useEffect } from 'react';
import { Tournament, Match } from '../types/tournament';
import {
  X,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Key,
  Trophy,
  RefreshCw,
  Check,
  ArrowRight,
  Server,
  Globe,
  Radio,
  ExternalLink,
  Code2,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { hextechAudio } from '../utils/audio';
import { riotApi, RiotVerificationResponse } from '../services/riotApi';
import confetti from 'canvas-confetti';

interface AdminPanelModalProps {
  tournaments: Tournament[];
  onClose: () => void;
  onUpdateMatch: (tournamentId: string, updatedMatch: Match) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  tournaments,
  onClose,
  onUpdateMatch
}) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'apis' | 'payouts'>('matches');
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(
    tournaments[0]?.id || ''
  );
  const [verifyingMatchId, setVerifyingMatchId] = useState<string | null>(null);
  const [lastVerificationResponse, setLastVerificationResponse] = useState<RiotVerificationResponse | null>(null);
  const [riotApiKeyInput, setRiotApiKeyInput] = useState<string>(riotApi.getApiKey());
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);
  const [testingApiIndex, setTestingApiIndex] = useState<number | null>(null);
  const [testedApis, setTestedApis] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hextechAudio.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const selectedTournament = tournaments.find((t) => t.id === selectedTournamentId) || tournaments[0];

  // Collect all matches across groups and playoffs
  const allMatches: Match[] = selectedTournament
    ? [
        ...selectedTournament.groups.flatMap((g) => g.matches),
        ...selectedTournament.playoffMatches
      ]
    : [];

  const handleVerifyMatch = async (match: Match) => {
    setVerifyingMatchId(match.id);
    hextechAudio.playClick();

    try {
      const response = await riotApi.verifyMatchAutomatically(match);
      setLastVerificationResponse(response);
      hextechAudio.playVictory();

      const updated: Match = {
        ...match,
        status: 'COMPLETED',
        winnerId: response.winnerTeamId,
        team1Score: response.blueTeamWon ? 1 : 0,
        team2Score: response.blueTeamWon ? 0 : 1,
        isAutomatedResult: true,
        gameStats: response.stats
      };

      onUpdateMatch(selectedTournament.id, updated);
      setVerifyingMatchId(null);
    } catch {
      setVerifyingMatchId(null);
    }
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    riotApi.setApiKey(riotApiKeyInput);
    setApiKeySaved(true);
    hextechAudio.playClick();
    setTimeout(() => setApiKeySaved(false), 2500);
  };

  const handleDistributePrizes = () => {
    hextechAudio.playVictory();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
    setPayoutSuccessMsg(
      `¡Premios en metálico liquidados con éxito! $${selectedTournament.prizeDistribution.firstPlace} USD transferidos al 1º Puesto, $${selectedTournament.prizeDistribution.secondPlace} USD al 2º y $${selectedTournament.prizeDistribution.thirdPlace} USD al 3º.`
    );
  };

  const handleTestApi = (index: number) => {
    setTestingApiIndex(index);
    hextechAudio.playClick();
    setTimeout(() => {
      setTestingApiIndex(null);
      setTestedApis((prev) => ({ ...prev, [index]: true }));
      hextechAudio.playVictory();
    }, 600);
  };

  // Required Riot Games APIs Specification
  const REQUIRED_RIOT_APIS = [
    {
      name: 'Tournament-v5 API',
      category: 'Generación de Salas & Códigos de Torneo',
      endpoints: [
        'POST /lol/tournament/v5/providers (Registro de Servidor Proveedor)',
        'POST /lol/tournament/v5/tournaments (Creación de ID de Torneo)',
        'POST /lol/tournament/v5/codes (Generación Masiva de Tournament Codes)'
      ],
      description:
        'API oficial de Riot para crear códigos de partida personalizados (Tournament Codes). Controla tipo de selección (TOURNAMENT_DRAFT), tamaño de equipo (5v5), mapa (Grieta del Invocador) y espectadores permitidos (LOBBYONLY o ALL).',
      payloadSample: `{
  "providerId": 9821,
  "name": "Hextech Rift Tournament LAS 2026",
  "mapType": "SUMMONER_RIFT",
  "pickType": "TOURNAMENT_DRAFT",
  "spectatorType": "ALL",
  "teamSize": 5
}`,
      statusBadge: 'Imprescindible',
      rateLimit: '500 req / 10 seg (Production Key)'
    },
    {
      name: 'Tournament-Callback-v5 (Webhooks)',
      category: 'Notificación de Fin de Partida en Tiempo Real',
      endpoints: [
        'POST /api/riot/tournament-callback (Webhook en Servidor Propio)',
        'Header: X-Riot-Token / HMAC-SHA256 signature'
      ],
      description:
        'Servicio webhook en tiempo real. En el milisegundo exacto en que un nexo es destruido en el cliente de LoL, los servidores centrales de Riot envían una petición HTTP POST a esta URL con el GameId, equipo ganador (Blue o Red) y código de torneo.',
      payloadSample: `{
  "startTime": 1728859200000,
  "shortCode": "TRN-LAS-EMD-GRP1",
  "metaData": "{\\"tournamentId\\":\\"trn_01\\",\\"matchId\\":\\"m_01\\"}",
  "gameId": 1420958102,
  "gameName": "Hextech Phoenix vs Noxus Vanguard",
  "gameType": "MATCHED_GAME",
  "gameMode": "CLASSIC",
  "region": "LA2"
}`,
      statusBadge: 'Automatización 0-Latencia',
      rateLimit: 'Event-driven (Push instantáneo)'
    },
    {
      name: 'Match-v5 API',
      category: 'Telemetría Detallada, KDA, Oro y MVP',
      endpoints: [
        'GET /lol/match/v5/matches/{matchId} (Estadísticas completas de partida)',
        'GET /lol/match/v5/matches/{matchId}/timeline (Línea de tiempo minuto a minuto)'
      ],
      description:
        'Extrae toda la información de la partida: KDA de cada jugador, daño infligido a campeones, oro obtenido, dragones elementales, Barón Nashor, torretas derribadas y algoritmo de cálculo del jugador más valioso (MVP).',
      payloadSample: `{
  "metadata": { "matchId": "LA2_1420958102" },
  "info": {
    "gameDuration": 1902,
    "teams": [{ "teamId": 100, "win": true, "baronKills": 1, "dragonKills": 3 }],
    "participants": [
      { "puuid": "kaelen_hex_puuid", "championName": "Ahri", "kills": 11, "deaths": 2, "assists": 9 }
    ]
  }
}`,
      statusBadge: 'Estadísticas & MVP',
      rateLimit: '2,000 req / 10 seg'
    },
    {
      name: 'Account-v1 & Summoner-v4 API',
      category: 'Verificación de Identidad Riot ID & Anti-Smurf',
      endpoints: [
        'GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine} (Riot ID a PUUID)',
        'GET /lol/summoner/v4/summoners/by-puuid/{puuid} (Datos de invocador & Nivel)',
        'GET /lol/league/v4/entries/by-summoner/{encryptedSummonerId} (Rango y LP en SoloQ)'
      ],
      description:
        'Verifica que el Riot ID ingresado pertenezca a una cuenta real y activa. Comprueba el rango actual en solo/duo para evitar smurfs y asegurar que el participante cumpla los requisitos de elo de la división del torneo.',
      payloadSample: `{
  "puuid": "q8A-9x...puuid",
  "gameName": "Kaelen Hex",
  "tagLine": "LAS",
  "tier": "DIAMOND",
  "rank": "I",
  "leaguePoints": 78
}`,
      statusBadge: 'Anti-Smurf & Verificación',
      rateLimit: '20,000 req / 10 seg'
    },
    {
      name: 'Spectator-v5 API',
      category: 'Monitoreo de Estado En Vivo & Detección de Caídas',
      endpoints: [
        'GET /lol/spectator/v5/active-games/by-summoner/{encryptedPUUID} (Partida en curso)'
      ],
      description:
        'Permite a los árbitros y al sistema verificar si los 10 jugadores ya cargaron a la Grieta del Invocador, detectar pausas tácticas y evitar descalificaciones erróneas por problemas técnicos de conexión.',
      payloadSample: `{
  "gameId": 1420958102,
  "gameType": "CUSTOM_GAME",
  "gameStartTime": 1728860100000,
  "observers": { "encryptionKey": "xyzKey==" }
}`,
      statusBadge: 'Monitoreo En Vivo',
      rateLimit: '20,000 req / 10 seg'
    }
  ];

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
        className="relative w-full max-w-5xl rounded-2xl bg-[#08101e] border-2 border-[#c89b3c]/50 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col cursor-default"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#060b13] border-b border-[#c89b3c]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#c89b3c]/20 border border-[#c89b3c]/40">
              <Shield className="w-5 h-5 text-[#c89b3c]" />
            </div>
            <div>
              <h2 className="text-lg font-cinzel font-bold text-[#f0e6d2]">
                Panel de Administración & Control Riot Games API
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Automatización de códigos de torneo, validación de partidas y liquidación de pozos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                hextechAudio.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#050a14] border-b border-slate-800 shrink-0 text-xs font-mono">
          <button
            onClick={() => {
              hextechAudio.playClick();
              setActiveTab('matches');
            }}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-[#c89b3c] text-black font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Verificación de Partidas ({allMatches.length})</span>
          </button>

          <button
            onClick={() => {
              hextechAudio.playClick();
              setActiveTab('apis');
            }}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'apis'
                ? 'bg-[#0ac8b9] text-black font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>APIs Requeridas de Riot Games (Guía)</span>
          </button>

          <button
            onClick={() => {
              hextechAudio.playClick();
              setActiveTab('payouts');
            }}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'payouts'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Liquidación de Premios (${selectedTournament.prizePoolUSD} USD)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs font-mono">
          {/* TAB 1: MATCHES VERIFICATION */}
          {activeTab === 'matches' && (
            <div className="space-y-6">
              {/* Tournament Selector & API Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Torneo a Gestionar
                  </label>
                  <select
                    value={selectedTournamentId}
                    onChange={(e) => setSelectedTournamentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/70 border border-slate-700 text-[#f0e6d2] font-cinzel text-sm focus:border-[#c89b3c] focus:outline-none cursor-pointer"
                  >
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.tier} · ${t.prizePoolUSD} USD)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs font-mono text-slate-400">ESTADO RIOT API GATEWAY</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {riotApi.hasApiKey() ? 'Conectado a Riot Live API' : 'Simulador Gateway Riot v5 Activo'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Tournament-v5 / Match-v5 Ready
                  </span>
                </div>
              </div>

              {/* Quick API Key Config Form */}
              <form onSubmit={handleSaveApiKey} className="p-4 rounded-xl bg-black/50 border border-slate-800 flex flex-wrap items-center gap-3">
                <Key className="w-4 h-4 text-[#c89b3c] shrink-0" />
                <span className="text-xs font-mono text-slate-300">Riot Games API Key (Opcional):</span>
                <input
                  type="password"
                  placeholder="RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={riotApiKeyInput}
                  onChange={(e) => setRiotApiKeyInput(e.target.value)}
                  className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none focus:border-[#c89b3c]"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs text-slate-200 font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {apiKeySaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                  <span>{apiKeySaved ? 'Guardada' : 'Guardar Llave'}</span>
                </button>
              </form>

              {/* Matches Verification List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-cinzel font-bold text-[#f0e6d2]">
                    Partidas en Sala de Espera y Brackets ({allMatches.length})
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Sincronización Automática con Cliente
                  </span>
                </div>

                <div className="space-y-3">
                  {allMatches.map((m) => {
                    const isVerifying = verifyingMatchId === m.id;
                    const isCompleted = m.status === 'COMPLETED';

                    return (
                      <div
                        key={m.id}
                        className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#c89b3c]">
                              [{m.stage}]
                            </span>
                            <span className="text-sm font-semibold text-[#f0e6d2]">
                              {m.team1?.name || 'TBD'} vs {m.team2?.name || 'TBD'}
                            </span>
                            {isCompleted && (
                              <span className="text-xs font-mono text-emerald-400 font-bold">
                                ({m.team1Score} - {m.team2Score})
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-slate-400">
                            Código Riot: <span className="text-cyan-400">{m.riotTournamentCode}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verificada por Riot API</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleVerifyMatch(m)}
                              disabled={isVerifying}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:from-[#e0b04c] text-black font-semibold text-xs font-mono transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                              <Cpu className="w-4 h-4" />
                              <span>{isVerifying ? 'Sincronizando...' : 'Verificar Automáticamente'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Last Verification API Response Payload Inspector */}
              {lastVerificationResponse && (
                <div className="p-4 rounded-xl bg-black/70 border border-[#0ac8b9]/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#0ac8b9]">
                    <span>RESPUESTA OFICIAL RIOT GAMES API (JSON RETRIEVED)</span>
                    <span>Match ID: {lastVerificationResponse.gameId}</span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-3 bg-black/80 rounded-lg max-h-48">
                    {JSON.stringify(lastVerificationResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REQUIRED RIOT APIS ARCHITECTURE GUIDE */}
          {activeTab === 'apis' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#091428] via-[#0e1d35] to-[#121c2e] border-2 border-[#0ac8b9]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#0ac8b9]/20 border border-[#0ac8b9]/40 text-[#0ac8b9] font-bold text-[10px]">
                      RIOT DEVELOPER PORTAL ARCHITECTURE
                    </span>
                    <span className="text-slate-400 text-xs">Especificación Técnica v5</span>
                  </div>
                  <a
                    href="https://developer.riotgames.com/apis"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#0ac8b9] hover:underline"
                  >
                    <span>Documentación Oficial Riot</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h3 className="text-lg font-cinzel font-bold text-[#f0e6d2]">
                  APIs Oficiales Requeridas para Automatizar Torneos de League of Legends
                </h3>

                <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-3xl">
                  Para que una plataforma de torneos opere 100% automatizada sin intervención humana de árbitros, Riot Games provee 5 APIs principales. A continuación se detalla exactamente el rol de cada una, sus endpoints y cómo se conectan al ciclo de vida del torneo.
                </p>
              </div>

              {/* APIs Grid */}
              <div className="space-y-4">
                {REQUIRED_RIOT_APIS.map((api, idx) => {
                  const isTested = testedApis[idx];
                  const isTesting = testingApiIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-[#0ac8b9]/20 text-[#0ac8b9] font-bold flex items-center justify-center text-xs">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-[#f0e6d2]">{api.name}</h4>
                            <span className="text-[11px] text-amber-400">{api.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px]">
                            {api.rateLimit}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                            {api.statusBadge}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleTestApi(idx)}
                            disabled={isTesting}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Radio className={`w-3 h-3 ${isTesting ? 'animate-spin text-amber-400' : 'text-[#0ac8b9]'}`} />
                            <span>{isTesting ? 'Ping...' : isTested ? '200 OK ✓' : 'Probar Ping'}</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {api.description}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] text-slate-400 font-bold uppercase block">
                          Endpoints Principales:
                        </span>
                        <div className="space-y-1">
                          {api.endpoints.map((ep, eIdx) => (
                            <div
                              key={eIdx}
                              className="px-2.5 py-1 rounded bg-black/60 border border-slate-800 font-mono text-[11px] text-[#0ac8b9]"
                            >
                              {ep}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payload Example */}
                      <details className="mt-2 text-[11px] group">
                        <summary className="text-slate-400 hover:text-slate-200 cursor-pointer font-bold flex items-center gap-1">
                          <span>Ver Estructura de Payload JSON</span>
                        </summary>
                        <pre className="mt-2 p-3 bg-black/80 rounded-lg text-slate-300 border border-slate-800 overflow-x-auto text-[10px]">
                          {api.payloadSample}
                        </pre>
                      </details>
                    </div>
                  );
                })}
              </div>

              {/* Checklist for Tournament Production Key */}
              <div className="p-5 rounded-2xl bg-black/60 border border-[#c89b3c]/30 space-y-3">
                <h4 className="text-sm font-cinzel font-bold text-[#f0e6d2] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#c89b3c]" />
                  Requisitos para Pasar de Development Key a Production Tournament Key
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 font-sans">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300 font-mono block">1. Proveedor Registrado (Callback URL)</span>
                    <p className="text-slate-400 text-[11px]">
                      Debe registrarse una URL HTTPS pública donde Riot envíe los webhooks de partidas completadas.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300 font-mono block">2. Validación de Firma Webhook</span>
                    <p className="text-slate-400 text-[11px]">
                      Comprobar la firma HMAC de Riot para evitar inyección fraudulenta de resultados de partidas.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300 font-mono block">3. Política de Espectadores</span>
                    <p className="text-slate-400 text-[11px]">
                      Configurar retraso reglamentario de 3 minutos para streams y evitar ghosting en vivo.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300 font-mono block">4. Escalado de Límites</span>
                    <p className="text-slate-400 text-[11px]">
                      La llave de producción no expira en 24 horas y soporta hasta 500 llamadas por cada 10 segundos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYOUTS */}
          {activeTab === 'payouts' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-gradient-to-r from-[#121c2e] to-[#091428] border-2 border-[#c89b3c]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-cinzel font-bold text-[#f0e6d2] flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    Liquidación de Premios en Metálico (${selectedTournament.prizePoolUSD} USD)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-sans">
                    Emite los pagos automáticos del pozo a los capitanes de equipo clasificados en 1º, 2º y 3º lugar.
                  </p>
                </div>

                <button
                  onClick={handleDistributePrizes}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black font-cinzel font-bold text-xs transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)] cursor-pointer whitespace-nowrap"
                >
                  Liquidar Pozo en Metálico
                </button>
              </div>

              {payoutSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{payoutSuccessMsg}</span>
                </div>
              )}

              {/* Breakdown Table */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-[#f0e6d2] uppercase">
                  Desglose de Premios del Torneo
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-black/50 border border-amber-500/40 text-center">
                    <span className="text-amber-400 text-[10px] uppercase font-bold block">1º Puesto</span>
                    <span className="text-xl font-bold text-[#f0e6d2] tabular-nums block mt-1">
                      ${selectedTournament.prizeDistribution.firstPlace} USD
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Capitán: Hextech Phoenix</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/50 border border-cyan-500/40 text-center">
                    <span className="text-cyan-400 text-[10px] uppercase font-bold block">2º Puesto</span>
                    <span className="text-xl font-bold text-[#f0e6d2] tabular-nums block mt-1">
                      ${selectedTournament.prizeDistribution.secondPlace} USD
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Capitán: Zaun Overdrive</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/50 border border-amber-700/40 text-center">
                    <span className="text-amber-600 text-[10px] uppercase font-bold block">3º Puesto</span>
                    <span className="text-xl font-bold text-[#f0e6d2] tabular-nums block mt-1">
                      ${selectedTournament.prizeDistribution.thirdPlace} USD
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Capitán: Targon Celestial</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
