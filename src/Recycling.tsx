import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { ItemArt } from './Art'
import { bins, items, type BinId } from './game'

type Props = { fallDuration: number; sorted: string[]; mistakes: number; reduceMotion: boolean; suspended: boolean; onSort: (id: string) => void; onMistake: () => void; onFinish: () => void; onSound: () => void }
type Grab = { pointer: number; x: number; y: number; startY: number; moved: boolean }

export default function Recycling({ fallDuration, sorted, mistakes, reduceMotion, suspended, onSort, onMistake, onFinish, onSound }: Props) {
  const item = items.find(entry => !sorted.includes(entry.id))
  const boardRef = useRef<HTMLDivElement>(null)
  const objectRef = useRef<HTMLButtonElement>(null)
  const completeRef = useRef<HTMLElement>(null)
  const grab = useRef<Grab | null>(null)
  const fall = useRef(0)
  const committed = useRef(false)
  const ignoreClick = useRef(false)
  const selectedRef = useRef(false)
  const [selected, setSelected] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hoverBin, setHoverBin] = useState<string | null>(null)
  const [message, setMessage] = useState('Arrastra el objeto al bote correcto. También puedes tocar el objeto y después el bote.')
  const callbacks = useRef({ onSort, onMistake, onSound })
  callbacks.current = { onSort, onMistake, onSound }

  function select(value: boolean) { selectedRef.current = value; setSelected(value) }
  function cancelGrab() {
    grab.current = null
    setHoverBin(null)
    objectRef.current?.style.setProperty('transform', `translate3d(0, ${fall.current * Math.max(0, (boardRef.current?.clientHeight ?? 0) - 112)}px, 0)`)
  }

  useEffect(() => {
    fall.current = 0
    committed.current = false
    ignoreClick.current = false
    select(false)
    cancelGrab()
  }, [item?.id])

  useEffect(() => {
    let raf = 0
    let previous = performance.now()
    const step = (ms: number) => {
      if (!item || paused || suspended || document.hidden || selectedRef.current || grab.current || committed.current) return
      if (!reduceMotion) fall.current += Math.max(0, ms) / fallDuration
      if (fall.current >= 1) {
        fall.current = 0
        setMessage('¡Otra oportunidad! El objeto vuelve arriba. Tócalo para detenerlo y elige un bote.')
      }
      if (objectRef.current && boardRef.current) objectRef.current.style.transform = `translate3d(0, ${fall.current * Math.max(0, boardRef.current.clientHeight - 112)}px, 0)`
    }
    const frame = (now: number) => { step(Math.min(50, now - previous)); previous = now; raf = requestAnimationFrame(frame) }
    if (item && !paused && !suspended && !reduceMotion) raf = requestAnimationFrame(frame)
    window.advanceRecycling = step
    return () => { cancelAnimationFrame(raf); delete window.advanceRecycling }
  }, [item, paused, reduceMotion, suspended, fallDuration])

  useEffect(() => {
    const stop = () => { cancelGrab(); setPaused(true) }
    const hidden = () => { if (document.hidden) stop() }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { cancelGrab(); select(false) } }
    window.addEventListener('blur', stop)
    document.addEventListener('visibilitychange', hidden)
    window.addEventListener('keydown', escape)
    window.addEventListener('resize', cancelGrab)
    return () => { window.removeEventListener('blur', stop); document.removeEventListener('visibilitychange', hidden); window.removeEventListener('keydown', escape); window.removeEventListener('resize', cancelGrab) }
  }, [])

  // A completed object disappears from the DOM. Keep keyboard users at the
  // next playable object instead of silently dropping focus onto the page.
  const nextFocus = useRef(false)
  useEffect(() => {
    if (!nextFocus.current) return
    nextFocus.current = false
    if (item) objectRef.current?.focus({ preventScroll: true })
    else completeRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
  }, [item])

  useEffect(() => {
    window.recyclingState = () => ({ activeItem: item ? { ...item, selected: selectedRef.current, fallProgress: +fall.current.toFixed(3) } : null, fallDuration, sorted, total: items.length, mistakes, paused: paused || suspended, message })
    return () => { delete window.recyclingState }
  }, [item, sorted, mistakes, paused, suspended, message, fallDuration])

  function destination(x: number, y: number) {
    // The captured object sits above the bins; elementFromPoint would hit the
    // object itself. Test the actual bin rectangles in viewport coordinates.
    const targets = boardRef.current?.parentElement?.querySelectorAll<HTMLElement>('[data-bin]') ?? []
    for (const target of targets) {
      const rect = target.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return target.dataset.bin as BinId
    }
    return undefined
  }
  function place(bin: BinId) {
    if (!item || committed.current || paused || suspended) return
    if (item.bin === bin) {
      nextFocus.current = document.activeElement === objectRef.current || document.activeElement?.closest('[data-bin]') !== null
      committed.current = true
      cancelGrab()
      select(false)
      setMessage(`¡Bien! ${item.name} va en ${bins.find(entry => entry.id === bin)?.name}.`)
      callbacks.current.onSound()
      callbacks.current.onSort(item.id)
    } else {
      callbacks.current.onMistake()
      setMessage(`Probemos de nuevo. ${item.tip}`)
      fall.current = 0
      cancelGrab()
      select(true)
      objectRef.current?.focus({ preventScroll: true })
    }
  }
  function down(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0 || paused || suspended || !item) return
    ignoreClick.current = false
    select(true)
    grab.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, startY: fall.current * Math.max(0, (boardRef.current?.clientHeight ?? 0) - 112), moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function move(event: PointerEvent<HTMLButtonElement>) {
    const current = grab.current
    if (!current || current.pointer !== event.pointerId) return
    const dx = event.clientX - current.x, dy = event.clientY - current.y
    current.moved ||= Math.hypot(dx, dy) > 6
    if (!current.moved) return
    event.currentTarget.style.transform = `translate3d(${dx}px, ${current.startY + dy}px, 0) scale(1.07)`
    setHoverBin(destination(event.clientX, event.clientY) ?? null)
  }
  function up(event: PointerEvent<HTMLButtonElement>) {
    const current = grab.current
    if (!current || current.pointer !== event.pointerId) return
    const bin = current.moved ? destination(event.clientX, event.clientY) : undefined
    ignoreClick.current = current.moved
    cancelGrab()
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (bin) place(bin)
    else if (current.moved) setMessage('El objeto sigue contigo. Suéltalo sobre un bote o toca su destino.')
  }
  if (!item) return <section ref={completeRef} className="recycle-complete" aria-labelledby="recycle-done"><div className="medal medal--recycle"><ItemArt kind="recycle"/></div><p className="section-eyebrow">8 objetos · 4 materiales</p><h2 id="recycle-done">¡Todo en su lugar!</h2><p>Separar los residuos ayuda a recuperar materiales.<br/>En tu comunidad, revisa siempre las indicaciones de cada bote.</p><div className="reward-line">Héroe del Reciclaje <span>★</span></div><button className="primary-button" onClick={onFinish}>Volver a mi ciudad <span aria-hidden="true">›</span></button></section>
  return <section className="recycling-game" aria-label="Juego de reciclaje">
    <div className="recycle-toolbar"><span className="score-chip">★ <b>{sorted.length} / {items.length}</b> separados</span><button className="small-button" aria-pressed={paused} onClick={() => { cancelGrab(); setPaused(!paused) }}>{paused ? '▶ Continuar' : 'Ⅱ Pausa'}</button></div>
    <p className="recycle-instruction">{selected ? 'Ahora elige el bote. El objeto está en pausa.' : reduceMotion ? 'Toca el objeto y después el bote correcto.' : 'Atrapa, arrastra y separa'}</p>
    <div className="sorting-stage">
      <div className="fall-board" ref={boardRef}>
        <div className="fall-lanes" aria-hidden="true">{bins.map(bin => <div key={bin.id}><span>↓</span></div>)}</div>
        <button key={item.id} ref={objectRef} className={`falling-item ${selected ? 'falling-item--selected' : ''}`} style={{ left: `${[8, 57, 32, 78, 33, 57, 8, 78][items.indexOf(item)]}%` }} data-item={item.id} aria-label={`Seleccionar ${item.name}`} aria-pressed={selected} aria-describedby="sorting-feedback" disabled={paused || suspended}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { ignoreClick.current = true; cancelGrab() }} onLostPointerCapture={cancelGrab}
          onClick={event => { if (event.detail !== 0 && ignoreClick.current) { ignoreClick.current = false; return } select(true) }} onKeyDown={event => { if (event.key === 'Escape') select(false) }}>
          <ItemArt kind={item.art}/><span>{item.name}</span>
        </button>
        {paused && <div className="pause-curtain"><strong>Tomamos un respiro</strong><span>El objeto te espera.</span><button className="primary-button" onClick={() => setPaused(false)}>Continuar</button></div>}
      </div>
      <div className="bins" aria-label="Botes de reciclaje">{bins.map((bin, index) => <button key={bin.id} className={`recycle-bin ${hoverBin === bin.id ? 'recycle-bin--over' : ''}`} data-bin={bin.id} style={{ '--bin-color': bin.color } as CSSProperties} aria-label={`${bin.name}. ${bin.hint}`} onClick={() => { if (selectedRef.current) place(bin.id); else setMessage('Primero toca el objeto que quieres separar.') }} disabled={paused || suspended}>
        <span className="bin-mouth"/><ItemArt kind="recycle"/><strong>{bin.name}</strong><small>{index + 1}</small>
      </button>)}</div>
    </div>
    <div className="sorting-feedback" id="sorting-feedback" role="status" aria-live="polite">{message}</div>
    <div className="sorting-progress" aria-label={`${sorted.length} de ${items.length} objetos separados`}>{items.map(entry => <span key={entry.id} className={sorted.includes(entry.id) ? 'is-sorted' : ''} aria-hidden="true">{sorted.includes(entry.id) ? '✓' : '·'}</span>)}</div>
    <p className="keyboard-copy">Teclado: Tab para elegir · Enter para seleccionar · Esc para soltar</p>
  </section>
}
