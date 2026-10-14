import { Champion, RankTier, LaneRole } from '../types/tournament';

export const LOL_CHAMPIONS: Champion[] = [
  {
    id: 'Aatrox',
    name: 'Aatrox',
    title: 'La Espada de los Oscuros',
    role: 'TOP',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Aatrox.png',
    difficulty: 'Media',
    class: 'Luchador'
  },
  {
    id: 'Ahri',
    name: 'Ahri',
    title: 'La Mujer Zorro de Nueve Colas',
    role: 'MID',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ahri.png',
    difficulty: 'Media',
    class: 'Mago'
  },
  {
    id: 'Akali',
    name: 'Akali',
    title: 'La Asesina Furtiva',
    role: 'MID',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Akali.png',
    difficulty: 'Alta',
    class: 'Asesino'
  },
  {
    id: 'Caitlyn',
    name: 'Caitlyn',
    title: 'La Sheriff de Piltóver',
    role: 'ADC',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Caitlyn.png',
    difficulty: 'Fácil',
    class: 'Tirador'
  },
  {
    id: 'Darius',
    name: 'Darius',
    title: 'La Mano de Noxus',
    role: 'TOP',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Darius.png',
    difficulty: 'Fácil',
    class: 'Luchador'
  },
  {
    id: 'Jinx',
    name: 'Jinx',
    title: 'La Bala Perdida',
    role: 'ADC',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jinx.png',
    difficulty: 'Media',
    class: 'Tirador'
  },
  {
    id: 'Kaisa',
    name: "Kai'Sa",
    title: 'La Hija del Vacío',
    role: 'ADC',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Kaisa.png',
    difficulty: 'Media',
    class: 'Tirador'
  },
  {
    id: 'Ksante',
    name: "K'Sante",
    title: 'El Orgullo de Nazumah',
    role: 'TOP',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/KSante.png',
    difficulty: 'Alta',
    class: 'Tanque'
  },
  {
    id: 'LeeSin',
    name: 'Lee Sin',
    title: 'El Monje Ciego',
    role: 'JUNGLE',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/LeeSin.png',
    difficulty: 'Alta',
    class: 'Luchador'
  },
  {
    id: 'Lux',
    name: 'Lux',
    title: 'La Dama Luminosa',
    role: 'SUPPORT',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Lux.png',
    difficulty: 'Fácil',
    class: 'Mago'
  },
  {
    id: 'Nautilus',
    name: 'Nautilus',
    title: 'El Titán de las Profundidades',
    role: 'SUPPORT',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Nautilus.png',
    difficulty: 'Fácil',
    class: 'Tanque'
  },
  {
    id: 'Thresh',
    name: 'Thresh',
    title: 'El Carcelero de las Cadenas',
    role: 'SUPPORT',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Thresh.png',
    difficulty: 'Media',
    class: 'Soporte'
  },
  {
    id: 'Viego',
    name: 'Viego',
    title: 'El Rey Arruinado',
    role: 'JUNGLE',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Viego.png',
    difficulty: 'Alta',
    class: 'Asesino'
  },
  {
    id: 'Yasuo',
    name: 'Yasuo',
    title: 'El Imperdonable',
    role: 'MID',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Yasuo.png',
    difficulty: 'Alta',
    class: 'Luchador'
  },
  {
    id: 'Yone',
    name: 'Yone',
    title: 'El Imborrable',
    role: 'MID',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Yone.png',
    difficulty: 'Media',
    class: 'Asesino'
  },
  {
    id: 'Zed',
    name: 'Zed',
    title: 'El Maestro de las Sombras',
    role: 'MID',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Zed.png',
    difficulty: 'Alta',
    class: 'Asesino'
  },
  {
    id: 'JarvanIV',
    name: 'Jarvan IV',
    title: 'El Ejemplo de Demacia',
    role: 'JUNGLE',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/JarvanIV.png',
    difficulty: 'Fácil',
    class: 'Tanque'
  },
  {
    id: 'Sejuani',
    name: 'Sejuani',
    title: 'La Furia del Norte',
    role: 'JUNGLE',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Sejuani.png',
    difficulty: 'Media',
    class: 'Tanque'
  },
  {
    id: 'Rakan',
    name: 'Rakan',
    title: 'El Encantador',
    role: 'SUPPORT',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Rakan.png',
    difficulty: 'Media',
    class: 'Soporte'
  },
  {
    id: 'Jax',
    name: 'Jax',
    title: 'El Gran Maestro de las Armas',
    role: 'TOP',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jax.png',
    difficulty: 'Media',
    class: 'Luchador'
  }
];

