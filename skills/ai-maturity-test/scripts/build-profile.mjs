#!/usr/bin/env node
// Builds the profile page of one test result: fills assets/profile-template.html with the person's
// data and inlines every library and font, so the page works offline with no CDN.
//
//   node build-profile.mjs --out <file.html> [--data <file.json>] [--open]
//
// Without --data the JSON is read from stdin. The level and the area values are computed here from
// the answer letters, with the same rules as SKILL.md; a level in the JSON that disagrees is reported
// and the computed one wins. Prints one JSON line with what it wrote.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const SKILL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(SKILL_DIR, 'assets');
const VENDOR = join(ASSETS, 'vendor');

// ---------- Arguments ----------
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const outPath = opt('--out');
const dataPath = opt('--data');
const openAfter = args.includes('--open');
if (!outPath) fail('Falta --out <archivo.html>.');

function fail(msg) { process.stderr.write('build-profile: ' + msg + '\n'); process.exit(1); }
const warnings = [];

// ---------- Data ----------
let raw;
try { raw = dataPath ? readFileSync(dataPath, 'utf8') : readFileSync(0, 'utf8'); }
catch (e) { fail('No se pudo leer el JSON: ' + e.message); }
let data;
try { data = JSON.parse(raw); } catch (e) { fail('El JSON no es válido: ' + e.message); }

const name = String(data.name || '').trim().replace(/\s+/g, ' ');
if (!name) fail('Falta "name" (nombre y apellido).');
const date = String(data.date || new Date().toISOString().slice(0, 10));
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail('"date" tiene que ser AAAA-MM-DD.');

const OPTIONS = { P1: 'ABCD', P3: 'ABC', P4: 'ABCD', P5: 'ABCD', P6: 'ABC', P7: 'ABC', P8: 'ABCD', P9: 'ABCD', P10: 'ABCD' };
const ans = {};
for (const q of Object.keys(OPTIONS)) {
  const v = data.answers && data.answers[q];
  const letter = String((v && typeof v === 'object' ? v.letter : v) || '').trim().toUpperCase();
  if (!OPTIONS[q].includes(letter) || letter.length !== 1) fail(`Falta la respuesta de ${q} o no es una de ${OPTIONS[q].split('').join(', ')}.`);
  ans[q] = letter;
}

// ---------- Level (SKILL.md, section "El nivel") ----------
function computeLevel(a) {
  if (!('BCD'.includes(a.P4) && 'CD'.includes(a.P5))) return 1;
  if (a.P5 !== 'D') return 2;
  if (!(a.P6 === 'C' && (a.P7 === 'C' || 'CD'.includes(a.P8)))) return 3;
  if (a.P9 !== 'C') return 4;
  if (a.P10 !== 'C') return 5;
  return 6;
}
const level = computeLevel(ans);
if (data.level != null && +data.level !== level) warnings.push(`El JSON dice nivel ${data.level}, las reglas dan ${level}: se usa ${level}.`);

// ---------- Area values, 0 to 100 (SKILL.md, section "La página de perfil") ----------
const SCORE = {
  P4: { A: 0, B: 35, C: 70, D: 100 }, P5: { A: 0, B: 30, C: 65, D: 100 },
  P6: { A: 0, B: 50, C: 100 }, P7: { A: 0, B: 50, C: 100 }, P8: { A: 0, B: 40, C: 75, D: 100 },
  P9: { A: 0, B: 40, C: 100, D: null }, P10: { A: 0, B: 50, C: 100, D: null },
};
const mean = (xs) => { const v = xs.filter((x) => x != null); return v.length ? Math.round(v.reduce((s, x) => s + x, 0) / v.length) : 0; };
const AREA_KEYS = ['Uso', 'Contexto', 'Automatización', 'Construcción', 'Equipo'];
const values = [
  mean([SCORE.P4[ans.P4], SCORE.P5[ans.P5]]),
  SCORE.P6[ans.P6], SCORE.P7[ans.P7], SCORE.P8[ans.P8],
  mean([SCORE.P9[ans.P9], SCORE.P10[ans.P10]]),
];
const reads = data.reads || {};
const areas = AREA_KEYS.map((k, i) => ({ k, value: values[i], read: typeof reads[k] === 'string' ? reads[k].trim() : '' }));
AREA_KEYS.forEach((k) => { if (!areas.find((a) => a.k === k).read) warnings.push(`Falta la lectura de "${k}": la página usa una genérica.`); });

