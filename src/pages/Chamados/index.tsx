import React from 'react'
import MenuSuperior from './MenuSuperior'

export default function Chamados(props: any) {
  const chamados = [
    {
      Id: 1,
      Cliente: "AAA",
      Title: "AAA",
      StatusDaQuestao: "AAA",
      Atribuidoa: "AAA",
      Descricao: "AAA",
      Modified: "AAA",
    }
  ]
  return (
    <div className="container mt-4">
      <MenuSuperior/>

    
    <table className="table table-dark" style={{width: "100%"}}>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Cliente</th>
          <th scope="col">Título</th>
          <th scope="col">Status</th>
          <th scope="col">Atribuído a</th>
          <th scope="col">Descrição</th>
          <th scope="col">Modificado</th>
        </tr>
      </thead>
      <tbody>
        {
            chamados.map((chamado: any) => (
              <tr>
                <th scope="row">{chamado.Id}</th>
                <td>{chamado.Cliente}</td>
                <td>{chamado.Title}</td>
                <td>{chamado.StatusDaQuestao}</td>
                <td>{chamado.Atribuidoa}</td>
                <td>{chamado.Descricao}</td>
                <td>{chamado.Modified}</td>
              </tr>
          ))
        }
      </tbody>
    </table>
    </div>
  )
}
