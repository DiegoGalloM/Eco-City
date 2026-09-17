import { useId, useState } from 'react'
import type { ZoneId } from './data'

/** Original vector art: kept separate from live text, controls and game logic. */
export function ItemArt({ kind }: { kind: string }) {
  let drawing
  switch (kind) {
    case 'bottle': drawing = <><path fill="#55cef0" d="M32 21h16v14l9 13v36q-17 10-34 0V48l9-13Z"/><path fill="#1b90d2" d="M32 12h16v12H32z"/><path fill="#dbf9ff" d="M25 51h30v20H25z"/><path d="M33 43v-9m-2 43v6" stroke="white"/><path d="m35 60 5-6 5 6-5 6Z" fill="#4bbe68"/></>; break
    case 'banana': drawing = <><path d="M51 18q12 29-20 62-18 10-22-2 30-7 34-47Z" fill="#ffda45"/><path d="M45 29q-12 27-27 21 1 20 21 12 12-9 13-34M49 29q12 25 23 15-1 28-20 18" fill="#ffe881"/><path d="m46 27 2-12 7 1-3 13" fill="#9b753c"/></>; break
    case 'paper': drawing = <><path d="M18 12h35l12 16v57H18Z" fill="#fffdf3"/><path d="M53 12v18h12" fill="#b5e4f1"/><path d="M28 42h26M28 52h26M28 62h21M28 72h15" stroke="#62a3c1"/></>; break
    case 'can': case 'tin': drawing = <><rect x="20" y="24" width="42" height="58" rx="7" fill={kind === 'can' ? '#ea7860' : '#abc1c8'}/><ellipse cx="41" cy="25" rx="21" ry="8" fill="#dae8e9"/><ellipse cx="41" cy="24" rx="7" ry="3" fill="#79949d"/><path d="M25 75h32M27 38v22" stroke="#fff"/><path d="m33 50 8-9 8 9-8 9Z" fill="#fff9d8"/></>; break
    case 'box': drawing = <><path d="m12 36 30-13 28 15v41L41 92 12 77Z" fill="#c78948"/><path d="m12 36 29 16 29-14M41 52v40" fill="none"/><path d="m27 30 30 15v16l-12 5V48L18 34" fill="#f6d294"/></>; break
    case 'apple': drawing = <><path d="M38 23q-18-15-24 4 16 21 7 43 20 19 38 0-11-23 8-42-13-18-25-5Z" fill="#fff0bd"/><path d="M15 29q27 12 51 0l1-9q-16-12-28 0-16-11-24 0ZM21 70q19-10 38 0l-1 10q-18 14-37-1Z" fill="#e65e44"/><path d="M40 21 44 8M38 49l1 4m10-6-1 4"/></>; break
    case 'jug': drawing = <><path d="M27 28h31l6 13v43H17V45Z" fill="#b5e8ee"/><path d="M31 17h22v13H31Z" fill="#278abd"/><path d="M48 38h8v19h-8Z" fill="#fff"/><path d="M23 60h32v16H23Z" fill="#6bc983"/></>; break
    case 'orange': drawing = <><circle cx="41" cy="54" r="28" fill="#f59b35"/><path d="M41 26v56M13 54h56M21 34l40 40m0-40L21 74" stroke="#ffe2a0"/><path d="M41 24q6-15 19-11-2 13-19 11Z" fill="#61b84b"/></>; break
    case 'eggshell': drawing = <><path d="M13 71q2-29 12-43l13 13 9-14 10 15 11-11q8 17 2 40Z" fill="#fff8db"/><path d="M15 70q25 16 53 0M25 28q17-12 32 0" fill="none" stroke="#d4b984"/></>; break
    case 'coffee': drawing = <><path d="M18 27h45l-5 55H23Z" fill="#ead19b"/><path d="M15 23h51v11H15Z" fill="#9f6c3f"/><ellipse cx="40" cy="50" rx="14" ry="10" fill="#795035"/><path d="M31 51q8-9 18 0-8 10-18 0Z" fill="#be8a5b"/></>; break
    case 'bread': drawing = <><path d="M15 40q0-22 20-20 15-15 30 2 11 2 7 18l-5 43H19Z" fill="#efbd69"/><path d="M24 42q0-11 11-10 11-8 21 1 8 1 7 10l-3 29H27Z" fill="#fff0b5"/><path d="m35 47 5-5m10 16 6-5"/></>; break
    case 'carrot': drawing = <><path d="m23 35 43 4-31 51Z" fill="#ef8b35"/><path d="m26 35-9-20m15 20 4-24m3 25 16-17" stroke="#43a550" strokeWidth="7"/><path d="m31 49 13 2m-18 11 12 2" stroke="#c46c2b"/></>; break
    case 'leaves': drawing = <><path d="M39 85Q9 71 16 36q31 1 30 33Q42 37 67 20q11 37-22 51" fill="#75bd45"/><path d="M40 86Q34 56 20 41m22 32q8-30 22-46" fill="none" stroke="#2e8842" strokeWidth="4"/></>; break
    case 'newspaper': drawing = <><path d="M13 19h55v67H13Z" fill="#f7f4e8"/><path d="M22 29h37v13H22Zm0 21h15v25H22Z" fill="#8bc4d0"/><path d="M43 51h17M43 59h17M43 67h17M22 80h38" stroke="#55747c"/></>; break
    case 'notebook': drawing = <><path d="M18 16h48v70H18Z" fill="#f8efba"/><path d="M18 16h10v70H18Z" fill="#e86f5b"/><path d="M35 35h23M35 47h23M35 59h18M14 25h8m-8 13h8m-8 13h8m-8 13h8" stroke="#557c84"/></>; break
    case 'paper-bag': drawing = <><path d="M17 31h49l-5 58H22Z" fill="#d9a967"/><path d="M29 35q0-23 12-23t12 23" fill="none" stroke="#9e7448" strokeWidth="5"/><path d="m31 61 10-9 10 9-10 10Z" fill="#f0d39a"/></>; break
    case 'egg-carton': drawing = <><path d="M10 45h62l-8 37H18Z" fill="#b9c59f"/><path d="M10 45 21 24h40l11 21Z" fill="#dbe2c2"/><circle cx="28" cy="55" r="7" fill="#fff2c9"/><circle cx="51" cy="55" r="7" fill="#fff2c9"/><path d="M18 68h46"/></>; break
    case 'tube': drawing = <><ellipse cx="40" cy="20" rx="16" ry="7" fill="#f0cf91"/><path d="M24 20h32v64H24Z" fill="#d3a969"/><ellipse cx="40" cy="84" rx="16" ry="7" fill="#b88b55"/><ellipse cx="40" cy="20" rx="9" ry="3" fill="#775942"/></>; break
    case 'magazine': drawing = <><path d="M17 16h50v72H17Z" fill="#ab77c7"/><path d="M23 24h38v28H23Z" fill="#75d2dc"/><path d="M27 77q7-23 16-17 12-12 19 17Z" fill="#63b65b"/><path d="M25 57h16" stroke="#fff"/></>; break
    case 'shampoo': drawing = <><path d="M25 29h32l7 15-5 44H22l-5-44Z" fill="#b083d2"/><path d="M29 15h24v16H29Z" fill="#6a4b91"/><path d="M29 51h24v21H29Z" fill="#f7d5f2"/><path d="m36 61 5-6 5 6-5 6Z" fill="#76bf6b"/></>; break
    case 'yogurt': drawing = <><path d="m17 31 8 55h34l8-55Z" fill="#f4f2dc"/><path d="M13 26h58v10H13Z" fill="#69b6d5"/><circle cx="42" cy="58" r="14" fill="#ef7580"/><path d="M36 58q6-9 12 0-6 8-12 0Z" fill="#fff1d0"/></>; break
    case 'cap': drawing = <><ellipse cx="41" cy="38" rx="28" ry="13" fill="#42a9d6"/><path d="M13 38v28q28 24 56 0V38" fill="#2788ba"/><path d="M21 45v22m10-26v34m11-34v37m11-37v34m10-30v22" stroke="#7bd4ec"/></>; break
    case 'detergent': drawing = <><path d="M22 26h42l-4 64H17V42Z" fill="#e77365"/><path d="M25 12h29v17H25Z" fill="#2a87ae"/><path d="M39 37h20v16H47v14H34V50Z" fill="#fff4d0"/><path d="M26 70h25v11H26Z" fill="#7fd2db"/></>; break
    case 'food-container': drawing = <><path d="M13 35h57l-6 48H19Z" fill="#a9e1db"/><path d="M9 28h65v13H9Z" fill="#3da6b3"/><path d="M27 49h29v23H27Z" fill="#f8efc9"/></>; break
    case 'spray-bottle': drawing = <><path d="M24 38h34l7 13-5 38H20l-5-38Z" fill="#7ed2e1"/><path d="M32 19h20v21H32Z" fill="#397e9d"/><path d="M47 17h23v9H47Z" fill="#52717d"/><path d="M27 58h26v18H27Z" fill="#fff0bc"/></>; break
    case 'foil': drawing = <><path d="m16 29 50-11-4 66-47 2Z" fill="#cbdadd"/><path d="m25 38 28-8-7 18 10 13-31 14 6-20Z" fill="#f2f8f5"/><path d="M20 31 61 79M55 24 18 80" stroke="#9db1b7"/></>; break
    case 'metal-lid': drawing = <><circle cx="41" cy="53" r="31" fill="#9db1b8"/><circle cx="41" cy="53" r="22" fill="#d7e2e2"/><path d="M41 31v44M19 53h44M25 37l32 32m0-32L25 69" stroke="#8ba0a6"/></>; break
    case 'spoon': drawing = <><ellipse cx="42" cy="26" rx="18" ry="22" fill="#d5e2e3"/><path d="M37 45h10l4 47H33Z" fill="#aebfc3"/><path d="M35 17q7-7 14 0" stroke="#fff"/></>; break
    case 'key': drawing = <><circle cx="26" cy="31" r="17" fill="none" stroke="#e0b447" strokeWidth="9"/><path d="m36 43 32 36m-9-10 9-9m-18 0 8-8" stroke="#e0b447" strokeWidth="10"/></>; break
    case 'steel-cup': drawing = <><path d="m18 24 8 64h32l8-64Z" fill="#b9cbcf"/><ellipse cx="42" cy="25" rx="24" ry="9" fill="#e8f0ee"/><ellipse cx="42" cy="25" rx="15" ry="5" fill="#789198"/><path d="M27 44h30M29 70h26" stroke="#eef8f6"/></>; break
    case 'metal-tray': drawing = <><path d="M10 31h62l-7 52H17Z" fill="#b4c7ca"/><path d="M17 39h48l-5 34H22Z" fill="#e1ebea"/><path d="m29 48 25 17m0-17L29 65" stroke="#a2b4b7"/></>; break
    case 'drop': drawing = <><path d="M40 9C28 30 12 45 12 61a28 28 0 0 0 56 0C68 45 52 29 40 9Z" fill="#42bff0"/><path d="M23 59q-2 15 13 19" stroke="#fff" strokeWidth="6"/></>; break
    case 'plant': case 'leaf': drawing = <><path d="M40 86V42" stroke="#26934b" strokeWidth="6"/><path d="M39 59C8 65 7 38 12 29c30 0 35 20 27 30Z" fill="#51c865"/><path d="M41 43C38 12 60 7 72 12c1 29-15 41-31 31Z" fill="#8bdd58"/><path d="M22 83h37l-6 12H28Z" fill="#cb824c"/></>; break
    case 'wrench': drawing = <path d="m24 81 26-40Q74 40 68 13L56 28l-12-8 8-14Q22 9 32 33L9 68q-3 13 15 13Z" fill="#a9c6d1"/>; break
    case 'cup': drawing = <><path d="m18 26 9 59h29l9-59Z" fill="#fff9df"/><path d="M16 23h51v9H16Z" fill="#e58859"/><path d="M29 46h25v19H29Z" fill="#f2ac65"/></>; break
    case 'bike': drawing = <><circle cx="18" cy="69" r="15" fill="#e7fbff"/><circle cx="65" cy="69" r="15" fill="#e7fbff"/><path d="m18 69 17-31 14 31H18l18-20h24l5 20M32 38h13m11-14h10l-6 25" fill="none" stroke="#1681b9" strokeWidth="5"/></>; break
    case 'bus': case 'car': drawing = <><rect x="7" y="28" width="68" height="46" rx="9" fill={kind === 'bus' ? '#f2bf37' : '#ec7757'}/><path d="M16 36h50v21H16Z" fill="#bbecf3"/><path d="M35 36v21M51 36v21"/><circle cx="21" cy="76" r="9" fill="#436171"/><circle cx="61" cy="76" r="9" fill="#436171"/></>; break
    case 'road': drawing = <><path d="M28 12h25l23 82H5Z" fill="#90a09b"/><path d="M40 20v12m0 13v13m0 14v13" stroke="white" strokeWidth="5"/></>; break
    default: drawing = <><path d="m39 11 13 22H39l-9 15-13-8ZM69 49 57 71l-7-12H32V44ZM26 85 4 72l14-1 9-16 13 8Z" fill="#fff"/></>
  }
  return <svg className="item-art" width="82" height="100" viewBox="0 0 82 100" aria-hidden="true"><g stroke="#275454" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">{drawing}</g></svg>
}

