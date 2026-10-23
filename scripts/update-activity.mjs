import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const userName = 'duduescudero';
const query = `query { user(login: "${userName}") {
  contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } }
  repositories(first:100, privacy:PUBLIC, ownerAffiliations:OWNER) { pageInfo { hasNextPage } nodes { name isFork isArchived languages(first:20, orderBy:{field:SIZE,direction:DESC}) { edges { size node { name color } } } } }
} }`;
const inputFlag = process.argv.indexOf('--input');
const response = inputFlag >= 0
  ? JSON.parse((await readFile(process.argv[inputFlag + 1], 'utf8')).replace(/^\uFEFF/, ''))
  : JSON.parse(execFileSync('gh', ['api', 'graphql', '-f', `query=${query}`], { encoding:'utf8', maxBuffer:2_000_000 }));
if (response.errors || !response.data?.user) throw new Error('O GitHub não retornou dados válidos para o perfil.');
const user = response.data.user;
if (user.repositories.pageInfo?.hasNextPage) throw new Error('Paginação necessária antes de publicar os indicadores.');
const calendar = user.contributionsCollection.contributionCalendar;
const days = calendar.weeks.flatMap(w => w.contributionDays);
const repos = user.repositories.nodes.filter(r => !r.isFork && !r.isArchived);
const languageBytes = new Map();
for (const repo of repos.filter(r => r.name !== userName)) {
  for (const { size, node } of repo.languages.edges)
    languageBytes.set(node.name, (languageBytes.get(node.name) ?? 0) + size);
}
const languages = [...languageBytes].sort((a, b) => b[1] - a[1]);
const totalBytes = languages.reduce((sum, [, size]) => sum + size, 0);
const activeDays = days.filter(d => d.contributionCount > 0).length;
const updated = new Intl.DateTimeFormat('pt-BR', { timeZone:'America/Sao_Paulo' }).format(new Date());
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const colors = ['#a88ae9','#9272d1','#7355b5','#d3bfff','#6f7ea6'];
await mkdir('assets/activity', { recursive:true });

for (const theme of ['dark', 'light']) {
  const c = theme === 'dark'
    ? { bg:'#0d1117', panel:'#15131f', line:'#342840', text:'#edf2f7', muted:'#b4b8c8', blank:'#1d1a29', levels:['#39274f','#674590','#9870c8','#c6a0f8'] }
    : { bg:'#ffffff', panel:'#f8f5ff', line:'#ded3ed', text:'#262032', muted:'#655d72', blank:'#eee9f5', levels:['#e1d2f6','#bd9fe4','#9269c8','#673daa'] };
  const text = (x, y, value, size=14, fill=c.muted, extra='') => `<text x="${x}" y="${y}" fill="${fill}" font-family="Segoe UI,Arial,sans-serif" font-size="${size}" ${extra}>${esc(value)}</text>`;
  const weeks = calendar.weeks.slice(-16);
  const max = Math.max(1, ...days.map(d => d.contributionCount));
  const cells = weeks.map((week, x) => week.contributionDays.map((d, y) => {
    const level = d.contributionCount === 0 ? -1 : Math.min(3, Math.ceil(d.contributionCount / max * 4) - 1);
    return `<rect x="${34+x*23}" y="${242+y*21}" width="17" height="16" rx="3" fill="${level < 0 ? c.blank : c.levels[level]}"><title>${d.date}: ${d.contributionCount} contribuições</title></rect>`;
  }).join('')).join('');
  const cards = [[calendar.totalContributions,'contribuições · últimos 12 meses'],[activeDays,'dias com contribuição · 12 meses'],[repos.length,'repositórios públicos · próprios']].map(([number, label], i) => `<rect x="${28+i*350}" y="81" width="324" height="98" rx="12" fill="${c.panel}" stroke="${c.line}"/>${text(48+i*350,125,number,33,c.text,'font-weight="650"')}${text(48+i*350,153,label,13)}`).join('');
  const langRows = languages.slice(0,4).map(([name, bytes], i) => {
    const value = totalBytes ? bytes/totalBytes*100 : 0;
    return `${text(532,247+i*34,name,15,c.text)}${text(1026,247+i*34,`${value.toFixed(1).replace('.',',')}%`,14,c.muted,'text-anchor="end"')}<rect x="660" y="${234+i*34}" width="284" height="11" rx="5" fill="${c.blank}"/><rect x="660" y="${234+i*34}" width="${Math.max(0,value/100*284)}" height="11" rx="5" fill="${colors[i]}"/>`;
  }).join('');
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="455" viewBox="0 0 1080 455" role="img"><title>Atividade de ${userName}, atualizada em ${updated}</title><desc>Dados do GitHub. ${calendar.totalContributions} contribuições em 12 meses. Linguagens por bytes em repositórios públicos próprios, ativos, excluindo este README.</desc><rect x="1" y="1" width="1078" height="453" rx="16" fill="${c.bg}" stroke="${c.line}"/>${text(28,39,'ATIVIDADE / EM CONSTRUÇÃO CONTÍNUA',15,c.text,'font-weight="600"')}${text(1051,39,`Atualizado em ${updated}`,12,c.muted,'text-anchor="end"')}${cards}${text(34,216,'Calendário · últimas 16 semanas',15,c.text)}${cells}${text(532,216,'Linguagens por bytes · GitHub Linguist',15,c.text)}${langRows}${text(532,394,'Outras: '+languages.slice(4,8).map(([n])=>n).join(' · '),12)}<path d="M28 419H1052" stroke="${c.line}"/>${text(29,441,'Fonte: GitHub API · Distribuição de código, não nível de domínio.',12)}</svg>`;
  await writeFile(`assets/activity/summary-${theme}.svg`, xml);
}

// Static calendar is also the reduced-motion alternative to the snake.
const cells = calendar.weeks.map((w, x) => w.contributionDays.map((d, y) => `<rect x="${18+x*18}" y="${38+y*18}" width="13" height="13" rx="2" fill="${d.contributionCount ? '#a88ae9' : '#24202e'}"><title>${d.date}: ${d.contributionCount}</title></rect>`).join('')).join('');
await writeFile('assets/activity/calendar-static.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="190" viewBox="0 0 1000 190" role="img"><title>Calendário de contribuições de ${userName}</title><rect width="1000" height="190" rx="12" fill="#0d1117"/><text x="18" y="22" fill="#cdb9ef" font-family="Segoe UI,Arial,sans-serif" font-size="13">CONTRIBUIÇÕES / ÚLTIMOS 12 MESES</text>${cells}<text x="18" y="177" fill="#b4b8c8" font-family="Segoe UI,Arial,sans-serif" font-size="11">${calendar.totalContributions} contribuições · atualizado em ${updated} · fonte: GitHub</text></svg>`);
await writeFile('assets/activity/data.json', JSON.stringify({ updated, totalContributions:calendar.totalContributions, activeDays, publicRepositories:repos.length, languages:languages.map(([name,bytes])=>({name,bytes})) }, null, 2)+'\n');
console.log('Indicadores e calendário gerados a partir dos dados do GitHub.');
