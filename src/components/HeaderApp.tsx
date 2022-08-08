import React, { useEffect, useState } from 'react'
import { faArrowRotateRight, faBars, faBuilding, faChartPie, faEdit, faPlus, faTableList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  MDBBadge, MDBBtn, MDBCollapse,
  MDBContainer, MDBNavbar, MDBNavbarBrand,
  MDBNavbarItem, MDBNavbarLink, MDBNavbarNav,
  MDBNavbarToggler, MDBTabsItem, MDBTabsLink
} from 'mdb-react-ui-kit'
import { IChamadoSelecionado, TAppTabs } from 'interfaces'
import classNames from 'classnames'


interface Props {
  chamadoSelecionado: IChamadoSelecionado;
  qtdChamados: number;
  qtdClientes: number;
  obterChamadosEClientes: () => void;
  appTab: TAppTabs
  setAppTab: React.Dispatch<React.SetStateAction<TAppTabs>>
}

interface IAtualizacaoSecao {
  clientes: boolean;
  chamados: boolean;
  campos: boolean;
}

const tempoAtualizacao: number = 15 * 60 // Tempo (segundos) para atualização dos clientes e chamados.
const tempoHabilitarAtualizar: number = 3 // Tempo (segundos) para remover o disabled do botão para evitar muitas requisições feitas pelo usuário.

export default function HeaderApp(props: Props) {

  const [navMobileExpanded, setNavMobileExpanded] = useState<boolean>(false);
  const [atualizacaoSecao, setAtualizacaoSecao] = useState<IAtualizacaoSecao>({ clientes: false, chamados: false, campos: false });
  const [segundosAtualizacao, setSegundosAtualizacao] = useState<number>(tempoAtualizacao)

  function handleSetAppTab(tab: TAppTabs) { props.setAppTab(tab); }

  function handleSetSegundosAtualizacao() { setAtualizacaoSecao(prevAtt => ({ ...prevAtt, clientes: true, chamados: true })); setSegundosAtualizacao(0); }

  useEffect(() => {

    if (segundosAtualizacao > 0) {
      const timer = setInterval(() => setSegundosAtualizacao(segundosAtualizacao > 0 ? segundosAtualizacao - 1 : 0), 1000);
      return () => clearInterval(timer);
    } else {
      setSegundosAtualizacao(tempoAtualizacao)
      props.obterChamadosEClientes()
    }

  }, [segundosAtualizacao]);

  return (
    <MDBNavbar expand='lg' sticky dark bgColor='dark' className='navBarDash'>
      <MDBContainer fluid>
        <MDBNavbarBrand className='navTitle'>Dashboard 22</MDBNavbarBrand>
        <MDBNavbarToggler
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setNavMobileExpanded(!navMobileExpanded)}
        >
          <FontAwesomeIcon icon={faBars} />
        </MDBNavbarToggler>
        <MDBCollapse navbar show={navMobileExpanded}>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>

            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='#'>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleSetAppTab('tabFormChamado')} active={props.appTab === 'tabFormChamado'}>
                    <MDBBtn outline={props.appTab !== 'tabFormChamado'} className='mx-0 border-0' color='light'>

                      <FontAwesomeIcon icon={props.chamadoSelecionado.Id !== 0 ? faEdit : faPlus} className='me-2' />
                      {props.chamadoSelecionado.Id !== 0 ? 'Editar chamado' : 'Novo chamado'}
                      <br />
                      {props.chamadoSelecionado.Id !== 0 ? <MDBBadge color='dark' className='ms-2 ' style={{ textTransform: "initial" }}>{`#${props.chamadoSelecionado.Id} | ${props.chamadoSelecionado.Cliente}`}</MDBBadge> : <></>}

                    </MDBBtn>
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBNavbarLink>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='#'>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleSetAppTab('tabChamados')} active={props.appTab === 'tabChamados'}>
                    <MDBBtn outline={props.appTab !== 'tabChamados'} className='mx-0 border-0' color='light' style={{ font: "inherit" }}>
                      <FontAwesomeIcon icon={faTableList} className='me-2' />
                      Chamados
                      <MDBBadge
                        color='dark'
                        className='ms-2'
                        style={{ padding: "4px 6px 1px 6px" }}
                      >

                        {props.qtdChamados}
                        <FontAwesomeIcon
                          icon={faArrowRotateRight}
                          spin={atualizacaoSecao.chamados}
                          className={classNames('ms-2', { 'd-none': !atualizacaoSecao.chamados })} />
                      </MDBBadge>
                    </MDBBtn>
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBNavbarLink>
            </MDBNavbarItem>



            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='#'>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleSetAppTab('tabDashboard')} active={props.appTab === 'tabDashboard'}>
                    <MDBBtn outline={props.appTab !== 'tabDashboard'} className='mx-0 border-0' color='light'>
                      <FontAwesomeIcon icon={faChartPie} className='me-2' />
                      Dashboard
                    </MDBBtn>
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBNavbarLink>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='#'>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleSetAppTab('tabClientes')} active={props.appTab === 'tabClientes'}>
                    <MDBBtn outline={props.appTab !== 'tabClientes'} className='mx-0 border-0' color='light'>
                      <FontAwesomeIcon icon={faBuilding} className='me-2' />
                      Clientes
                      <MDBBadge color='dark' className='ms-2' style={{ padding: "4px 6px 1px 6px" }}>
                        {props.qtdClientes}
                        <FontAwesomeIcon
                          icon={faArrowRotateRight}
                          spin={atualizacaoSecao.clientes}
                          className={classNames('ms-2', { 'd-none': !atualizacaoSecao.clientes })} />
                      </MDBBadge>
                    </MDBBtn>
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBNavbarLink>
            </MDBNavbarItem>

          </MDBNavbarNav>

          <MDBBtn
            outline
            className='mx-0 border-0'
            color='light'
            onClick={handleSetSegundosAtualizacao}
            disabled={
              atualizacaoSecao.clientes || atualizacaoSecao.chamados ? true :
              segundosAtualizacao > tempoAtualizacao - tempoHabilitarAtualizar
            }>

            <FontAwesomeIcon
              icon={faArrowRotateRight}
              spin={atualizacaoSecao.clientes || atualizacaoSecao.chamados}
              className='me-2' />

            {atualizacaoSecao.clientes || atualizacaoSecao.chamados ? 'Atualizando...' : 'Atualizar'}

            <MDBBadge
              color='dark'
              className='ms-2'
              style={{ padding: "4px 6px 1px 6px" }}>

              {String(Math.floor(segundosAtualizacao / 60)).padStart(2, '0') + ':' + String(segundosAtualizacao % 60).padStart(2, '0')}

            </MDBBadge>
          </MDBBtn>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  )
}