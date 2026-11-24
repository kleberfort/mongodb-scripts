// ------ ATRIBUIR BLOCO DE QUESTÕES PARA UM USUÁRIO ESPECÍFICO ---------

const usuarioAlvo = "kleberfort89788";

// 1. Busca todas as questões com a ramificação específica
const questoes = db.questoes.find({
  disciplina: "Direito Administrativo",
  topico: "Princípios da Administração Pública",
  assunto: "Princípios Básicos"
}).toArray();

// 2. Verifica quais dessas questões o usuário JÁ possui para evitar duplicatas
const idsQuestoes = questoes.map(q => q._id);
const jaAssociadas = db.questoes_usuarios.find({
  login_user: usuarioAlvo,
  questao_id: { $in: idsQuestoes }
}, { questao_id: 1 }).toArray();

const idsJaAssociados = new Set(jaAssociadas.map(item => item.questao_id.toString()));

// 3. Filtra apenas as questões novas e monta o formato da coleção 'questoes_usuarios'
const associacoes = questoes
  .filter(questao => !idsJaAssociados.has(questao._id.toString()))
  .map(questao => {
    return {
      login_user: usuarioAlvo,
      questao_id: questao._id,
      assunto: questao.assunto,
      disciplina: questao.disciplina,
      topico: questao.topico
    };
  });

// 4. Insere em lote na coleção
if (associacoes.length > 0) {
  db.questoes_usuarios.insertMany(associacoes);
  print(`Sucesso! ${associacoes.length} novas questões associadas ao usuário ${usuarioAlvo}.`);
} else {
  print("Nenhuma questão nova para associar (ou nenhuma questão encontrada com esses critérios).");
}

