import { faCircle, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IChamado, ITileObject } from 'interfaces';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import './ModalChamados.module.scss'
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from 'mdb-react-ui-kit';
import { ColunasChamados } from 'services/DataTableConfig'

interface Props {
  modalChamados: boolean;
  chamadosFiltrados: Array<any>;
  tileSelecionada?: ITileObject;
  toggleModalChamados: (tile: ITileObject) => void;
  setModalChamados: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelecionarChamadoViaModal: any
}

export default function ModalChamados(props: Props) {

  const clientesColumns: GridColDef[] = [
    { field: 'name', width: 200, headerName: 'Cliente' },
    { field: 'value', width: 180, headerName: 'Qtd. de chamados' },
  ];

  const chamadosColumns: GridColDef[] = [
    { field: 'name', width: 200, headerName: 'Cliente' },
    { field: 'value', width: 180, headerName: 'Qtd. de chamados' },
  ];


  function tabelaModal() {
    if (props.tileSelecionada?.Title === 'Clientes com chamados') {

      const dataTable = props.tileSelecionada?.Values.map((item: any) => ({ ...item, id: item.name }))

      return (
        <div style={{ height: 800, width: '100%', backgroundColor: 'white' }}>
          <DataGrid
            rows={dataTable || []}
            columns={clientesColumns}
            pageSize={100}
            rowHeight={60}
            rowsPerPageOptions={[100]}
            style={{
              backgroundColor: '#333',
              color: '#FFF !important',
              border: '0',
              fontFamily: '"Roboto", sans-serif !important'
            }}
            hideFooter={true}
            rowCount={dataTable?.length}
            sx={{
              '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle, & .MuiSvgIcon-root': {
                border: 0,
                color: '#FFF !important',
                fontFamily: '"Roboto", sans-serif !important'
              }
            }}
          />
        </div>
      )
      return (
        <MDBTable hover>
          <MDBTableHead>
            <tr>
              <th scope='col'>Cliente</th>
              <th scope='col'>Quantidade</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {props.tileSelecionada?.Values?.map((cliente: any) => (
              <tr key={cliente?.name}>
                <td>{cliente?.name}</td>
                <td>{cliente?.value}</td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>)
    } else {

      const dataTable = props.tileSelecionada?.Values.map((item: any) => ({ ...item, id: `${item.Cliente.Id}#${item.Id}` }))

      return (

        <div style={{ height: 800, width: '100%', backgroundColor: 'white' }}>
          <DataGrid
            rows={dataTable || []}
            columns={ColunasChamados()}
            pageSize={100}
            rowHeight={60}
            rowsPerPageOptions={[100]}
            style={{
              backgroundColor: '#333',
              color: '#FFF !important',
              border: '0',
              fontFamily: '"Roboto", sans-serif !important'
            }}
            hideFooter={true}
            rowCount={dataTable?.length}
            sx={{
              '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle, & .MuiSvgIcon-root': {
                border: 0,
                color: '#FFF !important',
                fontFamily: '"Roboto", sans-serif !important'
              }
            }}
          />
        </div>

      )
      return (
        <MDBTable hover>
          <MDBTableHead>
            <tr>
              <th scope='col'></th>
              <th scope='col'>ID</th>
              <th scope='col'>Cliente</th>
              <th scope='col'>Título</th>
              <th scope='col'>Atribuído a</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {props.tileSelecionada?.Values?.map((chamado: IChamado | Partial<IChamado>) => (
              <tr key={`${chamado.Id}#${chamado.Cliente?.Title}`}>
                <td>
                  <MDBBtn
                    size='sm'
                    title={`Editar chamado #${chamado.Id} da ${chamado?.Cliente?.Title}`}
                    onClick={() => props.handleSelecionarChamadoViaModal(chamado)}
                    color='secondary'>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </MDBBtn>
                </td>
                <td>#{chamado?.Id}</td>
                <td>{chamado?.Cliente?.Title}</td>
                <td>{chamado?.Title}</td>
                <td>{chamado?.Atribuida?.Title}</td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>)
    }

  }

  // console.log(props.tileSelecionada)

  return (
    <MDBModal show={props.modalChamados} setShow={props.setModalChamados} tabIndex='-1'>
      <MDBModalDialog size='lg'>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>
              <FontAwesomeIcon icon={props.tileSelecionada?.Icon || faCircle} className='me-2' />
              {props.tileSelecionada?.Title}
            </MDBModalTitle>
            <MDBBtn title='Fechar janela' className='btn-close' color='none' onClick={() => props.setModalChamados(!props.modalChamados)}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            {tabelaModal()}
          </MDBModalBody>

        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}