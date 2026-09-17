import { zones, type ZoneId } from './data'

export type Metrics = { planet: number; community: number; resources: number }
export type Choice = { id: string; title: string; detail: string; icon: string; effects: Metrics; feedback: string; change: string; helpful: boolean }
export type Mission = { title: string; question: string; objective: string; badge: string; options: Choice[] }
export const missions: Record<ZoneId, Mission> = {
  school: {
    title: 'Una escuela con menos basura', question: 'Cada recreo deja muchas botellas y vasos en el patio.', objective: 'Elige cómo reducir los residuos.', badge: 'Escuela del cambio',
    options: [
      { id: 'refill', title: 'Bebederos y botellas reutilizables', detail: 'Rellenar, beber y volver a usar.', icon: 'bottle', effects: { planet: 20, community: 20, resources: 20 }, feedback: 'Al rellenar nuestras botellas evitamos usar una nueva cada día. ¡Menos residuos desde el principio!', change: 'La escuela ya tiene un bebedero y botellas reutilizables.', helpful: true },
      { id: 'disposable', title: 'Más vasos desechables', detail: 'Un vaso nuevo en cada recreo.', icon: 'cup', effects: { planet: 2, community: 5, resources: 1 }, feedback: 'Parece cómodo, pero cada vaso se convierte en basura. Reutilizar evita que los botes se llenen tan rápido.', change: 'Los vasos siguen acumulándose. Todavía podemos aprender a separarlos.', helpful: false },
      { id: 'campaign', title: 'Una campaña ecológica', detail: 'Invitar a toda la escuela a participar.', icon: 'leaf', effects: { planet: 12, community: 20, resources: 10 }, feedback: 'Compartir ideas anima a más personas a cuidar la escuela. La campaña ayuda aún más si también reutilizamos.', change: 'El patio tiene una campaña para reducir residuos.', helpful: true },
    ],
  },
  home: {
    title: 'Cada gota cuenta', question: 'Una llave con fuga está desperdiciando agua en casa.', objective: 'Decide cómo cuidar el agua.', badge: 'Guardián del Agua',
    options: [
      { id: 'repair', title: 'Reparar la fuga', detail: 'Pedir ayuda para arreglar la llave.', icon: 'wrench', effects: { planet: 20, community: 20, resources: 20 }, feedback: 'Reparar la fuga evita que el agua se pierda todo el día. Para arreglarla, pedimos ayuda a una persona adulta.', change: 'La llave está reparada. ¡Ya no hay charcos!', helpful: true },
      { id: 'close', title: 'Cerrar la llave de paso', detail: 'Detener la pérdida por ahora.', icon: 'drop', effects: { planet: 12, community: 10, resources: 15 }, feedback: 'Cerrar el paso detiene la pérdida de agua. Después habrá que reparar la fuga para volver a usar la llave.', change: 'El agua dejó de salir; la reparación sigue pendiente.', helpful: true },
      { id: 'reuse', title: 'Recoger y reusar el agua', detail: 'Usarla para regar las plantas.', icon: 'plant', effects: { planet: 16, community: 10, resources: 12 }, feedback: 'Aprovechamos el agua para las plantas, pero la fuga continúa. Reusar ayuda; reparar evita el desperdicio.', change: 'Las plantas reciben agua recogida en una cubeta.', helpful: true },
    ],
  },
  park: {
    title: 'Un parque lleno de vida', question: 'Hay residuos junto a los árboles y pocas flores para los insectos.', objective: 'Ayuda a recuperar este espacio.', badge: 'Amigo de la Naturaleza',
    options: [
      { id: 'restore', title: 'Limpiar y plantar flores locales', detail: 'Cuidar a quienes viven aquí.', icon: 'plant', effects: { planet: 20, community: 20, resources: 20 }, feedback: 'Recoger los residuos protege a los animales. Las flores locales ofrecen alimento a los polinizadores.', change: 'El parque está limpio y tiene un jardín para polinizadores.', helpful: true },
      { id: 'clean', title: 'Organizar una limpieza', detail: 'Recoger los residuos entre todos.', icon: 'recycle', effects: { planet: 16, community: 20, resources: 12 }, feedback: 'Un parque limpio es más seguro para las personas y los animales. Plantar flores sería un gran siguiente paso.', change: 'Los caminos del parque vuelven a estar limpios.', helpful: true },
      { id: 'pave', title: 'Cubrir el jardín con cemento', detail: 'Quitar las plantas para barrer fácil.', icon: 'road', effects: { planet: 1, community: 5, resources: 2 }, feedback: 'Es más fácil barrer, pero perdemos sombra y refugios para los animales. Cuidar las plantas mantiene vivo el parque.', change: 'Hay menos plantas y menos refugios para los insectos.', helpful: false },
    ],
  },
  community: {
    title: 'Un barrio que se mueve mejor', question: 'Muchos viajes cortos en auto llenan la calle de tráfico.', objective: 'Elige cómo movernos juntos.', badge: 'Comunidad en acción',
    options: [
      { id: 'walk', title: 'Caminar o ir en bicicleta', detail: 'En grupo y por rutas seguras.', icon: 'bike', effects: { planet: 20, community: 20, resources: 20 }, feedback: 'Para trayectos cortos, caminar o pedalear reduce el tráfico y el uso de combustible. ¡Y compartimos el camino!', change: 'El barrio tiene una ruta para caminar y pedalear juntos.', helpful: true },
      { id: 'bus', title: 'Compartir transporte', detail: 'Usar el autobús o compartir un auto.', icon: 'bus', effects: { planet: 16, community: 20, resources: 17 }, feedback: 'Viajar juntos significa menos vehículos para llevar a las mismas personas. Es una buena opción para trayectos largos.', change: 'Más vecinos comparten el transporte.', helpful: true },
      { id: 'cars', title: 'Un auto para cada persona', detail: 'Incluso para los viajes más cortos.', icon: 'car', effects: { planet: 2, community: 3, resources: 1 }, feedback: 'Más autos ocupan espacio y usan más combustible. Compartir el viaje o caminar puede reducir el tráfico.', change: 'La calle sigue llena de autos. Podemos probar otra idea en una nueva partida.', helpful: false },
    ],
  },
}

