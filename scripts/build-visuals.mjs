import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const svg = (width, height, content, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img"><title>${label}</title>${content}</svg>`;
const font = 'Segoe UI,Arial,sans-serif';
const mono = 'Consolas,monospace';
const defs = `<defs><radialGradient id="glow"><stop stop-color="#422b66" stop-opacity=".7"/><stop offset="1" stop-color="#0b0d12" stop-opacity="0"/></radialGradient><linearGradient id="panel" x2="1" y2="1"><stop stop-color="#291e3e"/><stop offset="1" stop-color="#110f1b"/></linearGradient></defs>`;
await mkdir('assets/projects', { recursive: true });
await mkdir('assets/buttons', { recursive: true });
await mkdir('.local', { recursive: true });

const banner = svg(1200, 300, `${defs}
  <rect x="1" y="1" width="1198" height="298" rx="20" fill="#0b0d12" stroke="#332944"/>
  <ellipse cx="1000" cy="150" rx="250" ry="180" fill="url(#glow)"/>
  <g fill="none" stroke="#b69cff" stroke-opacity=".22"><circle cx="1010" cy="150" r="115"/><ellipse cx="1010" cy="150" rx="156" ry="59" transform="rotate(-30 1010 150)"/></g>
  <circle cx="48" cy="42" r="3" fill="#b69cff"/>
  <text x="60" y="47" fill="#b8c1d0" font-family="${mono}" font-size="11" letter-spacing="2.4">DESENVOLVEDOR EM FORMAÇÃO</text>
  <text x="43" y="129" fill="#edf2f7" font-family="${font}" font-size="61" font-weight="700" letter-spacing="-2.5">Eduardo Escudero<tspan fill="#b69cff">.</tspan></text>
  <text x="47" y="178" fill="#c8b7f2" font-family="${font}" font-size="26">Ideias ganham forma. Código faz acontecer.</text>
  <text x="48" y="221" fill="#aab5c5" font-family="${font}" font-size="17">Engenharia de Software · FIAP</text>
  <path d="M48 253H1152" stroke="#2d253b"/>
  <text x="49" y="278" fill="#aab5c5" font-family="${mono}" font-size="10" letter-spacing="1.6">INTERFACES / BACKEND / PROJETOS</text>
  <g transform="translate(927 65) rotate(-9 83 83)"><rect width="166" height="166" rx="31" fill="url(#panel)" stroke="#b69cff60"/><text x="79" y="113" text-anchor="middle" fill="#b69cff" font-family="${font}" font-size="91" font-weight="700" letter-spacing="-9">ee<tspan fill="#e0d1ff">.</tspan></text></g>`, 'Eduardo Escudero — Engenharia de Software na FIAP');
await writeFile('assets/banner.svg', banner);

await writeFile('assets/intro.svg', svg(600, 64, `<style>
  text{font:23px ${mono};fill:#a88ae9;text-anchor:middle}
  .a,.b{opacity:0}.c{opacity:1}
  .a{animation:one 5s both}.b{animation:two 5s both}.c{animation:three 5s both}
  @keyframes one{0%,25%{opacity:1}32%,100%{opacity:0}}
  @keyframes two{0%,30%{opacity:0}38%,61%{opacity:1}69%,100%{opacity:0}}
  @keyframes three{0%,65%{opacity:0}76%,100%{opacity:1}}
  @media(prefers-reduced-motion:reduce){.a,.b{animation:none;opacity:0}.c{animation:none;opacity:1}}
  </style><text class="a" x="300" y="40">Interfaces que conectam ideias.</text><text class="b" x="300" y="40">APIs, dados e aplicações completas.</text><text class="c" x="300" y="40">Aprender. Construir. Evoluir.</text>`, 'Interfaces, APIs e dados. Aprender. Construir. Evoluir.'));

const buttons = [
  ['portfolio', 'PORTFÓLIO', 160, '<circle cx="22" cy="22" r="8"/><path d="M14 22h16M22 14c-5 5-5 11 0 16M22 14c5 5 5 11 0 16"/>'],
  ['linkedin', 'LINKEDIN', 155, '<g stroke="none"><rect x="13" y="13" width="18" height="18" rx="2" fill="#ccb7ff"/><g fill="#21182f"><circle cx="17.5" cy="17.5" r="1.25"/><path d="M16.4 20h2.2v8h-2.2zM21 20h2.2v1.1c1-1.8 5-1.8 5 2V28H26v-4.7c0-1.8-2.8-1.8-2.8 0V28H21z"/></g></g>'],
  ['email', 'E-MAIL', 140, '<rect x="13" y="16" width="18" height="13" rx="2"/><path d="m14 17 8 6 8-6"/>'],
  ['repositories', 'REPOSITÓRIOS', 190, '<path d="m17 16-6 6 6 6m10-12 6 6-6 6m-4-15-4 18"/>'],
];
for (const [name, label, width, icon] of buttons) {
  await writeFile(`assets/buttons/${name}.svg`, svg(width, 44, `<rect x="1" y="1" width="${width - 2}" height="42" rx="8" fill="#21182f" stroke="#8564ba"/><g fill="none" stroke="#ccb7ff" stroke-width="1.6">${icon}</g><text x="45" y="27" fill="#eee5ff" font-family="${font}" font-size="12" font-weight="600" letter-spacing="1">${label}</text>`, label));
}

const screenshot = async (name) => `data:image/png;base64,${(await sharp(await readFile(`assets/screens/${name}.webp`)).png().toBuffer()).toString('base64')}`;
const projects = [
  { id:'fluxo-os', title:'Fluxo OS', tag:'APLICAÇÃO WEB', caption:'DO PRIMEIRO ATENDIMENTO À ENTREGA.', screen:'fluxo' },
  { id:'meu-onze', title:'Meu Onze', tag:'FUTEBOL INTERATIVO', caption:'SEU TIME. SUAS ESCOLHAS.', screen:'meu-onze' },
  { id:'orbita-verde', title:'OrbitaVerde', tag:'PROJETO ACADÊMICO · FIAP', caption:'QUATRO MÓDULOS. UM TEMA.', screen:'orbita-mobile' },
  { id:'pokeidle-manager', title:'PokeIdle Manager', tag:'DESKTOP &amp; EVENTOS', caption:'UM HOBBY. UM DESAFIO DE ENGENHARIA.', screen:'pokeidle' },
];
for (const p of projects) {
  let content = `${defs}<rect x="1" y="1" width="1198" height="658" rx="20" fill="#11101a" stroke="#47345e"/><ellipse cx="600" cy="440" rx="650" ry="460" fill="url(#glow)"/>
  <circle cx="43" cy="37" r="3" fill="#b69cff"/><text x="57" y="42" fill="#bba9d9" font-family="${mono}" font-size="11" letter-spacing="2">${p.tag}</text>
  <text x="1156" y="42" text-anchor="end" fill="#c7b2ee" font-family="${font}" font-size="20" font-weight="600">${p.title}</text>`;
  if (p.id === 'orbita-verde') {
    content += `<text x="70" y="200" fill="#edf2f7" font-family="${font}" font-size="53" font-weight="700" letter-spacing="-2">orbita<tspan fill="#a8df77">verde</tspan></text><text x="72" y="238" fill="#b7a9ca" font-family="${font}" font-size="19">APIs · Mobile · Visão computacional</text>
    <rect x="69" y="272" width="253" height="300" rx="14" fill="#080b0b" stroke="#635573"/>
    <clipPath id="vision"><rect x="77" y="280" width="237" height="284" rx="10"/></clipPath><image href="${await screenshot('orbita-vision')}" x="77" y="235" width="237" height="422" clip-path="url(#vision)"/>
    <g transform="translate(736 90) rotate(7 115 255)"><rect x="-8" y="-8" width="250" height="522" rx="28" fill="#06080a" stroke="#726080"/><clipPath id="phone"><rect width="234" height="506" rx="20"/></clipPath><image href="${await screenshot(p.screen)}" width="234" height="506" clip-path="url(#phone)"/></g>`;
  } else {
    const imageHeight = p.screen === 'fluxo' ? 1050 : p.screen === 'meu-onze' ? 1225 : 897;
    content += `<rect x="60" y="85" width="1080" height="514" rx="12" fill="#0a0c11" stroke="#70617f"/>
    <path d="M60 119h1080" stroke="#70617f"/><g fill="#a696bf"><circle cx="80" cy="102" r="3"/><circle cx="93" cy="102" r="3"/><circle cx="106" cy="102" r="3"/></g>
    <text x="600" y="106" text-anchor="middle" fill="#b7a9ca" font-family="${mono}" font-size="10">${p.title} · captura real com dados de demonstração</text>
    <clipPath id="window"><rect x="61" y="120" width="1078" height="478"/></clipPath><image href="${await screenshot(p.screen)}" x="60" y="120" width="1080" height="${imageHeight}" preserveAspectRatio="xMinYMin meet" clip-path="url(#window)"/>`;
  }
  content += `<text x="600" y="635" text-anchor="middle" fill="#bba9d9" font-family="${mono}" font-size="11" letter-spacing="2">${p.caption}</text>`;
  const image = svg(1200, 660, content, `${p.title} — captura real da aplicação em composição roxa`);
  await writeFile(`.local/${p.id}.svg`, image);
  await sharp(Buffer.from(image)).png({ compressionLevel:9 }).toFile(`assets/projects/${p.id}.png`);
}
console.log('Banner, introdução, botões e quatro apresentações gerados.');
