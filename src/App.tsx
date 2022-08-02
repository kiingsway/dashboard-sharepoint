import React, { useEffect, useState } from 'react';
import './App.css';
import * as bootstrap from 'bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableList, faChartPie, faArrowRotateRight, faPlus, faBuilding, faEdit } from '@fortawesome/free-solid-svg-icons'
import Chamados from './pages/Chamados';
import Clientes from './pages/Clientes';
import Dashboard from './pages/Dashboard';
import FormChamados from './pages/Chamados/FormChamados';
import MenuBotao from './components/MenuBotao';
import { obterClientes, obterChamados } from './services/SPRequest';

function App() {

  const triggerTabList = document.querySelectorAll('#myTab button')
  triggerTabList.forEach(triggerEl => {
    const tabTrigger = new bootstrap.Tab(triggerEl)

    triggerEl.addEventListener('click', event => {
      event.preventDefault()
      tabTrigger.show()
    })
  });

  const [chamados, setChamados] = useState<any>([]);
  const [clientes, setClientes] = useState<any>([]);
  const [chamadoSelecionado, setChamadoSelecionado] = useState({ Id: 0, Cliente: "Teste" });
  const [atualizar, setAtualizar] = useState(false)
 

  useEffect(() => {
    obterClientes().then(cls => {

      setChamados([]);

      const clientesData: any = cls.data.value

      setClientes(clientesData);

      for (let cliente of clientesData.slice(0, 5000)) {

        obterChamados(cliente).then((c: any) => {

          const chamadosData: any = c.data.value.map((o: any) => ({
            ...o,
            Cliente: cliente.Title,
            ClienteInternalName: cliente.ClienteInternalName,
            InternalNameSubsite: cliente.InternalNameSubsite,
            InternalNameSubsiteList: cliente.InternalNameSubsiteList
          }));

          setChamados((prevChamados: any) => [...prevChamados, ...chamadosData]);

        });

      }

    });
  }, [atualizar]);

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
          titulo={chamadoSelecionado.Id !== 0 ? `Editando` : 'Novo chamado'}
          internalname='formchamados'
          icon={chamadoSelecionado.Id !== 0 ? faEdit : faPlus}
          contagem={chamadoSelecionado.Id !== 0 ? `#${chamadoSelecionado.Id} ${chamadoSelecionado.Cliente}` : ""}
          mostrarContador={chamadoSelecionado.Id !== 0}
          menuSelecionado={false}
        />

        <hr className='my-4' />

        <button
          type="button"
          className="btn btn-outline-light d-flex justify-content-between align-items-center"
          title='Atualizar chamados e clientes'
          onClick={() => setAtualizar(prev => !prev)}
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
            chamados={chamados}
            setChamadoSelecionado={setChamadoSelecionado}
          />
        </div>
        <div className="tab-pane fade" id="v-pills-dashboard" role="tabpanel" aria-labelledby="v-pills-dashboard-tab" tabIndex={0}>
          <Dashboard
          clientes={clientes}
          chamados={chamados}/>
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