// ---------- Costume ----------
const template = readFileSync(join(ASSETS, 'profile-template.html'), 'utf8');
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const animal = String(data.animal || '').trim();

// The animals that already have a recipe in the template, read from its KEYWORDS table
const kitAnimals = [];
for (const m of template.matchAll(/\{key:'([a-z]+)', label:'([^']+)', re:(\/.+?\/)\}/g)) {
  const body = m[3].slice(1, -1);
  kitAnimals.push({ key: m[1], label: m[2], re: new RegExp(body) });
}
const tokens = norm(animal).split(/[^a-z0-9]+/).filter(Boolean);
const kitMatch = kitAnimals.find((k) => tokens.some((t) => k.re.test(t)));

const HEX = /^#[0-9a-fA-F]{6}$/;
const KIT = {
  ears: { variants: ['pointy', 'round', 'long', 'big', 'floppy', 'tuft'], fields: ['color', 'inner', 'scale'] },
  horns: { variants: ['dragon', 'small'], fields: ['color', 'tip', 'scale'] },
  wings: { variants: ['bat', 'feather', 'flipper'], fields: ['color', 'scale'] },
  tail: { variants: ['tuft', 'long', 'bushy', 'dragon', 'thick', 'curl', 'flat', 'fish', 'stub'], fields: ['color', 'tip', 'end', 'endColor', 'rings', 'scutes', 'thin', 'scale'] },
  beak: { variants: ['bird', 'toucan', 'duck'], fields: ['color', 'tip', 'scale'] },
  trunk: { variants: ['long', 'short'], fields: ['color', 'scale'] },
  mane: { variants: ['full', 'stripe'], fields: ['color'] },
  spikes: { variants: ['spikes', 'fin', 'scutes'], fields: ['color', 'scale'] },
  shell: { variants: ['dome', 'banded'], fields: ['color', 'rim', 'plates', 'scale'] },
  snout: { variants: ['long-up', 'blunt', 'croc', 'thin'], fields: ['color', 'tip', 'scale'] },
  band: { variants: [], fields: ['color', 'edge'] },
  whiskers: { variants: [], fields: ['color'] },
  mask: { variants: [], fields: ['color', 'scale'] },
  hood: { variants: ['tall'], fields: [] },
};
const COLOR_FIELDS = ['color', 'inner', 'tip', 'endColor', 'rings', 'scutes', 'rim', 'plates', 'edge'];

function validateRecipe(r) {
  const errs = [];
  if (!r || typeof r !== 'object' || Array.isArray(r)) return ['la receta no es un objeto'];
  for (const k of ['hoodColor', 'accentColor', 'bellyColor']) if (!HEX.test(r[k] || '')) errs.push(`${k} tiene que ser un color #RRGGBB`);
  if (r.rimColor != null && !HEX.test(r.rimColor)) errs.push('rimColor tiene que ser un color #RRGGBB');
  if (!Array.isArray(r.parts) || r.parts.length < 1 || r.parts.length > 8) errs.push('parts tiene que tener entre 1 y 8 piezas');
  else r.parts.forEach((p, i) => {
    const spec = KIT[p && p.type];
    if (!spec) { errs.push(`parts[${i}]: el tipo "${p && p.type}" no está en el kit`); return; }
    if (p.variant != null && !spec.variants.includes(p.variant)) errs.push(`parts[${i}] (${p.type}): la variante "${p.variant}" no existe; usá ${spec.variants.join(', ') || 'ninguna'}`);
    for (const k of Object.keys(p)) {
      if (k === 'type' || k === 'variant') continue;
      if (!spec.fields.includes(k)) { errs.push(`parts[${i}] (${p.type}): el campo "${k}" no existe para esta pieza`); continue; }
      if (COLOR_FIELDS.includes(k) && !HEX.test(p[k])) errs.push(`parts[${i}] (${p.type}): ${k} tiene que ser #RRGGBB`);
      if (k === 'scale' && !(typeof p.scale === 'number' && p.scale >= 0.4 && p.scale <= 1.6)) errs.push(`parts[${i}] (${p.type}): scale va de 0.4 a 1.6`);
      if (k === 'thin' && typeof p.thin !== 'boolean') errs.push(`parts[${i}] (${p.type}): thin es true o false`);
      if (k === 'end' && p.end !== 'tuft') errs.push(`parts[${i}] (${p.type}): end solo puede ser "tuft"`);
    }
  });
  if (r.pattern != null) {
    if (typeof r.pattern !== 'object' || !['spots', 'rosettes', 'stripes'].includes(r.pattern.type)) errs.push('pattern es null o {type: spots | rosettes | stripes, color}');
    else if (r.pattern.color != null && !HEX.test(r.pattern.color)) errs.push('pattern.color tiene que ser #RRGGBB');
  }
  return errs;
}

