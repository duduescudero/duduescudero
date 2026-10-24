import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import sharp from 'sharp';

const readme = await readFile('README.md','utf8');
for (const match of readme.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
  if (!/^https?:/.test(match[1])) await access(match[1].split(/[?#]/)[0]);
}
for (const project of ['fluxo-os','meu-onze','orbita-verde','pokeidle-manager']) {
  const info = await sharp(`assets/projects/${project}.png`).metadata();
  assert.equal(info.width,1200);
  assert.equal(info.height,660);
}
assert.equal((readme.match(/^### /gm) ?? []).length,4,'Os quatro projetos precisam ter a mesma hierarquia.');
assert(!/projeto principal|featured project|eduardo-escudero-09du|duduescuderoo/i.test(readme));
assert(readme.includes('https://www.linkedin.com/in/eduardo-pires-escudero/'));
for (const theme of ['dark','light']) {
  const panel = await readFile(`assets/activity/summary-${theme}.svg`,'utf8');
  const snake = await readFile(`assets/activity/snake-${theme}.svg`,'utf8');
  assert(panel.includes('GitHub Linguist'));
  assert(snake.includes('prefers-reduced-motion'));
}
const data = JSON.parse(await readFile('assets/activity/data.json','utf8'));
assert(Number.isInteger(data.totalContributions) && data.totalContributions >= 0);
assert(data.activeDays <= 366);
assert(data.languages.every(l => l.bytes > 0));
const intro = await readFile('assets/intro.svg','utf8');
assert(intro.includes('prefers-reduced-motion') && !intro.includes('infinite'));
console.log('Verificação concluída: imagens, quatro projetos, referências locais, indicadores e movimento reduzido.');
