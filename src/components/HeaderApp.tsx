import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { IAtualizacaoSecao, IChamadoSelecionado, TAppTabs } from 'interfaces'
import { faArrowRotateRight, faBars, faBuilding, faChartPie, faEdit, faPlus, faTableList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  MDBBadge, MDBBtn, MDBCollapse, MDBContainer, MDBNavbar, MDBNavbarBrand,
  MDBNavbarItem, MDBNavbarLink, MDBNavbarNav, MDBNavbarToggler, MDBTabsItem, MDBTabsLink
} from 'mdb-react-ui-kit'


interface Props {
  chamadoSelecionado: IChamadoSelecionado;
  qtdChamados: number;
  qtdClientes: number;
  appTab: TAppTabs;
  atualizacaoSecao: IAtualizacaoSecao;
  handleGetClientesChamados: () => void;
  setAtualizacaoSecao: React.Dispatch<React.SetStateAction<IAtualizacaoSecao>>;
  setAppTab: React.Dispatch<React.SetStateAction<TAppTabs>>;
}

const tempoAtualizacao: number = 15 * 60 // Tempo (segundos) para atualização dos clientes e chamados.
const tempoHabilitarAtualizar: number = 15 // Tempo (segundos) para remover o disabled do botão para evitar muitas requisições feitas pelo usuário.

export default function HeaderApp(props: Props) {

  const [navMobileExpanded, setNavMobileExpanded] = useState<boolean>(false);
  const [segundosAtualizacao, setSegundosAtualizacao] = useState<number>(tempoAtualizacao);

  /**
   * Altera a guia da aplicação para o texto recebido em parâmetros.
   * @param { TAppTabs } tab Guia para ser alterada via setAppTab. As opções válidas estão no tipo 'TAppTabs'.
   * @example handleSetAppTab('tabChamados')
   * @returns void
   */
  function handleSetAppTab(tab: TAppTabs) { props.setAppTab(tab); }

  /**
   * Força atualização dos clientes e chamados pelo setSegundosAtualizacao com o parâmetro 0.
   * Também inicializa ícones de atualização animados próximo ao texto das guias de clientes e chamados.
   * @returns void
   */
  function handleSetSegundosAtualizacao() { setSegundosAtualizacao(0); }

  useEffect(() => {

    // Caso tenha mais de 0 segundos da contagem de atualização, execute um timer para reduzir a contagem em 1.
    if (segundosAtualizacao > 0) {
      const timer = setInterval(() => setSegundosAtualizacao(segundosAtualizacao > 0 ? segundosAtualizacao - 1 : 0), 1000)
      return () => clearInterval(timer)

    } else { // Caso possuir <= 0 segundos para atualização, resete o timer e obtenha os clientes e chamados
      setSegundosAtualizacao(tempoAtualizacao)
      props.handleGetClientesChamados()
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
              <MDBBtn
                outline={props.appTab !== 'tabFormChamado'}
                className='mx-0 border-0'
                color='light'
                onClick={() => handleSetAppTab('tabFormChamado')}>

                <FontAwesomeIcon icon={props.chamadoSelecionado.Id !== 0 ? faEdit : faPlus} className='me-2' />
                {
                  props.chamadoSelecionado.Id !== 0 ?
                  <>
                  Editar chamado***
                  <br />
                      <MDBBadge
                        color='dark'
                        className='ms-2'
                        style={{ textTransform: "initial" }}>
                        {`#${props.chamadoSelecionado.Id} | ${props.chamadoSelecionado.Cliente?.Title}`}
                      </MDBBadge>
                    </>
                    : <>Novo chamado***</>
                }
              </MDBBtn>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='#'>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleSetAppTab('tabChamados')} active={props.appTab === 'tabChamados'}>
                    <MDBBtn outline={props.appTab !== 'tabChamados'} className='mx-0 border-0' color='light' style={{ font: "inherit" }}>
                      <FontAwesomeIcon icon={faTableList} className='me-2' />
                      Chamados***
                      <MDBBadge
                        color='dark'
                        className='ms-2'
                        style={{ padding: "2px 4px" }}
                      >

                        {props.qtdChamados}
                        <FontAwesomeIcon
                          icon={faArrowRotateRight}
                          spin={props.atualizacaoSecao.chamados}
                          className={classNames('ms-2', { 'd-none': !props.atualizacaoSecao.chamados })} />
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
                      <MDBBadge color='dark' className='ms-2'
                        style={{ padding: "2px 4px" }}>
                        {props.qtdClientes}
                        <FontAwesomeIcon
                          icon={faArrowRotateRight}
                          spin={props.atualizacaoSecao.clientes}
                          className={classNames('ms-2', { 'd-none': !props.atualizacaoSecao.clientes })} />
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
              props.atualizacaoSecao.clientes || props.atualizacaoSecao.chamados ? true :
                segundosAtualizacao > tempoAtualizacao - tempoHabilitarAtualizar
            }>

            <FontAwesomeIcon
              icon={faArrowRotateRight}
              spin={props.atualizacaoSecao.clientes || props.atualizacaoSecao.chamados}
              className='me-2' />

            {props.atualizacaoSecao.clientes || props.atualizacaoSecao.chamados ? 'Atualizando...' : 'Atualizar'}

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