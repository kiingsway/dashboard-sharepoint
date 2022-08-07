import React from 'react'
import moment from 'moment'
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardSubTitle, MDBProgress, MDBProgressBar, MDBContainer } from 'mdb-react-ui-kit';
import classNames from 'classnames';
import Grafico from './Grafico';

interface Props {
  chamados: any
  clientes: any
}

export default function Dashboard(props: Props) {

  const contagem = contarTiles(props.chamados);

  const listaTiles = [
    { Title: "Chamados vencidos", Subtitle: "+2 dias úteis sem atualizar", Count: contagem.vencido, Total: props.chamados.length, Progress: true },
    { Title: "Chamados em aberto", Subtitle: "Status em 'Aberto'", Count: contagem.emAberto, Total: props.chamados.length, Progress: true },
    { Title: "Chamados sem atribuição", Subtitle: "", Count: contagem.semAtribuido, Total: props.chamados.length, Progress: true },
    { Title: "Chamados criados hoje", Subtitle: "", Count: contagem.criadosHoje, Total: props.chamados.length, Progress: true },
    { Title: "Clientes com chamados", Subtitle: "Quantidade de clientes que possuem pelo menos um chamado em aberto", Count: contagem.clientesComChamados, Total: props.clientes.length, Progress: true },
  ]

  let atribuidores = props.chamados.map((chamado: any) => chamado.Atribuida?.Title)
  atribuidores = [...new Set(atribuidores)].map((atribuido: any) => {

    const fullName = atribuido ? atribuido : 'Sem atribuição'
    const name = atribuido ? atribuido.split(' ')[0].charAt(0) + '. ' + atribuido.split(' ').filter((nome: any) => nome.length >= 3)[1] : '👤'
    const value = props.chamados.filter((ch: any) => ch.Atribuida?.Title === atribuido).length
    const qtdChamadosAtrasados = props.chamados.filter((ch: any) => ch.Atribuida?.Title === atribuido && ch.diasUteisSemAtualizar >= 2).length;
    const qtdChamadosNaoAtrasados = props.chamados.filter((ch: any) => ch.Atribuida?.Title === atribuido && ch.diasUteisSemAtualizar < 2).length;

    return { name: name, value: value, fullName: fullName, qtdChamadosAtrasados: qtdChamadosAtrasados, qtdChamadosNaoAtrasados: qtdChamadosNaoAtrasados }
  });

  function sortNumberDesc(a: any, b: any) {
    if (a.value < b.value) {
      return 1;
    }
    if (a.value > b.value) {
      return -1;
    }
    return 0;
  }

  atribuidores.sort(sortNumberDesc);

  let clientesUnicos = [...new Set(props.chamados.map((ch: any) => ch.Cliente))];
  clientesUnicos = clientesUnicos.map((cliente: any) => {

    const name = cliente === 'Sturzenegger e Cavalcante' ? 'SCADV' : cliente
    const value = props.chamados.filter((chamado: any) => chamado.Cliente === cliente).length

    return { name: name, value: value }
  })
  clientesUnicos.sort(sortNumberDesc)

  return (

    <MDBContainer breakpoint='xxl'>

      <MDBRow className='row-cols-12 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 g-4'>
        {listaTiles.map((tile: any) => (

          <MDBCol size={3} key={tile.Title}>
            <MDBCard className='h-100'>
              <MDBCardBody>
                <MDBCardTitle>{tile.Title}</MDBCardTitle>
                <MDBCardSubTitle
                  className={classNames('text-muted fw-bold', { invisible: !Boolean(tile.Subtitle) })}>
                  {tile.Subtitle ? tile.Subtitle : '.'}
                </MDBCardSubTitle>
                <MDBCardText>
                  <span className='' style={{ fontSize: "100px", lineHeight: "100px" }}>{tile.Count}</span>
                </MDBCardText>
                <MDBProgress height='18' className={tile.Count > 0 && tile.Progress ? '' : 'invisible'}>
                  <MDBProgressBar className='dashprogress' width={(tile.Count / tile.Total) * 100} valuemin={0} valuemax={tile.Total} >
                    {Math.floor((tile.Count / tile.Total) * 100)}% ({tile.Count}/{tile.Total})
                  </MDBProgressBar>
                </MDBProgress>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>

      {/* Contagem de atribuições */}
      <MDBRow className='mt-4'>
        <MDBCol size={12}>
          <MDBCard style={{ height: '310px' }}>
            <MDBCardBody>
              <MDBCardTitle>Contagem de atribuições</MDBCardTitle>
              <MDBCardText style={{ height: '250px' }}>
                <Grafico
                  bar1={{id: 'qtdChamadosAtrasados', title:'Chamados atrasados'}}
                  bar2={{id: 'qtdChamadosNaoAtrasados', title:'Chamados atualizados'}}
                  dados={atribuidores}
                />

              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Contagem de atribuições */}
      <MDBRow className='mt-4'>
        <MDBCol size={12}>
          <MDBCard style={{ height: '310px' }}>
            <MDBCardBody>
              <MDBCardTitle>Chamados por cliente</MDBCardTitle>
              <MDBCardText style={{ height: '250px' }}>
                <Grafico
                  bar1={{id: 'value', title: 'Chamados'}}
                  dados={clientesUnicos}
                />

              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>


    </MDBContainer>
  )

}

function contarTiles(chamados: any) {

  const chamadosVencidos = chamados.filter((chamado: any) => chamado.diasUteisSemAtualizar >= 2).length

  const chamadosEmAberto = chamados.filter((chamado: any) => chamado.StatusDaQuestao === 'Aberto').length

  const chamadosSemAtribuido = chamados.filter((chamado: any) => chamado.Atribuida?.Title === undefined).length

  const chamadosCriadosHoje = chamados.filter((chamado: any) => moment(chamado.Created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')).length

  const clientesComChamados = [...new Set(chamados.map((chamado: any) => chamado.Cliente))].length

  let contagem = {
    vencido: chamadosVencidos,
    emAberto: chamadosEmAberto,
    semAtribuido: chamadosSemAtribuido,
    criadosHoje: chamadosCriadosHoje,
    clientesComChamados: clientesComChamados
  }
  return contagem
}
