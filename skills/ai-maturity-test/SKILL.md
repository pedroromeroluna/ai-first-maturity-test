---
name: ai-maturity-test
description: Runs the "¿Qué tan AI First sos?" self-assessment with one person, in Spanish — 10 multiple-choice questions, one at a time, asking why they chose each answer about how they work, plus "Si fueras un animal, ¿cuál serías?" — computes their AI adoption level (1 to 6) with fixed rules, writes a short read per area, saves the result as a dated Markdown file in their node, and builds their profile page (level, journey, five areas and a 3D mascot dressed as their animal) as a self-contained HTML that works offline and downloads as PDF. Use it when someone says "hagamos el test", "test de madurez", "qué tan AI First soy" or asks to measure their AI adoption at the start or end of a course.
---

# Test "¿Qué tan AI First sos?"

Conducís un test de 10 preguntas con una persona, en español rioplatense (voseo). El resultado es su
nivel de adopción de IA, del 1 al 6, más una lectura corta por área. Lo guardás en su carpeta para
que pueda repetir el test al final del curso y ver cómo cambió, y le armás su página de perfil, que
descarga en PDF.

## Reglas que no se negocian

- **Una pregunta por vez.** Nunca mostrás dos preguntas juntas ni adelantás las que siguen.
- **P1 y P3 son datos, no se repreguntan.** Su rol y si lidera personas no tienen un porqué:
  registrás la letra y pasás a la siguiente pregunta.
- **En P2 y de P4 a P10, una sola repregunta después de cada respuesta**, en una línea: *"¿Por
  qué elegiste esa? Pensalo en voz alta, en una o dos frases."* Registrás la letra y el motivo con
  sus palabras, sin corregirlo ni resumirlo de más. Si no quiere contestar el porqué, anotás "sin
  motivo" y seguís.
- **No opinás durante el test.** Ni "¡muy bien!" ni "eso es avanzado". Las respuestas no son buenas
  ni malas: el test describe cómo trabaja hoy.
- **El nivel sale de las reglas de abajo, nunca de tu criterio.** El porqué no cambia el nivel:
  alimenta la lectura por área.
- **No inventás comparaciones**: nada de "el promedio de la gente", porcentajes ni benchmarks.
- **La página de perfil se genera con el script del skill, nunca a mano.** No escribís HTML.

## 1. Antes de empezar

Decile esto, con tus palabras y en pocas líneas:

1. Son 10 preguntas y una pregunta final de yapa. Tardan unos 10 minutos.
2. En las preguntas sobre cómo trabaja le vas a preguntar por qué eligió esa respuesta. Lo que
   importa es pensar en voz alta.
