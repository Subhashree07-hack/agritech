export const E = {
  farm: '\u{1F33E}',
  tomato: '\u{1F345}',
  carrot: '\u{1F955}',
  greens: '\u{1F96C}',
  banana: '\u{1F34C}',
  apple: '\u{1F34E}',
  hair: '\u{1F487}',
  skin: '\u2728',
  shield: '\u{1F6E1}\uFE0F',
  plate: '\u{1F37D}\uFE0F',
  pin: '\u{1F4CD}',
  farmer: '\u{1F468}\u200D\u{1F33E}',
  rupee: '\u20B9',
  dot: '\u2022',
  cow: '\u{1F404}',
  juice: '\u{1F964}',
  sparkles: '\u2728',
  lightning: '\u26A1',
  truck: '\u{1F69A}',
  phone: '\u{1F4DE}',
  check: '\u2705',
  leaf: '\u{1F33F}',
  search: '\u{1F50D}',
  star: '\u2B50',
}

export const TAMIL = '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD'

export const CATEGORIES = [
  { key: '', label: 'All Stock', icon: '\u{1F6D2}' },
  { key: 'vegetable', label: 'Vegetables', icon: '\u{1F955}' },
  { key: 'greens', label: 'Greens', icon: '\u{1F96C}' },
  { key: 'fruit', label: 'Fruits', icon: '\u{1F34E}' },
]

export const catIcon = (c) =>
  ({ vegetable: '\u{1F955}', greens: '\u{1F96C}', fruit: '\u{1F34E}' }[c] || '\u{1F96C}')