export const bins = [
  { id: 'organic', name: 'Orgánico', hint: 'Restos de comida', color: '#159b45' },
  { id: 'paper', name: 'Papel', hint: 'Papel y cartón', color: '#168dd0' },
  { id: 'plastic', name: 'Plástico', hint: 'Envases plásticos', color: '#edb91f' },
  { id: 'metal', name: 'Metal', hint: 'Latas de metal', color: '#687b82' },
] as const
export type BinId = typeof bins[number]['id']
export type RecyclingItem = { id: string; name: string; bin: BinId; art: string; tip: string }
export const items: RecyclingItem[] = [
  { id: 'banana', name: 'Cáscara de plátano', bin: 'organic', art: 'banana', tip: 'Es un resto de comida: va en Orgánico.' },
  { id: 'bottle', name: 'Botella de plástico', bin: 'plastic', art: 'bottle', tip: 'Esta botella vacía es de plástico.' },
  { id: 'paper', name: 'Hoja de papel', bin: 'paper', art: 'paper', tip: 'El papel limpio y seco va en Papel.' },
  { id: 'can', name: 'Lata de aluminio', bin: 'metal', art: 'can', tip: 'El aluminio es un metal.' },
  { id: 'apple', name: 'Corazón de manzana', bin: 'organic', art: 'apple', tip: 'Los restos de fruta van en Orgánico.' },
  { id: 'box', name: 'Caja de cartón', bin: 'paper', art: 'box', tip: 'El cartón limpio va junto con el papel.' },
  { id: 'jug', name: 'Envase de plástico', bin: 'plastic', art: 'jug', tip: 'Este envase vacío está hecho de plástico.' },
  { id: 'tin', name: 'Lata de conservas', bin: 'metal', art: 'tin', tip: 'Esta lata vacía está hecha de metal.' },
]