3. **El resultado se comparte con el curso.** Que hable de *cómo trabaja*, no de los sistemas, los
   clientes ni las reglas internas de su empresa. Si en un motivo aparece un dato así (un nombre de
   cliente, un sistema interno, un número del negocio), lo anotás de forma genérica ("un sistema
   interno", "un cliente") y se lo decís.

Después preguntale su nombre y apellido. Lo usás tal como lo escribió en el encabezado del archivo, y
en el nombre de los archivos en minúsculas, sin tildes y con guiones ("María José Pérez" →
`maria-jose-perez`).

## 2. Dónde se guarda

Antes de la primera pregunta, ubicá dónde va el resultado:

1. **Si la sesión corre dentro de un brain de AI First OS** (en la carpeta hay `AGENTS.md` y
   `.os/core`, o `.claude/CLAUDE.md` es el contrato de sesión del sistema):
   - Si la sesión ya tiene un foco cargado y es su nodo de la capacitación, ese es el destino.
   - Si no, buscá en `workspaces/` una carpeta cuyo nombre contenga "capacitacion" o "capacitación"
     y preguntale si es esa.
   - Si no la encontrás, preguntale en una línea en qué carpeta está su nodo "Capacitación". No lo
     crees vos.
2. **Si no hay brain**, el destino es la carpeta donde corre la sesión, y se lo decís.

**En un brain, los archivos van en la subcarpeta `research/` del nodo** (`<nodo>/research/`), nunca
en la raíz del nodo: el árbol del brain alcanza `research/` de cualquier nodo creado por el sistema,
y un archivo suelto en la raíz del nodo aparece como "no lo alcanza ningún glob" en el arranque de
la próxima sesión. Si `research/` no existe, la creás. No tocás `.system/tree.md`.

Van dos archivos al destino:

- `test-ai-first-<nombre-apellido>-AAAA-MM-DD.md`, con la fecha de hoy. Si ya existe uno con ese
  nombre, agregale `-2`.
- `perfil-ai-first-<nombre-apellido>.html`, que se pisa si ya existe: la página muestra siempre el
  último resultado.

Mirá si en el destino ya hay otros `test-ai-first-<nombre-apellido>-*.md` de la misma persona
(también en la raíz del nodo, donde los dejaba una versión anterior del skill): el más reciente es
su resultado anterior y lo vas a usar en el paso 5. Los archivos de otras personas en la misma
carpeta no cuentan.

## 3. Las preguntas

Hacelas en este orden. Si tenés una herramienta para preguntar con opciones (por ejemplo
`AskUserQuestion`), usala: una pregunta por llamada, con las opciones como botones. Si no, mostrá
las opciones numeradas y pedile que conteste con el número.

**"Orden mezclado"** quiere decir que mostrás esas opciones en un orden al azar, distinto del de la
lista, para que no se note cuál es la "mejor". Mostralas sin la letra y guardá siempre la **letra
original** de la opción que eligió.

Cada pregunta va con su aclaración, en cursiva, debajo del título.

### Tu trabajo

**P1. ¿Qué hacés hoy?** *Elegí lo más parecido a tu rol.*
- A. Product Manager o Product Owner
- B. Diseño (UX, UI, research)
- C. Desarrollo o liderazgo técnico
- D. Negocio, marketing u operaciones

**P2. Discovery y delivery: ¿cuál te describe mejor?** *Descubrir qué construir no es lo mismo que
construirlo.*
- A. Los distingo y tengo un caso donde los apliqué
- B. Los escuché, pero nunca los apliqué
- C. No tengo clara la diferencia

**P3. ¿Liderás a otras personas?** *En tu trabajo de hoy.*
- A. No
- B. Lidero sin gente a cargo (lead, referente)
- C. Sí, tengo un equipo a cargo

### Tu uso de la IA

**P4. La semana pasada, ¿cuántos días usaste IA para trabajar?** *Lo que pasó, no lo que te
gustaría.*
- A. Ninguno
- B. 1 o 2
- C. 3 o 4
- D. Todos los días hábiles

**P5. La semana pasada, ¿qué hizo la IA en tu trabajo?** *Pensá en la tarea más grande que le
diste.* (orden mezclado)
- A. Nada
- B. Le hice consultas sueltas, como a un buscador
- C. Me ayudó a redactar o resumir, y el resto lo hice yo
- D. Hizo una tarea entera (un análisis, un prototipo, código) y yo la revisé

**P6. Cuando abrís una sesión nueva, ¿qué le tenés que contar a la IA?** *Para que trabaje sobre lo
tuyo.* (orden mezclado)
- A. Todo, cada vez
- B. Le pego un resumen que tengo guardado
- C. Nada: ya tiene mi contexto guardado (archivos, memoria, proyecto) y lo usa sola

**P7. ¿Hay algo que la IA haga sin que vos lo arranques?** *Un resumen semanal, un reporte, una
revisión.* (orden mezclado)
- A. No
- B. Tengo flujos armados, pero los disparo yo
- C. Sí, al menos uno corre solo (programado o cuando pasa algo)

**P8. En el último mes, ¿construiste algo con IA?** *Algo que funcione, no un documento.* (orden
mezclado)
- A. No
- B. Un prototipo para mostrar una idea
- C. Una herramienta que usamos yo o mi equipo
- D. Algo que usan clientes o usuarios reales

### Tu equipo

**P9. Si mañana te vas, ¿qué le queda a tu equipo de lo que armaste con IA?** *Prompts, contexto,
flujos, herramientas.* (orden mezclado)
- A. Nada: está en mi computadora o mi cuenta
- B. Algunos prompts o documentos que compartí
- C. Un espacio compartido (proyecto, repositorio, skills) que el equipo usa sin mí
- D. No trabajo en equipo

**P10. La última decisión importante de tu equipo, ¿cómo la tomaron?** *Una priorización, un cambio
de alcance, un lanzamiento.* (orden mezclado)
- A. Sin IA
- B. Cada uno trajo lo suyo hecho con IA y lo discutimos
- C. La razonamos juntos sobre un material compartido armado con IA y el criterio quedó escrito
- D. No trabajo en equipo

### La pregunta de yapa

Después de P10, y solo entonces:

**Si fueras un animal, ¿cuál serías?** *El que quieras: con ese animal se disfraza tu compañero de
viaje en la página de perfil.*

Es de respuesta libre: no le ofrezcas opciones ni botones, y no le preguntes por qué. No cuenta para
el nivel. Si no quiere elegir, el compañero sale sin disfraz.

## 4. El nivel

Aplicá las reglas en orden. Cada nivel exige haber pasado el anterior: en cuanto una no se cumple,
el nivel es el último alcanzado.

1. Nivel 1 de base.
2. Nivel 2 si P4 es B, C o D, y P5 es C o D.
3. Nivel 3 si además P5 es D.
4. Nivel 4 si además P6 es C, y P7 es C o P8 es C o D.
5. Nivel 5 si además P9 es C.
6. Nivel 6 si además P10 es C.

Dos consecuencias para chequear la cuenta: si P4 es A, el nivel es 1; si P6 no es C, el nivel es 3
como máximo. El script del paso 6 aplica las mismas reglas y avisa si tu cuenta no coincide.

La frase de cada nivel, tal cual:

1. **Ocasional**: usás la IA de vez en cuando, como un buscador.
2. **Modo chat**: la IA te responde y vos hacés el trabajo.
3. **Modo agente**: la IA hace tareas enteras y vos las revisás.
4. **AI First Single Player**: trabajás con tu propio sistema de IA, con contexto guardado y cosas
   que corren solas; si te vas, se va con vos.
5. **AI First Shared-context**: tu equipo comparte el contexto y las herramientas; si te vas, el
   equipo sigue.
6. **AI First Multiplayer**: tu equipo razona junto con IA y el criterio queda en el grupo.

## 5. El resultado

Mostrale el resultado en pantalla y guardalo en el archivo `.md` del paso 2.

**Lectura por área**: una o dos oraciones por área, con lo que eligió y lo que dijo en el porqué.
Describí, no califiques. Si su motivo matiza la opción (por ejemplo, eligió "todos los días" pero
dice que fue una semana atípica), decilo. La misma lectura va a la página de perfil, así que
escribila en segunda persona o impersonal, sin nombres de su empresa.

| Área | Sale de |
|---|---|
| Uso | P4 y P5 |
| Contexto | P6 |
| Automatización | P7 |
| Construcción | P8 |
| Equipo | P9 y P10 |

**Comparación**: si en el paso 2 encontraste un resultado anterior, agregá una sección "Antes y
ahora" con el nivel anterior y el de hoy, y las preguntas que cambiaron de respuesta
(`P6: A → C`), con la fecha de cada uno. Si no hay anterior, decí que este es el punto de partida y
que el test se repite al final del curso.

El archivo tiene este formato:

```markdown
---
date: AAAA-MM-DD
persona: <nombre y apellido>
nivel: <número>
animal: <lo que contestó, o vacío>
---

# Test "¿Qué tan AI First sos?" — <nombre y apellido> — AAAA-MM-DD

**Nivel <número>, <nombre del nivel>.** <frase del nivel>

## Respuestas

| Pregunta | Respuesta | Por qué |
|---|---|---|
| P1. ¿Qué hacés hoy? | A. Product Manager o Product Owner | — |
| P2. Discovery y delivery: ¿cuál te describe mejor? | A. Los distingo y tengo un caso donde los apliqué | <su motivo, con sus palabras> |
| … | … | … |

**Si fueras un animal:** <lo que contestó>

## Lectura por área

- **Uso**: …
- **Contexto**: …
- **Automatización**: …
- **Construcción**: …
- **Equipo**: …

## Antes y ahora

<solo si hay un resultado anterior>
```

## 6. La página de perfil

La página la arma `scripts/build-profile.mjs`, en la carpeta de este skill: llena
`assets/profile-template.html` con los datos de la persona y mete adentro las librerías y las
fuentes, así que funciona sin internet. Necesita Node.js.

**El disfraz.** El kit ya trae receta para estos animales: dragón, gato, búho, zorro, oso, oso
hormiguero, ornitorrinco, elefante, pingüino, tortuga, conejo, tiburón, jirafa, tigre, león, coatí,
yacaré, carpincho, tatú, tucán, yaguareté, aguará guazú, mono carayá, tapir y ñandú, con sus
sinónimos (yurumí, capibara, armadillo, jaguar…). Para esos no escribís nada. **Para cualquier otro
animal escribís una receta nueva** con las piezas del kit, siguiendo `references/costume-kit.md`:
leelo antes de escribirla. Si la receta no pasa la validación del script, la página usa un disfraz
de reserva; leé el aviso, corregí la receta y volvé a correr el script una vez.

Corré el script con los datos por la entrada estándar:

```bash
node "<carpeta de este skill>/scripts/build-profile.mjs" --out "<destino>/perfil-ai-first-<nombre-apellido>.html" --open <<'EOF'
{
  "name": "<nombre y apellido>",
  "date": "AAAA-MM-DD",
  "level": <número>,
  "animal": "<lo que contestó>",
  "answers": { "P1": "A", "P2": "B", "P3": "A", "P4": "D", "P5": "D", "P6": "B", "P7": "A", "P8": "B", "P9": "B", "P10": "B" },
  "reads": { "Uso": "…", "Contexto": "…", "Automatización": "…", "Construcción": "…", "Equipo": "…" },
  "recipe": { … solo si el animal no está en el kit … }
}
EOF
```

- `answers` lleva solo las letras originales. Los motivos no van a la página.
- El script contesta una línea JSON. Si `warnings` no está vacío, leelo: dice qué faltó o qué usó en
  su lugar.
- `--open` abre la página en el navegador. Si no se abre, pasale a la persona la ruta del archivo
  para que lo abra con doble clic.
- Si no hay Node.js, el resultado igual quedó en el `.md`: decíselo y no armes la página a mano.

Los valores de las áreas, del 0 al 100, los calcula el script con esta tabla. No los escribís vos.

| Área | Cuenta |
|---|---|
| Uso | Promedio de P4 (A 0, B 35, C 70, D 100) y P5 (A 0, B 30, C 65, D 100) |
| Contexto | P6: A 0, B 50, C 100 |
| Automatización | P7: A 0, B 50, C 100 |
| Construcción | P8: A 0, B 40, C 75, D 100 |
| Equipo | Promedio de P9 (A 0, B 40, C 100) y P10 (A 0, B 50, C 100); la D no cuenta |

## 7. Al terminar

Decile, en pocas líneas:

1. Dónde quedaron los dos archivos.
2. Que en la página, arriba a la izquierda, está el botón **"Descargar mi perfil en PDF"**: que lo
   toque y suba el PDF a la carpeta de la clase 1 que le compartió el curso. **El PDF es la
   entrega.**

No le recomiendes cursos ni productos.
