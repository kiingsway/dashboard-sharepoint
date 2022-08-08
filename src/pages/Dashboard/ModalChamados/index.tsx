import React, { useEffect, useState } from 'react';
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
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  toggleModalChamados: any
  modalChamados: any
  setModalChamados: any
  chamadosFiltrados: Array<any>
  setSelecionarChamado: any
  tileSelecionada: any
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
            {props.tileSelecionada?.Values?.map((chamado: any) => (
              <tr key={`${chamado.Id}#${chamado.Cliente}`}>
                <td width={'70px'}>
                  <MDBBtn title='Editar chamado' onClick={props.setSelecionarChamado}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </MDBBtn>
                </td>
                <td>#{chamado?.Id}</td>
                <td>{chamado?.Cliente}</td>
                <td>{chamado?.Title}</td>
                <td>{chamado?.Atribuida?.Title}</td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>)
    }

  }

  return (
    <MDBModal show={props.modalChamados} setShow={props.setModalChamados} tabIndex='-1'>
      <MDBModalDialog size='lg'>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{props.tileSelecionada?.Title}</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={props.toggleModalChamados}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            {tabelaModal()}
          </MDBModalBody>

        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}