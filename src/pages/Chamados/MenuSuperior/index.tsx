import { faArrowDownAZ, faArrowUpZA } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBDropdown, MDBBtn, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBDropdownLink } from 'mdb-react-ui-kit'
import React, { useState } from 'react'

interface Props {
  clientes?: any
  chamadosFiltrados?: any
  setChamadosFiltrados?: any
}

export default function MenuSuperior(props: Props) {
  const [sort, setSort] = useState<any>({ clientes: 'az' })

  function handleSort(prop: any) {

    function classificar( a: any, b: any ) {
      if ( a[prop] < b[prop] ){
        return -1;
      }
      if ( a[prop] > b[prop] ){
        return 1;
      }
      return 0;
    }
    
    if (sort[prop] === '' || sort[prop] === 'za') {
      setSort((prevSort: any) => ({ ...prevSort, [prop]: 'az' }))
      if (prop === 'clientes') {
        props.setChamadosFiltrados((prevState:any) => { prevState.sort(classificar) })
      }
    } else {
      props.setChamadosFiltrados((prevState:any) => { prevState.reverse(classificar) })
      setSort((prevSort: any) => ({ ...prevSort, [prop]: 'za' }))

    }
  }


  return (
    <div className="container my-4 d-flex justify-content-between align-items-center">
      <MDBDropdown className='btn-group'>
        <MDBBtn className='d-flex align-items-center' outline color='light' onClick={() => handleSort('clientes')}>
          Clientes
          <FontAwesomeIcon icon={sort.clientes === '' || sort.clientes === 'az' ? faArrowDownAZ : faArrowUpZA} className='ms-2' />
        </MDBBtn>
        <MDBDropdownToggle split outline color='light' className='btn'></MDBDropdownToggle>
        <MDBDropdownMenu>
          {
            props.clientes.map((cliente: any) => (
              <MDBDropdownItem key={cliente.Id}>
                <MDBDropdownLink href="#">{cliente.Title}</MDBDropdownLink>
              </MDBDropdownItem>
            ))
          }
        </MDBDropdownMenu>
      </MDBDropdown>
    </div>
  )
}
