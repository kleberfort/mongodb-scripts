# PROMPT — CONVERSÃO DE QUESTÕES DE CONCURSOS PARA JSON

## 1. Objetivo

Converta questões fornecidas em PDF, imagens ou texto para JSON compatível com MongoDB e com um bot do Telegram.

Analise somente as páginas ou questões indicadas pelo usuário. Preserve o conteúdo original e produza explicações didáticas adequadas a alunos iniciantes.

## 2. Identificação e numeração

Cada questão deve receber um campo `id` numérico, iniciado em `1` e incrementado em uma unidade.

- Primeira questão: `"id": 1`.
- Segunda questão: `"id": 2`.
- Terceira questão: `"id": 3`.

Respeite a ordem das questões na fonte. Não repita IDs dentro do mesmo conjunto. Se o usuário fornecer um ID inicial ou uma sequência existente, continue a partir dela.

O campo `enunciado` deve começar com a identificação da prova em uma linha, seguida de uma quebra de linha e do texto original:

`(BANCA/ÓRGÃO/CARGO OU ESPECIALIDADE/ANO)\nTexto da questão`

Utilize somente informações disponíveis na fonte. Não invente dados de identificação nem altere o conteúdo original.

## 3. Identificação do formato da questão

Identifique cada questão como múltipla escolha ou Certo/Errado.

**Múltipla escolha**
- Preserve todas as alternativas originais em um objeto JSON, utilizando suas letras como chaves.
- Em `resposta`, informe somente a letra do gabarito.
- Em `analise_alternativas`, justifique individualmente todas as alternativas.

**Certo/Errado**
- Mantenha a afirmação original no campo `enunciado`.
- Utilize obrigatoriamente `"alternativas": {"A": "Certo.", "B": "Errado."}`.
- Em `resposta`, utilize `"A"` para afirmação correta e `"B"` para afirmação errada.
- Em `analise_alternativas`, inclua as duas opções, indicando qual corresponde ao gabarito e justificando o julgamento.

Não crie alternativas adicionais nem transforme uma questão de um formato em outro, exceto pela representação padronizada de Certo/Errado.

## 4. Comentário e análise didática

### `comentario`

Escolha a abordagem didática mais adequada à disciplina, ao assunto e à dificuldade da questão. Utilize, quando necessário, explicação conceitual, decomposição do raciocínio, resolução passo a passo, comparação, regra e exceção, análise textual, exemplo prático ou explicação técnica.

Explique o conceito e o raciocínio necessários para compreender a resposta, com linguagem simples e objetiva.

**Formatação para leitura no Telegram:**
- Organize o texto em parágrafos curtos, separados por quebras de linha (`\n\n`).
- Separe as etapas de raciocínio, os exemplos e as conclusões quando isso facilitar a leitura.
- Evite blocos longos de texto, frases excessivamente extensas e repetições.
- Utilize listas numeradas ou marcadores quando ajudarem a organizar explicações mais complexas.
- Destaque a conclusão ou uma dica de memorização no final, quando pertinente.

Limite: **1.200 caracteres, incluindo espaços**.

## 5. Análise das alternativas

O campo `analise_alternativas` deve conter uma entrada para cada chave de `alternativas`, utilizando esta estrutura:

- `status`: `"correta"` ou `"incorreta"`.
- `comentario`: justificativa objetiva da classificação.

Regras:
- Em múltipla escolha, analise todas as alternativas originais.
- Em Certo/Errado, analise obrigatoriamente `"A"` e `"B"`.
- A análise deve ser coerente com o campo `resposta`.
- Não omita alternativas nem apresente justificativas contraditórias.

## 6. Fixação

O campo `fixacao` deve apresentar uma regra, fórmula, associação ou frase curta que facilite a memorização do conteúdo.

Evite repetir integralmente o comentário.

## 7. Configuração de imagem no Telegram

A inclusão de `telegram_config` depende exclusivamente da necessidade de imagem para resolver a questão, e não do formato da questão.

