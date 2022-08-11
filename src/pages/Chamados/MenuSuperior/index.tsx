import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBBtn, MDBCollapse, MDBCard, MDBCardBody } from 'mdb-react-ui-kit'
import React, { useState } from 'react'

interface Props {
  clientes?: any
  chamadosFiltrados?: any
  setChamadosFiltrados?: any
}

export default function MenuSuperior(props: Props) {
  // const [sort, setSort] = useState<any>({ clientes: 'az' })
  const [collapses, setCollapses] = useState({ clientes: false, status: false, atribuicoes: false });

  // setAtualizacaoPagina(prevAtt => ({ ...prevAtt, chamados: false }))
  const toggleClientes = () => setCollapses(prevState => ({ ...prevState, clientes: !prevState.clientes }));
  const toggleStatus = () => setCollapses(prevState => ({ ...prevState, status: !prevState.status }));
  const toggleatribuicoes = () => setCollapses(prevState => ({ ...prevState, atribuicoes: !prevState.atribuicoes }));

  /*function handleSort(prop: any) {

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
  }*/

  /*function handleClientesSort(e:any) {
    // const [name, value] = e.target;

    console.log(e.target)

  }*/
  
  // <select multiple={true} value={['B', 'C']}>
  // https://reactjs.org/docs/forms.html#controlled-components

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

              {/* {props.clientes?.map((cliente: any) => {
                return <div>
                  <input key={cliente.Id} type="checkbox" id={cliente.ClienteInternalName} name={cliente.ClienteInternalName}><label htmlFor={cliente.ClienteInternalName}>{cliente.Title}</label></input>
              </div>
                return <MDBCheckbox onChange={handleClientesSort} key={cliente.Id} name={cliente.EntityPropertyName} id={cliente.EntityPropertyName} label={cliente.Title} />
              })} */}
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
}
