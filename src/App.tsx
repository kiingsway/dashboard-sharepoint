import React, { useEffect, useState } from 'react';
import './App.css';
// import * as bootstrap from 'bootstrap';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableList, faChartPie, faArrowRotateRight, faPlus, faBuilding, faEdit } from '@fortawesome/free-solid-svg-icons'
import Chamados from './pages/Chamados';
import Clientes from './pages/Clientes';
import Dashboard from './pages/Dashboard';
import FormChamados from './pages/FormChamados';
import MenuBotao from './components/MenuBotao';
import { obterClientes, obterChamados, obterFeriados } from './services/SPRequest';
import moment from 'moment';
import {
  MDBNavbar, MDBContainer, MDBNavbarBrand,
  MDBNavbarToggler, MDBIcon, MDBNavbarNav,
  MDBNavbarItem, MDBNavbarLink, MDBBtn,
  MDBCollapse, MDBTabsItem,
  MDBTabsLink, MDBTabsContent, MDBTabsPane,
  MDBBadge
} from 'mdb-react-ui-kit';


import classNames from 'classnames';
const tempoAtualizacao = 15 * 60 // Tempo (segundos) para atualização dos clientes e chamados.
const tempoHabilitarAtualizar = 15 // Tempo (segundos) para remover o disabled do botão para evitar muitas requisições feitas pelo usuário.


