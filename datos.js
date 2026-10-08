// Ejercicios, fotos de free-exercise-db (yuhonas, dominio público): img/<id>/0.jpg inicio, 1.jpg final.
// g: grupo · lugar: 'ambos' | 'gim' · eq: lo que hace falta · tipo: 'reps' (veces) | 'seg' (segundos)
const EJERCICIOS = [
  // Calentar
  { id: 'Arm_Circles', n: 'Círculos con los brazos', g: 'calentar', lugar: 'ambos', eq: [], tipo: 'seg', cant: 30,
    txt: 'Estira los brazos a los lados, a la altura de los hombros, y dibuja círculos pequeños hacia delante. A mitad de tiempo, cambia el sentido.',
    ojo: 'Si se cansan los brazos, bájalos un momento y sigue.' },
  { id: 'Shoulder_Circles', n: 'Rodar los hombros', g: 'calentar', lugar: 'ambos', eq: [], tipo: 'seg', cant: 30,
    txt: 'Con los brazos sueltos, lleva los hombros hacia delante, arriba, atrás y abajo, como si dibujaras una rueda. Luego al revés.',
    ojo: 'Puedes hacerlo sentado.' },
  { id: 'Shoulder_Raise', n: 'Subir y bajar los hombros', g: 'calentar', lugar: 'ambos', eq: [], tipo: 'seg', cant: 30,
    txt: 'Sube los hombros hacia las orejas, aguanta un segundo y déjalos caer, relajados. Repite a tu ritmo.',
    ojo: 'Respira normal, sin aguantar el aire.' },
  { id: 'Knee_Circles', n: 'Círculos de rodillas', g: 'calentar', lugar: 'ambos', eq: ['silla'], tipo: 'seg', cant: 30,
    txt: 'Pies juntos y rodillas un poco dobladas. Mueve las rodillas en círculos suaves, primero hacia un lado y luego hacia el otro.',
    ojo: 'Ten una silla al lado por si necesitas apoyarte.' },
  { id: 'Ankle_Circles', n: 'Círculos de tobillo', g: 'calentar', lugar: 'ambos', eq: ['silla'], tipo: 'seg', cant: 30,
    txt: 'Agárrate a una silla o a la pared. Levanta un pie un poco del suelo y dibuja círculos con la punta. A mitad de tiempo, cambia de pie.',
    ojo: 'Agárrate siempre con una mano.' },
  { id: 'Elbows_Back', n: 'Codos atrás', g: 'calentar', lugar: 'ambos', eq: [], tipo: 'seg', cant: 30,
    txt: 'Pon las manos en la parte baja de la espalda. Lleva los codos hacia atrás, como si quisieras juntarlos, y abre el pecho. Suelta y repite.',
    ojo: 'Sin forzar: solo hasta donde sea cómodo.' },
  { id: 'Recumbent_Bike', n: 'Bicicleta estática con respaldo', g: 'cardio', lugar: 'gim', eq: ['maquina'], tipo: 'seg', cant: 300,
    txt: 'Ajusta el asiento para que la rodilla quede casi estirada al bajar el pedal. Pedalea a un ritmo en el que puedas hablar sin ahogarte.',
    ojo: 'Empieza con la resistencia más baja.' },
  { id: 'Walking_Treadmill', n: 'Caminar en la cinta', g: 'cardio', lugar: 'gim', eq: ['maquina'], tipo: 'seg', cant: 300,
    txt: 'Sube agarrado a las barras y empieza muy despacio. Camina a paso cómodo y ve subiendo la velocidad poco a poco.',
    ojo: 'Engánchate la pinza de seguridad a la ropa.' },

  // Piernas
  { id: 'Sit_Squats', n: 'Sentarse y levantarse', g: 'piernas', lugar: 'ambos', eq: ['silla'], tipo: 'reps', cant: 10,
    txt: 'Ponte delante de una silla con los pies separados. Echa el culete hacia atrás y baja despacio hasta rozar el asiento. Empuja con los talones y vuelve a subir.',
    ojo: 'Usa una silla firme, sin ruedas, apoyada contra la pared.' },
  { id: 'Bodyweight_Squat', n: 'Sentadilla', g: 'piernas', lugar: 'ambos', eq: [], tipo: 'reps', cant: 10,
    txt: 'Pies al ancho de los hombros y brazos al frente. Baja como si fueras a sentarte, hasta donde estés cómodo, y sube apretando los glúteos.',
    ojo: 'Las rodillas miran hacia la punta de los pies.' },
  { id: 'Standing_Dumbbell_Calf_Raise', n: 'Ponerse de puntillas', g: 'piernas', lugar: 'ambos', eq: ['silla'], tipo: 'reps', cant: 12,
    txt: 'De pie y agarrado a una silla o a la encimera, sube despacio sobre las puntas de los pies. Baja los talones sin prisa.',
    ojo: 'Al principio, sin pesas. Agárrate siempre.' },
  { id: 'Butt_Lift_Bridge', n: 'Puente de glúteos', g: 'piernas', lugar: 'ambos', eq: ['suelo'], tipo: 'reps', cant: 10,
    txt: 'Túmbate boca arriba con las rodillas dobladas y los pies apoyados. Empuja con los talones y sube la cadera. Aguanta un segundo y baja despacio.',
    ojo: 'Si te cuesta tumbarte en el suelo, hazlo en la cama.' },
  { id: 'Squats_-_With_Bands', n: 'Sentadilla con goma', g: 'piernas', lugar: 'ambos', eq: ['goma'], tipo: 'reps', cant: 10,
    txt: 'Pisa la goma con los pies separados y sujeta los extremos a la altura de los hombros. Baja como para sentarte y vuelve a subir.',
    ojo: 'Comprueba que la goma queda bien pisada.' },
  { id: 'Leg_Press', n: 'Prensa de piernas', g: 'piernas', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 12,
    txt: 'Siéntate con la espalda bien apoyada y los pies en la plataforma. Empuja hasta casi estirar las piernas y vuelve despacio.',
    ojo: 'No bloquees las rodillas. Empieza con poco peso.' },
  { id: 'Leg_Extensions', n: 'Extensión de piernas', g: 'piernas', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 12,
    txt: 'Sentado en la máquina, con el rodillo sobre los tobillos, estira las piernas hacia delante y bájalas despacio.',
    ojo: 'Peso ligero: es un ejercicio para la rodilla, no para batir récords.' },
  { id: 'Seated_Leg_Curl', n: 'Doblar piernas sentado', g: 'piernas', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 12,
    txt: 'Con el rodillo detrás de los tobillos, dobla las rodillas llevando los talones hacia abajo. Vuelve sin soltar de golpe.',
    ojo: 'Ajusta la almohadilla sobre los muslos antes de empezar.' },
  { id: 'Seated_Calf_Raise', n: 'Gemelos sentado', g: 'piernas', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 15,
    txt: 'Sentado, con las puntas de los pies en el escalón y el rodillo sobre los muslos, sube los talones todo lo que puedas y baja despacio.',
    ojo: 'Movimiento lento, sin rebotes.' },
  { id: 'Thigh_Abductor', n: 'Abrir piernas en máquina', g: 'piernas', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 12,
    txt: 'Sentado con la espalda apoyada, abre las piernas empujando las almohadillas hacia fuera y ciérralas controlando.',
    ojo: 'La espalda no se despega del respaldo.' },
  { id: 'Thigh_Adductor', n: 'Cerrar piernas en máquina', g: 'piernas', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 12,
    txt: 'Sentado con la espalda apoyada, junta las piernas apretando las almohadillas y ábrelas despacio.',
    ojo: 'Abre solo hasta donde sea cómodo.' },

  // Equilibrio (siempre con apoyo)
  { id: 'Side_Leg_Raises', n: 'Pierna hacia el lado', g: 'equilibrio', lugar: 'ambos', eq: ['silla'], tipo: 'reps', cant: 8,
    txt: 'De pie junto a una silla, agárrate con una mano. Levanta una pierna estirada hacia el lado y bájala despacio. Haz 8 con cada pierna.',
    ojo: 'El cuerpo recto: no te inclines hacia el otro lado.' },
  { id: 'Leg_Lift', n: 'Pierna hacia atrás', g: 'equilibrio', lugar: 'ambos', eq: ['silla'], tipo: 'reps', cant: 8,
    txt: 'Agarrado al respaldo de una silla, lleva una pierna estirada hacia atrás sin echar el cuerpo hacia delante, y vuelve. Haz 8 con cada pierna.',
    ojo: 'Movimiento corto y controlado.' },
  { id: 'Front_Leg_Raises', n: 'Balancear la pierna', g: 'equilibrio', lugar: 'ambos', eq: ['silla'], tipo: 'reps', cant: 8,
    txt: 'Junto a una silla y agarrado con una mano, balancea una pierna adelante y atrás, suave y sin forzar. Haz 8 con cada pierna.',
    ojo: 'Pequeño al principio; la amplitud llega sola.' },
  { id: 'Standing_Hip_Circles', n: 'Círculos con la rodilla', g: 'equilibrio', lugar: 'ambos', eq: ['silla'], tipo: 'reps', cant: 5,
    txt: 'Agarrado a una silla, sube una rodilla y dibuja con ella un círculo grande hacia fuera. Haz 5 con cada pierna.',
    ojo: 'Si pierdes el equilibrio, apoya el pie y sigue.' },

  // Brazos y espalda
  { id: 'Incline_Push-Up', n: 'Flexiones en la encimera', g: 'superior', lugar: 'ambos', eq: [], tipo: 'reps', cant: 10,
    txt: 'Apoya las manos en la encimera o en una mesa firme, algo más abiertas que los hombros. Con el cuerpo recto, dobla los codos acercando el pecho y empuja para volver.',
    ojo: 'Cuanto más alta la superficie, más fácil.' },
  { id: 'Seated_Side_Lateral_Raise', n: 'Brazos hacia los lados', g: 'superior', lugar: 'ambos', eq: ['pesas', 'silla'], tipo: 'reps', cant: 10,
    txt: 'Sentado, con una pesa o una botella de agua en cada mano, sube los brazos hacia los lados hasta la altura de los hombros y baja despacio.',
    ojo: 'No subas por encima de los hombros.' },
  { id: 'Seated_Dumbbell_Curl', n: 'Doblar los brazos', g: 'superior', lugar: 'ambos', eq: ['pesas', 'silla'], tipo: 'reps', cant: 10,
    txt: 'Sentado, con los codos pegados al cuerpo, dobla los brazos subiendo las pesas hacia los hombros. Bájalas despacio.',
    ojo: 'Los codos quietos, pegados a los costados.' },
  { id: 'Seated_Dumbbell_Press', n: 'Empujar hacia arriba', g: 'superior', lugar: 'ambos', eq: ['pesas', 'silla'], tipo: 'reps', cant: 10,
    txt: 'Sentado con la espalda recta y las pesas a la altura de los hombros, empuja hacia arriba sin estirar del todo los codos y vuelve a bajar.',
    ojo: 'Si molesta el hombro, sube solo hasta la altura de la cabeza.' },
  { id: 'Seated_Triceps_Press', n: 'Pesa por detrás de la cabeza', g: 'superior', lugar: 'ambos', eq: ['pesas', 'silla'], tipo: 'reps', cant: 10,
    txt: 'Sentado, sujeta una pesa con las dos manos por encima de la cabeza. Bájala por detrás doblando los codos y vuelve a subirla.',
    ojo: 'Con una botella de agua basta. Si molesta el hombro, sáltalo.' },
  { id: 'Bent_Over_Two-Dumbbell_Row', n: 'Remar con pesas', g: 'superior', lugar: 'ambos', eq: ['pesas'], tipo: 'reps', cant: 10,
    txt: 'Rodillas un poco dobladas y espalda recta, inclinada hacia delante. Tira de las pesas hacia la cintura y bájalas despacio.',
    ojo: 'Espalda siempre recta. Si te cuesta, apoya una mano en la mesa y rema con la otra.' },
  { id: 'Band_Pull_Apart', n: 'Abrir la goma', g: 'superior', lugar: 'ambos', eq: ['goma'], tipo: 'reps', cant: 12,
    txt: 'Con los brazos estirados al frente, sujeta la goma. Ábrelos hacia los lados juntando los omóplatos y vuelve despacio.',
    ojo: 'Hombros bajos, lejos de las orejas.' },
  { id: 'Lateral_Raise_-_With_Bands', n: 'Brazos al lado con goma', g: 'superior', lugar: 'ambos', eq: ['goma'], tipo: 'reps', cant: 10,
    txt: 'Pisa la goma y sujeta los extremos. Sube los brazos hacia los lados hasta los hombros y bájalos despacio.',
    ojo: 'Cuanto más corta cojas la goma, más cuesta.' },
  { id: 'Machine_Bench_Press', n: 'Empujar en la máquina de pecho', g: 'superior', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 12,
    txt: 'Sentado con la espalda apoyada, agarra las asas a la altura del pecho y empuja hacia delante. Vuelve despacio.',
    ojo: 'Ajusta el asiento para que las asas queden a la altura del pecho.' },
  { id: 'Seated_Cable_Rows', n: 'Remo sentado en polea', g: 'superior', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 12,
    txt: 'Sentado, rodillas un poco dobladas y espalda recta. Tira del agarre hacia la tripa juntando los omóplatos y estira los brazos despacio.',
    ojo: 'No eches el cuerpo hacia atrás para tirar.' },
  { id: 'Close-Grip_Front_Lat_Pulldown', n: 'Bajar la barra al pecho', g: 'superior', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 12,
    txt: 'Sentado con los muslos bajo el rodillo, tira de la barra hacia la parte alta del pecho y súbela controlando.',
    ojo: 'La barra siempre por delante, nunca detrás de la cabeza.' },
  { id: 'Machine_Shoulder_Military_Press', n: 'Empujar hacia arriba en máquina', g: 'superior', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 10,
    txt: 'Sentado en la máquina de hombros, agarra las asas a los lados y empuja hacia arriba. Baja despacio.',
    ojo: 'Peso ligero y la espalda apoyada.' },
  { id: 'Butterfly', n: 'Juntar los brazos en máquina', g: 'superior', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 12,
    txt: 'Con la espalda apoyada y los brazos abiertos, junta las asas delante del pecho y ábrelas despacio.',
    ojo: 'Abre solo hasta notar un estiramiento suave.' },
  { id: 'Reverse_Machine_Flyes', n: 'Abrir los brazos en máquina', g: 'superior', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 12,
    txt: 'Sentado mirando al respaldo, con los brazos estirados al frente, ábrelos hacia atrás juntando los omóplatos.',
    ojo: 'Muy bueno para la postura. Peso ligero.' },
  { id: 'Machine_Bicep_Curl', n: 'Doblar los brazos en máquina', g: 'superior', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 12,
    txt: 'Con los brazos apoyados en el atril, dobla los codos subiendo las asas y bájalas despacio.',
    ojo: 'No estires los codos del todo al bajar.' },
  { id: 'Machine_Triceps_Extension', n: 'Estirar los brazos en máquina', g: 'superior', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 12,
    txt: 'Con los brazos apoyados, empuja las asas estirando los codos y vuelve sin soltar de golpe.',
    ojo: 'Los hombros quietos; solo se mueven los codos.' },

  // Tronco
  { id: 'Dead_Bug', n: 'Brazo y pierna contrarios', g: 'tronco', lugar: 'ambos', eq: ['suelo'], tipo: 'reps', cant: 8,
    txt: 'Boca arriba, brazos hacia el techo y rodillas dobladas en el aire. Baja despacio un brazo y la pierna contraria sin despegar la espalda. Alterna.',
    ojo: 'Si molesta la espalda, mueve solo los brazos.' },
  { id: 'Pallof_Press', n: 'Empujar sin girar', g: 'tronco', lugar: 'gim', eq: ['maquina'], tipo: 'reps', cant: 10,
    txt: 'De lado a la polea, sujeta el agarre junto al pecho. Estira los brazos al frente sin dejar que el cuerpo gire, y vuelve. Luego del otro lado.',
    ojo: 'Peso muy ligero: lo que trabaja es la tripa.' },

  // Estirar
  { id: 'Chin_To_Chest_Stretch', n: 'Barbilla al pecho', g: 'estirar', lugar: 'ambos', eq: [], tipo: 'seg', cant: 30,
    txt: 'Sentado, entrelaza las manos detrás de la cabeza y deja que la barbilla baje hacia el pecho. El peso de los brazos basta.',
    ojo: 'No tires de la cabeza.' },
  { id: 'Side_Neck_Stretch', n: 'Cuello de lado', g: 'estirar', lugar: 'ambos', eq: [], tipo: 'seg', cant: 30,
    txt: 'Con los hombros relajados, inclina la cabeza hacia un hombro y ayúdate suavemente con la mano. A mitad de tiempo, al otro lado.',
    ojo: 'Suave: un estiramiento nunca duele.' },
  { id: 'Shoulder_Stretch', n: 'Estirar el hombro', g: 'estirar', lugar: 'ambos', eq: [], tipo: 'seg', cant: 30,
    txt: 'Cruza un brazo estirado por delante del pecho y sujétalo con la otra mano. A mitad de tiempo, cambia de brazo.',
    ojo: 'El hombro, bajo y relajado.' },
  { id: 'Overhead_Stretch', n: 'Estirarse hacia arriba', g: 'estirar', lugar: 'ambos', eq: [], tipo: 'seg', cant: 30,
    txt: 'Entrelaza los dedos, gira las palmas hacia el techo y estira los brazos hacia arriba, con los hombros bajos. Respira hondo.',
    ojo: 'Puedes hacerlo sentado.' },
  { id: 'Chair_Lower_Back_Stretch', n: 'Inclinarse de lado en la silla', g: 'estirar', lugar: 'ambos', eq: ['silla'], tipo: 'seg', cant: 30,
    txt: 'Sentado recto, sube un brazo por encima de la cabeza e inclínate hacia el otro lado, agarrado a la silla con la otra mano. A mitad, cambia.',
    ojo: 'Los dos glúteos siempre apoyados en el asiento.' },
  { id: 'Chair_Upper_Body_Stretch', n: 'Abrir el pecho en la silla', g: 'estirar', lugar: 'ambos', eq: ['silla'], tipo: 'seg', cant: 30,
    txt: 'Sentado en el borde de la silla, agarra el respaldo por detrás con los brazos estirados y lleva el pecho hacia delante.',
    ojo: 'Silla firme y sin ruedas.' },
  { id: 'Chair_Leg_Extended_Stretch', n: 'Estirar la pierna sentado', g: 'estirar', lugar: 'ambos', eq: ['silla'], tipo: 'seg', cant: 30,
    txt: 'Sentado y agarrado al asiento, estira una pierna con la punta del pie hacia ti, llévala hacia fuera y vuelve. Luego la otra.',
    ojo: 'Despacio y sin rebotes.' },
  { id: 'Calf_Stretch_Hands_Against_Wall', n: 'Gemelos contra la pared', g: 'estirar', lugar: 'ambos', eq: [], tipo: 'seg', cant: 30,
    txt: 'Manos en la pared, un pie delante y el otro atrás. Inclínate hacia la pared sin levantar el talón de atrás. A mitad, cambia de pierna.',
    ojo: 'El talón de atrás, pegado al suelo.' },
  { id: 'Standing_Hip_Flexors', n: 'Estirar la cadera', g: 'estirar', lugar: 'ambos', eq: ['silla'], tipo: 'seg', cant: 30,
    txt: 'Agarrado a una silla, pon un pie delante del otro, dobla un poco las rodillas y empuja suavemente la cadera hacia delante. A mitad, cambia.',
    ojo: 'El cuerpo recto, sin arquear la espalda.' },
  { id: 'Middle_Back_Stretch', n: 'Girar la cintura', g: 'estirar', lugar: 'ambos', eq: [], tipo: 'seg', cant: 30,
    txt: 'Pies separados y manos en la cintura. Gira el tronco despacio hacia un lado, aguanta, y luego hacia el otro.',
    ojo: 'Las caderas miran siempre al frente.' },
  { id: 'Standing_Lateral_Stretch', n: 'Inclinarse de lado de pie', g: 'estirar', lugar: 'ambos', eq: [], tipo: 'seg', cant: 30,
    txt: 'De pie, una mano en la cadera y la otra detrás de la cabeza. Inclínate hacia el lado de la mano en la cadera. A mitad, al otro lado.',
    ojo: 'Rodillas un poco dobladas.' },
];

