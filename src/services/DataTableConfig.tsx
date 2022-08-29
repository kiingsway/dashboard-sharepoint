import React from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { faBug, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { MDBBadge, MDBBtn } from 'mdb-react-ui-kit';
import URIs from 'services/uris.json'

type types = 'Attachments' | 'Id' | 'Cliente' | 'Title' | 'BugEmProducao' | 'StatusDaQuestao' | 'Atribuida' | 'TipoSolicitacao' | 'DescricaoDemanda' | 'EmailCliente' | 'Modified' | 'diasCorridosSemAtualizar' | 'diasUteisSemAtualizar'

export function ColunasChamados() {

  const renderCell = (p:any) => columnsRender(p)[p.field as types]  

  const col: GridColDef[] = [
    { field: 'Attachments', headerName: 'Anexos', width: 70, renderCell },
    { field: 'Id', headerName: 'ID', width: 120 },
    { field: 'Cliente', headerName: 'Cliente', width: 150, renderCell },
    { field: 'Title', headerName: 'Título', width: 500 },
    { field: 'BugEmProducao', headerName: 'Bug em Produção?', width: 150, renderCell },
    { field: 'StatusDaQuestao', headerName: 'Status', width: 200 },
    { field: 'Atribuida', headerName: 'Atribuído', width: 200 },
    { field: 'TipoSolicitacao', headerName: 'Tipo de solicitação', width: 150 },
    { field: 'DescricaoDemanda', headerName: 'Descrição', width: 500 },
    { field: 'EmailCliente', headerName: 'E-mail do cliente', width: 300 },
    { field: 'Modified', headerName: 'Modificado', width: 300 },
    { field: 'diasCorridosSemAtualizar', headerName: 'Dias (corridos) sem atualizar', width: 200 },
    { field: 'diasUteisSemAtualizar', headerName: 'Dias (úteis) sem modificar', width: 200 },
  ];

  return col
}

function columnsRender(params: GridRenderCellParams<any, any, any>) {
  return {
    Attachments: <div className='text-center w-100'><FontAwesomeIcon icon={faPaperclip} className={classNames({ 'd-none': !params.value })} /></div>,
    Cliente: <MDBBtn outline tag='a' className='m-0 border-0 me-2 text-capitalize px-1' color='light' target='__blank'
      href={`${URIs.PClientes}/${params.value.InternalNameSubsite || ''}`}
      title={`Abrir portal de chamados da ${params.value.Title}`}>{params.value.Title}</MDBBtn>,
    BugEmProducao: params?.value === 'Sim' ?
      <div className='w-100 text-center'>

        <MDBBadge className='mx-2' color='danger' style={{ fontWeight: 600, fontSize: '14px' }}>
          <FontAwesomeIcon icon={faBug} className='me-2' />
          Sim
        </MDBBadge>
      </div>
      :
      <div className='w-100 text-center' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}><span>{params?.value}</span></div>,

    Id: <></>,
    Title: <></>,
    StatusDaQuestao: <></>,
    Atribuida: <></>,
    TipoSolicitacao: <></>,
    DescricaoDemanda: <></>,
    EmailCliente: <></>,
    Modified: <></>,
    diasCorridosSemAtualizar: <></>,
    diasUteisSemAtualizar: <></>,
  }
}