function App() {

  const [chamados, setChamados] = useState<any>([]);
  const [clientes, setClientes] = useState<any>([]);
  const [chamadoSelecionado, setChamadoSelecionado] = useState({ Id: 0, Cliente: "" })
  const [feriados, setFeriados] = useState<any>()
  const [basicActive, setBasicActive] = useState('tabFormChamado')
  const [contadorAtualizar, setContadorAtualizar] = useState(tempoAtualizacao)
  const [showBasic, setShowBasic] = useState(false);
  const [atualizacaoPagina, setAtualizacaoPagina] = useState({ clientes: false, chamados: false, campos: false });

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
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
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

      for (let itemCliente of listClientes.data.value.slice(0, 5)) {

        obterChamados(itemCliente).then((listChamados: any) => {


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
          setAtualizacaoPagina(prevAtt => ({ ...prevAtt, chamados: false }))

        });

      }


    });

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
            onClick={() => setShowBasic(!showBasic)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>

          <MDBCollapse navbar show={showBasic}>
            <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>

              <MDBNavbarItem>
                <MDBNavbarLink active aria-current='page' href='#'>
                  <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleBasicClick('tabFormChamado')} active={basicActive === 'tabFormChamado'}>
                      <MDBBtn outline={basicActive !== 'tabFormChamado'} className='mx-0 border-0' color='light'>
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
                    <MDBTabsLink onClick={() => handleBasicClick('tabChamados')} active={basicActive === 'tabChamados'}>
                      <MDBBtn outline={basicActive !== 'tabChamados'} className='mx-0 border-0' color='light' style={{ font: "inherit" }}>
                        <FontAwesomeIcon icon={faTableList} className='me-2' />
                        Chamados
                        <MDBBadge
                          color='dark'
                          className='ms-2'>
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
                    <MDBTabsLink onClick={() => handleBasicClick('tabDashboard')} active={basicActive === 'tabDashboard'}>
                      <MDBBtn outline={basicActive !== 'tabDashboard'} className='mx-0 border-0' color='light'>
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
                    <MDBTabsLink onClick={() => handleBasicClick('tabClientes')} active={basicActive === 'tabClientes'}>
                      <MDBBtn outline={basicActive !== 'tabClientes'} className='mx-0 border-0' color='light'>
                        <FontAwesomeIcon icon={faBuilding} className='me-2' />
                        Clientes
                        <MDBBadge color='dark' className='ms-2'>
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
              <MDBBadge color='dark' className='ms-2'>
                {String(Math.floor(contadorAtualizar / 60)).padStart(2, '0') + ':' + String(contadorAtualizar % 60).padStart(2, '0')}
              </MDBBadge>
            </MDBBtn>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <MDBTabsContent>
        <MDBTabsPane className='container mt-4' show={basicActive === 'tabFormChamado'}>
          <FormChamados
            clientes={clientes}
            chamados={chamados}
            chamadoSelecionado={chamadoSelecionado}
            setChamadoSelecionado={setChamadoSelecionado}
            />
        </MDBTabsPane>
        <MDBTabsPane className='container mt-4' show={basicActive === 'tabChamados'}>
          <Chamados
            clientes={clientes}
            chamados={chamados}
            feriados={feriados}
            setChamadoSelecionado={setChamadoSelecionado}
          />
        </MDBTabsPane>
        <MDBTabsPane className='container mt-4' show={basicActive === 'tabDashboard'}>
          <Dashboard
            clientes={clientes}
            chamados={chamados} />
        </MDBTabsPane>
        <MDBTabsPane className='container mt-4' show={basicActive === 'tabClientes'}><Clientes clientes={clientes} /></MDBTabsPane>
      </MDBTabsContent>
    </>
  )

  return (
    <div className="d-flex align-items-start m-2">
      <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">

        <MenuBotao
          titulo={'Chamados'}
          internalname={'chamados'}
          icon={faTableList}
          mostrarContador={true}
          contagem={chamados?.length}
          menuSelecionado={true}
        />

        <MenuBotao
          titulo={'Clientes'}
          internalname={'clientes'}
          icon={faBuilding}
          mostrarContador={true}
          contagem={clientes?.length}
          menuSelecionado={false}
        />

        <MenuBotao
          titulo={'Dashboard'}
          internalname={'dashboard'}
          icon={faChartPie}
          mostrarContador={false}
          menuSelecionado={false}
        />

        <hr className='my-4' />

        <MenuBotao
          titulo={chamadoSelecionado?.Id !== 0 ? `Editando` : 'Novo chamado'}
          internalname='formchamados'
          icon={chamadoSelecionado?.Id !== 0 ? faEdit : faPlus}
          contagem={chamadoSelecionado?.Id !== 0 ? `#${chamadoSelecionado?.Id} ${chamadoSelecionado?.Cliente}` : ""}
          mostrarContador={chamadoSelecionado?.Id !== 0}
          menuSelecionado={false}
        />

        <hr className='my-4' />

        <button
          type="button"
          className="btn btn-outline-light d-flex justify-content-between align-items-center"
          title='Atualizar chamados e clientes'
          onClick={obterChamadosEClientes}
        >
          <div>
            <FontAwesomeIcon icon={faArrowRotateRight} className='me-2' />
            Atualizar
          </div>

          <span className="badge rounded-pill text-bg-light">00:00</span>
        </button>
      </div>

      <div className="tab-content w-100" id="v-pills-tabContent">
        <div className="tab-pane fade show active" id="v-pills-chamados" role="tabpanel" aria-labelledby="v-pills-chamados-tab" tabIndex={0}>
          <Chamados
            clientes={clientes}
            chamados={chamados}
            feriados={feriados}
            setChamadoSelecionado={setChamadoSelecionado}
          />
        </div>
        <div className="tab-pane fade" id="v-pills-dashboard" role="tabpanel" aria-labelledby="v-pills-dashboard-tab" tabIndex={0}>
          <Dashboard
            clientes={clientes}
            chamados={chamados} />
        </div>

        <div className="tab-pane fade" id="v-pills-formchamados" role="tabpanel" aria-labelledby="v-pills-formchamados-tab" tabIndex={0}>
          <FormChamados
            clientes={clientes}
            chamados={chamados}
            chamadoSelecionado={chamadoSelecionado}
            setChamadoSelecionado={setChamadoSelecionado}
          />
        </div>

        <div className="tab-pane fade container-lg mt-4" id="v-pills-clientes" role="tabpanel" aria-labelledby="v-pills-clientes-tab" tabIndex={0}>
          <div className="row row-cols-1 row-cols-md-4 g-4 w-100" >
            <Clientes clientes={clientes} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;