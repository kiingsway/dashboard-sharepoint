import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardSubTitle, MDBProgress, MDBProgressBar, MDBContainer, MDBBtn } from 'mdb-react-ui-kit';
import classNames from 'classnames';
import Grafico from './Grafico';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalChamados from './ModalChamados';
import { IChamado, ICliente } from 'interfaces'

interface Props {
  chamados: IChamado[]
  clientes: ICliente[]
}

interface IFiltrosChamados {

  vencido?: object[]
  emAberto?: object[]
  semAtribuido?: object[]
  criadosHoje?: object[]
  clientesComChamados?: object[]
  abertos30dias?: object[]
  pendentesValidacao?: object[]
  abertos15dias?: object[]

}

interface ITilesObject {
  Title: string;
  Subtitle?: string;
  Count: number | undefined;
  Total: any;
  Progress: boolean;
  Values: object[] | undefined;
}

export default function Dashboard(props: Props) {

  const [filtrosChamados, setFiltrosChamados] = useState<IFiltrosChamados>()
  const [tileSelecionada, setTileSelecionada] = useState();
  const [modalChamados, setModalChamados] = useState(false);
  const toggleModalChamados = (tile: any) => {
    setTileSelecionada(tile);
    setModalChamados(!modalChamados)
  };

  function sortNumberDesc(a: any, b: any) {
    if (a.value < b.value) {
      return 1;
    }
    if (a.value > b.value) {
      return -1;
    }
    return 0;
  }

  let clientesUnicos = [...new Set(props.chamados.map((ch: any) => ch.Cliente.Title))];
  clientesUnicos = clientesUnicos.map((cliente: any) => {

    const name = cliente === 'Sturzenegger e Cavalcante' ? 'SCADV' : cliente
    const value = props.chamados.filter((chamado: IChamado) => chamado.Cliente.Title === cliente).length

    return { name: name, value: value }
  })
  clientesUnicos.sort(sortNumberDesc)

  useEffect(() => {

    const chamadosVencidos = props.chamados.filter((chamado: IChamado) => chamado.diasUteisSemAtualizar >= 2)

    const chamadosEmAberto = props.chamados.filter((chamado: IChamado) => chamado.StatusDaQuestao === 'Aberto')

    const chamadosSemAtribuido = props.chamados.filter((chamado: IChamado) => chamado.Atribuida?.Title === undefined)

    const chamadosCriadosHoje = props.chamados.filter((chamado: IChamado) => moment(chamado.Created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'))

    const clientesComChamados = clientesUnicos;

    const abertos30dias = props.chamados.filter((ch: any) => moment().diff(moment(ch.Created), 'days') >= 30)
    
    const abertos15dias = props.chamados.filter((ch: any) => moment().diff(moment(ch.Created), 'days') >= 15 && moment().diff(moment(ch.Created), 'days') < 30)

    const pendentesValidacao = props.chamados.filter((chamado: IChamado) => chamado.StatusDaQuestao?.toLowerCase().includes('validação'))

    setFiltrosChamados({
      vencido: chamadosVencidos,
      emAberto: chamadosEmAberto,
      semAtribuido: chamadosSemAtribuido,
      criadosHoje: chamadosCriadosHoje,
      clientesComChamados: clientesComChamados as object[],
      abertos30dias: abertos30dias,
      pendentesValidacao: pendentesValidacao,
      abertos15dias: abertos15dias
    });

  }, [props.chamados])



  const listaTiles: ITilesObject[] = [
    { Title: "Chamados vencidos", Subtitle: "+2 dias úteis sem atualizar", Count: filtrosChamados?.vencido?.length, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.vencido },
    { Title: "Chamados em aberto", Subtitle: "Status em 'Aberto'", Count: filtrosChamados?.emAberto?.length, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.emAberto },
    { Title: "Chamados sem atribuição", Subtitle: "", Count: filtrosChamados?.semAtribuido?.length, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.semAtribuido },
    { Title: "Chamados criados hoje", Subtitle: "", Count: filtrosChamados?.criadosHoje?.length, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.criadosHoje },
    { Title: "Clientes com chamados", Subtitle: "Quantidade de clientes que possuem pelo menos um chamado em aberto", Count: filtrosChamados?.clientesComChamados?.length, Total: props.clientes.length, Progress: true, Values: filtrosChamados?.clientesComChamados },
    { Title: "Chamados criados entre 15 e 30 dias", Subtitle: "", Count: filtrosChamados?.abertos15dias?.length, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.abertos15dias },
    { Title: "Chamados criados há mais de 30 dias", Subtitle: "", Count: filtrosChamados?.abertos30dias?.length, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.abertos30dias },
    { Title: 'Chamados pendentes de validação', Count: filtrosChamados?.pendentesValidacao?.length, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.pendentesValidacao }
  ]

  let atribuidores: any = props.chamados.map((chamado: IChamado) => chamado.Atribuida?.Title)

  atribuidores = [...new Set(atribuidores)].map((atribuido: any) => {

    const fullName = atribuido ? atribuido : 'Sem atribuição'
    const name = atribuido ? atribuido.split(' ')[0].charAt(0) + '. ' + atribuido.split(' ').filter((nome: any) => nome.length >= 3)[1] : '👤'
    const value = props.chamados.filter((ch: any) => ch.Atribuida?.Title === atribuido).length
    const qtdChamadosAtrasados = props.chamados.filter((ch: any) => ch.Atribuida?.Title === atribuido && ch.diasUteisSemAtualizar >= 2).length;
    const qtdChamadosNaoAtrasados = props.chamados.filter((ch: any) => ch.Atribuida?.Title === atribuido && ch.diasUteisSemAtualizar < 2).length;

    return { name: name, value: value, fullName: fullName, qtdChamadosAtrasados: qtdChamadosAtrasados, qtdChamadosNaoAtrasados: qtdChamadosNaoAtrasados }
  });


  atribuidores.sort(sortNumberDesc);

  return (

    <MDBContainer breakpoint='xxl'>

      <ModalChamados
        modalChamados={modalChamados}
        setModalChamados={setModalChamados}
        toggleModalChamados={toggleModalChamados}
        chamadosFiltrados={[{ 'Id': 1 }]}
        setSelecionarChamado={null}
        tileSelecionada={tileSelecionada}
      />

      <MDBRow className='row-cols-12 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 g-4'>
        {listaTiles.map((tile: any) => (

          <MDBCol size={3} key={tile.Title}>
            <MDBCard className='h-100'>
              <MDBCardBody>
                <MDBCardTitle>
                  {tile.Title}

                  {
                    tile.Values?.length >= 1 ?
                      <>
                        <MDBBtn className='ms-2 shadow-0 border-0' size='sm' color='secondary' outline title='Ver os itens' onClick={() => (toggleModalChamados(tile))}>
                          <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </MDBBtn>
                      </>
                      : <></>
                  }
              </MDBCardTitle>
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

      {/* Contagem de atribuições */ }
  <MDBRow className='mt-4'>
    <MDBCol size={12}>
      <MDBCard style={{ height: '310px' }}>
        <MDBCardBody>
          <MDBCardTitle>Contagem de atribuições</MDBCardTitle>
          <MDBCardText style={{ height: '250px' }}>
            <Grafico
              bar1={{ id: 'qtdChamadosNaoAtrasados', title: 'Chamados atualizados' }}
              bar2={{ id: 'qtdChamadosAtrasados', title: 'Chamados atrasados' }}
              dados={atribuidores}
            />

          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  </MDBRow>

  {/* Contagem de atribuições */ }
  <MDBRow className='mt-4'>
    <MDBCol size={12}>
      <MDBCard style={{ height: '310px' }}>
        <MDBCardBody>
          <MDBCardTitle>Chamados por cliente</MDBCardTitle>
          <MDBCardText style={{ height: '250px' }}>
            <Grafico
              bar1={{ id: 'value', title: 'Chamados' }}
              dados={clientesUnicos}
            />

          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  </MDBRow>


    </MDBContainer >
  )

}