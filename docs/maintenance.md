# Atualização e limites

## Visuais

Os quatro projetos têm a mesma estrutura: título, composição de 1200 × 660, resumo, tecnologias, verificações e links. A ordem de leitura não indica um projeto principal.

O banner, a introdução, os botões e os ícones são locais. A introdução termina sua animação após cinco segundos e respeita `prefers-reduced-motion`.

Para reconstruir as composições com Node.js 24 e npm:

```sh
npm ci
npm run visuals
```

## Indicadores

`scripts/update-activity.mjs` consulta o usuário `duduescudero`. O painel mostra o total de contribuições e os dias ativos nos últimos 12 meses, a quantidade de repositórios públicos próprios e não arquivados, um recorte das últimas 16 semanas e as quatro linguagens com mais bytes de código.

A distribuição considera repositórios públicos próprios e não arquivados; exclui o repositório do perfil para não contar seus SVG. Os percentuais usam todas as linguagens retornadas pelo GitHub Linguist. Medem volume de código, não experiência, tempo investido ou nível de domínio.

O GitHub pode demorar para atualizar os dados. Erros na consulta ou necessidade de paginação interrompem a geração. A data visível usa `America/Sao_Paulo`. Os painéis claro e escuro mostram os mesmos dados.

## Atualização diária

O workflow `profile-activity.yml` executa diariamente às 06h23 de Brasília, por acionamento manual ou quando seu código muda na branch principal. O GitHub pode atrasar o agendamento. O job usa o token temporário do GitHub e salva somente `assets/activity/` no commit automático.

O token do workflow não concede acesso a outros repositórios privados. Nenhum token é incluído no README ou nos dados publicados. A geração que falha mantém os últimos arquivos publicados e sua data de atualização.

A cobrinha tem cores claras e escuras e respeita movimento reduzido. O README também seleciona um calendário estático quando o navegador prefere movimento reduzido, com link permanente para essa alternativa.

Para atualizar e conferir localmente com GitHub CLI autenticado:

```sh
npm run activity
npm run verify
```

As capturas representam versões demonstrativas dos projetos e não são atualizadas diariamente. Os badges vêm das verificações reais de cada repositório. Conferir o resultado no GitHub em desktop e celular após alterar o README.
