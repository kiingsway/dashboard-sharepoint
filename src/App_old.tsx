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

function App() {

  /*const triggerTabList = document.querySelectorAll('#myTab button')
  triggerTabList.forEach(triggerEl => {
    const tabTrigger = new bootstrap.Tab(triggerEl)

    triggerEl.addEventListener('click', event => {
      event.preventDefault()
      tabTrigger.show()
    })
  });*/


  const [chamados, setChamados] = useState<any>([]);
  const [clientes, setClientes] = useState<any>([]);
  const [chamadoSelecionado, setChamadoSelecionado] = useState({ Id: 0, Cliente: "" });
  const [feriados, setFeriados] = useState<any>()

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

    obterClientes().then(listClientes => {

      // Zerando chamados
      setChamados([]);

      const itensClientes: any = listClientes.data.value

      setClientes(itensClientes);

      for (let itemCliente of itensClientes.slice(0, 5)) {

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

            try {
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
            }

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

        });

      }

    });

  }

  useEffect(() => {
    computarFeriados();
    obterChamadosEClientes();
  }, [])

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