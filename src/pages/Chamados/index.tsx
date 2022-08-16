import { ICliente, IChamado, IFeriados, IChamadoSelecionado, IColTabelaChamados } from 'interfaces'
import MaterialTable from 'material-table'
import React from 'react'
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import URIs from '../../services/uris.json'
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBug, faClipboard, faEdit, faPaperclip, faTableList } from '@fortawesome/free-solid-svg-icons';
import { MDBBadge, MDBBtn, MDBDropdown, MDBDropdownItem, MDBDropdownLink, MDBDropdownMenu, MDBDropdownToggle, MDBPopover, MDBPopoverBody, MDBPopoverHeader } from 'mdb-react-ui-kit';
import { DateTime } from 'luxon';



const columns1: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const colunasTabelaDefault: IColTabelaChamados = {
  Attachments: { Title: 'Anexo', Show: false },
  Id: { Title: 'ID', Show: true },
  Cliente: { Title: 'Cliente', Show: true },
  Title: { Title: 'Título', Show: true },
  BugEmProducao: { Title: 'Bug em Produção?', Show: false },
  StatusDaQuestao: { Title: 'Status', Show: true },
  Atribuida: { Title: 'Atribuído a', Show: true },
  TipoSolicitacao: { Title: 'Tipo de solicitação', Show: false },
  DescricaoDemanda: { Title: 'Descrição', Show: true },
  EmailCliente: { Title: 'E-mail do cliente', Show: false },
  Modified: { Title: 'Modificado', Show: true },
  diasCorridosSemAtualizar: { Title: 'Dias (corridos) sem atualizar', Show: true },
  diasUteisSemAtualizar: { Title: 'Dias (úteis) sem atualizar', Show: true },
}


{/*
renderCell: (params: any) => (
<div style={{ maxHeight: "230px", maxWidth: "400px", overflowY: "auto", color: "black !important", wordBreak: "break-word" }}>
<span id="DescricaoDemanda">${params?.DescricaoDemanda?.replace(/color:#000000;/g, '').replace(/color&#58;#000000;/g, '')}</span>
</div>
),*/}


function buttonID(chamado: any, handleChamadoSelecionado: any, chamadoSelecionado: IChamadoSelecionado) {

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


  const uriChamado = `${URIs.PClientes}/${chamado.Cliente.InternalNameSubsite}/Lists/${chamado.Cliente.InternalNameSubsiteList}/DispForm.aspx?ID=${chamado.Id}`;

  return (
    <MDBDropdown className='btn-group shadow-sm w-100'>
      <MDBBtn
        block
        className='text-start'
        outline={!(chamado.Id === chamadoSelecionado.Id && chamado.Cliente.Id === chamadoSelecionado.Cliente?.Id)}
        color={geralApenasUmTrue.perigo ? 'danger' : (geralApenasUmTrue.atencao ? 'warning' : 'success')}
        style={{ borderWidth: '.125rem 0 .125rem .125rem', fontSize: '.75rem' }}
        onClick={() => { handleChamadoSelecionado(chamado) }}
        title='Editar chamado'
      >
        <FontAwesomeIcon icon={faEdit} className='me-2' />
        {chamado.Id}

      </MDBBtn>
      <MDBDropdownToggle
        split
        outline={!(chamado.Id === chamadoSelecionado.Id && chamado.Cliente.Id === chamadoSelecionado.Cliente?.Id)}
        style={{ borderWidth: '.125rem .125rem .125rem 0', fontSize: '.75rem' }}
        color={geralApenasUmTrue.perigo ? 'danger' : (geralApenasUmTrue.atencao ? 'warning' : 'success')}
      >
      </MDBDropdownToggle>
      <MDBDropdownMenu>
        <MDBDropdownItem>
          <MDBDropdownLink
            href={uriChamado}
            target='__blank'
          ><FontAwesomeIcon icon={faTableList} className='me-2' />Abrir formulário no PClientes</MDBDropdownLink>
        </MDBDropdownItem>
      </MDBDropdownMenu>
    </MDBDropdown>
  )
}




interface Props {
  clientes: ICliente[]
  chamados: IChamado[]
  feriados?: IFeriados
  chamadoSelecionado: IChamadoSelecionado
  setChamadoSelecionado: React.Dispatch<React.SetStateAction<IChamadoSelecionado>>
}

