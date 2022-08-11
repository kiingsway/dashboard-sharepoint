import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardSubTitle, MDBProgress, MDBProgressBar, MDBContainer, MDBBtn, MDBCardGroup } from 'mdb-react-ui-kit';
import classNames from 'classnames';
import Grafico from './Grafico';
import { faAsterisk, faCalendarDay, faCalendarDays, faCalendarWeek, faCircle, faHeartCrack, faListCheck, faListUl, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalChamados from './ModalChamados';
import { IChamado, ICliente, IFiltrosChamados, ITileObject } from 'interfaces'
import { sortNumberDesc } from 'services/FunctionHelpers'
import { faBuilding } from '@fortawesome/free-regular-svg-icons';

interface Props {
  chamados: IChamado[]
  clientes: ICliente[]
  handleSelecionarChamado: (chamado: IChamado) => void
}

export default function Dashboard(props: Props) {

  const [filtrosChamados, setFiltrosChamados] = useState<IFiltrosChamados>()
  const [tileSelecionada, setTileSelecionada] = useState<ITileObject>();
  const [modalChamados, setModalChamados] = useState(false);

  const toggleModalChamados = (tile: ITileObject) => {
    setTileSelecionada(tile);
    setModalChamados(!modalChamados)
  };

  let clientesUnicos = [...new Set(props.chamados.map((ch: any) => ch.Cliente.Title))];
  clientesUnicos = clientesUnicos.map((cliente: any) => {

    const name = cliente === 'Sturzenegger e Cavalcante' ? 'SCADV' : cliente
    const value = props.chamados.filter((chamado: IChamado) => chamado.Cliente.Title === cliente).length

    return { name: name, value: value }
  })
  clientesUnicos.sort(sortNumberDesc)

  useEffect(() => {

    const chamadosVencidos = props.chamados.filter((chamado: IChamado) => chamado.diasUteisSemAtualizar >= 2) || []

    const chamadosEmAberto = props.chamados.filter((chamado: IChamado) => chamado.StatusDaQuestao === 'Aberto')

    const chamadosSemAtribuido = props.chamados.filter((chamado: IChamado) => chamado.Atribuida?.Title === undefined)

    const chamadosCriadosHoje = props.chamados.filter((chamado: IChamado) => moment(chamado.Created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'))

    const abertos30dias = props.chamados.filter((chamado: IChamado) => moment().diff(moment(chamado.Created), 'days') >= 30)

    const abertos15dias = props.chamados.filter((chamado: IChamado) => moment().diff(moment(chamado.Created), 'days') >= 15 && moment().diff(moment(chamado.Created), 'days') < 30)

    const pendentesValidacao = props.chamados.filter((chamado: IChamado) => chamado.StatusDaQuestao?.toLowerCase().includes('validação'))

    setFiltrosChamados({
      vencido: chamadosVencidos,
      emAberto: chamadosEmAberto,
      semAtribuido: chamadosSemAtribuido,
      criadosHoje: chamadosCriadosHoje,
      clientesComChamados: clientesUnicos,
      abertos30dias: abertos30dias,
      pendentesValidacao: pendentesValidacao,
      abertos15dias: abertos15dias
    });

  }, [props.chamados]);

  const listaTiles: ITileObject[] = [
    { Title: "Chamados vencidos", Subtitle: "+2 dias úteis sem atualizar", Count: filtrosChamados?.vencido?.length || 0, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.vencido || [], Icon: faHeartCrack },
    { Title: "Chamados em aberto", Subtitle: "Status em 'Aberto'", Count: filtrosChamados?.emAberto?.length || 0, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.emAberto || [], Icon: faAsterisk },
    { Title: "Chamados sem atribuição", Subtitle: "", Count: filtrosChamados?.semAtribuido?.length || 0, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.semAtribuido || [], Icon: faUserSlash },
    { Title: "Clientes com chamados", Subtitle: "Clientes que possuem chamados não-resolvidos", Count: filtrosChamados?.clientesComChamados?.length || 0, Total: props.clientes.length, Progress: true, Values: filtrosChamados?.clientesComChamados || [], Icon: faBuilding },
    { Title: "Chamados criados hoje", Subtitle: "", Count: filtrosChamados?.criadosHoje?.length || 0, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.criadosHoje || [], Icon: faCalendarDay },
    { Title: "Chamados criados entre 15 e 30 dias", Subtitle: "", Count: filtrosChamados?.abertos15dias?.length || 0, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.abertos15dias || [], Icon: faCalendarWeek },
    { Title: "Chamados criados há mais de 30 dias", Subtitle: "", Count: filtrosChamados?.abertos30dias?.length || 0, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.abertos30dias || [], Icon: faCalendarDays },
    { Title: 'Chamados pendentes de validação', Count: filtrosChamados?.pendentesValidacao?.length || 0, Total: props.chamados.length, Progress: true, Values: filtrosChamados?.pendentesValidacao || [], Icon: faListCheck }
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

  function handleSelecionarChamadoViaModal(chamado: IChamado) {
    setModalChamados(!modalChamados)
    props.handleSelecionarChamado(chamado)
  }

  return (

    <MDBContainer breakpoint='xxl'>

      <ModalChamados
        modalChamados={modalChamados}
        setModalChamados={setModalChamados}
        toggleModalChamados={toggleModalChamados}
        chamadosFiltrados={[{ 'Id': 1 }]}
        handleSelecionarChamadoViaModal={handleSelecionarChamadoViaModal}
        tileSelecionada={tileSelecionada}
      />

      <MDBRow className='row-cols-12 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 g-4'>
        {listaTiles.map((tile: ITileObject) => (
          <MDBCardGroup key={tile.Title}>
            <MDBCard>
              <MDBCardBody className='p-0 d-flex flex-column justify-content-between'>
                <div className='d-flex justify-content-between'>
                  <MDBCardTitle className='w-100 ps-3 pt-3' style={{ maxHeight: '70px', overflow: 'hidden' }}>
                    <FontAwesomeIcon icon={tile.Icon || faCircle} className='me-2' />
                    {tile.Title}
                  </MDBCardTitle>
                  <MDBCardTitle className={tile.Values.length === 0 ? 'invisible' : ''}>
                    <MDBBtn
                      className='ms-2 shadow-0 border-0'
                      size='sm'
                      color='secondary'
                      title='Ver os itens'
                      onClick={() => (toggleModalChamados(tile))}
                      style={{ height: '40px', width: '40px' }} outline>
                      <FontAwesomeIcon icon={faListUl} />
                    </MDBBtn>
                  </MDBCardTitle>

                </div>
                <MDBCardSubTitle
                  className={classNames('text-muted fw-bold ps-3 pe-3', { invisible: !Boolean(tile.Subtitle) })} style={{ maxHeight: '60px', overflow: 'hidden', lineHeight: '1.1em' }}>
                  {tile.Subtitle ? tile.Subtitle : '.'}
                </MDBCardSubTitle>
                <MDBCardText className='w-100 m-0 pe-4 text-end' style={{ fontSize: "95px", lineHeight: "100px" }}>
                  {tile.Count}
                </MDBCardText>
                <MDBProgress height='18' className={tile.Count > 0 && tile.Progress ? '' : 'invisible'}>
                  <MDBProgressBar
                    className='dashprogress ps-2 pe-2'
                    width={(tile.Count / tile.Total) * 100 || 0}
                    valuemin={0}
                    valuemax={tile.Total}
                    title={`${tile.Count} ${tile.Title.toLowerCase()} de um total de ${tile.Total} (${Math.floor((tile.Count / tile.Total) * 100) || 0}%)`}
                  >
                    {Math.floor((tile.Count / tile.Total) * 100)}% ({tile.Count}/{tile.Total})
                  </MDBProgressBar>
                </MDBProgress>
              </MDBCardBody>
            </MDBCard>
          </MDBCardGroup>
        ))}
      </MDBRow>

      {/* GRÁFICOS ----------------  */}
      {/* Contagem de atribuições */}
      <MDBRow className='mt-4'>
        <MDBCol size={12}>
          <MDBCard style={{ height: '310px' }}>
            <MDBCardBody>
              <MDBCardTitle>Contagem de atribuições</MDBCardTitle>
              <div style={{ height: '250px' }}>
                <Grafico
                  bar1={{ id: 'qtdChamadosNaoAtrasados', title: 'Chamados atualizados' }}
                  bar2={{ id: 'qtdChamadosAtrasados', title: 'Chamados atrasados' }}
                  dados={atribuidores}
                />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Chamados por clientes */}
      <MDBRow className='mt-4'>
        <MDBCol size={12}>
          <MDBCard style={{ height: '310px' }}>
            <MDBCardBody>
              <MDBCardTitle>Chamados por cliente</MDBCardTitle>
              <div style={{ height: '250px' }}>
                <Grafico
                  bar1={{ id: 'value', title: 'Chamados' }}
                  dados={clientesUnicos}
                />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer >
  )
}