export type ZoneId = 'school' | 'home' | 'park' | 'community'
export type Zone = { id: ZoneId; name: string; className: string }

// This order also defines the mission-unlock sequence. Status is derived from
// saved answers in game.ts, never hardcoded into the content.
export const zones: Zone[] = [
  { id: 'school', name: 'Escuela', className: 'zone--school' },
  { id: 'home', name: 'Casa', className: 'zone--home' },
  { id: 'park', name: 'Parque', className: 'zone--park' },
  { id: 'community', name: 'Comunidad', className: 'zone--community' },
]