Existem duas possibilidades:

**Com imagem:**

Inclua `telegram_config` quando a resolução depender de elementos visuais, como gráficos, tabelas, diagramas, mapas, figuras geométricas, modelos de dados ou imagens que contenham informações indispensáveis.

Utilize esta estrutura:


"telegram_config": {
  "parse_mode": "MarkdownV2",
  "possui_imagem": true,
  "imagem_url": "URL_FORNECIDA_PELO_USUARIO"
}

**Sem imagem:**

Quando a questão puder ser resolvida integralmente pelo enunciado e pelas alternativas, omita completamente o campo `telegram_config`.

Regras adicionais:
- Aplique essa decisão tanto às questões de múltipla escolha quanto às de Certo/Errado.
- A simples presença de uma imagem no PDF não significa que ela seja necessária.
- Preserve a URL fornecida pelo usuário, sem inventar ou modificar o endereço.
- Se a imagem for indispensável, mas não houver URL disponível, informe a pendência fora do JSON.
- Nunca inclua `telegram_config` com `possui_imagem: false` ou `imagem_url` vazio.

## 8. Estrutura JSON obrigatória

Cada questão deve apresentar os campos nesta ordem:

1. `id` — número inteiro.
2. `disciplina` — string.
3. `topico` — string.
4. `assunto` — string.
5. `enunciado` — string.
6. `alternativas` — objeto.
7. `resposta` — string.
8. `comentario` — string.
9. `analise_alternativas` — objeto.
10. `fixacao` — string.
11. `criado_em` — string no formato ISO 8601 UTC.

**Campo condicional:** `telegram_config` deve aparecer após `assunto` e antes de `enunciado`, exclusivamente quando a imagem for necessária para resolver a questão.

O campo `criado_em` deve utilizar a data e hora atuais em UTC, salvo orientação diferente do usuário.

Exemplo: `"2026-10-31T21:00:00Z"`.

## 9. Modelos de saída

A saída deve respeitar os seguintes quatro cenários:

**Cenário 1 — Múltipla escolha com imagem**

Inclua as alternativas originais e o campo `telegram_config` com a URL da imagem necessária.

**Cenário 2 — Múltipla escolha sem imagem**

Inclua as alternativas originais e omita completamente `telegram_config`.

**Cenário 3 — Certo/Errado com imagem**

Utilize `"alternativas": {"A": "Certo.", "B": "Errado."}`, aplique a convenção de resposta e inclua `telegram_config` com a URL da imagem necessária.

**Cenário 4 — Certo/Errado sem imagem**

Utilize `"alternativas": {"A": "Certo.", "B": "Errado."}`, aplique a convenção de resposta e omita completamente `telegram_config`.

Em todos os cenários, preserve os demais campos e sua ordem conforme a estrutura obrigatória.

## 10. Validação e saída

Antes de entregar o resultado, verifique:

- O JSON é válido e contém todos os campos obrigatórios.
- Os IDs são numéricos e sequenciais, começando em `1`, salvo orientação diferente.
- O formato da questão foi identificado corretamente.
- As alternativas correspondem ao formato original.
- O gabarito está correto e utiliza a chave correspondente.
- `analise_alternativas` contempla todas as opções.
- `comentario` respeita o limite de 1.200 caracteres.
- `telegram_config` aparece somente quando a imagem é indispensável.
- A URL da imagem corresponde à questão e foi fornecida pelo usuário.
- Não existem informações, gabaritos ou links inventados.

Retorne sempre um array JSON, mesmo quando houver apenas uma questão.

Quando todas as informações estiverem disponíveis, entregue somente o JSON, sem títulos, explicações ou blocos Markdown.

Se faltar informação indispensável, como gabarito não confirmado ou imagem necessária sem URL, informe a pendência fora do JSON, sem inventar dados. faça para às questões das páginas 55 à 65. Disciplina: Direito Administrativo tópico: Princípios da Administração Pública assunto: Princípios Básicos


