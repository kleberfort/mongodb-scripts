// 1. Defina os critérios de busca (Disciplina e Tópico) e o usuário
const disciplinaAlvo = "Leis Gerais";
const topicoAlvo = "Lei de Acesso à Informação";
const usuarioAlvo = "kleberfort89788";

// Busca todas as questões da disciplina e tópico escolhidos (englobando todos os assuntos)
const questoes = db.questoes.find({
   "disciplina": disciplinaAlvo,
   "topico": topicoAlvo
}).toArray();

// 2. Transforma as questões no formato exigido pela coleção 'questoes_usuarios'
const associacoes = questoes.map(questao => {
  return {
    login_user: usuarioAlvo,
    questao_id: questao._id,
    assunto: questao.assunto,
    disciplina: questao.disciplina,
    topico: questao.topico
  };
});

// 3. Insere em lote na coleção
if (associacoes.length > 0) {
  db.questoes_usuarios.insertMany(associacoes);
  print(`Sucesso! ${associacoes.length} questões do tópico "${topicoAlvo}" (${disciplinaAlvo}) associadas ao usuário ${usuarioAlvo}.`);
} else {
  print(`Nenhuma questão encontrada para o tópico "${topicoAlvo}" na disciplina "${disciplinaAlvo}".`);
}
