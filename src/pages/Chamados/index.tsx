import React from 'react'
import MenuSuperior from './MenuSuperior'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableList, faChartPie, faArrowRotateRight, faPlus, faBuilding, faEdit } from '@fortawesome/free-solid-svg-icons'
import URIS from '../../services/uris.json'
import moment from 'moment'
import classNames from 'classnames'
moment.locale('pt-br')

interface Props {
  setChamadoSelecionado: any
  chamados: any
}

export default function Chamados(props: Props) {

  function handleChamadoSelecionado(chamado: any) {
    props.setChamadoSelecionado(chamado);
  }

  function tableActions(chamado: any) {

    const uriChamado = `${URIS.PClientes}/${chamado.InternalNameSubsite}/Lists/${chamado.InternalNameSubsiteList}/DispForm.aspx?ID=${chamado.Id}`;

    const duracao = moment.duration(moment().diff(moment(chamado.Modified)));
    const diffDias = parseFloat((Math.round(duracao.asDays() * 100) / 100).toFixed(1));

    const modificadoAlerta = {
      perigo: diffDias >= 2.5,
      atencao: diffDias >= 2 && diffDias < 2.5,
      sucesso: diffDias < 2
    }

    const statusAlerta = {
      atencao: chamado.StatusDaQuestao === 'Aberto'
    }

    const atribuidoAlerta = {
      perigo: Boolean(chamado?.Atribuido?.Title)
    }

    const geralAlerta = {
      perigo: modificadoAlerta.perigo || atribuidoAlerta.perigo,
      atencao: modificadoAlerta.atencao || statusAlerta.atencao,
      sucesso: modificadoAlerta.sucesso

    }

    return {
      Id: <div className="btn-group">
        <a
          href={uriChamado}
          target='__blank'
          // className="btn btn-sm btn-outline-light"
          className={classNames(
            'btn btn-sm',
            {'btn-outline-danger': geralAlerta.perigo},
            {'btn-outline-warning': geralAlerta.atencao},
            {'btn-outline-success': geralAlerta.sucesso}
          )}
          onClick={() => { handleChamadoSelecionado(chamado) }}
          title='Abrir formulário do chamado'
        >
          <FontAwesomeIcon icon={faTableList} className='me-2' />#{chamado.Id}
        </a>

        <button type="button" className="btn btn-sm btn-outline-light border-0 dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="visually-hidden">Toggle Dropdown</span>
        </button>

        <ul className="dropdown-menu dropdown-menu-end">
          <li><a className="dropdown-item" href="#" onClick={() => { handleChamadoSelecionado(chamado) }}><FontAwesomeIcon icon={faEdit} className='me-2' />Editar chamado</a></li>
        </ul>
      </div>,

      Modified: <span>
        <span className={classNames({
          'text-danger': modificadoAlerta.perigo,
          'text-warning': modificadoAlerta.atencao,
          'text-success': modificadoAlerta.sucesso
        })}>{diffDias}</span>
        {` dia${diffDias > 1 ? 's' : ''} sem modificar ${moment(chamado.Modified).format('DD/MM - HH:mm')}`}
        </span>,

      Status: <div ><span className={classNames({'text-warning': statusAlerta.atencao})}>{`${chamado.StatusDaQuestao}`}</span></div>
    }

  }

  return (
    <div className="container mt-4">
      <MenuSuperior />


      <table className="table table-dark w-100 table-hover" style={{"tableLayout": "auto"}}>

        <colgroup>
          <col span={1} style={{"width": "12%"}} />
          <col span={1} style={{"width": "8%"}} />
          <col span={1} style={{"width": "10%"}} />
          <col span={1} style={{"width": "8%"}} />
          <col span={1} style={{"width": "8%"}} />
          <col span={1} style={{"width": "30%"}} />
          <col span={1} style={{"width": "10%"}} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Cliente</th>
            <th scope="col">Título</th>
            <th scope="col">Status</th>
            <th scope="col">Atribuído a</th>
            <th scope="col">Descrição</th>
            <th scope="col">Modificado</th>
          </tr>
        </thead>
        <tbody>
          {
            props.chamados.map((chamado: any) => (
              <tr key={`${chamado.Id}_${chamado.Cliente}`} >
                <th scope="row">{tableActions(chamado).Id}</th>
                <td>{chamado.Cliente}</td>
                <td>{chamado.Title}</td>
                <td>{tableActions(chamado).Status}</td>
                <td className={classNames({'text-danger': !chamado?.Atribuida?.Title})}>{chamado?.Atribuida?.Title ?? "Sem atribuição"}</td>
                <td dangerouslySetInnerHTML={{ __html: `<div style="max-height:230px;overflow-y:auto;"><span id="DescricaoDemanda">${chamado.DescricaoDemanda}</span></div>` }}></td>
                <td>{tableActions(chamado).Modified}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

