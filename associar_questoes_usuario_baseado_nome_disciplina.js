// 1. Busca todas as questões da disciplina escolhida (sem restringir tópico ou assunto)
const disciplinaAlvo = "Leis Gerais"; // Altere aqui para a disciplina desejada
const usuarioAlvo = "kleberfort89788";

const questoes = db.questoes.find({
   "disciplina": disciplinaAlvo
}).toArray();

// 2. Transforma as questões no formato exigido pela sua coleção 'questoes_usuarios'
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
  print(`Sucesso! ${associacoes.length} questões da disciplina "${disciplinaAlvo}" associadas ao usuário ${usuarioAlvo}.`);
} else {
  print(`Nenhuma questão encontrada para a disciplina "${disciplinaAlvo}".`);
}
