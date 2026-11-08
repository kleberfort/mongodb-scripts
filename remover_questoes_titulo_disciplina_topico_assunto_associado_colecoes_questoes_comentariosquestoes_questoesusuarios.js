async function deletarBlocoEmCascata() {
  const assuntoAlvo = "Engenharia de Prompts";
  
  const questoes = await db.questoes.find({ "assunto": assuntoAlvo }, { _id: 1 }).toArray();
  const idsQuestoes = questoes.map(q => q._id);

  if (idsQuestoes.length === 0) {
    return "Nenhuma questão encontrada para este assunto.";
  }

  // 1. Deleta os comentários associados às questões encontradas
  const resultadoComentarios = await db.comentarios_usuarios.deleteMany({ questao_id: { $in: idsQuestoes } });

  // 2. Deleta os vínculos dos usuários
  const resultadoUsuarios = await db.questoes_usuarios.deleteMany({ questao_id: { $in: idsQuestoes } });
  
  // 3. Deleta as questões principais
  const resultadoQuestoes = await db.questoes.deleteMany({ _id: { $in: idsQuestoes } });

  return {
    sucesso: true,
    assunto_removido: assuntoAlvo,
    questoes_deletadas: resultadoQuestoes.deletedCount,
    vinculos_usuarios_deletados: resultadoUsuarios.deletedCount,
    comentarios_deletados: resultadoComentarios.deletedCount // Adicionado ao retorno
  };
}
