import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { ItemArt } from './Art'
import { bins, practiceItems, type BinId, type RecyclingItem } from './game'

type Props = {
  best: number
  reduceMotion: boolean
  suspended: boolean
  onBest: (score: number) => void
  onSound: () => void
  onExit: () => void
}
type Grab = { pointer: number; x: number; y: number; startY: number; moved: boolean }
type Phase = 'intro' | 'playing' | 'over'

const START_DURATION = 11000
const MIN_DURATION = 2400
const durationFor = (score: number) => Math.max(MIN_DURATION, Math.round(START_DURATION * Math.pow(.94, score)))

function nextItem(previous?: string): RecyclingItem {
  const choices = previous ? practiceItems.filter(item => item.id !== previous) : practiceItems
  return choices[Math.floor(Math.random() * choices.length)]
}

export default function Practice({ best, reduceMotion, suspended, onBest, onSound, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [item, setItem] = useState(() => nextItem())
  const [score, setScore] = useState(0)
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState(false)
  const [hoverBin, setHoverBin] = useState<string | null>(null)
  const [message, setMessage] = useState('Clasifica tantos objetos como puedas. La velocidad aumentará con cada acierto.')
  const [failure, setFailure] = useState('')
  const boardRef = useRef<HTMLDivElement>(null)
  const objectRef = useRef<HTMLButtonElement>(null)
  const grab = useRef<Grab | null>(null)
  const fall = useRef(0)
  const committed = useRef(false)
  const ignoreClick = useRef(false)
  const selectedRef = useRef(false)
  const phaseRef = useRef<Phase>('intro')
  const itemRef = useRef(item)
  const scoreRef = useRef(0)
  const duration = durationFor(score)
  const level = Math.floor(score / 5) + 1

  phaseRef.current = phase
  itemRef.current = item
  scoreRef.current = score

  function select(value: boolean) { selectedRef.current = value; setSelected(value) }
  function resetObject() {
    fall.current = 0
    committed.current = false
    ignoreClick.current = false
    grab.current = null
    setHoverBin(null)
    select(false)
    objectRef.current?.style.setProperty('transform', 'translate3d(0, 0, 0)')
  }
  function start() {
    const first = nextItem()
    setItem(first)
    setScore(0)
    scoreRef.current = 0
    setPaused(false)
    setFailure('')
    setMessage('Atrapa el objeto y llévalo al bote correcto.')
    resetObject()
    phaseRef.current = 'playing'
    setPhase('playing')
    requestAnimationFrame(() => objectRef.current?.focus({ preventScroll: true }))
  }
  function end(reason: string) {
    if (phaseRef.current !== 'playing') return
    const finalScore = scoreRef.current
    phaseRef.current = 'over'
    setPhase('over')
    setFailure(reason)
    setPaused(false)
    grab.current = null
    setHoverBin(null)
    select(false)
    if (finalScore > best) onBest(finalScore)
  }

  useEffect(() => {
    resetObject()
  }, [item.id])

  useEffect(() => {
    let raf = 0
    let previous = performance.now()
    const step = (ms: number) => {
      if (phaseRef.current !== 'playing' || paused || suspended || document.hidden || grab.current || committed.current) return
      fall.current += Math.max(0, ms) / durationFor(scoreRef.current)
      if (fall.current >= 1) {
        fall.current = 1
        if (objectRef.current && boardRef.current && !reduceMotion) objectRef.current.style.transform = `translate3d(0, ${Math.max(0, boardRef.current.clientHeight - 112)}px, 0)`
        end(`Se escapó ${itemRef.current.name}. ${itemRef.current.tip}`)
        return
      }
      if (objectRef.current && boardRef.current && !reduceMotion) objectRef.current.style.transform = `translate3d(0, ${fall.current * Math.max(0, boardRef.current.clientHeight - 112)}px, 0)`
    }
    const frame = (now: number) => { step(Math.min(50, now - previous)); previous = now; raf = requestAnimationFrame(frame) }
    if (phase === 'playing' && !paused && !suspended) raf = requestAnimationFrame(frame)
    window.advancePractice = step
    return () => { cancelAnimationFrame(raf); delete window.advancePractice }
  }, [phase, paused, suspended, reduceMotion, duration, best])

  useEffect(() => {
    const stop = () => { grab.current = null; setHoverBin(null); if (phaseRef.current === 'playing') setPaused(true) }
    const hidden = () => { if (document.hidden) stop() }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') select(false) }
    window.addEventListener('blur', stop)
    document.addEventListener('visibilitychange', hidden)
    window.addEventListener('keydown', escape)
    window.addEventListener('resize', stop)
    return () => { window.removeEventListener('blur', stop); document.removeEventListener('visibilitychange', hidden); window.removeEventListener('keydown', escape); window.removeEventListener('resize', stop) }
  }, [])

  useEffect(() => {
    window.practiceState = () => ({ phase, activeItem: phase === 'playing' ? { ...item, selected: selectedRef.current, fallProgress: +fall.current.toFixed(3) } : null, score, best: Math.max(best, score), level, fallDuration: duration, paused: paused || suspended, message: phase === 'over' ? failure : message, totalItems: practiceItems.length })
    return () => { delete window.practiceState }
  }, [phase, item, score, best, level, duration, paused, suspended, message, failure])

  function destination(x: number, y: number) {
    const targets = boardRef.current?.parentElement?.querySelectorAll<HTMLElement>('[data-practice-bin]') ?? []
    for (const target of targets) {
      const rect = target.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return target.dataset.practiceBin as BinId
    }
    return undefined
  }
  function place(bin: BinId) {
    if (phaseRef.current !== 'playing' || committed.current || paused || suspended) return
    const current = itemRef.current
    if (current.bin !== bin) {
      end(`${current.name} no va en ${bins.find(entry => entry.id === bin)?.name}. ${current.tip}`)
      return
    }
    committed.current = true
    grab.current = null
    setHoverBin(null)
    select(false)
    onSound()
    const nextScore = scoreRef.current + 1
    scoreRef.current = nextScore
    setScore(nextScore)
    setMessage(`¡Bien! ${current.name} va en ${bins.find(entry => entry.id === bin)?.name}.`)
    const next = nextItem(current.id)
    setItem(next)
    requestAnimationFrame(() => objectRef.current?.focus({ preventScroll: true }))
  }
  function down(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0 || paused || suspended || phaseRef.current !== 'playing') return
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
    grab.current = null
    setHoverBin(null)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (bin) place(bin)
    else if (current.moved) {
      objectRef.current?.style.setProperty('transform', reduceMotion ? 'translate3d(0, 0, 0)' : `translate3d(0, ${fall.current * Math.max(0, (boardRef.current?.clientHeight ?? 0) - 112)}px, 0)`)
      setMessage('Sigue intentando: suelta el objeto sobre un bote o toca su destino.')
    }
  }

  if (phase === 'intro') return <section className="practice-card practice-card--intro" aria-labelledby="practice-intro-title">
    <div className="practice-card__art"><ItemArt kind="newspaper"/><ItemArt kind="orange"/><ItemArt kind="shampoo"/><ItemArt kind="foil"/></div>
    <p className="section-eyebrow">32 objetos diferentes</p>
    <h2 id="practice-intro-title">¿Cuántos puedes separar?</h2>
    <p>El ritmo aumenta después de cada acierto. La ronda termina si un objeto cae o llega al bote equivocado.</p>
    <div className="practice-rules"><span><b>1</b> Observa el material</span><span><b>2</b> Elige su bote</span><span><b>3</b> Supera tu récord</span></div>
    {best > 0 && <p className="practice-best">Tu mejor racha: <strong>{best}</strong></p>}
    <button className="primary-button" onClick={start}>Comenzar práctica <span aria-hidden="true">›</span></button>
    <button className="text-button" onClick={onExit}>Volver al mapa</button>
  </section>

  if (phase === 'over') return <section className="practice-card practice-card--over" aria-labelledby="practice-over-title">
    <div className="medal medal--recycle"><ItemArt kind="recycle"/></div>
    <p className="section-eyebrow">Ronda terminada</p>
    <h2 id="practice-over-title">Separaste {score} {score === 1 ? 'objeto' : 'objetos'}</h2>
    <p className="practice-failure">{failure}</p>
    <div className="practice-result"><span>Racha <b>{score}</b></span><span>Récord <b>{Math.max(best, score)}</b></span><span>Nivel <b>{level}</b></span></div>
    <button className="primary-button" onClick={start}>Intentar de nuevo <span aria-hidden="true">›</span></button>
    <button className="text-button" onClick={onExit}>Volver al mapa</button>
  </section>

  return <section className="recycling-game practice-game" aria-label="Práctica infinita de separación de residuos">
    <div className="practice-stats"><span>Racha <b>{score}</b></span><span>Nivel <b>{level}</b></span><span>Récord <b>{Math.max(best, score)}</b></span><button className="small-button" aria-pressed={paused} onClick={() => { grab.current = null; setHoverBin(null); setPaused(!paused) }}>{paused ? '▶ Continuar' : 'Ⅱ Pausa'}</button></div>
    <div className="speed-meter" aria-label={`Velocidad nivel ${level}`}><span style={{ width: `${Math.min(100, 18 + score * 2.5)}%` }}/></div>
    <p className="recycle-instruction">{selected ? 'El tiempo sigue: elige el bote.' : reduceMotion ? 'El temporizador avanza sin mover el objeto.' : 'Atrapa, arrastra y separa'}</p>
    <div className="sorting-stage">
      <div className="fall-board" ref={boardRef}>
        <div className="fall-lanes" aria-hidden="true">{bins.map(bin => <div key={bin.id}><span>↓</span></div>)}</div>
        <button key={item.id} ref={objectRef} className={`falling-item ${selected ? 'falling-item--selected' : ''}`} style={{ left: `${[8, 32, 57, 78][practiceItems.indexOf(item) % 4]}%` }} data-practice-item={item.id} aria-label={`Seleccionar ${item.name}`} aria-pressed={selected} aria-describedby="practice-feedback" disabled={paused || suspended}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { ignoreClick.current = true; grab.current = null; setHoverBin(null) }} onLostPointerCapture={() => { grab.current = null; setHoverBin(null) }}
          onClick={event => { if (event.detail !== 0 && ignoreClick.current) { ignoreClick.current = false; return } select(true) }} onKeyDown={event => { if (event.key === 'Escape') select(false) }}>
          <ItemArt kind={item.art}/><span>{item.name}</span>
        </button>
        {paused && <div className="pause-curtain"><strong>Práctica en pausa</strong><span>Tu racha está segura.</span><button className="primary-button" onClick={() => setPaused(false)}>Continuar</button></div>}
      </div>
      <div className="bins" aria-label="Botes de separación">{bins.map((bin, index) => <button key={bin.id} className={`recycle-bin ${hoverBin === bin.id ? 'recycle-bin--over' : ''}`} data-practice-bin={bin.id} style={{ '--bin-color': bin.color } as CSSProperties} aria-label={`${bin.name}. ${bin.hint}`} onClick={() => { if (selectedRef.current) place(bin.id); else setMessage('Primero toca el objeto que quieres separar.') }} disabled={paused || suspended}>
        <span className="bin-mouth"/><ItemArt kind="recycle"/><strong>{bin.name}</strong><small>{index + 1}</small>
      </button>)}</div>
    </div>
    <div className="sorting-feedback" id="practice-feedback" role="status" aria-live="polite">{message}</div>
    <p className="keyboard-copy">Teclado: Tab para elegir · Enter para seleccionar · Esc para soltar</p>
  </section>
}
