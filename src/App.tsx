import { useEffect, useRef, useState } from 'react'
import { zones, type ZoneId } from './data'
import { Friends, ItemArt, WorldArt } from './Art'
import { recyclingLevels, recyclingComplete, zoneComplete, freshSave, getChoice, getMetrics, getScore, isFinished, items, loadSave, missions, STORAGE_KEY, zoneStatus, type Save, type Metrics } from './game'
import Recycling from './Recycling'

type Screen = 'landing' | 'map' | 'mission' | 'decision' | 'result' | 'minigame' | 'achievements' | 'final'
type Modal = 'help' | 'settings' | 'restart' | null
function Icon({ name }: { name: 'back' | 'gear' | 'close' | 'leaf' | 'people' | 'drop' }) {
  const paths = {
    back: <path d="M19 12H5m6-6-6 6 6 6"/>, close: <path d="m6 6 12 12M18 6 6 18"/>,
    gear: <><path d="m9 3-1 3-3 1v4l2 2-1 3 3 3 3-1 3 1 3-3-1-3 2-2V7l-3-1-1-3Z"/><circle cx="12" cy="11" r="3"/></>,
    leaf: <><path d="M20 4C12 4 5 8 5 15c0 2.8 2.2 5 5 5 7 0 10-8 10-16Z"/><path d="M5 20c2-5 6-8 11-11"/></>,
    people: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c.3-4 2.4-6 6-6s5.7 2 6 6M15 15c3.4-.4 5.4 1.3 6 4"/></>,
    drop: <path d="M12 2C9 8 5 11 5 15a7 7 0 0 0 14 0c0-4-4-7-7-13Z"/>,
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
function ResourceBar({ metrics }: { metrics: Metrics }) {
  return <div className="resource-bar" aria-label="Bienestar de la ciudad">{([['planet', 'Planeta', 'leaf', 'planet'], ['community', 'Comunidad', 'people', 'community'], ['resources', 'Recursos', 'drop', 'energy']] as const).map(([key, label, icon, color]) => <div key={key} className={`resource resource--${color}`} aria-label={`${label}: ${metrics[key]} de 100`}><Icon name={icon}/><span><small>{label}</small><b>{metrics[key]}</b></span></div>)}</div>
}
function EcoLogo({ compact = false }: { compact?: boolean }) {
  return <div className={`eco-logo ${compact ? 'eco-logo--compact' : ''}`} aria-label="Eco-Ciudad"><span className="eco-logo__sprout" aria-hidden="true"><i/><i/></span><span>Eco</span><span>-Ciudad</span>{!compact && <small>Construye un futuro sostenible</small>}</div>
}
function Building({ type }: { type: ZoneId }) {
  return <span className={`building building--${type}`} aria-hidden="true">
    {type === 'school' && <><i className="roof"/><i className="flag"/><b>ESCUELA</b><i className="door"/><i className="window window--one"/><i className="window window--two"/></>}
    {type === 'home' && <><i className="roof"/><i className="solar"/><i className="door"/><i className="window"/></>}
    {type === 'park' && <><i className="park-tree park-tree--one"/><i className="park-tree park-tree--two"/><i className="park-bench"/></>}
    {type === 'community' && <><i className="roof"/><i className="door"/><i className="window window--one"/><i className="window window--two"/><i className="awning"/></>}
  </span>
}
function WoodTitle({ children }: { children: React.ReactNode }) { return <h1 className="wood-title" tabIndex={-1}>{children}<i aria-hidden="true"/><i aria-hidden="true"/></h1> }

function Dialog({ type, onClose, save, onSetting, onRestart }: { type: Exclude<Modal, null>; onClose: () => void; save: Save; onSetting: (key: 'sound' | 'reduceMotion') => void; onRestart: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const nodes = () => Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])
    nodes()[0]?.focus()
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current() }
      if (event.key === 'Tab') {
        const buttons = nodes(), first = buttons[0], last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', key)
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', key); previous?.focus({ preventScroll: true }) }
  }, [])
  return <div className="modal-backdrop" onPointerDown={event => { if (event.currentTarget === event.target) onClose() }}><section ref={ref} className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button className="icon-button modal-card__close" onClick={onClose} aria-label="Cerrar"><Icon name="close"/></button><span className="modal-card__leaf"><Icon name={type === 'settings' ? 'gear' : 'leaf'}/></span><p className="modal-card__eyebrow">Tu aventura, a tu ritmo</p><h2 id="modal-title">{type === 'help' ? '¿Cómo se juega?' : type === 'restart' ? '¿Empezamos de nuevo?' : 'Ajustes'}</h2>
    {type === 'help' ? <><ol className="steps"><li><b>1</b><div><strong>Explora la ciudad</strong><span>Empieza en la escuela. Decide y completa el reciclaje para abrir otra zona.</span></div></li><li><b>2</b><div><strong>Decide y observa</strong><span>Descubre qué cambia con tus decisiones.</span></div></li><li><b>3</b><div><strong>Separa los residuos</strong><span>Arrastra al bote o toca el objeto y su destino. También puedes usar Tab y Enter.</span></div></li></ol><button className="primary-button" onClick={onClose}>¡Vamos!</button></> : type === 'settings' ? <><div className="setting-row"><div><strong>Sonido</strong><span>Efectos breves al jugar</span></div><button className={`toggle ${save.sound ? 'toggle--on' : ''}`} aria-label="Sonido" aria-pressed={save.sound} onClick={() => onSetting('sound')}><i/></button></div><div className="setting-row"><div><strong>Movimiento reducido</strong><span>Objetos quietos para jugar a tu ritmo</span></div><button className={`toggle ${save.reduceMotion ? 'toggle--on' : ''}`} aria-label="Movimiento reducido" aria-pressed={save.reduceMotion} onClick={() => onSetting('reduceMotion')}><i/></button></div><button className="primary-button" onClick={onClose}>Listo</button><button className="text-button reset-link" onClick={onRestart}>Reiniciar partida</button></> : <><p>Se borrarán las misiones y las insignias de esta partida en este navegador.</p><button className="primary-button" onClick={onRestart}>Sí, volver a empezar</button><button className="text-button" onClick={onClose}>Seguir con mi ciudad</button></>}
  </section></div>
}

