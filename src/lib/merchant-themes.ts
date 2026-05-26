// Activités et thèmes de catalogue pour les marchands Souqly

// ---------------------------------------------------------------------------
// Activités éligibles
// ---------------------------------------------------------------------------

export type Activity = {
  id: string
  label: string
  group: string
}

export const ACTIVITIES: Activity[] = [
  // Mode & Textile
  { id: 'mode-femme',       label: 'Mode femme',              group: 'Mode & Textile' },
  { id: 'mode-homme',       label: 'Mode homme',              group: 'Mode & Textile' },
  { id: 'mode-enfant',      label: 'Mode enfant & bébé',      group: 'Mode & Textile' },
  { id: 'sneakers',         label: 'Sneakers & Chaussures',   group: 'Mode & Textile' },
  { id: 'streetwear',       label: 'Streetwear & Urbain',     group: 'Mode & Textile' },
  { id: 'lingerie',         label: 'Lingerie & Maillots',     group: 'Mode & Textile' },
  // Luxe & Accessoires
  { id: 'luxe',             label: 'Luxe & Créateurs',        group: 'Luxe & Accessoires' },
  { id: 'bijoux',           label: 'Bijoux & Accessoires',    group: 'Luxe & Accessoires' },
  { id: 'montres',          label: 'Montres & Horlogerie',    group: 'Luxe & Accessoires' },
  { id: 'maroquinerie',     label: 'Sacs & Maroquinerie',     group: 'Luxe & Accessoires' },
  // Beauté & Bien-être
  { id: 'cosmetiques',      label: 'Cosmétiques & Maquillage', group: 'Beauté & Bien-être' },
  { id: 'parfums',          label: 'Parfums & Senteurs',      group: 'Beauté & Bien-être' },
  { id: 'soins',            label: 'Soins & Bien-être',       group: 'Beauté & Bien-être' },
  // Sport & Loisirs
  { id: 'sportswear',       label: 'Sportswear & Fitness',    group: 'Sport & Loisirs' },
  { id: 'sport-equipement', label: 'Équipement sportif',      group: 'Sport & Loisirs' },
  // Tech & Digital
  { id: 'electronique',     label: 'Électronique & High-Tech', group: 'Tech & Digital' },
  { id: 'gaming',           label: 'Gaming & Jeux vidéo',     group: 'Tech & Digital' },
  // Maison & Déco
  { id: 'deco',             label: 'Déco intérieure & Maison', group: 'Maison & Déco' },
  { id: 'mobilier',         label: 'Mobilier & Ameublement',  group: 'Maison & Déco' },
  { id: 'textile-maison',   label: 'Textile maison',           group: 'Maison & Déco' },
  // Food & Boissons
  { id: 'alimentation',     label: 'Alimentation & Épicerie fine', group: 'Food & Boissons' },
  { id: 'cafe-boissons',    label: 'Café, Thé & Boissons',    group: 'Food & Boissons' },
  // Enfants & Famille
  { id: 'jouets',           label: 'Jouets & Jeux',           group: 'Enfants & Famille' },
  { id: 'puericulture',     label: 'Puériculture & Bébé',     group: 'Enfants & Famille' },
  // Art & Culture
  { id: 'art-creatif',      label: 'Art & Créations artisanales', group: 'Art & Culture' },
  { id: 'livres',           label: 'Livres & Papeterie',      group: 'Art & Culture' },
  { id: 'musique',          label: 'Instruments de musique',  group: 'Art & Culture' },
  // Nature & Cadeaux
  { id: 'fleurs-plantes',   label: 'Fleurs & Plantes',        group: 'Nature & Cadeaux' },
  { id: 'cadeaux',          label: 'Cadeaux & Événementiel',  group: 'Nature & Cadeaux' },
  { id: 'animaux',          label: 'Animaux & Accessoires',   group: 'Nature & Cadeaux' },
]

export const ACTIVITY_GROUPS = [...new Set(ACTIVITIES.map((a) => a.group))]

// ---------------------------------------------------------------------------
// Thèmes de catalogue (30)
// ---------------------------------------------------------------------------

export type ThemeColors = {
  bg: string
  surface: string
  border: string
  primary: string
  primaryFg: string
  text: string
  textMuted: string
}

export type Theme = {
  id: string
  name: string
  description: string
  colors: ThemeColors
  recommended: string[]
  isDark: boolean
}