const GRUPOS = {
  cardio: 'Calentar', calentar: 'Calentar', piernas: 'Piernas', equilibrio: 'Equilibrio',
  superior: 'Brazos y espalda', tronco: 'Tripa y espalda', estirar: 'Estirar',
};
const SECCION = g => (g === 'calentar' || g === 'cardio') ? 'calentar' : g === 'estirar' ? 'estirar' : 'principal';

const EJ = Object.fromEntries(EJERCICIOS.map(e => [e.id, e]));
const SERIE_REPS = 45; // segundos que se dan para una serie de repeticiones

// Un paso: { id, series, cant (veces o segundos), descanso (s) }
function trabajo(p) { return EJ[p.id].tipo === 'seg' ? p.cant : SERIE_REPS; }
function duracionPaso(p) { return p.series * (trabajo(p) + p.descanso); }
function duracionTotal(pasos) { return pasos.reduce((s, p) => s + duracionPaso(p), 0); }

function pasoDe(e, series) {
  return { id: e.id, series: e.tipo === 'seg' ? 1 : series, cant: e.cant, descanso: e.tipo === 'seg' ? 15 : 30 };
}

function disponibles(lugar, opc) {
  return EJERCICIOS.filter(e =>
    (e.lugar === 'ambos' || e.lugar === lugar) &&
    !e.eq.includes('suelo') && // ponytail: la rutina rápida no obliga a tumbarse; el modo avanzado sí los ofrece
    (lugar === 'gim' || opc.pesas || !e.eq.includes('pesas')) &&
    (opc.goma || !e.eq.includes('goma')));
}

