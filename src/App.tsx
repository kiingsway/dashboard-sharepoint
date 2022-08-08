import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br'
import Chamados from './pages/Chamados';
import Clientes from './pages/Clientes';
import Dashboard from './pages/Dashboard';
import FormChamados from './pages/FormChamados';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import './App.css';
import { obterClientes as obterClientes1, obterChamados as obterChamados1, obterFeriados as obterFeriados1 } from './services/SPRequest';
import { MDBTabsContent, MDBTabsPane } from 'mdb-react-ui-kit';
import { IChamado, ICliente, IChamadoSelecionado, TAppTabs } from 'interfaces'
import HeaderApp from 'components/HeaderApp';
import { obterClientes, obterChamados, obterFeriados } from 'services/GetDashboardHelper'
import HeaderErrors from 'components/HeaderErrors';
import { DateTime } from 'luxon';

moment.locale('pt-br')


function App() {

  const [chamados, setChamados] = useState<IChamado[]>([]);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [chamadoSelecionado, setChamadoSelecionado] = useState<IChamadoSelecionado>({ Id: 0 })

  const [erros, setErros] = useState([1]);

  const [feriados, setFeriados] = useState<any>({});
  const [atualizacaoPagina, setAtualizacaoPagina] = useState({ clientes: false, chamados: false, campos: false });
  const [appTab, setAppTab] = useState<TAppTabs>('tabFormChamado');


  function obterChamadosEClientes() {

  }

  useEffect(() => {

    obterClientes()
    .catch(e => {
      e.id = DateTime.now().toFormat('x');
      setErros(prevErros => prevErros.length === 0 ? e : [e, ...prevErros]);
    })
    .then((listClientes:any) => {
      const itensClientes: ICliente[] = listClientes.data.value;
      
      for (let cliente of itensClientes) {
        
        obterChamados(cliente)        
        .catch(e => {
          e.id = DateTime.now().toFormat('x');
          setErros(prevErros => prevErros.length === 0 ? e : [e, ...prevErros]);
        })
        .then((listChamados:any) => {
          const itensChamados: IChamado[] = listChamados.data.value;

          console.log(itensChamados);          
        })
      }
    });

    
    // obterClientes()
    //   .then(d => console.log(d))
    //   .catch(e => {

    //     e.id = DateTime.now().toFormat('x')
    //     setErros(prevErros => prevErros.length === 0 ? e : [e, ...prevErros])
    //   });

    // computarFeriados();
    // obterChamadosEClientes();
  }, [])

  // return null


  return (
    <>
      <HeaderApp
        chamadoSelecionado={chamadoSelecionado}
        qtdChamados={chamados.length}
        qtdClientes={clientes.length}
        obterChamadosEClientes={obterChamadosEClientes}
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