export default function App() {
  const [save, setSave] = useState(loadSave)
  const [screen, setScreen] = useState<Screen>('landing')
  const [selected, setSelected] = useState<ZoneId>('school')
  const [modal, setModal] = useState<Modal>(null)
  const [storageError, setStorageError] = useState(false)
  const [mapArtReady, setMapArtReady] = useState(false)
  const audio = useRef<AudioContext | null>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const metrics = getMetrics(save), mission = missions[selected], zone = zones.find(entry => entry.id === selected)!, choice = getChoice(save, selected), status = zoneStatus(save, selected)
  const completeCount = zones.filter(zone => zoneComplete(save, zone.id)).length, allDone = isFinished(save)
  const sorted = save.recycling[selected], level = recyclingLevels[selected]
  function chime() {
    if (!save.sound) return
    try {
      const context = audio.current ??= new AudioContext()
      void context.resume().catch(() => {})
      const oscillator = context.createOscillator(), gain = context.createGain()
      oscillator.connect(gain); gain.connect(context.destination)
      oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(660, context.currentTime); oscillator.frequency.exponentialRampToValueAtTime(990, context.currentTime + .12)
      gain.gain.setValueAtTime(.0001, context.currentTime); gain.gain.exponentialRampToValueAtTime(.055, context.currentTime + .015); gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .24)
      oscillator.start(); oscillator.stop(context.currentTime + .25); oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
    } catch { /* Audio is optional. */ }
  }
  function navigate(next: Screen) { setScreen(next) }
  function afterResult() {
    if (!recyclingComplete(save, selected)) navigate('minigame')
    else if (allDone) navigate('achievements')
    else { const next = zones.find(entry => zoneStatus(save, entry.id) === 'ready'); if (next) setSelected(next.id); navigate('map') }
  }
  function restart() { setSave({ ...freshSave(), sound: save.sound, reduceMotion: save.reduceMotion }); setSelected('school'); setModal(null); navigate('landing') }
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(save)); setStorageError(false) } catch { setStorageError(true) } }, [save])
  useEffect(() => { window.scrollTo({ top: 0 }); mainRef.current?.querySelector<HTMLElement>('h1, .map-stage, #start-btn')?.focus({ preventScroll: true }) }, [screen])
  useEffect(() => {
    const key = async (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'f' || event.ctrlKey || event.metaKey || event.altKey || modal) return
      try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen() } catch { /* Optional on mobile. */ }
    }
    window.addEventListener('keydown', key); window.advanceTime = ms => window.advanceRecycling?.(ms)
    return () => window.removeEventListener('keydown', key)
  }, [modal])
  useEffect(() => {
    window.render_game_to_text = () => JSON.stringify({ coordinateSystem: 'DOM viewport; origin top-left; x right, y down', mode: screen, modal, selectedZone: selected, resources: getMetrics(save), score: getScore(save), completedMissions: zones.filter(zone => zoneComplete(save, zone.id)).map(zone => zone.id), answeredMissions: Object.keys(save.answers), recyclingByZone: save.recycling, zones: zones.map(zone => ({ id: zone.id, name: zone.name, status: zoneStatus(save, zone.id), choice: save.answers[zone.id] ?? null })), recycling: window.recyclingState?.() ?? { zone: selected, sorted: save.recycling[selected], fallDuration: recyclingLevels[selected].fallDuration, total: items.length, mistakes: save.mistakes }, settings: { sound: save.sound, reduceMotion: save.reduceMotion }, finished: isFinished(save) })
  }, [screen, modal, selected, save])
  const header = <header className="map-header"><button className="icon-button" onClick={() => navigate(screen === 'map' ? 'landing' : 'map')} aria-label={screen === 'map' ? 'Volver a la portada' : 'Volver al mapa'}><Icon name="back"/></button><ResourceBar metrics={metrics}/><button className="icon-button" onClick={() => setModal('settings')} aria-label="Abrir ajustes"><Icon name="gear"/></button></header>
  const badges = [
    { title: 'Héroe del Reciclaje', kind: 'recycle', unlocked: zones.every(zone => recyclingComplete(save, zone.id)), color: 'recycle', detail: 'Completa los cuatro retos de reciclaje' },
    { title: 'Guardián del Agua', kind: 'drop', unlocked: !!save.answers.home, color: 'water', detail: 'Completa la misión de Casa' },
    { title: 'Amigo de la Naturaleza', kind: 'plant', unlocked: !!save.answers.park && getChoice(save, 'park')?.helpful, color: 'nature', detail: 'Elige una acción que cuide el parque' },
    { title: 'Comunidad en acción', kind: 'bike', unlocked: !!save.answers.community && getChoice(save, 'community')?.helpful, color: 'community', detail: 'Elige un transporte compartido o activo' },
  ]
  return <div className={`app app--${screen} ${save.reduceMotion ? 'reduce-motion' : ''}`}><div ref={mainRef} inert={modal !== null}>
    {storageError && <div className="storage-notice" role="status">Puedes jugar, pero este navegador no permite guardar tu avance.</div>}
    {screen === 'landing' && <main className="screen landing" data-screen="landing"><button className="icon-button landing__settings" onClick={() => setModal('settings')} aria-label="Abrir ajustes"><Icon name="gear"/></button><section className="landing__copy"><div className="eyebrow"><Icon name="leaf"/> Pequeñas acciones, grandes cambios</div><EcoLogo/><p className="landing__intro">Una ciudad, cuatro aventuras.<br/>¡El próximo cambio empieza contigo!</p><div className="landing__actions"><button id="start-btn" className="primary-button primary-button--play" onClick={() => { chime(); navigate('map') }}><span className="play-icon" aria-hidden="true">▶</span>{completeCount ? 'Continuar' : 'Jugar'}</button><button className="text-button" onClick={() => setModal('help')}><span>?</span> ¿Cómo se juega?</button></div><div className="quick-facts"><span><b>4</b> misiones</span><span><b>4</b> retos de reciclaje</span><span>Tu progreso se guarda aquí</span></div></section><section className="landing__world" aria-label="Nuestros exploradores en una escuela sostenible"><WorldArt improved choice="refill"/></section><p className="keyboard-hint">Presiona <kbd>F</kbd> para pantalla completa</p></main>}

    {screen === 'map' && <main className="screen city-screen" data-screen="map">{header}<section className={`map-stage ${allDone ? 'map-stage--complete' : ''} ${mapArtReady ? 'map-stage--painted' : ''}`} tabIndex={-1} aria-label="Mapa de Eco-Ciudad"><img className="map-illustration" src="/art/city-map.webp" width="1120" height="1400" alt="" onLoad={() => setMapArtReady(true)} onError={() => setMapArtReady(false)}/><div className="map-title"><EcoLogo compact/><p>{allDone ? '¡Mira todo lo que has conseguido!' : 'Cada decisión transforma tu ciudad'}</p></div><div className="river" aria-hidden="true"><i/><i/><i/></div><div className="road road--vertical"/><div className="road road--horizontal"/><div className="roundabout"><i/></div><div className="map-trees" aria-hidden="true">● ● ● ● ● ● ● ● ● ● ● ● ● ● ●</div>
      {zones.map((entry, index) => { const state = zoneStatus(save, entry.id), improved = getChoice(save, entry.id)?.helpful; return <button key={entry.id} className={`zone ${entry.className} zone--${state} ${selected === entry.id ? 'zone--selected' : ''} ${improved ? 'zone--green' : ''}`} aria-pressed={selected === entry.id} aria-label={`${entry.name}. ${state === 'locked' ? `Completa ${zones[index - 1]?.name} para desbloquear` : state === 'completed' ? 'Misión completada' : 'Misión disponible'}`} onClick={() => setSelected(entry.id)}><span className={`zone__badge zone__badge--${state}`}>{state === 'completed' ? '✓' : state === 'locked' ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5Z" fill="none" stroke="currentColor" strokeWidth="3"/></svg> : '★'}</span><Building type={entry.id}/>{improved && <span className="zone-garden" aria-hidden="true">✿ ✿ ✿</span>}<span className="zone__label">{entry.name}</span></button> })}<div className="map-cyclist" aria-hidden="true"><ItemArt kind="bike"/></div></section>
      <aside className="zone-panel" aria-live="polite"><div className={`zone-panel__icon zone-panel__icon--${status}`}>{status === 'completed' ? '✓' : status === 'locked' ? '·' : '★'}</div><div><span>{status === 'completed' ? 'Misión completada' : status === 'locked' ? 'Una aventura por descubrir' : 'Tu próxima misión'}</span><h2>{zone.name}</h2><p>{status === 'locked' ? `Completa ${zones[zones.findIndex(entry => entry.id === selected) - 1].name} para desbloquear esta misión.` : choice ? recyclingComplete(save, selected) ? choice.change : `Completa el reto de reciclaje: ${sorted.length}/8 objetos.` : mission.title}</p></div><button className="zone-panel__enter" onClick={() => navigate(choice && !recyclingComplete(save, selected) ? 'minigame' : 'mission')}>{status === 'locked' ? 'Explorar' : status === 'completed' ? 'Ver zona' : 'Entrar'} <b aria-hidden="true">›</b></button></aside><footer className="map-footer"><button className="small-button" onClick={() => navigate('achievements')}>★ Mis logros</button>{save.answers[selected] && <button className="small-button recycle-shortcut" onClick={() => navigate('minigame')}>♻ {zone.name} <b>{sorted.length}/8</b></button>}<div className="progress-pill"><span>{completeCount}/4</span><small>Zonas completadas</small></div></footer>{allDone && <button className="primary-button map-final-button" onClick={() => navigate('final')}>Ver mi ciudad sostenible ›</button>}</main>}

    {(['mission', 'decision', 'result'] as Screen[]).includes(screen) && <main className={`screen adventure-screen adventure-screen--${screen}`} data-screen={screen} data-zone={selected}>{header}<WoodTitle>{screen === 'result' ? 'Resultado' : screen === 'decision' ? 'Tu decisión' : 'Misión'}</WoodTitle><div className="adventure-layout"><section className="story-scene"><div className="question-bubble"><span className="section-eyebrow">{zone.name} · {zones.findIndex(entry => entry.id === selected) + 1} de 4</span><h2>{screen === 'result' ? choice?.helpful ? '¡Buena decisión!' : 'Cada decisión nos enseña' : mission.title}</h2><p>{screen === 'result' ? choice?.change : mission.question}</p></div><WorldArt zone={selected} improved={screen === 'result' || status === 'completed' ? choice?.helpful : false} choice={screen === 'result' || status === 'completed' ? choice?.id : undefined}/><div className="scene-caption">{screen === 'result' ? 'Así cambia tu ciudad' : 'Observa · Imagina · Transforma'}</div></section><section className="story-actions">
      {screen === 'mission' && <><p className="section-eyebrow">{status === 'locked' ? 'Muy pronto podrás ayudar aquí' : status === 'completed' ? 'Tu huella en la ciudad' : 'Tu reto'}</p><h2>{status === 'completed' ? choice?.change : mission.objective}</h2><p>{status === 'locked' ? 'Cada misión abre un nuevo lugar. Vuelve al mapa para seguir tu aventura.' : status === 'completed' ? 'Puedes explorar otra idea y ver cómo cambia el resultado.' : 'Hay más de una forma de ayudar. Descubre qué sucede con cada opción.'}</p>{status !== 'locked' && <button className="primary-button" onClick={() => navigate('decision')}>{status === 'completed' ? 'Explorar otra solución' : '¿Qué podemos hacer?'} ›</button>}{save.answers[selected] && <button className="secondary-button" onClick={() => navigate('minigame')}>♻ Ir al reto de reciclaje</button>}<button className="text-button" onClick={() => navigate('map')}>Volver al mapa</button></>}
      {screen === 'decision' && <><p className="section-eyebrow">Elige una idea</p><h2>¿Qué hacemos?</h2><div className="decision-list">{mission.options.map((option, index) => <button className={`decision-card decision-card--${index}`} key={option.id} data-choice={option.id} onClick={() => { setSave(current => ({ ...current, answers: { ...current.answers, [selected]: option.id } })); chime(); navigate('result') }}><span className="decision-icon"><ItemArt kind={option.icon}/></span><span><strong>{option.title}</strong><small>{option.detail}</small></span><b aria-hidden="true">›</b></button>)}</div><p className="soft-note">Elige y observa lo que cambia.</p></>}
      {screen === 'result' && choice && <><p className="section-eyebrow">Pequeña acción, gran aprendizaje</p><h2>{choice.title}</h2><p className="consequence-copy">{choice.feedback}</p><div className="effect-chips"><span>Planeta <b>+{choice.effects.planet}</b></span><span>Comunidad <b>+{choice.effects.community}</b></span><span>Recursos <b>+{choice.effects.resources}</b></span></div><button className="primary-button" onClick={afterResult}>{!recyclingComplete(save, selected) ? '¡A separar residuos!' : allDone ? 'Ver mis logros' : 'Volver a mi ciudad'} ›</button><button className="text-button" onClick={() => navigate('decision')}>Probar otra idea</button></>}
    </section></div></main>}

    {screen === 'minigame' && <main className="screen recycling-screen" data-screen="minigame">{header}<WoodTitle>Reto de <em>reciclaje</em></WoodTitle><p className="recycling-level">{zone.name} · Nivel {level.level}/4 · {level.label}</p><div className="recycling-world"><div className="recycle-scenery" aria-hidden="true"><WorldArt zone={selected} improved={choice?.helpful} choice={choice?.id} characters={false}/></div><div className="recycle-friends" aria-hidden="true"><svg viewBox="0 0 340 240"><Friends/></svg></div><Recycling key={selected} fallDuration={level.fallDuration} sorted={sorted} mistakes={save.mistakes} reduceMotion={save.reduceMotion} suspended={modal !== null} onSort={id => setSave(current => current.recycling[selected].includes(id) ? current : { ...current, recycling: { ...current.recycling, [selected]: [...current.recycling[selected], id] } })} onMistake={() => setSave(current => ({ ...current, mistakes: Math.min(9999, current.mistakes + 1) }))} onSound={chime} onFinish={afterResult}/></div></main>}

    {screen === 'achievements' && <main className="screen achievements-screen" data-screen="achievements">{header}<WoodTitle>Mis logros</WoodTitle><div className="celebration-copy"><h2>{badges.some(badge => badge.unlocked) ? '¡Mira lo que has conseguido!' : 'Tu aventura apenas comienza'}</h2><p>Cada acción cuenta para cuidar nuestra ciudad.</p></div><div className="badges-grid">{badges.map(badge => <div key={badge.title} className={`badge-card ${badge.unlocked ? '' : 'badge-card--locked'}`}><span className="badge-star" aria-hidden="true">★</span><div className={`medal medal--${badge.color}`}><ItemArt kind={badge.kind}/></div><h2>{badge.title}</h2><p>{badge.unlocked ? '✓ ¡Conseguido!' : badge.detail}</p></div>)}</div><svg className="celebration-friends" viewBox="0 0 340 240" aria-hidden="true"><Friends celebrate/></svg><button className="primary-button" onClick={() => navigate(allDone ? 'final' : 'map')}>{allDone ? 'Ver mi ciudad sostenible' : 'Seguir explorando'} ›</button></main>}

    {screen === 'final' && <main className="screen final-screen" data-screen="final">{header}<WoodTitle>Tu ciudad sostenible</WoodTitle><div className="final-intro"><div className="final-score"><b>{getScore(save)}<small>%</small></b><span>Sostenibilidad</span></div><div><h2>¡Tú hiciste la diferencia!</h2><p>Cuatro lugares, muchas pequeñas acciones.<br/>Así quedó la ciudad con tus decisiones.</p></div></div><div className="final-city">{zones.map(entry => <article key={entry.id}><WorldArt zone={entry.id} improved={getChoice(save, entry.id)?.helpful} choice={save.answers[entry.id]} characters={false}/><h2>{entry.name}</h2><p>{getChoice(save, entry.id)?.change}</p></article>)}</div><div className="final-tips"><span><ItemArt kind="drop"/> Cuida cada gota</span><span><ItemArt kind="bottle"/> Reutiliza tus envases</span><span><ItemArt kind="plant"/> Protege la naturaleza</span></div><div className="final-actions"><button className="primary-button" onClick={() => navigate('map')}>Explorar mi ciudad</button><button className="secondary-button" onClick={() => setModal('restart')}>Volver a jugar</button></div><p className="soft-note">El porcentaje refleja tus decisiones en este juego.</p></main>}
  </div>{modal && <Dialog key={modal} type={modal} save={save} onClose={() => setModal(null)} onSetting={key => setSave(current => ({ ...current, [key]: !current[key] }))} onRestart={() => modal === 'restart' ? restart() : setModal('restart')}/>}</div>
}