export const THEMES: Theme[] = [
  // ─── THÈMES SOMBRES (15) ───────────────────────────────────────────────

  {
    id: 'indigo-pro',
    name: 'Indigo Pro',
    description: 'Le thème signature Souqly. Élégant et professionnel.',
    colors: { bg: '#0f0f1a', surface: '#1a1a2e', border: '#2d2d4e', primary: '#6366f1', primaryFg: '#fff', text: '#f0f0ff', textMuted: '#8080b0' },
    recommended: ['mode-femme', 'mode-homme', 'electronique'],
    isDark: true,
  },
  {
    id: 'midnight-luxury',
    name: 'Minuit Luxueux',
    description: 'Noir profond et or. Pour le luxe et la haute couture.',
    colors: { bg: '#0a0a0a', surface: '#141414', border: '#2a2a2a', primary: '#d4af37', primaryFg: '#000', text: '#f5f0e0', textMuted: '#a09070' },
    recommended: ['luxe', 'bijoux', 'montres', 'maroquinerie'],
    isDark: true,
  },
  {
    id: 'couture-noir',
    name: 'Couture Noire',
    description: 'Noir absolu, typographie fine. Créateurs et mode premium.',
    colors: { bg: '#080808', surface: '#111111', border: '#222222', primary: '#ffffff', primaryFg: '#000', text: '#f5f5f5', textMuted: '#888888' },
    recommended: ['luxe', 'mode-femme', 'lingerie'],
    isDark: true,
  },
  {
    id: 'royal-velvet',
    name: 'Velours Royal',
    description: 'Bordeaux profond et or. Parfums, cadeaux et prestige.',
    colors: { bg: '#1a0a14', surface: '#250d1c', border: '#3d1830', primary: '#9b2444', primaryFg: '#fff', text: '#f5e8ee', textMuted: '#b08090' },
    recommended: ['parfums', 'cadeaux', 'luxe'],
    isDark: true,
  },
  {
    id: 'urban-concrete',
    name: 'Urban Béton',
    description: 'Gris béton et rouge vif. Streetwear et sneakers.',
    colors: { bg: '#1c1c1c', surface: '#262626', border: '#333333', primary: '#e63946', primaryFg: '#fff', text: '#f0f0f0', textMuted: '#909090' },
    recommended: ['streetwear', 'sneakers', 'mode-homme'],
    isDark: true,
  },
  {
    id: 'neon-street',
    name: 'Néon Street',
    description: 'Noir et cyan électrique. Gaming et culture urbaine.',
    colors: { bg: '#060611', surface: '#0d0d1f', border: '#1a1a3a', primary: '#00f5ff', primaryFg: '#000', text: '#e0f0ff', textMuted: '#6080a0' },
    recommended: ['gaming', 'electronique', 'streetwear'],
    isDark: true,
  },
  {
    id: 'amber-souk',
    name: 'Ambre Souk',
    description: 'Ambre et brun chaud. Artisanat oriental et maroquinerie.',
    colors: { bg: '#1a0e05', surface: '#261507', border: '#3d2208', primary: '#d2820e', primaryFg: '#fff', text: '#f5ddb0', textMuted: '#a08050' },
    recommended: ['maroquinerie', 'bijoux', 'art-creatif', 'alimentation'],
    isDark: true,
  },
  {
    id: 'oud-oriental',
    name: 'Oud Oriental',
    description: 'Violet-bordeaux et cuivre. Parfums orientaux et luxe.',
    colors: { bg: '#120814', surface: '#1c1020', border: '#2c1830', primary: '#c4862a', primaryFg: '#fff', text: '#f0e0d0', textMuted: '#907060' },
    recommended: ['parfums', 'bijoux', 'luxe'],
    isDark: true,
  },
  {
    id: 'ocean-marine',
    name: 'Océan Marin',
    description: 'Navy profond et turquoise. Sport nautique et lifestyle.',
    colors: { bg: '#051528', surface: '#0a2040', border: '#103050', primary: '#14b8a6', primaryFg: '#fff', text: '#e0f4f4', textMuted: '#6090a0' },
    recommended: ['sportswear', 'sport-equipement'],
    isDark: true,
  },
  {
    id: 'fitness-pro',
    name: 'Fitness Pro',
    description: 'Noir et vert électrique. Performance et sport.',
    colors: { bg: '#080f0a', surface: '#0f1a10', border: '#1a2a1c', primary: '#32c850', primaryFg: '#000', text: '#e0ffe0', textMuted: '#60a070' },
    recommended: ['sportswear', 'sport-equipement'],
    isDark: true,
  },
  {
    id: 'vinyl-music',
    name: 'Vinyl Noir',
    description: 'Noir profond et ambre chaud. Musique et instruments.',
    colors: { bg: '#0d0a07', surface: '#1a140d', border: '#2a2010', primary: '#d2963c', primaryFg: '#fff', text: '#f5e8d0', textMuted: '#a08050' },
    recommended: ['musique'],
    isDark: true,
  },
  {
    id: 'emeraude-luxe',
    name: 'Émeraude Luxe',
    description: 'Émeraude profond et or. Bijoux et créateurs premium.',
    colors: { bg: '#050f0a', surface: '#0a1a10', border: '#10281a', primary: '#10af60', primaryFg: '#fff', text: '#e0f5e8', textMuted: '#50906a' },
    recommended: ['bijoux', 'luxe', 'cadeaux'],
    isDark: true,
  },
  {
    id: 'rose-gold-glam',
    name: 'Rose Gold Glamour',
    description: 'Rose or sur fond sombre. Mode femme et cosmétiques luxe.',
    colors: { bg: '#1a0e14', surface: '#261220', border: '#3a1a2a', primary: '#c5856a', primaryFg: '#fff', text: '#f5e8f0', textMuted: '#a07080' },
    recommended: ['mode-femme', 'cosmetiques', 'bijoux', 'lingerie'],
    isDark: true,
  },
  {
    id: 'cafe-vintage',
    name: 'Café Vintage',
    description: 'Brun riche et ambre. Café, thé et épicerie fine.',
    colors: { bg: '#1a1008', surface: '#241708', border: '#382510', primary: '#d2a064', primaryFg: '#fff', text: '#f5e8d8', textMuted: '#a08060' },
    recommended: ['cafe-boissons', 'alimentation'],
    isDark: true,
  },
  {
    id: 'chrome-tech',
    name: 'Chrome Tech',
    description: 'Gris sombre et bleu acier. Électronique et high-tech.',
    colors: { bg: '#0e1218', surface: '#181e28', border: '#252d3a', primary: '#3b82f6', primaryFg: '#fff', text: '#dce8f8', textMuted: '#6080a0' },
    recommended: ['electronique', 'gaming'],
    isDark: true,
  },

  // ─── THÈMES CLAIRS (15) ────────────────────────────────────────────────

  {
    id: 'blush-parisien',
    name: 'Blush Parisien',
    description: 'Rose poudré et crème dorée. Mode femme et cosmétiques.',
    colors: { bg: '#fdf8f5', surface: '#ffffff', border: '#f0ddd5', primary: '#c4726a', primaryFg: '#fff', text: '#2d1a16', textMuted: '#9a7570' },
    recommended: ['mode-femme', 'cosmetiques', 'lingerie', 'bijoux'],
    isDark: false,
  },
  {
    id: 'marbre-classique',
    name: 'Marbre Classique',
    description: 'Blanc marbre et gris perle. Bijoux et déco haut de gamme.',
    colors: { bg: '#f7f7f7', surface: '#ffffff', border: '#e0ddd8', primary: '#3d3d3d', primaryFg: '#fff', text: '#1a1a1a', textMuted: '#787878' },
    recommended: ['bijoux', 'deco', 'mobilier', 'luxe'],
    isDark: false,
  },
  {
    id: 'tokyo-minimal',
    name: 'Tokyo Minimal',
    description: 'Blanc épuré et noir absolu. Mode internationale.',
    colors: { bg: '#f8f8f8', surface: '#ffffff', border: '#e8e8e8', primary: '#1a1a1a', primaryFg: '#fff', text: '#1a1a1a', textMuted: '#888888' },
    recommended: ['mode-femme', 'mode-homme', 'sneakers'],
    isDark: false,
  },
  {
    id: 'sage-nature',
    name: 'Sauge Nature',
    description: 'Vert sauge et sable. Soins naturels, plantes et bien-être.',
    colors: { bg: '#f5f4ef', surface: '#ffffff', border: '#d4d9c8', primary: '#6b7c5a', primaryFg: '#fff', text: '#2d3526', textMuted: '#7a8a6a' },
    recommended: ['soins', 'fleurs-plantes', 'alimentation'],
    isDark: false,
  },
  {
    id: 'scandinave-pur',
    name: 'Scandinave Pur',
    description: 'Blanc chaud et bois naturel. Déco et mobilier.',
    colors: { bg: '#f7f5f2', surface: '#ffffff', border: '#e0dbd5', primary: '#4a4035', primaryFg: '#fff', text: '#2a2520', textMuted: '#8a8078' },
    recommended: ['deco', 'mobilier', 'textile-maison'],
    isDark: false,
  },
  {
    id: 'cotton-denim',
    name: 'Coton Denim',
    description: 'Denim et blanc pur. Mode homme et casual.',
    colors: { bg: '#f5f7fb', surface: '#ffffff', border: '#d0daf0', primary: '#3457a0', primaryFg: '#fff', text: '#1a2035', textMuted: '#7080a0' },
    recommended: ['mode-homme', 'sneakers', 'streetwear'],
    isDark: false,
  },
  {
    id: 'terracotta-sud',
    name: 'Terracotta Sud',
    description: 'Terracotta et crème. Alimentation, artisanat et bazar.',
    colors: { bg: '#fdf6ef', surface: '#ffffff', border: '#e8d5c0', primary: '#c4622d', primaryFg: '#fff', text: '#2d1a0a', textMuted: '#9a7050' },
    recommended: ['alimentation', 'art-creatif', 'maroquinerie'],
    isDark: false,
  },
  {
    id: 'fresh-market',
    name: 'Marché Frais',
    description: 'Vert vif et blanc. Épicerie fraîche et alimentaire.',
    colors: { bg: '#f0faf0', surface: '#ffffff', border: '#c0e8c0', primary: '#2a8a2a', primaryFg: '#fff', text: '#0a200a', textMuted: '#508050' },
    recommended: ['alimentation', 'cafe-boissons'],
    isDark: false,
  },
  {
    id: 'bebe-doux',
    name: 'Bébé Doux',
    description: 'Menthe douce et soleil tendre. Puériculture et enfants.',
    colors: { bg: '#f0fbf7', surface: '#ffffff', border: '#c7ece0', primary: '#4ead8a', primaryFg: '#fff', text: '#1a3d30', textMuted: '#6a9d88' },
    recommended: ['puericulture', 'jouets', 'mode-enfant'],
    isDark: false,
  },
  {
    id: 'arc-en-ciel',
    name: 'Arc-en-Ciel',
    description: 'Fond blanc et accents joyeux. Jouets et univers enfant.',
    colors: { bg: '#fffdf5', surface: '#ffffff', border: '#ffe8a0', primary: '#f59e0b', primaryFg: '#fff', text: '#1a1a0a', textMuted: '#909070' },
    recommended: ['jouets', 'mode-enfant', 'cadeaux'],
    isDark: false,
  },
  {
    id: 'art-gallery',
    name: "Galerie d'Art",
    description: 'Blanc pur et noir absolu. Art et créations artisanales.',
    colors: { bg: '#ffffff', surface: '#f8f8f8', border: '#e0e0e0', primary: '#111111', primaryFg: '#fff', text: '#111111', textMuted: '#777777' },
    recommended: ['art-creatif', 'livres'],
    isDark: false,
  },
  {
    id: 'jardin-fleuri',
    name: 'Jardin Fleuri',
    description: 'Rose naturel et vert feuille. Fleurs, plantes et cadeaux.',
    colors: { bg: '#fdf5f8', surface: '#ffffff', border: '#f0d9e4', primary: '#b05a7a', primaryFg: '#fff', text: '#2d1020', textMuted: '#907080' },
    recommended: ['fleurs-plantes', 'cadeaux', 'cosmetiques'],
    isDark: false,
  },
  {
    id: 'papier-kraft',
    name: 'Papier Kraft',
    description: 'Kraft naturel et rouge brique. Papeterie, livres et créations.',
    colors: { bg: '#f5ecd0', surface: '#fdf5e0', border: '#d4c090', primary: '#8b2500', primaryFg: '#fff', text: '#1a0a00', textMuted: '#807040' },
    recommended: ['livres', 'art-creatif'],
    isDark: false,
  },
  {
    id: 'pet-care',
    name: 'Patte Dorée',
    description: 'Beige chaud et vert herbe. Animaux et accessoires.',
    colors: { bg: '#fdf8f0', surface: '#ffffff', border: '#e8d8b8', primary: '#7a9a2a', primaryFg: '#fff', text: '#2a2010', textMuted: '#8a8050' },
    recommended: ['animaux'],
    isDark: false,
  },
  {
    id: 'champagne-prestige',
    name: 'Champagne Prestige',
    description: 'Champagne et anthracite. Événementiel et cadeaux premium.',
    colors: { bg: '#faf7f0', surface: '#ffffff', border: '#e8dfc8', primary: '#2d2820', primaryFg: '#fff', text: '#1a1410', textMuted: '#8a8070' },
    recommended: ['cadeaux', 'luxe', 'alimentation'],
    isDark: false,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

export function getActivity(id: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id)
}

export function getRecommendedThemes(activityId: string): Theme[] {
  const recommended = THEMES.filter((t) => t.recommended.includes(activityId))
  const rest = THEMES.filter((t) => !t.recommended.includes(activityId))
  return [...recommended, ...rest]
}

export function themeToCSS(theme: Theme): Record<string, string> {
  return {
    '--ct-bg':         theme.colors.bg,
    '--ct-surface':    theme.colors.surface,
    '--ct-border':     theme.colors.border,
    '--ct-primary':    theme.colors.primary,
    '--ct-primary-fg': theme.colors.primaryFg,
    '--ct-text':       theme.colors.text,
    '--ct-text-muted': theme.colors.textMuted,
  }
}