let recipe = null, costume;
if (!animal) costume = 'none';
else if (kitMatch) {
  costume = 'kit:' + kitMatch.key;
  if (data.recipe) warnings.push(`"${animal}" ya tiene receta en el kit (${kitMatch.label}): se usa esa y se ignora la del JSON.`);
} else if (data.recipe) {
  const errs = validateRecipe(data.recipe);
  if (errs.length) { costume = 'fallback'; warnings.push('La receta no pasó la validación, se usa el disfraz de reserva: ' + errs.join('; ')); }
  else { recipe = { ...data.recipe, animal }; costume = 'custom'; }
} else { costume = 'fallback'; warnings.push(`"${animal}" no tiene receta en el kit y el JSON no trae una: se usa el disfraz de reserva.`); }

// ---------- Assemble ----------
const b64 = (file) => readFileSync(join(VENDOR, file)).toString('base64');
const jsUrl = (file) => 'data:text/javascript;base64,' + b64(file);
const fontFaces = [
  ['Bricolage Grotesque', 'bricolage-grotesque-latin.woff2', '200 800'],
  ['Instrument Sans', 'instrument-sans-latin.woff2', '400 700'],
].map(([family, file, weight]) =>
  `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${b64('fonts/' + file)}) format('woff2')}`
).join('\n');
// The addons import 'three' by bare name: the import map resolves it to the inlined build
const importMap = JSON.stringify({ imports: {
  'three': jsUrl('three.module.min.js'),
  'three/addons/controls/OrbitControls.js': jsUrl('OrbitControls.js'),
  'three/addons/environments/RoomEnvironment.js': jsUrl('RoomEnvironment.js'),
} });
const profile = { name, date, level, course: data.course || undefined, animal, recipe, areas, answers: ans };
const safeJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

const placeholders = ['/*__FONT_FACES__*/', '__IMPORTMAP__', '__PROFILE_DATA__', '__H2C_URL__', '__JSPDF_URL__'];
for (const p of placeholders) if (template.split(p).length !== 2) fail(`La plantilla tiene que tener exactamente un ${p}.`);
const html = template
  .replace('/*__FONT_FACES__*/', () => fontFaces)
  .replace('__IMPORTMAP__', () => importMap)
  .replace('__PROFILE_DATA__', () => safeJson(profile))
  .replace('__H2C_URL__', () => jsUrl('html2canvas.min.js'))
  .replace('__JSPDF_URL__', () => jsUrl('jspdf.umd.min.js'));

const out = resolve(outPath);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);

if (openAfter) {
  const [cmd, cmdArgs] = process.platform === 'darwin' ? ['open', [out]]
    : process.platform === 'win32' ? ['cmd', ['/c', 'start', '""', out]]
    : ['xdg-open', [out]];
  try { spawn(cmd, cmdArgs, { detached: true, stdio: 'ignore' }).unref(); }
  catch (e) { warnings.push('No se pudo abrir el navegador: ' + e.message); }
}

process.stdout.write(JSON.stringify({ out, bytes: Buffer.byteLength(html), level, areas: areas.map((a) => [a.k, a.value]), costume, warnings }) + '\n');
