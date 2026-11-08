// REMOÇÃO DE QUESTÕES BASEADO NO ASSUNTO COMO TAMBÉM ASSOCIADO AO USUÁRIO
async function deletarBlocoEmCascata() {
  const assuntoAlvo = "Engenharia de Prompts";
  
  const questoes = await db.questoes.find({ "assunto": assuntoAlvo }, { _id: 1 }).toArray();
  const idsQuestoes = questoes.map(q => q._id);

  if (idsQuestoes.length === 0) {
    return "Nenhuma questão encontrada para este assunto.";
  }

  const resultadoUsuarios = await db.questoes_usuarios.deleteMany({ questao_id: { $in: idsQuestoes } });
  const resultadoQuestoes = await db.questoes.deleteMany({ _id: { $in: idsQuestoes } });

  return {
    sucesso: true,
    assunto_removido: assuntoAlvo,
    questoes_deletadas: resultadoQuestoes.deletedCount,
    vinculos_usuarios_deletados: resultadoUsuarios.deletedCount
  };
}

// Executa sem usar top-level await
deletarBlocoEmCascata().then(console.log).catch(console.error);