function Tree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><ellipse cy="65" rx="40" ry="10" fill="#287e42" opacity=".2"/><path d="M-6 0h12v66H-6Z" fill="#976439"/><path d="m0 40-19-20m20 13 17-20" stroke="#976439" strokeWidth="7"/><path d="M-39 7c-17-28 1-52 22-51 2-29 50-32 58-1 32 3 36 43 13 52-8 24-46 24-55 11-22 14-43 4-38-11Z" fill="#299d45"/><path d="M-24-24c-11-22 18-38 36-23 20-10 39 11 30 26-7 15-26 15-36 5-18 9-30 3-30-8Z" fill="#67cd53"/></g>
}

export function Friends({ celebrate = false }: { celebrate?: boolean }) {
  const [failed, setFailed] = useState(false)
  return failed ? <VectorFriends celebrate={celebrate}/> : <image href="/art/explorers.webp" width="340" height="240" preserveAspectRatio="xMidYMax meet" onError={() => setFailed(true)}/>
}

function VectorFriends({ celebrate = false }: { celebrate?: boolean }) {
  return <g stroke="#633c29" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
    <g transform="translate(40 28)">
      <path d="m35 125-5 51h20l8-40 10 40h20l-5-52" fill="#296f8c"/><path d="M28 177h24v10H24Zm39 0h22l5 10H67Z" fill="#f4eed5"/>
      <path d="M28 88Q11 88 6 120l14 4 17-25m44-9 20 17 18-26 11 9-24 36-29-18" fill="#f3b782"/>
      <path d="M33 80q24-11 45 0l10 55H25Z" fill="#16a65b"/><path d="M48 116q-3-24 20-24 5 22-20 24Z" fill="#eaf9bd" stroke="none"/>
      <ellipse cx="55" cy="48" rx="35" ry="37" fill="#f7bd87"/>
      <path d="m20 47-10-26 17 4L26 6l17 12L55 0l6 17L85 8l-3 18 16-2-11 28-10-24-17 13-4-10-22 14-3-13Z" fill="#754126"/>
      <ellipse cx="43" cy="49" rx="5" ry="7" fill="#382b25"/><ellipse cx="69" cy="49" rx="5" ry="7" fill="#382b25"/><circle cx="44" cy="47" r="1.8" fill="white" stroke="none"/><circle cx="70" cy="47" r="1.8" fill="white" stroke="none"/>
      <path d={celebrate ? 'M43 62q14 26 26-1Z' : 'M44 65q11 10 23-2'} fill={celebrate ? '#b95946' : 'none'}/><path d="M37 61h4m32 0h4" stroke="#e98c68"/>
    </g>
    <g transform="translate(195 31)">
      <path d="M18 41q-1-42 40-37 45-3 41 48l10 51-90 1Z" fill="#69412b"/>
      <path d="m34 122-4 52h19l11-40 7 40h20l-4-52" fill="#557bba"/><path d="M29 176h23v10H25Zm39 0h20l7 10H68Z" fill="#f3f0db"/>
      <path d="M32 86 15 111-15 92l-6 12 34 24 24-18m46-22 17 27 13-10 8 10-21 16-23-24" fill="#f4bd8c"/>
      <path d="M34 79q25-9 47 1l6 53H29Z" fill="#b270d7"/><circle cx="59" cy="109" r="13" fill="#9bdfdd"/><path d="m55 97-7 11 11 10 5-11Z" fill="#55bd65" stroke="none"/>
      <ellipse cx="58" cy="46" rx="33" ry="36" fill="#f6c393"/><path d="M24 40q-3-42 38-35 39 0 36 31L67 19 53 32 48 22Z" fill="#714229"/>
      <path d="M20 20Q37-9 77 5l12 14-47-2-16 8Z" fill="#f397b7"/><path d="M42 14q27-6 57 11-26 6-52-2Z" fill="#a85ca5"/>
      <ellipse cx="46" cy="47" rx="5" ry="7" fill="#382b25"/><ellipse cx="70" cy="47" rx="5" ry="7" fill="#382b25"/><circle cx="47" cy="45" r="1.8" fill="white" stroke="none"/><circle cx="71" cy="45" r="1.8" fill="white" stroke="none"/>
      <path d={celebrate ? 'M45 61q13 24 25 0Z' : 'M47 64q11 10 22-1'} fill={celebrate ? '#b95946' : 'none'}/>
    </g>
    <g transform="translate(153 151)"><ellipse cx="11" cy="39" rx="25" ry="28" fill="#d6934d"/><path d="m-13 46-2 26h14l6-23m21-3 3 26H16l-3-23" fill="#f9e3b2"/><ellipse cx="9" cy="7" rx="27" ry="25" fill="#ecc281"/><ellipse cx="-15" cy="5" rx="12" ry="24" fill="#9b5b30" transform="rotate(20)"/><ellipse cx="34" cy="5" rx="12" ry="24" fill="#9b5b30" transform="rotate(-10 34 5)"/><circle cx="0" cy="3" r="3" fill="#30291f"/><circle cx="19" cy="3" r="3" fill="#30291f"/><path d="m5 13 5 4 5-4Z" fill="#30291f"/><path d="M8 24q9 13 14 0" fill="#e98b7e"/><path d="m-11 29 38 1-15 17Z" fill="#24aa62"/></g>
  </g>
}

