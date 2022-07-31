import React, { useState } from 'react';
import './App.css';
import * as bootstrap from 'bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableList, faChartPie, faArrowRotateRight, faPlus, faBuilding } from '@fortawesome/free-solid-svg-icons'
import Chamados from './pages/Chamados';
import Clientes from './pages/Clientes';
import Dashboard from './pages/Dashboard';
import NovoChamado from './pages/NovoChamado';

function App() {

  const triggerTabList = document.querySelectorAll('#myTab button')
  triggerTabList.forEach(triggerEl => {
    const tabTrigger = new bootstrap.Tab(triggerEl)

    triggerEl.addEventListener('click', event => {
      event.preventDefault()
      tabTrigger.show()
    })
  });

  const [chamados, setChamados] = useState<any>([])

  return (
    <div className="d-flex align-items-start m-2">
      <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">

        <button
          className="nav-link active d-flex justify-content-between align-items-center"
          id="v-pills-chamados-tab"
          data-bs-toggle="pill"
          data-bs-target="#v-pills-chamados"
          type="button"
          role="tab"
          aria-controls="v-pills-chamados"
          aria-selected="true"
          title='Chamados'
        >
          <div>

          <FontAwesomeIcon icon={faTableList} className='me-2' />
          Chamados
          </div>
          <span className="badge rounded-pill text-bg-light">0</span>
        </button>

        <button
          className="nav-link d-flex justify-content-between align-items-center"
          id="v-pills-clientes-tab"
          data-bs-toggle="pill"
          data-bs-target="#v-pills-clientes"
          type="button"
          role="tab"
          aria-controls="v-pills-clientes"
          aria-selected="false"
          title='Clientes'

        >
          <div>
            <FontAwesomeIcon icon={faBuilding} className='me-2' />
            Clientes
          </div>
          <span className="badge rounded-pill text-bg-light">0</span>
        </button>

        <button
          className="nav-link  d-flex justify-content-between align-items-center"
          id="v-pills-dashboard-tab"
          data-bs-toggle="pill"
          data-bs-target="#v-pills-dashboard"
          type="button"
          role="tab"
          aria-controls="v-pills-dashboard"
          aria-selected="false"
          title='Dashboard'

        >
          <div>

          <FontAwesomeIcon icon={faChartPie} className='me-2' />
          Dashboard
          </div>
        </button>

        <hr className='my-4' />
        <button
          className="nav-link  d-flex justify-content-between align-items-center"
          id="v-pills-novoChamado-tab"
          data-bs-toggle="pill"
          data-bs-target="#v-pills-novoChamado"
          type="button"
          role="tab"
          aria-controls="v-pills-novoChamado"
          aria-selected="false"
          title='Novo chamado'

        >
          <div>

          <FontAwesomeIcon icon={faPlus} className='me-2' />
          Novo chamado
          </div>
        </button>


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

      <div className="tab-content" id="v-pills-tabContent">
        <div className="tab-pane fade show active" id="v-pills-chamados" role="tabpanel" aria-labelledby="v-pills-chamados-tab" tabIndex={0}>
          <Chamados
            chamados={chamados}
          />
        </div>
        <div className="tab-pane fade" id="v-pills-dashboard" role="tabpanel" aria-labelledby="v-pills-dashboard-tab" tabIndex={0}><Dashboard/></div>
        <div className="tab-pane fade" id="v-pills-novoChamado" role="tabpanel" aria-labelledby="v-pills-novoChamado-tab" tabIndex={0}><NovoChamado/></div>
        <div className="tab-pane fade" id="v-pills-clientes" role="tabpanel" aria-labelledby="v-pills-clientes-tab" tabIndex={0}><Clientes/></div>
      </div>
    </div>
  );
}

export default App;
