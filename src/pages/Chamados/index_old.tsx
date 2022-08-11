import React, { useEffect, useState } from 'react'
import MenuSuperior from './MenuSuperior'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableList, faEdit } from '@fortawesome/free-solid-svg-icons'
import URIS from '../../services/uris.json'
import moment from 'moment'
import classNames from 'classnames'
import { IChamado } from 'interfaces'
moment.locale('pt-br')

interface Props {
  setChamadoSelecionado: any
  chamados: any
  clientes: any
  feriados: any
}

export default function Chamados(props: Props) {

  const [chamadosFiltrados, setChamadosFiltrados] = useState([])

  useEffect(() => {

    setChamadosFiltrados(props.chamados)

  }, [props.chamados])
  
  function handleChamadoSelecionado(chamado: any) {
    props.setChamadoSelecionado(chamado);
  }

  function tableActions(chamado: any) {

    const modificadoAlerta = {
      perigo: chamado.diasUteisSemAtualizar >= 2.5,
      atencao: chamado.diasUteisSemAtualizar >= 2 && chamado.diasUteisSemAtualizar < 2.5,
      sucesso: chamado.diasUteisSemAtualizar < 2
    }

    const statusAlerta = {
      atencao: chamado.StatusDaQuestao === 'Aberto'
    }

    const atribuidoAlerta = {
      perigo: !chamado?.Atribuida
    }

    const geralAlerta = {
      perigo: modificadoAlerta.perigo || atribuidoAlerta.perigo,
      atencao: modificadoAlerta.atencao || statusAlerta.atencao,
      sucesso: modificadoAlerta.sucesso
    }

    // Para evitar que múltiplas classes aparecam, aqui é verificado se algum mais 'forte' está true antes de colocar true.
    const geralApenasUmTrue = {
      perigo: geralAlerta.perigo,
      atencao: geralAlerta.atencao && !geralAlerta.perigo,
      sucesso: geralAlerta.sucesso && !geralAlerta.atencao && !geralAlerta.perigo
    }

    const uriChamado = `${URIS.PClientes}/${chamado.Cliente.InternalNameSubsite}/Lists/${chamado.Cliente.InternalNameSubsiteList}/DispForm.aspx?ID=${chamado.Id}`;

    return {
      Id: <div className="btn-group">
        <a
          href={uriChamado}
          target='__blank'
          className={classNames(
            'btn btn-sm',
            { 'btn-outline-success': geralApenasUmTrue.sucesso },
            { 'btn-outline-warning': geralApenasUmTrue.atencao },
            { 'btn-outline-danger': geralApenasUmTrue.perigo }
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

      Modified: <span title={`${chamado.diasCorridosSemAtualizar} dia${chamado.diasCorridosSemAtualizar > 1 ? 's' : ''} corridos sem modificar`}>
        <span className={classNames({
          'text-danger': modificadoAlerta.perigo,
          'text-warning': modificadoAlerta.atencao,
          'text-success': modificadoAlerta.sucesso
        })}>{chamado.diasUteisSemAtualizar}</span>
        {` ${chamado.diasUteisSemAtualizar > 1 ? 'dias úteis' : 'dia útil'} sem modificar ${moment(chamado.Modified).format('DD/MM - HH:mm')}`}
      </span>,

      Status: <div ><span className={classNames({ 'text-warning': statusAlerta.atencao })}>{`${chamado.StatusDaQuestao}`}</span></div>
    }

  }

  return (
    <div className="container mt-4">
      <MenuSuperior clientes={props.clientes} chamadosFiltrados={chamadosFiltrados} setChamadosFiltrados={setChamadosFiltrados} />


      <table className="table table-dark w-100 table-hover">

        <colgroup>
          <col span={1} id='chamadosColID' />
          <col span={1} id='chamadoColCliente' />
          <col span={1} id='chamadoColTítulo' />
          <col span={1} id='chamadoColStatus' />
          <col span={1} id='chamadoColAtribuído' />
          <col span={1} id='chamadoColDescrição' />
          <col span={1} id='chamadoColModificado' />
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
            chamadosFiltrados.map((chamado: IChamado) => {

              const actions = tableActions(chamado);

              const styleCenter: object = {textAlign: 'center', verticalAlign: 'middle'}

              return <tr key={`${chamado.Id}_${chamado.Cliente.Id}`} >
                <th style={styleCenter} scope="row">{actions.Id}</th>
                <td style={styleCenter}>{chamado.Cliente.Title}</td>
                <td style={styleCenter}>{chamado.Title}</td>
                <td style={styleCenter}>{actions.Status}</td>
                <td style={styleCenter} className={classNames({ 'text-danger': !chamado?.Atribuida?.Title })}>{chamado?.Atribuida?.Title ?? "Sem atribuição"}</td>
                <td style={styleCenter} dangerouslySetInnerHTML={{
                  __html: `
                <div style="max-height:230px;max-width:400px;overflow-y:auto;color:white !important;word-break: break-word;">
                  <span id="DescricaoDemanda">${chamado?.DescricaoDemanda?.replace(/color:#000000;/g, '').replace(/color&#58;#000000;/g, '')}</span>
                </div>` }}></td>
                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>{actions.Modified}</td>
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  )
}

