import { useEffect, useState } from 'react';
import Chamados from './pages/Chamados';
import Clientes from './pages/Clientes';
import Dashboard from './pages/Dashboard';
import FormChamados from './pages/FormChamados';

import HeaderErrors from 'components/HeaderErrors';
import HeaderApp from 'components/HeaderApp';
import { obterClientes, obterChamados, obterFeriados } from 'services/GetDashboardHelper'
import { IChamado, ICliente, IChamadoSelecionado, TAppTabs, ILocalStorageFeriado, IAtualizacaoSecao } from 'interfaces'
import { diffBusinessDays } from 'services/FunctionHelpers';

import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import './App.css';
import { MDBBtn, MDBTabsContent, MDBTabsPane } from 'mdb-react-ui-kit';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

function App() {

  const [chamados, setChamados] = useState<IChamado[]>([]);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [chamadoSelecionado, setChamadoSelecionado] = useState<IChamadoSelecionado>({ Id: 0 })
  const [feriados, setFeriados] = useState<ILocalStorageFeriado>({});
  const [appTab, setAppTab] = useState<TAppTabs>('tabFormChamado');
  const [erros, setErros] = useState([]);
  const [atualizacaoSecao, setAtualizacaoSecao] = useState<IAtualizacaoSecao>({ clientes: false, chamados: false, slcChamados: false, formChamados: false });

  function handleAtualizarChamadoLista(cliente: any, chamado: any) {

    function removerChamado(ch: any) {
      return ch.Id !== chamado.Id && ch.Cliente.Id !== cliente.Id
    }

    const chamadoEcliente = { ...chamado, Cliente: cliente };

    setChamados(prevChamados => [...prevChamados.filter(removerChamado), chamadoEcliente])

    setChamadoSelecionado(chamadoEcliente);

  }

  /**
   * Obtém informações dos clientes e para cada cliente é obtido seus chamados em suas listas respectivas.
   * Clientes e chamados são salvos no state setClientes e setChamados respectivamente.
   *
   * Nos objetos dos chamados são adicionadas propriedades referentes aos dias corridos e úteis sem atualização e
   * informações do cliente a qual o chamado pertence.
   * 
   * @returns void
   */
  function handleGetClientesChamados() {
    setAtualizacaoSecao(prevAtt => ({ ...prevAtt, clientes: true, chamados: true }));

    obterClientes()
      .catch(e => handleErrors(e))
      .finally(() => setAtualizacaoSecao(prevAtt => ({ ...prevAtt, clientes: false })))
      .then((listClientes: any) => {
        const itensClientes: ICliente[] = listClientes.data.value.slice(0, 15);
        const batchClientes = itensClientes.map((cliente: ICliente) => obterChamados(cliente));
        setClientes(itensClientes);


        // Promise.all para obter todos os chamados de uma vez
        Promise.all(batchClientes)
          .catch(e => handleErrors(e))
          .finally(() => setAtualizacaoSecao(prevAtt => ({ ...prevAtt, chamados: false })))
          .then((batchChamados: any) => {
            setChamados([]);

            const itemsChamados: IChamado[] = [].concat.apply(
              [], batchChamados.map((listChamados: IChamado[]) =>
                listChamados.map((chamado: IChamado) =>
                ({
                  ...chamado,
                  diasCorridosSemAtualizar: DateTime.now().diff(DateTime.fromISO(chamado.Modified), 'days').days.toFixed(1),
                  diasUteisSemAtualizar: diffBusinessDays(DateTime.fromISO(chamado.Modified), DateTime.now(), feriados?.Datas).toFixed(1)

                }))
              )
            );
            setChamados(itemsChamados)
          })
      })
  }

  /**
   * Obtém todos os feriados desde hoje até a um ano atrás.
   * 
   * Os feriados são obtidos a partir de uma lista Sharepoint e salvo no state setFeriados e também no Local Storage.
   * Caso já exista feriados no Local Storage ('dashboard.feriados'), ele esteja atualizado (propriedade 'DataRequisicao' ser data de hoje)
   * e contenha algum valor no array da propriedade 'Datas', o setFeriados será com a informação do Local Storage.
   * 
   * Caso não esteja no Local Storage, é obtido de uma lista Sharepoint e depois salvo no Local Storage.
   * 
   * @returns void
   */
  function handleGetFeriados() {

    // Feriados: Obtendo a informação do Local Storage.
    const lsFeriados: ILocalStorageFeriado = JSON.parse(localStorage.getItem('dashboard.feriados') || '{}')
    const hoje = DateTime.now().toISODate();

    // Caso Local Storage esteja atualizado (DataRequisicao === hoje) ou
    // Tamanho da array Datas é maior que um, use os feriados do Local Storage.
    if (lsFeriados.DataRequisicao === hoje || (lsFeriados.Datas?.length || 0) > 0) setFeriados(lsFeriados)

    // Caso Local Storage não exista ou está desatualizado ou Datas é vazio
    // obtém os itens no Sharepoint e salva no setFeriados e no Local Storage.
    else obterFeriados().then((listferiados: any) => {

      // Transformando o objeto retornado em apenas uma array de strings com as datas dos feriados.
      const datasFeriados: string[] = listferiados.data.value.map((item: any) => DateTime.fromISO(item.Data).toISODate());

      const feriadosData: ILocalStorageFeriado = { DataRequisicao: hoje, Datas: datasFeriados };

      localStorage.setItem('dashboard.feriados', JSON.stringify(feriadosData));
      setFeriados(feriadosData);
    })

  }

  /**
   * Guarda os erros na array 'erros' pelo setErros.
   * Essa array é usada para mostrar os erros que as requisições deram para o usuário.
   * 
   * @param e Objeto de erros obtidas do catch da função da requisição.
   * @returns void
   */
  function handleErrors(e: any) {
    setErros(prevErros => prevErros.length === 0 ? e : [{ ...e, id: uuidv4() }, ...prevErros]);
  }

  function handleSelecionarChamado(chamado: IChamadoSelecionado, tab: TAppTabs = 'tabFormChamado') {
    setChamadoSelecionado(chamado);
    if (tab) setAppTab('tabFormChamado');
  }

  // Executado na primeira abertura da aplicação.
  useEffect(() => {
    handleGetClientesChamados();
    handleGetFeriados();
  }, [])

  return (
    <>
      <HeaderApp
        chamadoSelecionado={chamadoSelecionado}
        qtdChamados={chamados.length}
        qtdClientes={clientes.length}
        appTab={appTab}
        atualizacaoSecao={atualizacaoSecao}
        handleGetClientesChamados={handleGetClientesChamados}
        setAppTab={setAppTab}
        setAtualizacaoSecao={setAtualizacaoSecao}
      />

      {/* <HeaderErrors
        erros={erros}
        setErros={setErros}
      /> */}

      <MDBTabsContent>
        <MDBTabsPane className='container-lg p-0' show={appTab === 'tabFormChamado'}>
          {/* <MDBBtn
            color='danger'
            className={chamadoSelecionado.Id === 0 ? 'd-none' : ''}
            onClick={() => setChamadoSelecionado({ Id: 0 })}
          >
            Cancelar edição
          </MDBBtn> */}
          <FormChamados
            clientes={clientes}
            chamados={chamados}
            chamadoSelecionado={chamadoSelecionado}
            handleSelecionarChamado={handleSelecionarChamado}
            atualizacaoSecao={atualizacaoSecao}
            setAtualizacaoSecao={setAtualizacaoSecao}
            handleAtualizarChamadoLista={handleAtualizarChamadoLista}
          />
        </MDBTabsPane>
        <MDBTabsPane className='container-fluid m-0 p-0' show={appTab === 'tabChamados'}>
          {/* <Chamados
            clientes={clientes}
            chamados={chamados}
            feriados={feriados.Datas}
            chamadoSelecionado={chamadoSelecionado}
            setChamadoSelecionado={setChamadoSelecionado}
          /> */}
        </MDBTabsPane>
        <MDBTabsPane className='container mt-4' show={appTab === 'tabDashboard'}>
          <Dashboard
            clientes={clientes}
            chamados={chamados}
            handleSelecionarChamado={handleSelecionarChamado}
          />
        </MDBTabsPane>

        <MDBTabsPane className='container mt-4' show={appTab === 'tabClientes'}>
          <Clientes clientes={clientes} />
        </MDBTabsPane>

      </MDBTabsContent>
    </>
  )
}

export default App;