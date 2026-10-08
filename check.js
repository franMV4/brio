// node check.js — la rutina rápida dura exactamente lo pedido, sin repetir ejercicios
const assert = require('assert');
const { crearRutina, duracionTotal, EJ } = require('./datos.js');
for (const lugar of ['casa', 'gim']) for (const min of [10, 15, 20, 30, 45, 60]) for (const opc of [{ pesas: true, goma: false }, { pesas: false, goma: false }, { pesas: true, goma: true }]) for (let i = 0; i < 30; i++) {
  const r = crearRutina(min, lugar, opc);
  assert.strictEqual(duracionTotal(r.pasos), min * 60, `${min} ${lugar} dura ${duracionTotal(r.pasos)}`);
  const ids = r.pasos.map(p => p.id);
  assert.strictEqual(new Set(ids).size, ids.length, 'repetido');
  assert.ok(ids.every(id => EJ[id] && !EJ[id].eq.includes('suelo')));
  if (lugar === 'casa') assert.ok(ids.every(id => EJ[id].lugar === 'ambos'));
  assert.ok(r.pasos.filter(p => EJ[p.id].tipo === 'reps').length >= 2, `${min} ${lugar} pocos ejercicios de fuerza`);
}
const r = crearRutina(20, 'casa');
console.log(r.pasos.map(p => `${EJ[p.id].n} ${p.series}x${p.cant} +${p.descanso}`).join('\n'));
console.log('OK');
