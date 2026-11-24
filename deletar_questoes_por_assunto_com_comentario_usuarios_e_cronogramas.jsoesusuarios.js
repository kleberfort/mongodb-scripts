(async () => {
  const assuntoAlvo = "Modelagem Relacional";
  
  const questoes = await db.questoes.find({ assunto: assuntoAlvo }, { _id: 1, id: 1 }).toArray();

  const objectIds = questoes.map(q => q._id);
  const stringIds = questoes.map(q => q._id.toString());
  const numericIds = questoes.map(q => q.id).filter(id => id !== undefined);
  const todosIdsPossiveis = [...objectIds, ...stringIds, ...numericIds];

  // 1. Deleta os comentários associados
  const resComentarios = await db.comentarios_usuarios.deleteMany({ 
    questao_id: { $in: todosIdsPossiveis } 
  });

  // 2. Deleta os vínculos dos usuários
  const resUsuarios = await db.questoes_usuarios.deleteMany({ 
    questao_id: { $in: todosIdsPossiveis } 
  });

  // 3. Remove "Modelagem Relacional" de todos os dias em cronogramas_usuarios
  const resCronogramas = await db.cronogramas_usuarios.updateMany(
    {},
    {
      $pull: {
        "dias.segunda.atividades": { assunto: assuntoAlvo },
        "dias.terca.atividades": { assunto: assuntoAlvo },
        "dias.quarta.atividades": { assunto: assuntoAlvo },
        "dias.quinta.atividades": { assunto: assuntoAlvo },
        "dias.sexta.atividades": { assunto: assuntoAlvo },
        "dias.sabado.atividades": { assunto: assuntoAlvo },
        "dias.domingo.atividades": { assunto: assuntoAlvo }
      }
    }
  );
  
  // 4. Deleta as questões principais
  const resQuestoes = await db.questoes.deleteMany({ 
    _id: { $in: objectIds } 
  });

  printjson({
    sucesso: true,
    assunto_removido: assuntoAlvo,
    questoes_deletadas: resQuestoes.deletedCount,
    vinculos_usuarios_deletados: resUsuarios.deletedCount,
    comentarios_deletados: resComentarios.deletedCount,
    cronogramas_atualizados: resCronogramas.modifiedCount
  });
})();
