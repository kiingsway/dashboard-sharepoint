import { useEffect, useState } from 'react';
import Chamados from './pages/Chamados';
import Clientes from './pages/Clientes';
import Dashboard from './pages/Dashboard';
import FormChamados from './pages/FormChamados';

import HeaderErrors from 'components/HeaderErrors';
import HeaderApp from 'components/HeaderApp';
import { obterClientes, obterChamados, obterFeriados } from 'services/GetDashboardHelper'
import { IChamado, ICliente, IChamadoSelecionado, TAppTabs, IFeriado, IAtualizacaoSecao } from 'interfaces'
import { diffBusinessDays } from 'services/FunctionHelpers';

import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import './App.css';
import { MDBTabsContent, MDBTabsPane } from 'mdb-react-ui-kit';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

function App() {

  const [chamados, setChamados] = useState<IChamado[]>([]);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [chamadoSelecionado, setChamadoSelecionado] = useState<IChamadoSelecionado>({ Id: 0 })
  const [feriados, setFeriados] = useState<IFeriado>({});
  const [appTab, setAppTab] = useState<TAppTabs>('tabFormChamado');
  const [erros, setErros] = useState([]);
  const [atualizacaoSecao, setAtualizacaoSecao] = useState<IAtualizacaoSecao>({ clientes: false, chamados: false, campos: false });



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
    .then((listClientes: any) => {
      const itensClientes: ICliente[] = listClientes.data.value;
      setClientes(itensClientes);
      setChamados([]);
      setAtualizacaoSecao(prevAtt => ({ ...prevAtt, clientes: false}));
        for (let cliente of itensClientes.splice(0, 10)) {
          obterChamados(cliente)
            .catch(e => handleErrors(e))
            .then((listChamados: any) => {

              // Adicionando propriedades adicionais ao chamado
              const itensChamados: IChamado[] = listChamados.data.value.map((item: IChamado) => ({
                ...item,
                Cliente: cliente,
                diasCorridosSemAtualizar: DateTime.now().diff(DateTime.fromISO(item.Modified), 'days').days.toFixed(1),
                diasUteisSemAtualizar: diffBusinessDays(DateTime.fromISO(item.Modified), DateTime.now(), feriados?.Datas).toFixed(1)
              }))

              setChamados((prevChamados: any) => [...prevChamados, ...itensChamados]);
            })
        }
        setAtualizacaoSecao(prevAtt => ({ ...prevAtt, chamados: false }));
      });

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
    const lsFeriados: IFeriado = JSON.parse(localStorage.getItem('dashboard.feriados') || '{}')
    const hoje = DateTime.now().toISODate();

    // Caso Local Storage esteja atualizado (DataRequisicao === hoje) ou
    // Tamanho da array Datas é maior que um, use os feriados do Local Storage.
    if (lsFeriados.DataRequisicao === hoje || (lsFeriados.Datas?.length || 0) > 0) setFeriados(lsFeriados)

    // Caso Local Storage não exista ou está desatualizado ou Datas é vazio
    // obtém os itens no Sharepoint e salva no setFeriados e no Local Storage.
    else obterFeriados().then((listferiados: any) => {

      // Transformando o objeto retornado em apenas uma array de strings com as datas dos feriados.
      const datasFeriados: string[] = listferiados.data.value.map((item: any) => DateTime.fromISO(item.Data).toISODate());

      const feriadosData: IFeriado = { DataRequisicao: hoje, Datas: datasFeriados };

      localStorage.setItem('dashboard.feriados', JSON.stringify(feriadosData));
      setFeriados(feriadosData);
    })

  }

  /**
   * Guarda os erros na array 'erros' pelo setErros.
   * Essa array é usada para mostrar os erros que as requisições deram para o usuário.
   * 
   * @param e Objeto de erros obtidas do catch da função da requisição.
   */
  function handleErrors(e: any) {
    e.id = uuidv4();
    setErros(prevErros => prevErros.length === 0 ? e : [e, ...prevErros]);
  }

  // Executado na primeira abertura da aplicação.
  useEffect(() => { handleGetClientesChamados(); handleGetFeriados(); }, [])

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

      <HeaderErrors
        erros={erros}
        setErros={setErros}
      />

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
          <Chamados
            clientes={clientes}
            chamados={chamados}
            feriados={feriados}
            setChamadoSelecionado={setChamadoSelecionado}
          />
        </MDBTabsPane>
        <MDBTabsPane className='container mt-4' show={appTab === 'tabDashboard'}>
          <Dashboard
          setChamadoSelecionado={setChamadoSelecionado}
            clientes={clientes}
            chamados={chamados} />
        </MDBTabsPane>

        <MDBTabsPane className='container mt-4' show={appTab === 'tabClientes'}>
          <Clientes clientes={clientes} />
        </MDBTabsPane>

      </MDBTabsContent>
    </>
  )
}

export default App;