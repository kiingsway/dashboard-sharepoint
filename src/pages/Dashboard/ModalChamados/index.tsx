import { faCircle, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IChamado, TAppTabs } from 'interfaces';
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

interface Props {
  toggleModalChamados: any
  modalChamados: any
  setModalChamados: any
  chamadosFiltrados: Array<any>
  tileSelecionada: any
  handleSelecionarChamadoViaModal: (chamado: IChamado) => void
}

export default function ModalChamados(props: Props) {

  function tabelaModal() {
    if (props.tileSelecionada?.Title === 'Clientes com chamados') {
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
            {props.tileSelecionada?.Values?.map((chamado: IChamado) => (
              <tr key={`${chamado.Id}#${chamado.Cliente?.Title}`}>
                <td>
                  <MDBBtn
                  size='sm'
                  title={`Editar chamado #${chamado.Id} da ${chamado.Cliente.Title}`}
                  onClick={()=> props.handleSelecionarChamadoViaModal(chamado)}
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
            <MDBBtn className='btn-close' color='none' onClick={() => props.setModalChamados(!props.modalChamados)}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            {tabelaModal()}
          </MDBModalBody>

        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}