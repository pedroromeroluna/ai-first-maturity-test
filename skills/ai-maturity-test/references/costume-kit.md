# El kit de disfraces

El compañero de viaje es un muñeco 3D con un mameluco y una capucha. Un disfraz es una **receta**: un
JSON que dice de qué color son el mameluco y la capucha y qué piezas del kit se le suman. La página
arma el disfraz solo a partir de la receta; no hay otra forma de dibujar un animal.

La receta va en el campo `recipe` del JSON que recibe `scripts/build-profile.mjs`. El script la
valida contra esta lista: un tipo, una variante o un campo que no está acá hace que la página use el
disfraz de reserva.

## Forma de la receta

```json
{
  "hoodColor": "#F7A8C4",
  "accentColor": "#D9658F",
  "bellyColor": "#FFE3EC",
  "rimColor": "#FFFFFF",
  "parts": [ { "type": "ears", "variant": "tuft", "color": "#E0567F", "scale": 0.9 } ],
  "pattern": null
}
```

| Campo | Qué pinta | Obligatorio |
|---|---|---|
| `hoodColor` | La capucha y el mameluco: el color principal del animal | Sí |
| `accentColor` | Las patas | Sí |
| `bellyColor` | La panza | Sí |
| `rimColor` | El borde de la capucha alrededor de la cara (si falta, el de la capucha) | No |
| `parts` | Entre 1 y 8 piezas del kit | Sí |
| `pattern` | Un dibujo sobre capucha y cuerpo, o `null` | No |

Reglas:

- Todos los colores van como `#RRGGBB`.
- `scale` va de 0.4 a 1.6; si falta, es 1.
- Una variante que falta toma la primera de la lista de su pieza.
- No repitas un tipo de pieza: la segunda se dibuja encima de la primera.
- El animal se reconoce por la silueta, no por el detalle. Tres o cuatro piezas bien elegidas y los
  colores reales del animal bastan.

## Las piezas

| Pieza (`type`) | Variantes (`variant`) | Campos | Cómo se ve |
|---|---|---|---|
| `ears` | `pointy`, `round`, `long`, `big`, `floppy`, `tuft` | `color`, `inner`, `scale` | Orejas sobre la capucha. `pointy` de gato o zorro; `round` de oso; `long` de conejo; `big` de elefante, a los costados; `floppy` caídas, de perro; `tuft` plumas en punta, de búho. `inner` es el interior de la oreja |
| `horns` | `dragon`, `small` | `color`, `tip`, `scale` | `dragon` cuernos curvos hacia atrás; `small` osiconos cortos de jirafa, con la punta en `tip` |
| `wings` | `bat`, `feather`, `flipper` | `color`, `scale` | `bat` alas membranosas en la espalda; `feather` alas de ave; `flipper` convierte los brazos en aletas (pingüino, foca) |
| `tail` | `tuft`, `long`, `bushy`, `dragon`, `thick`, `curl`, `flat`, `fish`, `stub` | `color`, `tip`, `end`, `endColor`, `rings`, `scutes`, `thin`, `scale` | `tuft` pompón; `long` cola larga de felino (`tip` pinta la punta; `thin: true` y `end: "tuft"` con `endColor` hacen la cola de león); `bushy` peluda de zorro; `dragon` con punta de flecha; `thick` gruesa de reptil (`scutes` pinta las placas); `curl` enroscada de mono; `flat` plana de castor u ornitorrinco; `fish` aleta caudal; `stub` cortita. `rings` agrega anillos (coatí, mapache) |
| `beak` | `bird`, `toucan`, `duck` | `color`, `tip`, `scale` | `bird` pico corto; `toucan` pico enorme con la punta en `tip`; `duck` pico plano de pato. Saca la boca y la nariz de la cara |
| `trunk` | `long`, `short` | `color`, `scale` | `long` trompa de elefante; `short` hocico de tapir. Saca la boca y la nariz |
| `snout` | `long-up`, `blunt`, `croc`, `thin` | `color`, `tip`, `scale` | `long-up` hocico largo hacia arriba (coatí), con la nariz en `tip`; `blunt` hocico ancho y chato (carpincho); `croc` mandíbula larga de cocodrilo; `thin` hocico tubular (oso hormiguero), con la punta en `tip`. Saca la boca y la nariz |
| `mane` | `full`, `stripe` | `color` | `full` melena alrededor de la cara (león); `stripe` cresta oscura por la nuca y la espalda (aguará guazú, hiena) |
| `spikes` | `spikes`, `fin`, `scutes` | `color`, `scale` | En la espalda: `spikes` púas de dragón; `fin` aleta dorsal (tiburón, delfín); `scutes` placas de reptil |
| `shell` | `dome`, `banded` | `color`, `rim`, `plates`, `scale` | `dome` caparazón de tortuga, con `plates` para las placas y `rim` para el borde; `banded` caparazón en bandas de tatú |
| `band` | — | `color`, `edge` | Franja diagonal sobre el cuerpo, con borde claro en `edge` (oso hormiguero) |
| `whiskers` | — | `color` | Bigotes |
| `mask` | — | `color`, `scale` | Discos claros alrededor de los ojos (búho, mapache) |
| `hood` | `tall` | — | Estira la capucha hacia arriba (aves de cuello largo) |

## Dibujos (`pattern`)

| `type` | Cómo se ve | Campo |
|---|---|---|
| `spots` | Manchas sueltas (jirafa, vaca, dálmata) | `color` |
| `rosettes` | Rosetas, manchas en anillo (yaguareté, leopardo) | `color` |
| `stripes` | Rayas (tigre, cebra) | `color` |

## Ejemplos

Coatí, que ya está en el kit:

```json
{ "hoodColor": "#A0643A", "accentColor": "#4A3426", "bellyColor": "#E8CFAE", "parts": [
  { "type": "ears", "variant": "round", "color": "#A0643A", "inner": "#E8CFAE", "scale": 0.62 },
  { "type": "snout", "variant": "long-up", "color": "#C9A27E", "tip": "#2B2220" },
  { "type": "tail", "variant": "long", "thin": false, "color": "#A0643A", "rings": "#4A3426", "scale": 1.1 } ], "pattern": null }
```

Axolote, escrito con el kit:

```json
{ "hoodColor": "#F7A8C4", "accentColor": "#D9658F", "bellyColor": "#FFE3EC", "parts": [
  { "type": "ears", "variant": "tuft", "color": "#E0567F", "scale": 0.9 },
  { "type": "spikes", "variant": "fin", "color": "#F48FB1", "scale": 0.8 },
  { "type": "tail", "variant": "flat", "color": "#F7A8C4" } ], "pattern": null }
```
