import { useEffect, useState } from 'react';
import moment, { max } from 'moment';
import 'moment/locale/pt-br'
import Chamados from './pages/Chamados';
import Clientes from './pages/Clientes';
import Dashboard from './pages/Dashboard';
import FormChamados from './pages/FormChamados';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import './App.css';
import { MDBTabsContent, MDBTabsPane } from 'mdb-react-ui-kit';
import { IChamado, ICliente, IChamadoSelecionado, TAppTabs, IFeriado } from 'interfaces'
import HeaderApp from 'components/HeaderApp';
import { obterClientes, obterChamados, obterFeriados } from 'services/GetDashboardHelper'
import HeaderErrors from 'components/HeaderErrors';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

moment.locale('pt-br')

function App() {

  const [chamados, setChamados] = useState<IChamado[]>([]);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [chamadoSelecionado, setChamadoSelecionado] = useState<IChamadoSelecionado>({ Id: 0 })

  const [erros, setErros] = useState([]);

  const [feriados, setFeriados] = useState<any>({});
  const [atualizacaoPagina, setAtualizacaoPagina] = useState({ clientes: false, chamados: false, campos: false });
  const [appTab, setAppTab] = useState<TAppTabs>('tabFormChamado');


  function handleGetClientesChamados() {

    // Clientes e Chamados: Obtém os clientes e a resposta vai para setClientes.
    // A cada cliente, é obtido os chamados e adicionados com setChamados.
    // Tratamento de erro da requisição em handleErrors().
    obterClientes()
    .catch(e => handleErrors(e) )
    .then((listClientes:any) => {
      const itensClientes: ICliente[] = listClientes.data.value;
      setClientes(itensClientes);      
      for (let cliente of itensClientes.splice(0,10)) {        
        obterChamados(cliente)
        .catch(e => handleErrors(e) )
        .then((listChamados:any) => {

          // Adicionando propriedades adicionais ao chamado
          const itensChamados: IChamado[] = listChamados.data.value.map((item:IChamado) => ({
            ...item,
            Cliente: cliente,
            diasCorridosSemAtualizar: DateTime.now().diff(DateTime.fromISO(item.Modified),'days').days,
            diasUteisSemAtualizar: 0
          }))

          setChamados((prevChamados: any) => [...prevChamados, ...itensChamados]);
        })
      }
    });

  }

  function handleGetFeriados() {

    // Feriados: Obtendo a informação do Local Storage
    const feriadosLocalStorage = JSON.parse(localStorage.getItem('dashboard.feriados') || '{}')
    const hoje = DateTime.now().toISODate();

    // Caso a data do Local Storage seja igual a hoje, use a informação do storage.
    if (feriadosLocalStorage.DataRequisicao === hoje) setFeriados(feriadosLocalStorage)

    // Caso não exista no Local Storage ou esteja desatualizada,
    // Faça requisição para o Sharepoint, salve no useState de Feriados e no Local Storage.
    else obterFeriados().then((listferiados: any) => {

      // const datasFeriados = listferiados.data.value.map((item: any) => moment(item.Data).format('YYYY-MM-DD'));
      const datasFeriados: string[] = listferiados.data.value.map((item: any) => DateTime.fromISO(item.Data).toISODate());

      const feriadosData: IFeriado = { DataRequisicao: hoje, Datas: datasFeriados };

      localStorage.setItem('dashboard.feriados', JSON.stringify(feriadosData));
      setFeriados(feriadosData);
    })

  }

  function handleErrors (e:any) {

    e.id = uuidv4();
    setErros(prevErros => prevErros.length === 0 ? e : [e, ...prevErros]);

  }

  useEffect(() => {

    handleGetClientesChamados();
    handleGetFeriados();
    
  }, [])

  useEffect(() => {

    // Obtém as datas de hoje, do início do dia (hoje meia noite) e
    // o quanto já passou de agora para o início do dia.
    const hoje = DateTime.now()
    const inicioDia = hoje.startOf('day')
    const contagemDeHoje: number = hoje.diff(inicioDia, 'day').days

    chamados.map((chamado:IChamado) => {

      const anterior = DateTime.fromISO(chamado.Modified);
      const diffCorridos = hoje.diff(anterior,'days').days

      let diffUteis = diffCorridos
      let dataAtual = DateTime.now()
      let contSubtrairDias = 0;
      let cont = 1;
      const maxCont = 365;

      // Enquanto a Data Atual for maior que anterior
      // cont e maxCont definem o máximo para o loop contar.
      while (cont <= maxCont && dataAtual >= anterior) {

        // Caso a Data Atual for sábado, domingo ou a data conter nos feriados...
        if(dataAtual.weekday == 7 || dataAtual.weekday == 6 || feriados.Datas.includes(dataAtual.toISODate())) {

          // Caso a Data Atual seja Hoje,
          // diminui apenas a diferença entre hoje e meia noite de hoje. Se não, diminua 1
          contSubtrairDias += dataAtual === hoje ? contagemDeHoje : 1
        }

        console.log(dataAtual.toISODate() + ' | weekday: ' + dataAtual.weekday + ' | Feriado ou FDS? ' + (feriados.Datas.includes(dataAtual.toISODate()) || dataAtual.weekday == 7 || dataAtual.weekday == 6) )
        dataAtual = dataAtual.minus({'days': 1})
        cont++;
      }

      if(cont>=maxCont) console.error(`Loop de contagem estourado. Limite: ${maxCont}`)

      console.log(
        `Data atual: ${hoje.toISODate()} | Data anterior: ${anterior.toISODate()}\n` +
        `Diff corrida: ${parseFloat(diffCorridos.toFixed(1))} | Diff Úteis: ${parseFloat(diffUteis.toFixed(1))  - contSubtrairDias}`
      )

    });

  }, [chamados])

  return (
    <>
      <HeaderApp
        chamadoSelecionado={chamadoSelecionado}
        qtdChamados={chamados.length}
        qtdClientes={clientes.length}
        obterChamadosEClientes={handleGetClientesChamados}
        appTab={appTab}
        setAppTab={setAppTab}
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

        <MDBTabsPane className='container mt-4' show={appTab === 'tabClientes'}>
          <Clientes clientes={clientes} />
        </MDBTabsPane>

      </MDBTabsContent>
    </>
  )
}

export default App;