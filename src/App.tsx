import React, { useState } from 'react';
import './App.css';
import * as bootstrap from 'bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableList, faChartPie, faArrowRotateRight, faPlus, faBuilding } from '@fortawesome/free-solid-svg-icons'
import Chamados from './pages/Chamados';
import Clientes from './pages/Clientes';
import Dashboard from './pages/Dashboard';
import NovoChamado from './pages/NovoChamado';
import MenuBotao from './components/MenuBotao';

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


  return (
    <div className="d-flex align-items-start m-2">
      <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical" style={{minWidth: "167px"}}>

        <MenuBotao titulo={'Chamados'} internalname='chamados' icon={faTableList} mostrarContador={true} contagem={0} menuSelecionado={true} />
        <MenuBotao titulo={'Clientes'} internalname='clientes' icon={faBuilding} mostrarContador={true} contagem={0} menuSelecionado={false} />
        <MenuBotao titulo={'Dashboard'} internalname='dashboard' icon={faChartPie} mostrarContador={false} menuSelecionado={false} />
        <hr className='my-4' />
        <MenuBotao titulo={'Novo chamado'} internalname='novochamado' icon={faPlus} mostrarContador={false} menuSelecionado={false} />
        <hr className='my-4' />
        <button
          type="button"
          className="btn btn-outline-light d-flex justify-content-between align-items-center"
          title='Atualizar chamados e clientes'
          >
            <div>

            <FontAwesomeIcon icon={faArrowRotateRight} className='me-2' />
            Atualizar
            </div>
          <span className="badge rounded-pill text-bg-light">00:00</span>
        </button>
      </div>

      <div className="tab-content" id="v-pills-tabContent" style={{width: "100%"}}>
        <div className="tab-pane fade show active" id="v-pills-chamados" role="tabpanel" aria-labelledby="v-pills-chamados-tab" tabIndex={0}>
          <Chamados
            chamados={chamados}
          />
        </div>
        <div className="tab-pane fade" id="v-pills-dashboard" role="tabpanel" aria-labelledby="v-pills-dashboard-tab" tabIndex={0}><Dashboard/></div>
        <div className="tab-pane fade" id="v-pills-novochamado" role="tabpanel" aria-labelledby="v-pills-novochamado-tab" tabIndex={0}><NovoChamado/></div>
        <div className="tab-pane fade" id="v-pills-clientes" role="tabpanel" aria-labelledby="v-pills-clientes-tab" tabIndex={0}><Clientes clientes={clientes}/></div>
      </div>
    </div>
  );
}

export default App;