function barajar(arr, rnd) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Rutina que dura exactamente `min` minutos: 20% calentar, 15% estirar, el resto fuerza y equilibrio.
function crearRutina(min, lugar, opc = { pesas: true, goma: false }, rnd = Math.random) {
  const T = min * 60;
  const pool = disponibles(lugar, opc);
  const usados = new Set();
  const pasos = { calentar: [], principal: [], estirar: [] };
  const coste = () => duracionTotal([...pasos.calentar, ...pasos.principal, ...pasos.estirar]);
  const tomar = (grupo, preferirGim) => {
    let c = barajar(pool.filter(e => e.g === grupo && !usados.has(e.id)), rnd);
    if (preferirGim) c.sort((a, b) => (b.lugar === 'gim') - (a.lugar === 'gim'));
    return c[0];
  };

  // Calentar
  const presuCal = T * 0.2;
  if (lugar === 'gim' && min >= 15) {
    const c = tomar('cardio');
    const p = pasoDe(c, 1); p.cant = Math.min(600, Math.max(180, Math.round(T * 0.12 / 60) * 60));
    pasos.calentar.push(p); usados.add(c.id);
  }
  for (let e; duracionTotal(pasos.calentar) + 45 <= presuCal && (e = tomar('calentar'));) {
    pasos.calentar.push(pasoDe(e, 1)); usados.add(e.id);
  }

  // Lo principal: alterna piernas / arriba / equilibrio
  const series = min <= 10 ? 1 : min < 30 ? 2 : 3;
  const orden = lugar === 'gim'
    ? ['piernas', 'superior', 'piernas', 'superior', 'equilibrio', 'superior', 'tronco', 'piernas']
    : ['piernas', 'superior', 'equilibrio', 'piernas', 'superior', 'equilibrio', 'superior', 'piernas'];
  const presuPrin = T * 0.65;
  const costeEj = series * (SERIE_REPS + 30);
  for (let i = 0, fallos = 0; fallos < orden.length; i++) {
    if (duracionTotal(pasos.principal) + costeEj > presuPrin) break;
    const e = tomar(orden[i % orden.length], lugar === 'gim');
    if (!e) { fallos++; continue; }
    fallos = 0; pasos.principal.push(pasoDe(e, series)); usados.add(e.id);
  }
  // Hueco sobrante: un ejercicio más de una serie
  const hueco = T - coste() - T * 0.15;
  if (hueco >= SERIE_REPS + 30) {
    const e = tomar('equilibrio') || tomar('piernas') || tomar('superior');
    if (e) { pasos.principal.push(pasoDe(e, 1)); usados.add(e.id); }
  }

  // Estirar hasta llenar
  for (let e; T - coste() >= 45 && (e = tomar('estirar'));) { pasos.estirar.push(pasoDe(e, 1)); usados.add(e.id); }

  // Ajuste fino: el sobrante se reparte en los pasos de segundos para que el total sea exacto
  const todos = [...pasos.calentar, ...pasos.principal, ...pasos.estirar];
  const flexibles = todos.filter(p => EJ[p.id].tipo === 'seg' && EJ[p.id].g !== 'cardio');
  let resto = T - coste();
  for (let i = 0; resto > 0 && flexibles.length; i++) {
    const d = Math.min(5, resto); flexibles[i % flexibles.length].cant += d; resto -= d;
  }
  if (resto !== 0 && todos.length) todos[todos.length - 1].descanso += resto; // si no hay pasos de segundos o sobra
  return {
    nombre: `Rutina de ${min} minutos ${lugar === 'gim' ? 'en el gimnasio' : 'en casa'}`,
    min, lugar, pasos: todos,
  };
}

if (typeof module !== 'undefined') module.exports = { EJERCICIOS, EJ, crearRutina, duracionTotal, duracionPaso, disponibles };