// The city missions stay intentionally short. Endless practice uses a much
// wider pool so children learn to recognize materials instead of memorizing
// the order of the eight mission objects.
export const practiceItems: RecyclingItem[] = [
  ...items,
  { id: 'orange', name: 'Cáscara de naranja', bin: 'organic', art: 'orange', tip: 'Las cáscaras de fruta son residuos orgánicos.' },
  { id: 'eggshell', name: 'Cáscara de huevo', bin: 'organic', art: 'eggshell', tip: 'La cáscara de huevo es un resto de comida.' },
  { id: 'coffee', name: 'Café usado', bin: 'organic', art: 'coffee', tip: 'El café usado puede volver a la tierra como composta.' },
  { id: 'bread', name: 'Pedazo de pan', bin: 'organic', art: 'bread', tip: 'El pan es un resto de alimento: va en Orgánico.' },
  { id: 'carrot', name: 'Punta de zanahoria', bin: 'organic', art: 'carrot', tip: 'Los restos de verduras son orgánicos.' },
  { id: 'leaves', name: 'Hojas secas', bin: 'organic', art: 'leaves', tip: 'Las hojas secas pueden convertirse en composta.' },
  { id: 'newspaper', name: 'Periódico', bin: 'paper', art: 'newspaper', tip: 'El periódico limpio y seco va con el papel.' },
  { id: 'notebook', name: 'Cuaderno usado', bin: 'paper', art: 'notebook', tip: 'Sus hojas son de papel; retira piezas que no sean de papel.' },
  { id: 'paper-bag', name: 'Bolsa de papel', bin: 'paper', art: 'paper-bag', tip: 'Una bolsa limpia de papel va en Papel.' },
  { id: 'egg-carton', name: 'Cartón de huevos', bin: 'paper', art: 'egg-carton', tip: 'Este empaque seco está hecho de cartón.' },
  { id: 'tube', name: 'Tubo de cartón', bin: 'paper', art: 'tube', tip: 'El tubo de cartón va junto con el papel.' },
  { id: 'magazine', name: 'Revista', bin: 'paper', art: 'magazine', tip: 'Las revistas limpias y secas van en Papel.' },
  { id: 'shampoo', name: 'Botella de champú', bin: 'plastic', art: 'shampoo', tip: 'Este envase vacío está hecho de plástico.' },
  { id: 'yogurt', name: 'Vaso de yogur', bin: 'plastic', art: 'yogurt', tip: 'Enjuagado y vacío, este vaso es de plástico.' },
  { id: 'cap', name: 'Tapa de botella', bin: 'plastic', art: 'cap', tip: 'Esta tapa está hecha de plástico.' },
  { id: 'detergent', name: 'Envase de detergente', bin: 'plastic', art: 'detergent', tip: 'El envase vacío de detergente es de plástico.' },
  { id: 'food-container', name: 'Recipiente de plástico', bin: 'plastic', art: 'food-container', tip: 'Este recipiente limpio está hecho de plástico.' },
  { id: 'spray-bottle', name: 'Atomizador vacío', bin: 'plastic', art: 'spray-bottle', tip: 'La botella vacía del atomizador es de plástico.' },
  { id: 'foil', name: 'Papel aluminio limpio', bin: 'metal', art: 'foil', tip: 'Aunque es delgado, el aluminio es un metal.' },
  { id: 'metal-lid', name: 'Tapa metálica', bin: 'metal', art: 'metal-lid', tip: 'Esta tapa está hecha de metal.' },
  { id: 'spoon', name: 'Cuchara de metal', bin: 'metal', art: 'spoon', tip: 'La cuchara está hecha de metal.' },
  { id: 'key', name: 'Llave vieja', bin: 'metal', art: 'key', tip: 'Las llaves están hechas de metal.' },
  { id: 'steel-cup', name: 'Vaso de acero', bin: 'metal', art: 'steel-cup', tip: 'El acero pertenece a los metales.' },
  { id: 'metal-tray', name: 'Charola metálica', bin: 'metal', art: 'metal-tray', tip: 'Esta charola limpia está hecha de metal.' },
]