export const RANK_TIERS_INFO: Record<RankTier, { name: string; color: string; border: string; bg: string; eloBadge: string }> = {
  IRON: {
    name: 'Hierro',
    color: 'text-stone-400',
    border: 'border-stone-600',
    bg: 'bg-stone-900/60',
    eloBadge: '0 - 1,149 LP'
  },
  BRONZE: {
    name: 'Bronce',
    color: 'text-amber-700',
    border: 'border-amber-800',
    bg: 'bg-amber-950/50',
    eloBadge: '1,150 - 1,499 LP'
  },
  SILVER: {
    name: 'Plata',
    color: 'text-slate-300',
    border: 'border-slate-400',
    bg: 'bg-slate-800/60',
    eloBadge: '1,500 - 1,849 LP'
  },
  GOLD: {
    name: 'Oro',
    color: 'text-yellow-400',
    border: 'border-yellow-500',
    bg: 'bg-yellow-950/40',
    eloBadge: '1,850 - 2,199 LP'
  },
  PLATINUM: {
    name: 'Platino',
    color: 'text-emerald-400',
    border: 'border-emerald-500',
    bg: 'bg-emerald-950/40',
    eloBadge: '2,200 - 2,499 LP'
  },
  EMERALD: {
    name: 'Esmeralda',
    color: 'text-teal-400',
    border: 'border-teal-500',
    bg: 'bg-teal-950/40',
    eloBadge: '2,500 - 2,799 LP'
  },
  DIAMOND: {
    name: 'Diamante',
    color: 'text-cyan-300',
    border: 'border-cyan-400',
    bg: 'bg-cyan-950/50',
    eloBadge: '2,800 - 3,199 LP'
  },
  MASTER: {
    name: 'Master',
    color: 'text-purple-400',
    border: 'border-purple-500',
    bg: 'bg-purple-950/50',
    eloBadge: '3,200+ LP'
  },
  GRANDMASTER: {
    name: 'Gran Master',
    color: 'text-rose-400',
    border: 'border-rose-500',
    bg: 'bg-rose-950/50',
    eloBadge: 'Top 700 Regional'
  },
  CHALLENGER: {
    name: 'Challenger',
    color: 'text-amber-300',
    border: 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]',
    bg: 'bg-amber-950/60',
    eloBadge: 'Top 300 Regional'
  }
};

export const LANE_ROLES_INFO: Record<LaneRole, { name: string; label: string; iconKey: string; desc: string }> = {
  TOP: {
    name: 'Top Lane',
    label: 'Superior',
    iconKey: 'shield',
    desc: 'Luchadores, Tanques y control de línea solitaria.'
  },
  JUNGLE: {
    name: 'Jungla',
    label: 'Jungla',
    iconKey: 'compass',
    desc: 'Objetivos neutros (Baron, Dragón), emboscadas y ritmo de mapa.'
  },
  MID: {
    name: 'Mid Lane',
    label: 'Central',
    iconKey: 'flame',
    desc: 'Magos y asesinos con rotación e impacto central.'
  },
  ADC: {
    name: 'Bot / Tirador',
    label: 'Tirador (ADC)',
    iconKey: 'target',
    desc: 'Daño continuo físico a distancia para peleas en equipo.'
  },
  SUPPORT: {
    name: 'Soporte',
    label: 'Soporte',
    iconKey: 'heart-handshake',
    desc: 'Visión, control de masas y protección del equipo.'
  },
  FILL: {
    name: 'Polivalente',
    label: 'Comodín',
    iconKey: 'shuffle',
    desc: 'Capacidad de jugar cualquier rol según necesidad del equipo.'
  }
};
