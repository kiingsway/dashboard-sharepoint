import React from 'react'
import moment from 'moment'

interface Props {
  chamados: any
  clientes: any
}

export default function Dashboard(props: Props) {

  const contagem = contarTiles(props.chamados);

  const listaTiles = [
    {Title: "Chamados vencidos", Subtitle: "+2 dias sem atualizar", Count: contagem.vencido},
    {Title: "Chamados em aberto", Subtitle: "Status em 'Aberto'", Count: contagem.emAberto},
    {Title: "Chamados sem atribuição", Subtitle: "", Count: contagem.semAtribuido},
  ]

  return (<div className='row'>
    {
      listaTiles.map((tile: any) => (
        <div className="card col-3 p-3 m-2" style={{ "width": "18rem" }}>
          <div className="card-body p-0">
            <h5 className="card-title">{tile.Title}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{tile.Subtitle}</h6>
            <p style={{fontSize: "100px", lineHeight:"100px"}} className="text-end m-0">{tile.Count}</p>
          </div>
        </div>
      ))
    }
    </div>
  )
}

function contarTiles(chamados: any) {

  const chamadosVencidos = chamados.filter((chamado: any) => {
    const duracao = moment.duration(moment().diff(moment(chamado.Modified)));
    const diffDias = parseFloat((Math.round(duracao.asDays() * 100) / 100).toFixed(1));

    return diffDias >= 2
  }).length

  const chamadosEmAberto = chamados.filter((chamado: any) => chamado.StatusDaQuestao === 'Aberto' ).length

  const chamadosSemAtribuido = chamados.filter((chamado: any) => chamado.Atribuida?.Title === undefined ).length

  let contagem = {
    vencido: chamadosVencidos,
    emAberto: chamadosEmAberto,
    semAtribuido: chamadosSemAtribuido
  }
  return contagem
}