// Keep the storage key so version-1 school progress can migrate without data loss.
export const STORAGE_KEY = 'eco-ciudad-v1'
export const recyclingLevels: Record<ZoneId, { level: number; fallDuration: number; label: string }> = {
  school: { level: 1, fallDuration: 18000, label: 'Primeros pasos' },
  home: { level: 2, fallDuration: 14000, label: 'Toma ritmo' },
  park: { level: 3, fallDuration: 10000, label: 'Más rápido' },
  community: { level: 4, fallDuration: 7000, label: 'Reto de la ciudad' },
}
export type Save = { version: 3; answers: Partial<Record<ZoneId, string>>; recycling: Record<ZoneId, string[]>; mistakes: number; practiceBest: number; sound: boolean; reduceMotion: boolean }
export function freshSave(): Save { return { version: 3, answers: {}, recycling: { school: [], home: [], park: [], community: [] }, mistakes: 0, practiceBest: 0, sound: true, reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches } }
export function loadSave(): Save {
  const fallback = freshSave()
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!value || ![1, 2, 3].includes(value.version) || !value.answers || typeof value.answers !== 'object' || Array.isArray(value.answers)) return fallback
    const answers: Save['answers'] = {}
    const recycling = fallback.recycling
    for (const zone of zones) {
      const choice = value.answers[zone.id]
      if (!missions[zone.id].options.some(option => option.id === choice)) break
      answers[zone.id] = choice
      const sorted = value.version === 1 ? (zone.id === 'school' ? value.sorted : []) : value.recycling?.[zone.id]
      recycling[zone.id] = Array.isArray(sorted) ? items.filter(item => sorted.includes(item.id)).map(item => item.id) : []
    }
    return { ...fallback, answers, recycling, mistakes: Number.isSafeInteger(value.mistakes) ? Math.max(0, Math.min(9999, value.mistakes)) : 0, practiceBest: Number.isSafeInteger(value.practiceBest) ? Math.max(0, Math.min(999999, value.practiceBest)) : 0, sound: typeof value.sound === 'boolean' ? value.sound : true, reduceMotion: typeof value.reduceMotion === 'boolean' ? value.reduceMotion : fallback.reduceMotion }
  } catch { return fallback }
}
export function getChoice(save: Save, zone: ZoneId) { return missions[zone].options.find(option => option.id === save.answers[zone]) }
export function recyclingComplete(save: Save, zone: ZoneId) { return save.recycling[zone].length === items.length }
export function zoneComplete(save: Save, zone: ZoneId) { return Boolean(save.answers[zone]) && recyclingComplete(save, zone) }
export function getMetrics(save: Save): Metrics {
  const sortedCount = zones.reduce((count, zone) => count + save.recycling[zone.id].length, 0)
  const bonus = Math.round(sortedCount / (items.length * zones.length) * 10)
  const scores = { planet: 10 + bonus, community: 10 + bonus, resources: 10 + bonus }
  zones.forEach(zone => {
    const choice = getChoice(save, zone.id)
    if (choice) for (const key of ['planet', 'community', 'resources'] as const) scores[key] = Math.min(100, scores[key] + choice.effects[key])
  })
  return scores
}
export function getScore(save: Save) { const m = getMetrics(save); return Math.round(m.planet * .4 + m.resources * .3 + m.community * .3) }
export function zoneStatus(save: Save, zone: ZoneId) {
  if (zoneComplete(save, zone)) return 'completed'
  const index = zones.findIndex(entry => entry.id === zone)
  // Existing decisions stay accessible when migrating a previous game.
  return index === 0 || Boolean(save.answers[zone]) || zoneComplete(save, zones[index - 1].id) ? 'ready' : 'locked'
}
export function isFinished(save: Save) { return zones.every(zone => zoneComplete(save, zone.id)) }