type WorldProps = { zone?: ZoneId; improved?: boolean; choice?: string; characters?: boolean }

export function WorldArt({ zone = 'school', improved = false, choice, characters = true }: WorldProps) {
  const [failed, setFailed] = useState(false)
  if (failed) return <VectorWorldArt zone={zone} improved={improved} choice={choice} characters={characters}/>
  const index = ['school', 'home', 'park', 'community'].indexOf(zone)
  return <svg className="world-art" viewBox="0 0 800 480" role="img" aria-label={`${zone === 'school' ? 'Patio de la escuela' : zone === 'home' ? 'Jardín de casa' : zone === 'park' ? 'Parque' : 'Calle del barrio'}: ${improved ? 'con las mejoras de tu decisión' : 'un lugar que podemos cuidar'}`}>
    <svg width="800" height="480" viewBox={`${index % 2 * 800} ${Math.floor(index / 2) * 480} 800 480`} overflow="hidden"><image href="/art/locations.webp" width="1600" height="960" onError={() => setFailed(true)}/></svg>
    {zone === 'school' && <g>
      {improved && choice === 'refill' ? <g transform="translate(570 268)" stroke="#426f77" strokeWidth="3"><ellipse cx="40" cy="143" rx="55" ry="12" fill="#715d3330" stroke="none"/><rect width="80" height="140" rx="9" fill="#b6d2d0"/><rect x="5" y="5" width="70" height="40" rx="5" fill="#2697c7"/><path d="M39 13C30 27 28 31 39 34c11-3 9-7 0-21Z" fill="#b8edfa"/><path d="M28 63h25v18H39v12" strokeWidth="7" fill="none"/><ellipse cx="40" cy="106" rx="28" ry="7" fill="#779e9a"/><path d="M17 123h46" stroke="#dceee7"/></g> : <g transform="translate(559 294)" strokeWidth="3"><ellipse cx="38" cy="127" rx="65" ry="14" fill="#715d3330"/><rect width="77" height="120" rx="7" fill="#299759" stroke="#e9f4d9"/><path d="M-5-5h87v16H-5Z" fill="#236341" stroke="#174f36"/><path d="m38 38 20 35H18Z" fill="none" stroke="#fff" strokeWidth="7"/>{!improved && <g stroke="#819b97"><path d="m6-7 8-26 23 6-2 23Zm34 0 9-34 23 10-9 26Z" fill="#fff2d1"/><path d="m-28 119 28 10-10 16-28-9Zm99 20 18-22 26 15-20 21Z" fill="#fff5de"/></g>}</g>}
      {!improved && <g transform="translate(690 360) rotate(30) scale(.6)"><ItemArt kind="bottle"/></g>}
      {choice === 'campaign' && <g transform="translate(655 265)"><path d="M35 80v65" stroke="#9a6c3c" strokeWidth="9"/><rect width="75" height="90" rx="6" fill="#fff5c8" stroke="#9a6c3c" strokeWidth="4"/><g transform="translate(12 10) scale(.65)"><ItemArt kind="leaf"/></g></g>}
    </g>}
    {zone === 'home' && <g>
      {(!improved || choice === 'reuse') && <g fill="#4dc0e5" stroke="#daffff" strokeWidth="2"><path d="M745 294q-9 36 0 90" fill="none" stroke="#60cee5" strokeWidth="7"/><ellipse cx="725" cy="410" rx="65" ry="15"/><path d="M747 340q-10 18 0 20 10-2 0-20Z"/></g>}
      {choice === 'reuse' && <g transform="translate(704 354)"><path d="M0 0h71L60 66H12Z" fill="#64b7d0" stroke="#3f7991" strokeWidth="4"/><ellipse cx="35" cy="5" rx="33" ry="8" fill="#acf0f2"/></g>}
      {choice === 'repair' && <g transform="translate(649 334) scale(.65)"><ItemArt kind="wrench"/></g>}
      {choice === 'close' && <circle cx="745" cy="293" r="12" fill="#dcaa49" stroke="#867344" strokeWidth="4"/>}
    </g>}
    {zone === 'park' && <g>
      {!improved && choice !== 'pave' && <><g transform="translate(600 363) rotate(18) scale(.65)"><ItemArt kind="paper"/></g><g transform="translate(686 388) rotate(-20) scale(.5)"><ItemArt kind="can"/></g></>}
      {choice === 'pave' && <path d="M0 280h800v50H0Z" fill="#b6bcb0" opacity=".94"/>}
      {choice === 'restore' && [520,580,640,695].map((x,i) => <g key={x} transform={`translate(${x} ${350 + i % 2 * 32})`}><path d="M0 0v55m0-25-17-10m17 2 16-11" fill="none" stroke="#338949" strokeWidth="5"/><g fill={i % 2 ? '#efb051' : '#a679cc'}><circle cx="-8" cy="-5" r="10"/><circle cx="9" cy="-5" r="10"/><circle cy="8" r="10"/></g><circle r="6" fill="#ffef95"/></g>)}
    </g>}
    {zone === 'community' && <g>
      {(improved ? choice === 'bus' ? [520] : [] : [442,550,658]).map(x => <g key={x} transform={`translate(${x} 330) scale(.85)`}><ItemArt kind={choice === 'bus' ? 'bus' : 'car'}/></g>)}
      {choice === 'walk' && <><path d="M441 441h310" stroke="#fbfce0" strokeWidth="5" strokeDasharray="28 15"/><g transform="translate(580 311) scale(1.25)"><ItemArt kind="bike"/></g></>}
    </g>}
    {characters && <g transform="translate(66 200) scale(1.13)"><Friends celebrate={improved}/></g>}
  </svg>
}