export default function Chamados(props: Props) {

  function handleChamadoSelecionado(chamado: any) {
    props.setChamadoSelecionado(chamado);
  }

  const chamadosTable = props.chamados.map((chamado: Partial<IChamado>) => (
    {
      id: `${chamado.Id}#${chamado.Cliente?.ID}`,
      ...chamado
    }
  ))


  function domAtribuicao(params: any) {

    return params?.value ? <MDBPopover
      dismiss
      size='sm'
      outline
      className='border-0'
      color='light'
      style={{ border: 0, textTransform: 'initial' }}
      btnChildren={(<div className='border-0'>{params.value?.Title}</div>)}
    >
      <MDBPopoverHeader>{params.value?.Title} <span className='text-muted ms-2' style={{ fontSize: '10px', fontWeight: 500 }}> #{params.value.Id} </span></MDBPopoverHeader>
      <MDBPopoverBody className='d-flex flex-column justify-content-start p-2'>
        
        <span style={{ fontWeight: 600 }}> {params.value.EMail} </span>
        <div className='d-flex flex-row pt-2'>

          <MDBBtn
            outline
            className='p-0 m-0 border-0 me-2'
            style={{ "height": "50px", "width": "50px", borderRadius: '50%' }}
            href={`mailto:${params.value?.EMail}`}
            title='Enviar email pelo Outlook'>
            <img src="https://cdn-icons-png.flaticon.com/512/906/906312.png" alt="Enviar email pelo Outlook" height='100%' width={'100%'} />
          </MDBBtn>
          <MDBBtn
            outline
            className='p-0 m-0 border-0'
            style={{ "height": "50px", "width": "50px", borderRadius: '50%' }}
            href={`https://teams.microsoft.com/l/chat/0/0?users=${params.value?.EMail}`}
            target='__blank'
            title='Enviar mensagem no Microsoft Teams'
          >
            <img src="https://cdn-icons-png.flaticon.com/512/906/906349.png" alt="Enviar mensagem no Microsoft Teams" height='100%' width={'100%'} />
          </MDBBtn>
        </div>
      </MDBPopoverBody>
    </MDBPopover>
      :
      <span className='text-danger ps-3'>Sem atribuição</span>
  }

  function domBug(params: any) {
    return params?.value === 'Sim' ?
      <div className='w-100 text-center'>

        <MDBBadge className='mx-2' color='danger' style={{ fontWeight: 600, fontSize: '14px' }}>
          <FontAwesomeIcon icon={faBug} className='me-2' />
          Sim
        </MDBBadge>
      </div>
      :
      <div className='w-100 text-center'><span>{params?.value}</span></div>
  }

  function domModified(params:any) {

    return <>{DateTime.fromISO(params.value).toFormat('dd/MMM/y T')}</>
  }

  function domDiasDecimalParaHoras(params:any) {
    
    const diasInt = Math.floor(params.value)
    const hrsInt = Math.floor((params.value - diasInt) * 24)

    return <div className={classNames({'text-danger': params.value >= 2.1}, {'text-warning': params.value < 2.1 && params.value >=1.5}, {'text-success': params.value < 1.5})}> {diasInt}d {hrsInt}hrs</div>  }


  const columns: GridColDef[] = [
    { field: 'Attachments', headerName: 'Anexos', width: 70, renderCell: (params: any) => <div className='text-center w-100'><FontAwesomeIcon icon={faPaperclip} className={classNames({ 'd-none': !params.value })} /></div> },
    { field: 'Id', headerName: 'ID', width: 120, renderCell: (params: any) => buttonID(params.row, props.setChamadoSelecionado, props.chamadoSelecionado) },
    { field: 'Cliente', headerName: 'Cliente', width: 120, renderCell: (params: any) => <span>{params.value.Title}</span> },
    { field: 'Title', headerName: 'Título', width: 500 },
    { field: 'BugEmProducao', headerName: 'Bug em Produção?', width: 150, renderCell: (p: any) => domBug(p) },
    { field: 'StatusDaQuestao', headerName: 'Status', width: 200, renderCell: (params: any) => <span className={classNames({ 'text-warning': params.value === 'Aberto' })}>{params.value}</span> },
    { field: 'Atribuida', headerName: 'Atribuído', width: 200, renderCell: (p: any) => domAtribuicao(p) },
    { field: 'TipoSolicitacao', headerName: 'Tipo de solicitação', width: 150 },
    {
      field: 'DescricaoDemanda', headerName: 'Descrição', width: 500,
      renderCell: (params: any) => (

        <div dangerouslySetInnerHTML={{
          __html: `<div style="max-height:230px;max-width:400px;overflow-y:auto;color:initial !important;word-break: break-word;">
      <span id="DescricaoDemanda">${params?.value?.replace(/color:#000000;/g, '').replace(/color&#58;#000000;/g, '')}</span>
      </div>` }}></div>
      ),
    },
    { field: 'EmailCliente', headerName: 'E-mail do cliente', width: 300 },
    { field: 'Modified', headerName: 'Modificado', width: 300, renderCell: (p:any) => domModified(p) },
    { field: 'diasCorridosSemAtualizar', headerName: 'Dias (corridos) sem atualizar', width: 200, renderCell: (p:any) => domDiasDecimalParaHoras(p) },
    { field: 'diasUteisSemAtualizar', headerName: 'Dias (úteis) sem modificar', width: 200, renderCell: (p:any) => domDiasDecimalParaHoras(p) },
  ];



  return (
    <div style={{ height: 800, width: '100%', backgroundColor: 'white' }}>
      <DataGrid
        rows={chamadosTable}
        columns={columns}
        pageSize={100}
        rowHeight={60}
        rowsPerPageOptions={[100]}
        style={{
          backgroundColor: '#333',
          color: '#FFF',
          border: '0',
          fontFamily: '"Roboto", sans-serif !important'
        }}
        sx={{'& .MuiDataGrid-cell': {
          border:0,
          fontFamily: '"Roboto", sans-serif !important'
        }}}
      />
    </div>
  );
}
