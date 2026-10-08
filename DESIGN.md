# Brío · Design

Mundo: cocina de formica española de los 70. Cada rutina es una ficha de receta; el temporizador es un reloj de cocina.

## Tokens (index.html `:root`)
- `--formica` #c3e5d6 fondo de página · `--formica-honda` #a8d6c2
- `--esmalte` #fcfdf9 fichas y tarjetas · `--tinta` #10322a texto · `--tinta-suave` #3a5a51
- `--botella` #1f5c4c acciones secundarias, descanso · `--mantequilla` #f7d46a selección, serie
- `--tomate` #c8381f solo para ir: Empezar / Preparar / tachado final
- Tipos: Bricolage Grotesque (rótulos, 750–800, -0.02em) · Atkinson Hyperlegible (texto, base 20px)
- Radio 16px tarjetas, 14px botones; sombra con desplazamiento y blur, nunca bloque duro.

## Componentes
- Ficha de receta: franja de hule de cuadros arriba, título + raya tomate, «Necesitas», «Paso a paso» con tiempos alineados a la derecha y total con puntos guía.
- Mandos de cocina (elegir minutos): círculos con muesca que gira al seleccionar.
- Foto animada: dos fotogramas (inicio/final) que se alternan; con movimiento reducido se muestran lado a lado.
- Reloj de cocina: esfera con 60 marcas y sector que se vacía; fijo abajo en móvil.
- Tachado a boli al terminar, por línea.

## Reglas
- Botones ≥ 52px (principales 64px), texto ≥ 18px.
- Un solo look claro (pensado para salón o gimnasio con luz).
