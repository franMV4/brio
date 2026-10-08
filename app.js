'use strict';
const $ = (s, el = document) => el.querySelector(s);
const vista = $('#vista');
const quieto = matchMedia('(prefers-reduced-motion: reduce)');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const ic = n => `<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const foto = (id, f = 0) => `img/${id}/${f}.jpg`;
const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const lim = (v, a, b) => Math.min(b, Math.max(a, Math.round(+v || a)));
const LUGAR = { casa: 'En casa', gim: 'En el gimnasio' };

// ---------- Perfil guardado en este navegador ----------
const CLAVE = 'brio-v1';
let S;
function cargar() {
  try { S = JSON.parse(localStorage.getItem(CLAVE)); } catch { S = null; }
  if (!S || !Array.isArray(S.rutinas)) {
    const ej = crearRutina(15, 'casa');
    S = { nombre: '', voz: false, historial: [], rutinas: [{ ...ej, id: nuevoId(), nombre: 'Ejemplo: 15 minutos en casa', veces: 0 }] };
    guardar();
  }
}
function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch { /* sin almacenamiento: la sesión sigue funcionando */ } }
const buscar = id => S.rutinas.find(r => r.id === id);

function avisar(t) {
  const a = $('#aviso'); a.textContent = t; a.classList.add('ver');
  clearTimeout(avisar.t); avisar.t = setTimeout(() => a.classList.remove('ver'), 3200);
}
function hace(ts) {
  const d = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(ts).setHours(0, 0, 0, 0)) / 864e5);
  return d <= 0 ? 'hoy' : d === 1 ? 'ayer' : `hace ${d} días`;
}

// ---------- Piezas ----------
function detalle(p) {
  const e = EJ[p.id];
  if (e.tipo === 'seg') return p.cant >= 120 && p.cant % 60 === 0 ? `${p.cant / 60} minutos` : `${p.cant} segundos`;
  return `${p.series} ${p.series === 1 ? 'serie' : 'series'} de ${p.cant} veces${e.g === 'equilibrio' ? ' con cada pierna' : ''}`;
}

function ingredientes(r) {
  const eq = new Set(r.pasos.flatMap(p => EJ[p.id].eq));
  const l = [];
  if (eq.has('maquina')) l.push('Las máquinas del gimnasio');
  if (eq.has('silla')) l.push('Una silla firme, sin ruedas');
  if (eq.has('pesas')) l.push('Dos pesas ligeras o dos botellas de agua llenas');
  if (eq.has('goma')) l.push('Una goma elástica de ejercicio');
  if (eq.has('barra')) l.push('Una barra con poco peso');
  if (eq.has('suelo')) l.push('Una esterilla o una alfombra');
  l.push('Ropa cómoda y agua para beber');
  return l;
}

function ficha(r, modo = {}) {
  const total = duracionTotal(r.pasos);
  let previa = null, html = '', k = 0;
  r.pasos.forEach((p, i) => {
    const sec = SECCION(EJ[p.id].g);
    if (!modo.editar && sec !== previa) {
      if (previa !== null) html += '</ol>';
      html += `<h4 class="seccion">${{ calentar: 'Para calentar', principal: 'Lo principal', estirar: 'Para terminar' }[sec]}</h4><ol class="pasos">`;
      previa = sec;
    }
    html += paso(p, i, modo, k++);
  });
  const lista = modo.editar ? `<ol class="pasos">${html}</ol>` : html + (previa ? '</ol>' : '');
  return `<article class="receta${modo.tachar ? ' tachada' : ''}">
    <div class="hule" aria-hidden="true"></div>
    <div class="receta-cuerpo">
      <header class="receta-cab">
        <h2>${esc(r.nombre || 'Mi rutina')}</h2>
        <p class="raciones"><span>${ic('reloj')} Para ${Math.round(total / 60)} minutos</span><span>${ic(r.lugar === 'gim' ? 'pesa' : 'silla')} ${LUGAR[r.lugar]}</span><span>${r.pasos.length} ejercicios</span></p>
      </header>
      <section class="necesitas"><h3>Necesitas</h3><ul>${ingredientes(r).map(t => `<li>${t}</li>`).join('')}</ul></section>
      <section><h3>Paso a paso</h3>${r.pasos.length ? lista : '<p class="entradilla">Todavía no has añadido ejercicios.</p>'}
        <p class="total"><span>Total</span><i></i><span class="t">${mmss(total)}</span></p>
      </section>
    </div>
  </article>`;
}

function paso(p, i, modo, k) {
  const e = EJ[p.id];
  const ctrl = modo.editar ? `<div class="controles">
      ${e.tipo === 'reps' ? contador('series', i, `${p.series} ${p.series === 1 ? 'serie' : 'series'}`, p.series <= 1, p.series >= 5) : ''}
      ${contador('cant', i, e.tipo === 'reps' ? `${p.cant} veces` : detalle(p), p.cant <= (e.tipo === 'reps' ? 1 : 10), false)}
      <button class="circulo" data-acc="mover" data-i="${i}" data-d="-1" aria-label="Subir ${esc(e.n)}" ${i === 0 ? 'disabled' : ''}>${ic('arriba')}</button>
      <button class="circulo" data-acc="mover" data-i="${i}" data-d="1" aria-label="Bajar ${esc(e.n)}" ${i === modo.n - 1 ? 'disabled' : ''}>${ic('abajo')}</button>
      <button class="circulo quitar" data-acc="quitar" data-i="${i}" aria-label="Quitar ${esc(e.n)}">${ic('papelera')}</button>
    </div>` : '';
  return `<li class="paso" style="--k:${k}">
    <button class="ver-ficha" data-acc="ficha" data-id="${e.id}" aria-label="Ver cómo se hace: ${esc(e.n)}"><img class="miniatura" src="${foto(e.id)}" alt="" loading="lazy" width="76" height="51"><span class="lupa">${ic('lupa')}</span></button>
    <div class="paso-texto"><strong>${modo.tachar ? `<span class="boli">${esc(e.n)}</span>` : esc(e.n)}</strong><span>${detalle(p)}</span>
      ${modo.cambiar ? `<button class="enlace" data-acc="cambiar" data-i="${i}">${ic('cambiar')} Cambiar</button>` : ''}</div>
    <span class="tiempo">${mmss(duracionPaso(p))}</span>
    ${ctrl}
  </li>`;
}

function contador(campo, i, texto, sinMenos, sinMas) {
  return `<span class="contador">
    <button class="circulo" data-acc="${campo}" data-i="${i}" data-d="-1" aria-label="Menos" ${sinMenos ? 'disabled' : ''}>${ic('menos')}</button>
    <output>${texto}</output>
    <button class="circulo" data-acc="${campo}" data-i="${i}" data-d="1" aria-label="Más" ${sinMas ? 'disabled' : ''}>${ic('mas')}</button>
  </span>`;
}

function fotoAnimada(id) {
  return `<div class="foto anima" data-f="0">
    <img src="${foto(id, 0)}" alt="Posición de inicio"><img src="${foto(id, 1)}" alt="Posición final">
    <div class="fotogramas" aria-hidden="true"><span>1 · Inicio</span><span>2 · Final</span></div>
  </div>`;
}

// ---------- Vistas ----------
function vInicio() {
  const h = new Date().getHours();
  const saludo = h < 6 ? 'Buenas noches' : h < 14 ? 'Buenos días' : h < 21 ? 'Buenas tardes' : 'Buenas noches';
  const ultima = S.rutinas.filter(r => r.ultima).sort((a, b) => b.ultima - a.ultima)[0];
  const semana = S.historial.filter(x => Date.now() - x.fecha < 7 * 864e5).length;
  return `
  <section class="bloque">
    <h1 class="titular">${saludo}${S.nombre ? `, ${esc(S.nombre)}` : ''}.</h1>
    <p class="entradilla">${S.historial.length ? `Llevas <b>${S.historial.length}</b> ${S.historial.length === 1 ? 'entrenamiento' : 'entrenamientos'}${semana ? `, ${semana} esta semana` : ''}. ¿Seguimos?` : 'Un poco de ejercicio cada día, a tu ritmo. ¿Empezamos?'}</p>
  </section>
  ${S.nombre ? '' : `<form class="campo" data-form="nombre">
    <label for="nombre">¿Cómo te llamas? <small>(si quieres)</small></label>
    <div class="en-linea"><input class="entrada" id="nombre" name="nombre" maxlength="40" autocomplete="given-name"><button class="btn btn-ok">Guardar</button></div>
  </form>`}
  ${ultima ? `<section class="repetir">
    <h2>¿Repetimos «${esc(ultima.nombre)}»?</h2>
    <p>${Math.round(duracionTotal(ultima.pasos) / 60)} minutos · ${LUGAR[ultima.lugar]} · la hiciste ${hace(ultima.ultima)}</p>
    <a class="btn btn-ir" href="#entrenar-${ultima.id}">${ic('play')} Empezar</a>
  </section>` : ''}
  <ul class="accesos">
    <li><a class="acceso principal" href="#crear"><span class="acceso-icono">${ic('mando')}</span><div><strong>Preparar una rutina</strong><span>Dime cuánto tiempo tienes y dónde estás. La preparo al momento.</span></div><span class="acceso-flecha">${ic('flecha')}</span></a></li>
    <li><a class="acceso" href="#rutinas"><span class="acceso-icono">${ic('recetario')}</span><div><strong>Mis rutinas</strong><span>${S.rutinas.length ? `Tienes ${S.rutinas.length} guardada${S.rutinas.length === 1 ? '' : 's'}.` : 'Aquí se guardan las que prepares.'}</span></div><span class="acceso-flecha">${ic('flecha')}</span></a></li>
    <li><a class="acceso" href="#avanzado"><span class="acceso-icono">${ic('lapiz')}</span><div><strong>Elegir los ejercicios yo</strong><span>Modo avanzado: escoges cada ejercicio, las series y las veces.</span></div><span class="acceso-flecha">${ic('flecha')}</span></a></li>
  </ul>
  <label class="interruptor"><input type="checkbox" id="opc-voz" data-ajuste="voz" ${S.voz ? 'checked' : ''}><span>Voz que lee los ejercicios<small>Mientras entrenas, una voz te dice qué toca. Quítala si te molesta.</small></span></label>
  <footer class="nota">
    <p>Antes de empezar a hacer ejercicio, consulta con tu médico. Si notas dolor, mareo o te falta el aire, para y descansa.</p>
    ${S.nombre ? '<p><button class="enlace" data-acc="olvidar-nombre">Cambiar mi nombre</button></p>' : ''}
    <p>Fotos de los ejercicios: free-exercise-db, de dominio público.</p>
  </footer>`;
}

const sel = { min: 20, lugar: 'casa', pesas: true, goma: false };
let borrador = null;

function vCrear() {
  return `
  <section class="bloque">
    <h1 class="titular">¿Cuánto tiempo tienes?</h1>
    <div class="mandos-tiempo" role="group" aria-label="Minutos">
      ${[10, 15, 20, 30, 45, 60].map(m => `<button class="mando" data-acc="min" data-v="${m}" aria-pressed="${sel.min === m}"><b>${m}</b><small>min</small></button>`).join('')}
    </div>
  </section>
  <section class="bloque">
    <h2>¿Dónde vas a entrenar?</h2>
    <div class="lugares">
      <button class="lugar" data-acc="lugar" data-v="casa" aria-pressed="${sel.lugar === 'casa'}"><span class="marca-ok">${ic('check')}</span>${ic('silla')}<strong>En casa</strong><span>Con una silla y poco más</span></button>
      <button class="lugar" data-acc="lugar" data-v="gim" aria-pressed="${sel.lugar === 'gim'}"><span class="marca-ok">${ic('check')}</span>${ic('pesa')}<strong>En el gimnasio</strong><span>Con máquinas y pesas</span></button>
    </div>
  </section>
  ${sel.lugar === 'casa' ? `<section class="bloque">
    <h2>¿Qué tienes en casa?</h2>
    <div class="interruptores">
      <label class="interruptor"><input type="checkbox" id="opc-pesas" data-opc="pesas" ${sel.pesas ? 'checked' : ''}><span>Pesas o botellas de agua<small>Dos botellas de litro sirven</small></span></label>
      <label class="interruptor"><input type="checkbox" id="opc-goma" data-opc="goma" ${sel.goma ? 'checked' : ''}><span>Goma elástica<small>De las de hacer ejercicio</small></span></label>
    </div>
  </section>` : ''}
  <button class="btn btn-ir ancho" data-acc="preparar">Preparar mi rutina de ${sel.min} minutos</button>`;
}

function vReceta() {
  if (!borrador) { location.replace('#crear'); return ''; }
  return `
  <section class="bloque">
    <h1 class="titular">Tu rutina está lista.</h1>
    <p class="entradilla">Toca una foto para ver cómo se hace cada ejercicio.</p>
  </section>
  ${ficha(borrador, { cambiar: true })}
  <div class="acciones">
    <button class="btn btn-ir" data-acc="empezar-borrador">${ic('play')} Guardar y empezar ahora</button>
    <button class="btn btn-2" data-acc="guardar-borrador">Guardar para otro día</button>
    <div class="acciones fila">
      <button class="btn btn-2 peq" data-acc="otra">${ic('cambiar')} Hacer otra distinta</button>
      <button class="btn btn-2 peq" data-acc="ajustar">${ic('lapiz')} Ajustarla a mano</button>
    </div>
  </div>`;
}

let editor = null;
const filtro = { grupo: 'todos' };
const FILTROS = [['todos', 'Todos'], ['calentar', 'Calentar'], ['piernas', 'Piernas'], ['equilibrio', 'Equilibrio'], ['superior', 'Brazos y espalda'], ['tronco', 'Tripa'], ['estirar', 'Estirar']];

function vEditor(id) {
  if (id && (!editor || editor.id !== id)) {
    const r = buscar(id);
    if (!r) { location.replace('#rutinas'); return ''; }
    editor = JSON.parse(JSON.stringify(r));
  }
  if (!id && (!editor || editor.id)) editor = { id: null, nombre: '', lugar: 'casa', pasos: [] };
  const cat = EJERCICIOS.filter(e => (editor.lugar === 'gim' || e.lugar === 'ambos') &&
    (filtro.grupo === 'todos' || e.g === filtro.grupo || (filtro.grupo === 'calentar' && e.g === 'cardio')));
  const total = duracionTotal(editor.pasos);
  return `
  <section class="bloque">
    <h1 class="titular">${id ? 'Cambia tu rutina' : 'Elige tus ejercicios'}</h1>
    <p class="entradilla">Añade los que quieras. Abajo verás tu rutina y cuánto dura.</p>
  </section>
  <div class="campo">
    <label for="ed-nombre">Nombre de la rutina</label>
    <input class="entrada" id="ed-nombre" maxlength="60" value="${esc(editor.nombre)}" placeholder="Por ejemplo: Piernas de los martes">
  </div>
  <div class="segmento" role="group" aria-label="Dónde">
    <button data-acc="ed-lugar" data-v="casa" aria-pressed="${editor.lugar === 'casa'}">${ic('silla')} En casa</button>
    <button data-acc="ed-lugar" data-v="gim" aria-pressed="${editor.lugar === 'gim'}">${ic('pesa')} Gimnasio</button>
  </div>
  <section class="bloque">
    <h2>Ejercicios</h2>
    <div class="filtros" role="group" aria-label="Tipo de ejercicio">
      ${FILTROS.map(([v, t]) => `<button class="chip" data-acc="grupo" data-v="${v}" aria-pressed="${filtro.grupo === v}">${t}</button>`).join('')}
    </div>
    <ul class="catalogo">${cat.map(e => {
      const dentro = editor.pasos.some(p => p.id === e.id);
      const extras = e.eq.map(q => ({ silla: 'silla', pesas: 'pesas', goma: 'goma', suelo: 'en el suelo', maquina: 'máquina', barra: 'barra' })[q]).join(', ');
      return `<li class="cat">
        <button class="ver-ficha" data-acc="ficha" data-id="${e.id}" aria-label="Ver cómo se hace: ${esc(e.n)}"><img class="miniatura" src="${foto(e.id)}" alt="" loading="lazy" width="96" height="64"><span class="lupa">${ic('lupa')}</span></button>
        <div><strong>${e.n}</strong><span>${GRUPOS[e.g]} · ${e.tipo === 'reps' ? `${e.cant} veces` : e.cant >= 120 ? `${e.cant / 60} min` : `${e.cant} s`}${extras ? ` · ${extras}` : ''}</span></div>
        <button class="btn peq ${dentro ? 'btn-ok' : 'btn-2'}" data-acc="alternar" data-id="${e.id}" aria-pressed="${dentro}">${dentro ? `${ic('check')} Añadido` : `${ic('mas')} Añadir`}</button>
      </li>`;
    }).join('')}</ul>
  </section>
  <section class="bloque" id="tu-rutina">
    <h2>Tu rutina</h2>
    ${ficha({ ...editor, nombre: editor.nombre || 'Mi rutina' }, { editar: true, n: editor.pasos.length })}
  </section>
  <div class="barra-guardar">
    <p>${editor.pasos.length} ejercicios · <b>${mmss(total)}</b></p>
    <button class="btn btn-ir peq" data-acc="guardar-editor">${ic('check')} Guardar</button>
  </div>`;
}

let borrando = null, compartiendo = null;

function vRutinas() {
  const lista = S.rutinas.slice().sort((a, b) => (b.ultima || b.creada || 0) - (a.ultima || a.creada || 0));
  return `
  <section class="bloque">
    <h1 class="titular">Mis rutinas</h1>
    <p class="entradilla">${S.nombre ? `El recetario de ${esc(S.nombre)}.` : 'Tu recetario de ejercicios.'} Se guardan en este móvil.</p>
  </section>
  ${lista.length ? `<ul class="fichero">${lista.map(r => `<li class="tarjeta">
      <div class="tarjeta-tira" aria-hidden="true">${r.pasos.filter(p => SECCION(EJ[p.id].g) === 'principal').slice(0, 4).map(p => `<img src="${foto(p.id)}" alt="" loading="lazy">`).join('')}</div>
      <div class="tarjeta-cuerpo">
        <h2>${esc(r.nombre)}</h2>
        <p class="meta">${Math.round(duracionTotal(r.pasos) / 60)} minutos · ${LUGAR[r.lugar]} · ${r.pasos.length} ejercicios<br>${r.veces ? `Hecha ${r.veces} ${r.veces === 1 ? 'vez' : 'veces'}, la última ${hace(r.ultima)}` : 'Aún no la has hecho'}</p>
        <div class="acciones"><a class="btn btn-ir" href="#entrenar-${r.id}">${ic('play')} Empezar</a><a class="btn btn-2" href="#ver-${r.id}">Ver</a></div>
      </div>
    </li>`).join('')}</ul>` : `<div class="vacio">
      <h2>Aún no tienes rutinas guardadas</h2>
      <p>Prepara una en un momento: solo tienes que decir cuánto tiempo tienes.</p>
      <a class="btn btn-ir" href="#crear">Preparar una rutina</a>
    </div>`}
  <details class="importar">
    <summary>${ic('importar')} Añadir una rutina que te han pasado</summary>
    <form data-form="importar">
      <label for="codigo">Pega aquí el código que te han enviado</label>
      <textarea class="entrada" id="codigo" required placeholder="BRIO-…"></textarea>
      <button class="btn btn-ok">Añadir a mis rutinas</button>
    </form>
  </details>`;
}

function vVer(id) {
  const r = buscar(id);
  if (!r) return `<div class="vacio"><h2>Esta rutina ya no existe</h2><a class="btn btn-2" href="#rutinas">Ir a mis rutinas</a></div>`;
  return `
  ${ficha(r)}
  <div class="acciones">
    <a class="btn btn-ir" href="#entrenar-${r.id}">${ic('play')} Empezar</a>
    <div class="acciones fila">
      <a class="btn btn-2 peq" href="#editar-${r.id}">${ic('lapiz')} Cambiar ejercicios</a>
      <button class="btn btn-2 peq" data-acc="compartir" data-id="${r.id}">${ic('compartir')} Pasársela a alguien</button>
    </div>
    ${compartiendo === r.id ? `<div class="codigo">
      <p>Copia este código y envíaselo por WhatsApp o correo. La otra persona lo pega en «Mis rutinas».</p>
      <textarea class="entrada" id="codigo-salida" readonly>${codigoDe(r)}</textarea>
      <button class="btn btn-ok peq" data-acc="copiar">Copiar el código</button>
    </div>` : ''}
    ${borrando === r.id ? `<div class="confirmar">
      <p><b>¿Seguro que quieres borrar esta rutina?</b> No se puede deshacer.</p>
      <div class="acciones fila"><button class="btn btn-ir peq" data-acc="borrar-si" data-id="${r.id}">Sí, borrarla</button><button class="btn btn-2 peq" data-acc="borrar-no">No, dejarla</button></div>
    </div>` : `<button class="enlace" data-acc="borrar" data-id="${r.id}" style="color:var(--tomate)">${ic('papelera')} Borrar esta rutina</button>`}
  </div>`;
}

function vFin(id) {
  const r = buscar(id);
  if (!r) return vInicio();
  return `
  <section class="bloque fin">
    <h1 class="titular">¡Hecho${S.nombre ? `, ${esc(S.nombre)}` : ''}!</h1>
    <p class="entradilla">${Math.round(duracionTotal(r.pasos) / 60)} minutos de ejercicio. Llevas ${r.veces} ${r.veces === 1 ? 'vez' : 'veces'} con esta rutina.</p>
  </section>
  ${ficha(r, { tachar: true })}
  <div class="acciones fila"><a class="btn btn-ok" href="#inicio">Volver al inicio</a><a class="btn btn-2" href="#rutinas">Mis rutinas</a></div>`;
}

// ---------- Compartir con un código ----------
const b64 = s => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
const desb64 = s => new TextDecoder().decode(Uint8Array.from(atob(s), c => c.charCodeAt(0)));
function codigoDe(r) {
  return 'BRIO-' + b64(JSON.stringify({ n: r.nombre, l: r.lugar, p: r.pasos.map(p => [p.id, p.series, p.cant, p.descanso]) }));
}
function leerCodigo(txt) {
  try {
    const o = JSON.parse(desb64(txt.trim().replace(/^BRIO-/, '').replace(/\s/g, '')));
    const pasos = o.p.filter(x => Array.isArray(x) && EJ[x[0]])
      .map(([id, s, c, d]) => ({ id, series: EJ[id].tipo === 'seg' ? 1 : lim(s, 1, 5), cant: lim(c, 1, 900), descanso: lim(d, 0, 180) }));
    if (!pasos.length) return null;
    return { nombre: String(o.n || 'Rutina compartida').slice(0, 60), lugar: o.l === 'gim' ? 'gim' : 'casa', pasos };
  } catch { return null; }
}

function guardarRutina(r) {
  const nueva = { ...r, id: nuevoId(), creada: Date.now(), veces: 0, min: Math.round(duracionTotal(r.pasos) / 60) };
  S.rutinas.push(nueva); guardar();
  return nueva;
}

// ---------- Entrenar ----------
let run = null, reloj = null;
const MARCAS = Array.from({ length: 60 }, (_, i) => {
  const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 84 : 77, r2 = 90;
  return `<line class="${i % 5 ? '' : 'larga'}" x1="${100 + r1 * Math.sin(a)}" y1="${100 - r1 * Math.cos(a)}" x2="${100 + r2 * Math.sin(a)}" y2="${100 - r2 * Math.cos(a)}"/>`;
}).join('');

function sector(f) {
  if (f >= 0.9999) return 'M100 12 A88 88 0 1 1 99.99 12 Z';
  if (f <= 0) return '';
  const a = f * 2 * Math.PI, x = 100 + 88 * Math.sin(a), y = 100 - 88 * Math.cos(a);
  return `M100 100 L100 12 A88 88 0 ${f > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`;
}

function fasesDe(r) {
  const f = [];
  r.pasos.forEach((p, k) => {
    for (let s = 1; s <= p.series; s++) {
      f.push({ tipo: 'trabajo', k, s, dur: trabajo(p) });
      if (p.descanso > 0) f.push({ tipo: 'descanso', k, s, dur: p.descanso });
    }
  });
  return f;
}

function vEntrenar() { return '<section class="entreno" id="entreno" aria-live="polite"></section>'; }

function iniciarEntreno(id) {
  const r = buscar(id);
  if (!r || !r.pasos.length) { location.replace('#rutinas'); return; }
  run = { r, fases: fasesDe(r), i: 0, fin: 0, resto: 0, pausa: false, salir: false };
  empezarFase(0);
  reloj = setInterval(tick, 200);
  pedirLuz();
}

function empezarFase(i) {
  if (i >= run.fases.length) return terminar();
  run.i = i; run.pausa = false;
  run.resto = run.fases[i].dur * 1000; run.fin = Date.now() + run.resto;
  pintarFase();
  const f = run.fases[i], p = run.r.pasos[f.k], e = EJ[p.id];
  if (f.tipo === 'trabajo') {
    hablar(`${e.n}. ${e.tipo === 'reps' ? `${p.cant} veces${e.g === 'equilibrio' ? ' con cada pierna' : ''}` : detalle(p)}.${f.s === 1 ? ' ' + e.txt : ` Serie ${f.s}.`}`);
  } else {
    const sig = run.fases[i + 1];
    hablar(sig ? `Descansa. Después: ${EJ[run.r.pasos[sig.k].id].n}.` : 'Descansa y respira hondo. Ya casi está.');
  }
}

function tick() {
  if (!run || run.pausa) return;
  run.resto = run.fin - Date.now();
  if (run.resto <= 0) empezarFase(run.i + 1); else pintarDial();
}

function pintarDial() {
  const f = run.fases[run.i], s = Math.ceil(run.resto / 1000);
  const sec = $('#entreno .sector'), num = $('#entreno .dial-num');
  if (sec) sec.setAttribute('d', sector(run.resto / (f.dur * 1000)));
  if (num) num.textContent = s >= 60 ? mmss(s) : s;
}

function pintarFase() {
  const f = run.fases[run.i], p = run.r.pasos[f.k], e = EJ[p.id];
  const trabajoReps = f.tipo === 'trabajo' && e.tipo === 'reps';
  const cab = `<div class="entreno-cab">
      <button class="btn btn-2 peq" data-acc="salir" data-salir="${run.salir ? 1 : 0}">${ic('x')} ${run.salir ? '¿Salir? Toca otra vez' : 'Salir'}</button>
      <p class="cuenta">Ejercicio ${f.k + 1} de ${run.r.pasos.length}</p>
      <button class="btn btn-2 peq" data-acc="voz" aria-pressed="${S.voz}">${ic(S.voz ? 'voz' : 'mudo')} ${S.voz ? 'Voz: sí' : 'Sin voz'}</button>
    </div>
    <div class="progreso" aria-hidden="true">${run.r.pasos.map((_, k) => `<span class="${k < f.k ? 'hecho' : k === f.k ? 'ahora' : ''}"></span>`).join('')}</div>`;
  const mandos = `<div class="reloj ${run.pausa ? 'en-pausa' : ''}">
      <div class="dial" role="timer" aria-label="Tiempo restante"><svg viewBox="0 0 200 200" aria-hidden="true"><circle class="cara" cx="100" cy="100" r="96"/><g class="marcas">${MARCAS}</g><path class="sector" d="${sector(run.resto / (f.dur * 1000))}"/><circle class="centro" cx="100" cy="100" r="50"/></svg><span class="dial-num"></span></div>
      <div class="botonera">
        <button class="redondo" data-acc="ant"><span class="disco">${ic('ant')}</span>Anterior</button>
        <button class="redondo grande" data-acc="pausa"><span class="disco">${ic(run.pausa ? 'play' : 'pausa')}</span>${run.pausa ? 'Seguir' : 'Pausa'}</button>
        <button class="redondo ${trabajoReps ? 'hecho' : ''}" data-acc="sig"><span class="disco">${ic(trabajoReps ? 'check' : 'sig')}</span>${trabajoReps ? 'Hecho' : 'Saltar'}</button>
      </div>
    </div>`;
  let cuerpo;
  if (f.tipo === 'trabajo') {
    const serie = e.tipo === 'reps'
      ? `${p.series > 1 ? `Serie ${f.s} de ${p.series} · ` : ''}${p.cant} veces${e.g === 'equilibrio' ? ' con cada pierna' : ''}`
      : `Durante ${detalle(p)}`;
    cuerpo = `<div class="fase trabajo">
      ${fotoAnimada(e.id)}
      <div class="fase-info"><h1>${e.n}</h1><p class="serie">${serie}</p><p class="explica">${e.txt}</p><p class="ojo">${ic('ojo')}<span>${e.ojo}</span></p></div>
      ${mandos}
    </div>`;
  } else {
    const sig = run.fases[run.i + 1], ps = sig && run.r.pasos[sig.k];
    cuerpo = `<div class="fase en-descanso">
      <div class="descansa"><h1>Descansa</h1><p>${sig ? 'Respira tranquilo. Bebe un poco de agua si quieres.' : 'Último respiro. ¡Ya casi está!'}</p></div>
      ${ps ? `<div class="viene"><div><span>Ahora viene</span><strong>${EJ[ps.id].n}</strong><span>${sig.k === f.k ? `Serie ${sig.s} de ${ps.series}` : detalle(ps)}</span></div>${fotoAnimada(ps.id)}</div>` : ''}
      ${mandos}
    </div>`;
  }
  $('#entreno').innerHTML = cab + cuerpo;
  pintarDial();
}

function terminar() {
  const r = run.r;
  r.veces = (r.veces || 0) + 1; r.ultima = Date.now();
  S.historial.push({ id: r.id, fecha: Date.now(), seg: duracionTotal(r.pasos) });
  guardar();
  hablar(`¡Rutina terminada${S.nombre ? `, ${S.nombre}` : ''}! Muy bien hecho.`);
  parar(false);
  location.hash = 'fin-' + r.id;
}

function parar(callar = true) {
  clearInterval(reloj); reloj = null;
  if (run?.luz) run.luz.release().catch(() => {});
  if (callar && 'speechSynthesis' in window) speechSynthesis.cancel();
  run = null;
}

async function pedirLuz() { try { if (run) run.luz = await navigator.wakeLock?.request('screen'); } catch { /* sin bloqueo de pantalla */ } }
document.addEventListener('visibilitychange', () => { if (run && document.visibilityState === 'visible') pedirLuz(); });

let vozEs = null;
function hablar(t) {
  if (!S.voz || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    vozEs ??= speechSynthesis.getVoices().find(v => v.lang.startsWith('es')) || null;
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'es-ES'; u.rate = .95; if (vozEs) u.voice = vozEs;
    speechSynthesis.speak(u);
  } catch { /* sin voz */ }
}

// ---------- Ficha de ejercicio ----------
function abrirFicha(id) {
  const e = EJ[id], d = $('#ficha');
  const enEditor = editor && /^(avanzado|editar)/.test(location.hash.slice(1));
  const dentro = enEditor && editor.pasos.some(p => p.id === id);
  d.innerHTML = `<div class="ficha-cuerpo">
    ${fotoAnimada(id)}
    <h2 id="ficha-titulo">${e.n}</h2>
    <p class="foto-pie">${GRUPOS[e.g]} · ${e.tipo === 'reps' ? `${e.cant} veces` : `${e.cant >= 120 ? e.cant / 60 + ' minutos' : e.cant + ' segundos'}`}</p>
    <p class="explica">${e.txt}</p>
    <p class="ojo">${ic('ojo')}<span>${e.ojo}</span></p>
    <div class="acciones">
      ${enEditor ? `<button class="btn ${dentro ? 'btn-2' : 'btn-ok'}" data-acc="alternar" data-id="${id}" data-cerrar="1">${dentro ? 'Quitar de mi rutina' : `${ic('mas')} Añadir a mi rutina`}</button>` : ''}
      <button class="btn btn-2" data-acc="cerrar-ficha">Cerrar</button>
    </div>
  </div>`;
  d.showModal();
}
$('#ficha').addEventListener('click', ev => { if (ev.target === ev.currentTarget) ev.currentTarget.close(); });

// La foto alterna sus dos fotogramas como un GIF
setInterval(() => {
  if (quieto.matches) return;
  document.querySelectorAll('.foto.anima').forEach(f => { f.dataset.f = f.dataset.f === '1' ? '0' : '1'; });
}, 1300);

// ---------- Acciones ----------
const acciones = {
  min: b => { sel.min = +b.dataset.v; refrescar(); },
  lugar: b => { sel.lugar = b.dataset.v; refrescar(); },
  preparar: () => { borrador = crearRutina(sel.min, sel.lugar, sel); location.hash = 'receta'; },
  otra: () => { borrador = crearRutina(borrador.min, borrador.lugar, sel); refrescar(); avisar('Aquí tienes otra rutina distinta.'); },
  cambiar: (b, i) => {
    const actual = borrador.pasos[i], e = EJ[actual.id];
    const usados = new Set(borrador.pasos.map(p => p.id));
    const opciones = disponibles(borrador.lugar, sel).filter(x => x.g === e.g && !usados.has(x.id));
    if (!opciones.length) return avisar('No hay otro ejercicio parecido para cambiarlo.');
    const n = opciones[Math.floor(Math.random() * opciones.length)];
    borrador.pasos[i] = { ...actual, id: n.id, cant: n.tipo === 'seg' ? actual.cant : n.cant };
    refrescar(); avisar(`Cambiado por «${n.n}».`);
  },
  'empezar-borrador': () => { const r = guardarRutina(borrador); borrador = null; location.hash = 'entrenar-' + r.id; },
  'guardar-borrador': () => { const r = guardarRutina(borrador); borrador = null; location.hash = 'ver-' + r.id; avisar('Guardada en Mis rutinas.'); },
  ajustar: () => { editor = { ...JSON.parse(JSON.stringify(borrador)), id: null }; location.hash = 'avanzado'; },

  grupo: b => { filtro.grupo = b.dataset.v; refrescar(); },
  'ed-lugar': b => { editor.lugar = b.dataset.v; refrescar(); },
  alternar: b => {
    const id = b.dataset.id, i = editor.pasos.findIndex(p => p.id === id);
    if (i >= 0) { editor.pasos.splice(i, 1); avisar(`Quitado: ${EJ[id].n}`); }
    else {
      editor.pasos.push({ id, series: EJ[id].tipo === 'seg' ? 1 : 2, cant: EJ[id].cant, descanso: EJ[id].tipo === 'seg' ? 15 : 30 });
      avisar(`Añadido: ${EJ[id].n}`);
    }
    if (b.dataset.cerrar) $('#ficha').close();
    refrescar();
  },
  series: (b, i) => { const p = editor.pasos[i]; p.series = lim(p.series + +b.dataset.d, 1, 5); refrescar(); },
  cant: (b, i) => {
    const p = editor.pasos[i], e = EJ[p.id];
    const paso = e.tipo === 'reps' ? 1 : e.g === 'cardio' ? 60 : 10;
    p.cant = lim(p.cant + paso * +b.dataset.d, e.tipo === 'reps' ? 1 : 10, e.tipo === 'reps' ? 30 : 900);
    refrescar();
  },
  mover: (b, i) => {
    const j = i + +b.dataset.d, ps = editor.pasos;
    if (j < 0 || j >= ps.length) return;
    [ps[i], ps[j]] = [ps[j], ps[i]]; refrescar();
  },
  quitar: (b, i) => { const [p] = editor.pasos.splice(i, 1); refrescar(); avisar(`Quitado: ${EJ[p.id].n}`); },
  'guardar-editor': () => {
    if (!editor.pasos.length) return avisar('Añade al menos un ejercicio.');
    const min = Math.round(duracionTotal(editor.pasos) / 60);
    editor.nombre = editor.nombre.trim() || `Mi rutina de ${min} minutos`;
    editor.min = min;
    let r;
    if (editor.id && buscar(editor.id)) { r = Object.assign(buscar(editor.id), editor); guardar(); }
    else r = guardarRutina(editor);
    editor = null;
    location.hash = 'ver-' + r.id; avisar('Rutina guardada.');
  },

  ficha: b => abrirFicha(b.dataset.id),
  'cerrar-ficha': () => $('#ficha').close(),
  compartir: b => { compartiendo = compartiendo === b.dataset.id ? null : b.dataset.id; refrescar(); },
  copiar: () => {
    const t = $('#codigo-salida');
    const bien = () => avisar('Código copiado. Ya puedes pegarlo en un mensaje.');
    const mal = () => { t.focus(); t.select(); avisar('Mantén pulsado el código y elige «Copiar».'); };
    navigator.clipboard?.writeText(t.value).then(bien, mal) ?? mal();
  },
  borrar: b => { borrando = b.dataset.id; refrescar(); },
  'borrar-no': () => { borrando = null; refrescar(); },
  'borrar-si': b => {
    S.rutinas = S.rutinas.filter(r => r.id !== b.dataset.id); guardar();
    borrando = null; location.hash = 'rutinas'; avisar('Rutina borrada.');
  },
  'olvidar-nombre': () => { S.nombre = ''; guardar(); refrescar(); $('#nombre')?.focus(); },

  salir: () => {
    if (run.salir) { const id = run.r.id; parar(); location.hash = 'ver-' + id; return; }
    run.salir = true; pintarFase();
    setTimeout(() => { if (run?.salir) { run.salir = false; pintarFase(); } }, 3500);
  },
  voz: () => { cambiarVoz(!S.voz); pintarFase(); },
  pausa: () => {
    run.pausa = !run.pausa;
    if (run.pausa) { run.resto = run.fin - Date.now(); window.speechSynthesis?.cancel(); } else run.fin = Date.now() + run.resto;
    pintarFase();
  },
  sig: () => empezarFase(run.i + 1),
  ant: () => {
    let j = run.i - 1; // desde un descanso repite la serie; desde un ejercicio vuelve al anterior
    while (j > 0 && run.fases[j].tipo !== 'trabajo') j--;
    empezarFase(Math.max(0, j));
  },
};

document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-acc]');
  if (!b || b.disabled) return;
  acciones[b.dataset.acc]?.(b, +b.dataset.i);
});
document.addEventListener('change', ev => {
  const o = ev.target.dataset.opc;
  if (o) sel[o] = ev.target.checked;
  if (ev.target.dataset.ajuste === 'voz') cambiarVoz(ev.target.checked);
});
function cambiarVoz(si) {
  S.voz = si; guardar();
  if (si) hablar('Voz activada.'); else window.speechSynthesis?.cancel();
  avisar(si ? 'Voz activada.' : 'Voz quitada. Ya no hablará.');
}
document.addEventListener('input', ev => { if (ev.target.id === 'ed-nombre' && editor) editor.nombre = ev.target.value; });
document.addEventListener('submit', ev => {
  ev.preventDefault();
  const f = ev.target.dataset.form;
  if (f === 'nombre') {
    S.nombre = $('#nombre').value.trim().slice(0, 40); guardar(); refrescar();
    if (S.nombre) avisar(`Encantados, ${S.nombre}.`);
  }
  if (f === 'importar') {
    const r = leerCodigo($('#codigo').value);
    if (!r) return avisar('Ese código no funciona. Comprueba que lo has copiado entero.');
    const n = guardarRutina(r); location.hash = 'ver-' + n.id; avisar('Rutina añadida a las tuyas.');
  }
});

// ---------- Navegación por #ancla ----------
const VISTAS = { inicio: vInicio, crear: vCrear, receta: vReceta, avanzado: vEditor, editar: vEditor, rutinas: vRutinas, ver: vVer, entrenar: vEntrenar, fin: vFin };
const PESTANA = { crear: 'crear', receta: 'crear', avanzado: 'crear', editar: 'crear', rutinas: 'rutinas', ver: 'rutinas' };
function ruta() {
  const h = decodeURIComponent(location.hash.slice(1)) || 'inicio', i = h.indexOf('-');
  return i < 0 ? [h, null] : [h.slice(0, i), h.slice(i + 1)];
}
function refrescar() {
  const [r, arg] = ruta(), y = scrollY;
  vista.innerHTML = (VISTAS[r] || vInicio)(arg);
  scrollTo(0, y);
}
function pintar() {
  const [r, arg] = ruta();
  if (run && r !== 'entrenar') parar();
  if (r !== 'ver') { borrando = null; compartiendo = null; }
  const hacer = () => {
    document.body.dataset.ruta = r;
    vista.innerHTML = (VISTAS[r] || vInicio)(arg);
    const tab = PESTANA[r] || 'inicio';
    document.querySelectorAll('.tabs a').forEach(a => a.dataset.tab === tab ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    scrollTo(0, 0);
    if (r === 'entrenar') iniciarEntreno(arg);
  };
  if (document.startViewTransition && !quieto.matches && r !== 'entrenar' && !document.hidden) {
    let listo = false;
    const una = () => { if (!listo) { listo = true; hacer(); } };
    const t = document.startViewTransition(una);
    t.ready.catch(() => {}); t.finished.catch(() => {}); t.updateCallbackDone.catch(() => {});
    setTimeout(una, 300); // si el navegador no pinta (pestaña en segundo plano), no esperamos a la transición
  } else hacer();
}
addEventListener('hashchange', pintar);

cargar();
pintar();
