# ¿Qué tan AI First sos?

Un skill para Claude Code que toma un test de 10 preguntas sobre cómo usás la IA para trabajar y te
dice en qué nivel de adopción estás, del 1 al 6: de *Ocasional* a *AI First Multiplayer*. Guarda el
resultado en tu carpeta para que puedas repetirlo al final de un curso y ver cómo cambió, y te arma
una página de perfil con tu nivel, tu recorrido, tus cinco áreas y un compañero de viaje en 3D
disfrazado del animal que elijas. La página se descarga en PDF y funciona sin internet.

## Instalación

```bash
npx skills add pedroromeroluna/ai-first-maturity-test
```

Después, en Claude Code: *"hagamos el test de madurez"*.

## Qué necesita

- Claude Code.
- Node.js, para armar la página de perfil. Sin Node, el resultado igual queda guardado en Markdown.

## Qué deja

- `test-ai-first-<nombre-apellido>-AAAA-MM-DD.md`: tus respuestas, tu nivel y una lectura por área.
- `perfil-ai-first-<nombre-apellido>.html`: tu página de perfil, con el botón para bajarla en PDF.

## Licencia

MIT. Las librerías y fuentes incluidas en `skills/ai-maturity-test/assets/vendor/` mantienen sus
licencias (MIT y SIL OFL 1.1); el detalle está en el README de esa carpeta.
