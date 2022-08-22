import { IChamadoSelecionado, ICliente } from 'interfaces'
import { MDBCard, MDBCardHeader, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBCardFooter } from 'mdb-react-ui-kit';
import React, { FormEvent } from 'react'

interface Props {
  clienteSelecionado: ICliente
  chamadoSelecionado: IChamadoSelecionado
}

export default function EditForm(props: any) {

  /** Caso não tenha cliente selecionado, retornar nulo. */
  // if (!props.clienteSelecionado) return null

  function saveForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert('Salvando...')
  }

  function resetForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert('Resetando...')
  }

  return (
    <MDBCard alignment='center'>
      <MDBCardHeader>Featured</MDBCardHeader>
      <MDBCardBody>
        <form onSubmit={saveForm} onReset={resetForm}>

          <MDBBtn type='reset'>Cancelar</MDBBtn>
          <MDBBtn type='submit'>Salvar</MDBBtn>
        </form>
        <MDBCardTitle>Special title treatment</MDBCardTitle>
        <MDBCardText>With supporting text below as a natural lead-in to additional content.</MDBCardText>
      </MDBCardBody>
      <MDBCardFooter className='text-muted'>2 days ago</MDBCardFooter>
    </MDBCard>
  )
}