function VectorWorldArt({ zone = 'school', improved = false, choice, characters = true }: WorldProps) {
  const id = useId().replace(/:/g, '')
  const green = improved && choice !== 'pave'
  return <svg className="world-art" viewBox="0 0 800 480" role="img" aria-label={`${zone === 'school' ? 'Patio de la escuela' : zone === 'home' ? 'Jardín de casa' : zone === 'park' ? 'Parque de la ciudad' : 'Calle del barrio'}: ${green ? 'con las mejoras de tu decisión' : 'antes de la transformación'}`}>
    <defs><linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#59c8ee"/><stop offset="1" stopColor="#def6e8"/></linearGradient><linearGradient id={`${id}-ground`} x2="0" y2="1"><stop stopColor="#94d95e"/><stop offset="1" stopColor="#3ca849"/></linearGradient></defs>
    <path fill={`url(#${id}-sky)`} d="M0 0h800v480H0Z"/><circle cx="689" cy="73" r="31" fill="#ffe269"/>
    <g fill="#fff" opacity=".9"><path d="M59 83q-14-24 12-28 8-29 37-16 22-5 26 20 30 0 18 24Z"/><path d="M474 63q-7-18 12-22 8-26 30-15 20-4 23 18 22-2 20 19Z"/></g>
    <g fill="#8bcfd9" opacity=".5">{[125,171,229,292,482,537,596].map((x, i) => <path key={x} d={`M${x} ${145 - (i % 3) * 20}h38v115h-38Z`}/>)}</g>
    <path d="M0 230Q150 130 329 206T800 192v288H0Z" fill={`url(#${id}-ground)`}/>
    <path d="M310 271h140q28 73 219 209H39q253-150 271-209" fill="#f3d999"/><path d="M315 274q-37 120-220 206M437 280q52 105 187 200" fill="none" stroke="#ffebba" strokeWidth="9"/>
    <Tree x={65} y={207} scale={1.3}/><Tree x={744} y={216} scale={1.2}/><Tree x={166} y={234} scale={.65}/>
    {(zone === 'school' || zone === 'home') && <g stroke="#b97840" strokeWidth="3" strokeLinejoin="round">
      <path d="M230 168h336v148H230Z" fill="#fff0b5"/><path d="M217 170 300 102h190l91 68Z" fill="#e57744"/><path d="m232 168 71-54h183l75 54Z" fill="#f99750"/>
      {[254,302,452,504].map(x => <g key={x}><path d={`M${x} 192h31v34h-31Zm0 54h31v38h-31Z`} fill="#60bbdb" stroke="#fff" strokeWidth="6"/><path d={`M${x + 15} 194v31m0 23v34`} strokeWidth="2" stroke="#d9f6ed"/></g>)}
      <path d="M362 246h64v70h-64Z" fill="#358dbf" stroke="#fff" strokeWidth="5"/><path d="M394 248v68" stroke="#6ad2ec"/>
      {zone === 'school' ? <><path d="M354 176h86v47h-86Z" fill="#fffdf0"/><circle cx="397" cy="197" r="15" fill="#e4f7ed" stroke="#4995b4"/><path d="M397 185v13l9 5" stroke="#498cad"/></> : <><path d="m284 137 24-24h63l-21 24Z" fill="#297cc4" stroke="#d3eff0"/><path d="m314 137 23-24m-42 12h60" fill="none" stroke="#b5e6ed"/></>}
      <path d="M219 319h361v9H219Z" fill="#d5b975"/>
    </g>}
    {zone === 'park' && <><Tree x={320} y={160} scale={1.8}/><Tree x={547} y={202} scale={1.2}/><g stroke="#815632" strokeWidth="6"><path d="M359 272h139v35H359Z" fill="#e6ac58"/><path d="M353 316h153M369 308v39m122-39v39"/></g>{choice === 'pave' && <path d="M234 342h330l121 89H128Z" fill="#b9b9a8"/>}</>}
    {zone === 'community' && <><g stroke="#bd814b" strokeWidth="4"><path d="M194 161h147v156H194Z" fill="#ffe6a0"/><path d="m180 164 86-66 89 66Z" fill="#e67553"/><path d="M462 169h158v148H462Z" fill="#ffeac0"/><path d="m448 171 90-69 98 69Z" fill="#e67553"/></g><path d="M0 340h800v85H0Z" fill="#829b94"/><path d="M0 382h800" stroke="#fff0b3" strokeWidth="4" strokeDasharray="25 20"/>{(green ? [535] : [420,540,660]).map(x => <g key={x} transform={`translate(${x} 324) scale(.7)`}><rect x="0" y="22" width="108" height="37" rx="8" fill={choice === 'bus' ? '#ffd053' : '#e77853'}/><path d="m25 4-16 21h73L65 4Z" fill="#b9eaf0"/><circle cx="22" cy="61" r="11" fill="#3b5c64"/><circle cx="83" cy="61" r="11" fill="#3b5c64"/></g>)}</>}
    {zone === 'home' && <g transform="translate(571 264)" stroke="#3a7987" strokeWidth="4"><path d="M0 0h68v95H0Z" fill="#e9ddad" stroke="#c1a877"/><path d="M18 27h40v17H44v17H27V44h-9Z" fill="#acbcc0"/><path d="M26 15h26m-13-7v19"/>{(!green || choice === 'reuse') && <><path d="M36 74q-12 15 0 17 13-2 0-17" fill="#50c7ee"/><ellipse cx="40" cy="116" rx="57" ry="13" fill="#70d5ef" opacity=".8"/></>}{choice === 'reuse' && <path d="M10 91h52l-9 36H20Z" fill="#66b4d4"/>}</g>}
    {zone === 'school' && <g transform="translate(535 283)">
      {green && choice === 'refill' ? <g stroke="#3e8895" strokeWidth="3"><rect x="7" y="1" width="49" height="103" rx="7" fill="#bed9d8"/><rect x="9" y="4" width="45" height="28" rx="4" fill="#329acd"/><path d="M24 45h18v14H31v12" fill="none" strokeWidth="5"/><ellipse cx="31" cy="76" rx="19" ry="5" fill="#699b9a"/></g> : <><rect width="49" height="81" rx="5" fill="#219d55" stroke="#fff" strokeWidth="4"/><path d="M-3 0h55v12H-3Z" fill="#176e3f"/><path d="m14 44 11-16 12 16-12 17Z" fill="#fff"/>{!green && <g fill="#fff9d7" stroke="#bacab5" strokeWidth="2"><path d="m0-4 9-16 15 9-7 15ZM24-4l8-23 13 2 3 26Z"/><path d="m70 86 18-8 9 19-20 6Zm-63 18 20 4-6 16-20-6Z"/></g>}{green && <path d="M70 24h66v55H70Z" fill="#fff3bf" stroke="#a67a43" strokeWidth="4"/>}</>}
    </g>}
    {zone === 'park' && !green && choice !== 'pave' && <g fill="#fff5dc" stroke="#8ca798" strokeWidth="2"><path d="m512 358 33 7-8 22-30-9Zm-32 45 16-16 14 16-17 15Z"/><path d="m618 319 13 5-3 34-18-5Z" fill="#90d8f0"/></g>}
    {green && [105,191,622,706].map((x, i) => <g key={x} transform={`translate(${x} ${375 + i % 2 * 33})`}><path d="M0 0v28m0-10-12-5m12 0 12-6" stroke="#298c41" strokeWidth="4"/><g fill={i % 2 ? '#ffdda2' : '#fffbea'}><circle cx="-6" cy="-4" r="7"/><circle cx="6" cy="-4" r="7"/><circle cy="5" r="7"/></g><circle r="4" fill="#efb630"/></g>)}
    {characters && <g transform="translate(124 252) scale(.89)"><Friends celebrate={green}/></g>}
    <g fill="#238d40"><path d="M0 480v-86q40 1 41 47 22-49 58-38-2 45-18 61 40-23 67 16ZM800 480v-86q-40 1-41 47-22-49-58-38 2 45 18 61-40-23-67 16Z"/></g>
    <g fill="#81c954"><path d="M0 469v-40q35 6 36 40Zm800 0v-40q-35 6-36 40Z"/></g>
  </svg>
}
