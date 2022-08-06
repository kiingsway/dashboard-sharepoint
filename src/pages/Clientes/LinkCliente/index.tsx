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

    return (

        <div className="btn-group mt-2">
            <a target="__blank" href={urlPortal} className="btn btn-secondary">
                <FontAwesomeIcon icon={faTableCellsLarge} className='me-2' />Ir para o portal</a>

            <button type="button" className="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
                <li>
                    <a className="dropdown-item" target="__blank" href={urlList}>
                        <FontAwesomeIcon icon={faList} className='me-2' />Lista de chamados
                    </a>
                </li>
                <li><a className="dropdown-item" target="__blank" href={urlNewForm}><FontAwesomeIcon icon={faAdd} className='me-2' />Formulário de novo chamado</a></li>
            </ul>
        </div>
    )
}
