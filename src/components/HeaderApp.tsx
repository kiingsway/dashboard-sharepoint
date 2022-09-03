import React, { useState } from 'react'
import classNames from 'classnames'
import { IAtualizacaoSecao, IChamadoSelecionado, TAppTabs } from 'interfaces'
import { faArrowRotateRight, faBars, faBuilding, faChartPie, faEdit, faPlus, faTableList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  MDBBadge, MDBBtn, MDBCollapse, MDBContainer, MDBNavbar, MDBNavbarBrand,
  MDBNavbarItem, MDBNavbarNav, MDBNavbarToggler
} from 'mdb-react-ui-kit'
import HeaderAtualizacao from './HeaderAtualizacao'


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


export default function HeaderApp(props: Props) {

  const [navMobileExpanded, setNavMobileExpanded] = useState<boolean>(false);

  /**
   * Altera a guia da aplicação para o texto recebido em parâmetros.
   * @param { TAppTabs } tab Guia para ser alterada via setAppTab. As opções válidas estão no tipo 'TAppTabs'.
   * @example handleSetAppTab('tabChamados')
   * @returns void
   */
  function handleSetAppTab(tab: TAppTabs) { props.setAppTab(tab); }

  return (
    <>
    <MDBNavbar expand='lg' sticky dark bgColor='dark' className='navBarDash shadow-sm'>
      <MDBContainer fluid>
        <MDBNavbarBrand className='navTitle'>Dashboard 22</MDBNavbarBrand>

        <MDBNavbarToggler
          type='button'
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
                type='button'
                color='light'
                className='mx-1 my-1 border-0 d-none'
                outline={props.appTab !== 'tabFormChamado'}
                onClick={() => handleSetAppTab('tabFormChamado')}>

                <FontAwesomeIcon icon={props.chamadoSelecionado?.Id ? faEdit : faPlus} className='me-2' />
                {
                  props.chamadoSelecionado?.Id ?
                    <>
                      Editar chamado***
                      <br />
                      <MDBBadge
                        color='dark'
                        className='ms-2'
                        style={{ textTransform: "initial" }}
                        >
                        {`#${props.chamadoSelecionado.Id} | ${props.chamadoSelecionado.Cliente?.Title}`}
                      </MDBBadge>
                    </>
                    : <>Novo chamado***</>
                }
              </MDBBtn>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBBtn
                type='button'
                color='light'
                className='mx-1 my-1 border-0'
                outline={props.appTab !== 'tabChamados'}
                onClick={() => handleSetAppTab('tabChamados')}>

                <FontAwesomeIcon icon={faTableList} className='me-2' />

                Chamados***

                <MDBBadge
                  color='dark'
                  className='ms-2'
                  style={{ padding: "2px 4px" }}>

                  {props.qtdChamados}

                  <FontAwesomeIcon
                    icon={faArrowRotateRight}
                    spin={props.atualizacaoSecao.chamados}
                    className={classNames('ms-2', { 'd-none': !props.atualizacaoSecao.chamados })} />

                </MDBBadge>
              </MDBBtn>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBBtn
                type='button'
                color='light'
                className='mx-1 my-1 border-0'
                outline={props.appTab !== 'tabDashboard'}
                onClick={() => handleSetAppTab('tabDashboard')}
              >

                <FontAwesomeIcon icon={faChartPie} className='me-2' />
                Dashboard
              </MDBBtn>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBBtn
                type='button'
                color='light'
                className='mx-1 my-1 border-0'
                outline={props.appTab !== 'tabClientes'}
                onClick={() => handleSetAppTab('tabClientes')}
              >
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
            </MDBNavbarItem>

          </MDBNavbarNav>

          <HeaderAtualizacao
          atualizacaoSecao={props.atualizacaoSecao}
          handleGetClientesChamados={props.handleGetClientesChamados}
          
          />
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
    </>
  )
}