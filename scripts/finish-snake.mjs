import { readFile, writeFile } from 'node:fs/promises';
for (const theme of ['dark','light']) {
  const file = `assets/activity/snake-${theme}.svg`;
  let svg = await readFile(file, 'utf8');
  if (!svg.startsWith('<svg') || !svg.includes('</svg>')) throw new Error('Animação SVG inválida.');
  svg = svg.replace(/(<svg\b[^>]*>)/, '$1<title>Contribuições de duduescudero em uma animação de cobrinha</title><style>@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>');
  await writeFile(file, svg);
}
console.log('Animações preparadas com identificação e movimento reduzido.');
