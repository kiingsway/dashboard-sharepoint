import React, { useEffect, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import Chamados from './pages/Chamados';
import Clientes from './pages/Clientes';
import Dashboard from './pages/Dashboard';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import './App.css';
import FormChamados from './pages/FormChamados';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { obterClientes, obterChamados, obterFeriados } from './services/SPRequest';
import { faTableList, faChartPie, faArrowRotateRight, faPlus, faBuilding, faEdit, faBars } from '@fortawesome/free-solid-svg-icons'
import {
  MDBNavbar, MDBContainer, MDBNavbarBrand,
  MDBNavbarToggler, MDBNavbarNav,
  MDBNavbarItem, MDBNavbarLink, MDBBtn,
  MDBCollapse, MDBTabsItem,
  MDBTabsLink, MDBTabsContent, MDBTabsPane,
  MDBBadge
} from 'mdb-react-ui-kit';


const tempoAtualizacao = 15 * 60 // Tempo (segundos) para atualização dos clientes e chamados.
const tempoHabilitarAtualizar = 15 // Tempo (segundos) para remover o disabled do botão para evitar muitas requisições feitas pelo usuário.


function App() {

  const [chamados, setChamados] = useState<any>([]);
  const [clientes, setClientes] = useState<any>([]);
  const [feriados, setFeriados] = useState<any>({});
  const [contadorAtualizar, setContadorAtualizar] = useState(tempoAtualizacao);
  const [atualizacaoPagina, setAtualizacaoPagina] = useState({ clientes: false, chamados: false, campos: false });
  const [chamadoSelecionado, setChamadoSelecionado] = useState({ Id: 0, Cliente: "" })
  const [appTab, setAppTab] = useState('tabFormChamado')
  const [menuExpanded, setMenuExpanded] = useState(false);

  useEffect(() => {

    if (contadorAtualizar > 0) {
      const timer = setInterval(() => setContadorAtualizar(contadorAtualizar > 0 ? contadorAtualizar - 1 : 0), 1000);
      return () => clearInterval(timer);
    } else {
      setContadorAtualizar(tempoAtualizacao)
      obterChamadosEClientes()
    }

  }, [contadorAtualizar]);

  const handleBasicClick = (value: string) => {
    if (value === appTab) {
      return;
    }

    setAppTab(value);
  };

  function computarFeriados() {

    const feriadosLocalStorage = JSON.parse(localStorage.getItem('dashboard.feriados') || '{}')

    const hoje = moment().format('YYYY-MM-DD')

    if (feriadosLocalStorage.DataRequisicao === hoje) {
      setFeriados(feriadosLocalStorage)
    }

    else obterFeriados().then((listferiados: any) => {

      const itensFeriados = listferiados.data.value
      const apenasDataFeriados = itensFeriados.map((item: any) => moment(item.Data).format('YYYY-MM-DD'))

      const feriadosData = {
        DataRequisicao: hoje,
        Datas: apenasDataFeriados,
      }

      localStorage.setItem('dashboard.feriados', JSON.stringify(feriadosData))
      setFeriados(feriadosData)
    })

  }

  function obterChamadosEClientes() {
    setAtualizacaoPagina(prevAtt => ({ ...prevAtt, chamados: true, clientes: true }))

    obterClientes().then(listClientes => {

      // Zerando chamados
      setChamados([]);

      setClientes(listClientes.data.value)

      setAtualizacaoPagina(prevAtt => ({ ...prevAtt, clientes: false }))

      const clientesFiltrados = listClientes.data.value.filter((cliente:any) => {
        return true
        return cliente.Title === 'Class' || cliente.Title.includes('st')
      })

      for (let itemCliente of clientesFiltrados) {

        obterChamados(itemCliente).then((listChamados: any) => {
          setAtualizacaoPagina(prevAtt => ({ ...prevAtt, chamados: true }))

          const itensChamados: any = listChamados.data.value.map((itemChamado: any) => {

            function diferencaDias(dataAnterior: any) {
              // Enviar em MOMENT.JS: moment()
              const duracao = moment.duration(moment().diff(dataAnterior));
              return parseFloat((Math.round(duracao.asDays() * 100) / 100).toFixed(1));
            }

            const ymd = 'YYYY-MM-DD'

            const hoje = moment();
            const inicioHoje = hoje.startOf('date')
            const modified = moment(itemChamado.Modified).format(ymd);

            let dataAtual = moment();
            let contDiasSubtrair: number = 0.0;
            let icontLimit: number = 0;

            /*try {
              do {

                // Se a data atual estiver na lista de feriados, for sábado ou domingo, conta +1 dia para remover
                if (feriados.Datas.includes(dataAtual.format(ymd)) || dataAtual.day() === 6 || dataAtual.day() === 0)
                  contDiasSubtrair += dataAtual.isSame(hoje) ? diferencaDias(inicioHoje) : 1

                // Decrementar Data Atual
                dataAtual = dataAtual.subtract(1, 'days')
                icontLimit++

              } while (dataAtual.isSameOrAfter(modified) || icontLimit === 20);
            } catch (e) {
              console.error('Não foi possível fazer o cálculo de dias úteis...')
            }*/

            const diasCorridosSemAtualizar = diferencaDias(itemChamado.Modified);
            // Contagem de dias úteis apenas
            const diasUteisSemAtualizar = ((diasCorridosSemAtualizar * 10) - (contDiasSubtrair * 10)) / 10

            return {
              ...itemChamado,
              Cliente: itemCliente.Title,
              diasCorridosSemAtualizar: diasCorridosSemAtualizar,
              diasUteisSemAtualizar: diasUteisSemAtualizar,
              ClienteInternalName: itemCliente.ClienteInternalName,
              InternalNameSubsite: itemCliente.InternalNameSubsite,
              InternalNameSubsiteList: itemCliente.InternalNameSubsiteList
            }
          });

          setChamados((prevChamados: any) => [...prevChamados, ...itensChamados]);
          
        }).then(() => {
          setAtualizacaoPagina(prevAtt => ({ ...prevAtt, chamados: false }))
    
        });
        
      }

    })

  }

  function handleTempoAtualizar() {

    setAtualizacaoPagina(prevAtt => ({ ...prevAtt, clientes: true, chamados: true }))
    setContadorAtualizar(0);

  }

  useEffect(() => {
    computarFeriados();
    obterChamadosEClientes();
  }, [])


  return (
    <>
      <MDBNavbar expand='lg' sticky dark bgColor='dark' className='navBarDash'>
        <MDBContainer fluid>
          <MDBNavbarBrand className='navTitle' style={{ cursor: "default" }}>Dashboard 22</MDBNavbarBrand>
          <MDBNavbarToggler
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setMenuExpanded(!menuExpanded)}
          >
            <FontAwesomeIcon icon={faBars}/>
          </MDBNavbarToggler>

          <MDBCollapse navbar show={menuExpanded}>
            <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>

              <MDBNavbarItem>
                <MDBNavbarLink active aria-current='page' href='#'>
                  <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleBasicClick('tabFormChamado')} active={appTab === 'tabFormChamado'}>
                      <MDBBtn outline={appTab !== 'tabFormChamado'} className='mx-0 border-0' color='light'>
                        <FontAwesomeIcon icon={chamadoSelecionado?.Id !== 0 ? faEdit : faPlus} className='me-2' />
                        {chamadoSelecionado?.Id !== 0 ? 'Editar chamado' : 'Novo chamado'}
                        <br />
                        {chamadoSelecionado?.Id !== 0 ? <MDBBadge color='dark' className='ms-2 ' style={{ textTransform: "initial" }}>{`#${chamadoSelecionado.Id} | ${chamadoSelecionado.Cliente}`}</MDBBadge> : <></>}
                      </MDBBtn>
                    </MDBTabsLink>
                  </MDBTabsItem>
                </MDBNavbarLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                <MDBNavbarLink active aria-current='page' href='#'>
                  <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleBasicClick('tabChamados')} active={appTab === 'tabChamados'}>
                      <MDBBtn outline={appTab !== 'tabChamados'} className='mx-0 border-0' color='light' style={{ font: "inherit" }}>
                        <FontAwesomeIcon icon={faTableList} className='me-2' />
                        Chamados
                        <MDBBadge
                          color='dark'
                          className='ms-2'
                          style={{padding: "4px 6px 1px 6px"}}
                        >
                            
                          {chamados.length}
                          <FontAwesomeIcon
                            icon={faArrowRotateRight}
                            spin={atualizacaoPagina.chamados}
                            className={classNames('ms-2', { 'd-none': !atualizacaoPagina.chamados })} />
                        </MDBBadge>
                      </MDBBtn>
                    </MDBTabsLink>
                  </MDBTabsItem>
                </MDBNavbarLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                <MDBNavbarLink active aria-current='page' href='#'>
                  <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleBasicClick('tabDashboard')} active={appTab === 'tabDashboard'}>
                      <MDBBtn outline={appTab !== 'tabDashboard'} className='mx-0 border-0' color='light'>
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
                    <MDBTabsLink onClick={() => handleBasicClick('tabClientes')} active={appTab === 'tabClientes'}>
                      <MDBBtn outline={appTab !== 'tabClientes'} className='mx-0 border-0' color='light'>
                        <FontAwesomeIcon icon={faBuilding} className='me-2' />
                        Clientes
                        <MDBBadge color='dark' className='ms-2' style={{padding: "4px 6px 1px 6px"}}>
                          {clientes.length}
                          <FontAwesomeIcon
                            icon={faArrowRotateRight}
                            spin={atualizacaoPagina.clientes}
                            className={classNames('ms-2', { 'd-none': !atualizacaoPagina.clientes })} />
                        </MDBBadge>
                      </MDBBtn>
                    </MDBTabsLink>
                  </MDBTabsItem>
                </MDBNavbarLink>
              </MDBNavbarItem>

            </MDBNavbarNav>

            {/* atualizacaoPagina.clientes || atualizacaoPagina.chamados && contadorAtualizar > tempoAtualizacao - tempoHabilitarAtualizar */}
            <MDBBtn outline className='mx-0 border-0' color='light' onClick={handleTempoAtualizar}
              disabled={atualizacaoPagina.clientes || atualizacaoPagina.chamados ? atualizacaoPagina.clientes || atualizacaoPagina.chamados : contadorAtualizar > tempoAtualizacao - tempoHabilitarAtualizar}>
              <FontAwesomeIcon icon={faArrowRotateRight} spin={atualizacaoPagina.clientes || atualizacaoPagina.chamados} className='me-2' />
              {atualizacaoPagina.clientes || atualizacaoPagina.chamados ? 'Atualizando...' : 'Atualizar'}
              <MDBBadge color='dark' className='ms-2' style={{padding: "4px 6px 1px 6px"}}>
                {String(Math.floor(contadorAtualizar / 60)).padStart(2, '0') + ':' + String(contadorAtualizar % 60).padStart(2, '0')}
              </MDBBadge>
            </MDBBtn>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <MDBTabsContent>
        <MDBTabsPane className='container mt-4' show={appTab === 'tabFormChamado'}>
          {/* <FormChamados
            clientes={clientes}
            chamados={chamados}
            chamadoSelecionado={chamadoSelecionado}
            setChamadoSelecionado={setChamadoSelecionado}
            /> */}
        </MDBTabsPane>
        <MDBTabsPane className='container mt-4' show={appTab === 'tabChamados'}>
          {/* <Chamados
            clientes={clientes}
            chamados={chamados}
            feriados={feriados}
            setChamadoSelecionado={setChamadoSelecionado}
          /> */}
        </MDBTabsPane>
        <MDBTabsPane className='container mt-4' show={appTab === 'tabDashboard'}>
          <Dashboard
            clientes={clientes}
            chamados={chamados} />
        </MDBTabsPane>
        <MDBTabsPane className='container mt-4' show={appTab === 'tabClientes'}><Clientes clientes={clientes} /></MDBTabsPane>
      </MDBTabsContent>
    </>
  )
}

export default App;