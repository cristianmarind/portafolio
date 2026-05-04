export const tokens = {
  colors: {
    bgDeep:        '#060E14',
    bgSurface:     '#0D1F2D',
    bgElevated:    '#152535',
    border:        '#1E3448',
    accentCyan:    '#00D9C0',
    accentBlue:    '#0099FF',
    accentGold:    '#F5A623',
    textPrimary:   '#E8F4F8',
    textSecondary: '#7BA7BC',
    terminalBg:    '#030810',
    terminalText:  '#00FF88',
    gameSafe:      '#00FF66',
    gameDanger:    '#FF3333',
  },
  fonts: {
    sans: "'Space Grotesk', 'Inter', sans-serif",
    mono: "'JetBrains Mono', 'Courier New', monospace",
  },
  spacing: {
    sectionPad: '6rem',
  },
} as const;

export type ColorToken = keyof typeof tokens.colors;
