import { faArrowDownAZ, faFilter, faArrowUpZA } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBDropdown, MDBBtn, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBDropdownLink, MDBCheckbox, MDBCollapse, MDBCol, MDBRow, MDBCard, MDBCardBody } from 'mdb-react-ui-kit'
import React, { useState } from 'react'

interface Props {
  clientes?: any
  chamadosFiltrados?: any
  setChamadosFiltrados?: any
}

export default function MenuSuperior(props: Props) {
  const [sort, setSort] = useState<any>({ clientes: 'az' })
  const [collapses, setCollapses] = useState({ clientes: false, status: false, atribuicoes: false });

  // setAtualizacaoPagina(prevAtt => ({ ...prevAtt, chamados: false }))
  const toggleClientes = () => setCollapses(prevState => ({ ...prevState, clientes: !prevState.clientes }));
  const toggleStatus = () => setCollapses(prevState => ({ ...prevState, status: !prevState.status }));
  const toggleatribuicoes = () => setCollapses(prevState => ({ ...prevState, atribuicoes: !prevState.atribuicoes }));

  function handleSort(prop: any) {

    function classificar(a: any, b: any) {
      if (a[prop] < b[prop]) {
        return -1;
      }
      if (a[prop] > b[prop]) {
        return 1;
      }
      return 0;
    }

    if (sort[prop] === '' || sort[prop] === 'za') {
      setSort((prevSort: any) => ({ ...prevSort, [prop]: 'az' }))

      props.setChamadosFiltrados(props.chamadosFiltrados.sort(classificar))

    } else {
      props.setChamadosFiltrados(props.chamadosFiltrados.reverse(classificar))
      setSort((prevSort: any) => ({ ...prevSort, [prop]: 'za' }))

    }
  }

  return (
    <div className="mb-4 d-flex flex-row w-100 justify-content-evenly">

      <div className="d-flex flex-column m-1">
        <MDBBtn onClick={toggleClientes} outline color='light' className='colFilters mb-2'>
          Clientes
          <FontAwesomeIcon icon={faFilter} className='ms-2' />
        </MDBBtn>
        <MDBCollapse show={collapses.clientes} className='cardFilter'>
          <MDBCard>
            <MDBCardBody>
              <div>

              {props.clientes.map((cliente: any) => {
                return <MDBCheckbox key={cliente.Id} name={cliente.EntityPropertyName} id={cliente.EntityPropertyName} label={cliente.Title} />
              })}
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCollapse>
      </div>

      <div className="d-flex flex-column m-1">
        <MDBBtn onClick={toggleStatus} outline color='light' className='colFilters mb-2'>
          Status
          <FontAwesomeIcon icon={faFilter} className='ms-2' />
        </MDBBtn>
        <MDBCollapse show={collapses.status}>
          <MDBCard>
            <MDBCardBody>This is some text within a card body.</MDBCardBody>
          </MDBCard>
        </MDBCollapse>
      </div>

      <div className="d-flex flex-column m-1">
        <MDBBtn onClick={toggleatribuicoes} outline color='light' className='colFilters mb-2'>
          Atribuições
          <FontAwesomeIcon icon={faFilter} className='ms-2' />
        </MDBBtn>
        <MDBCollapse show={collapses.atribuicoes}>
          <MDBCard>
            <MDBCardBody>This is some text within a card body.</MDBCardBody>
          </MDBCard>
        </MDBCollapse>
      </div>

    </div>
  )


  return (
    <div className='container my-4'>
      <MDBRow className='d-flex justify-content-between'>

        <MDBCol>
          <MDBBtn onClick={toggleClientes} outline color='light'>
            Clientes
            <FontAwesomeIcon icon={faFilter} className='ms-2' />
          </MDBBtn>
        </MDBCol>

        <MDBCol>
          <MDBBtn onClick={toggleStatus} outline color='light'>
            Status
            <FontAwesomeIcon icon={faFilter} className='ms-2' />
          </MDBBtn>
        </MDBCol>

        <MDBCol>
          <MDBBtn onClick={toggleatribuicoes} outline color='light'>
            Atribuição
            <FontAwesomeIcon icon={faFilter} className='ms-2' />
          </MDBBtn>
        </MDBCol>

      </MDBRow>


      <MDBRow>
        <MDBCol>
          <MDBCollapse >
            <MDBCard>
              <MDBCardBody>This is some text within a card body.</MDBCardBody>
            </MDBCard>
          </MDBCollapse>
        </MDBCol>
      </MDBRow>

      <div className=" my-4 d-flex justify-content-between align-items-center">
        <MDBBtn outline color='light' className='d-flex align-items-center'>Button</MDBBtn>

        <MDBDropdown className='btn-group'>

          <MDBBtn className='d-flex align-items-center' outline color='light' onClick={() => handleSort('clientes')}>
            Clientes
            <FontAwesomeIcon icon={sort.clientes === '' || sort.clientes === 'az' ? faArrowDownAZ : faArrowUpZA} className='ms-2' />
          </MDBBtn>
          <MDBDropdownToggle split outline color='light' className='btn'></MDBDropdownToggle>
          <MDBDropdownMenu>
            {props.clientes.map((cliente: any) => (
              <>
                <MDBDropdownItem key={cliente.Id}>
                  <MDBDropdownLink>
                    <MDBCheckbox name='flexCheck' value='' id='flexCheckChecked' label={cliente.Title} defaultChecked={false} />

                  </MDBDropdownLink>
                </MDBDropdownItem>
              </>
            ))
            }
          </MDBDropdownMenu>
        </MDBDropdown>
        <MDBCollapse >
          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim
          keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
        </MDBCollapse>
      </div>
    </div>
  )
}
