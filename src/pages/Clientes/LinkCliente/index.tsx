import React from 'react'
import URIs from '../../../services/uris.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableCellsLarge, faList, faAdd } from '@fortawesome/free-solid-svg-icons'
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem, MDBDropdownLink, MDBBtn } from 'mdb-react-ui-kit';


interface Props {
    cliente: any
}

export default function LinkCliente(props: Props) {
    const urlPortal = `${URIs.PClientes}/${props.cliente.InternalNameSubsite}`;
    const urlList = `${urlPortal}/Lists/${props.cliente.InternalNameSubsiteList}`;
    const urlNewForm = `${urlList}/NewForm.aspx`;

    return (
        <MDBDropdown className='btn-group'>
            <MDBBtn href={urlPortal} target="__blank" color='secondary'>
                <FontAwesomeIcon icon={faTableCellsLarge} className='me-2' />
                Ir para o portal
            </MDBBtn>
            <MDBDropdownToggle color='secondary' split></MDBDropdownToggle>
            <MDBDropdownMenu>
                <MDBDropdownItem>
                    <MDBDropdownLink target="__blank" href={urlList}>
                        <FontAwesomeIcon icon={faList} className='me-2' />Lista de chamados
                    </MDBDropdownLink>
                </MDBDropdownItem>
                <MDBDropdownItem>
                    <MDBDropdownLink target="__blank" href={urlNewForm}>
                        <FontAwesomeIcon icon={faAdd} className='me-2' />Formulário de novo chamado
                    </MDBDropdownLink>
                </MDBDropdownItem>
            </MDBDropdownMenu>
        </MDBDropdown>
    );
}
