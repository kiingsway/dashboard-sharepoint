import { IChamado } from 'interfaces';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import React from 'react'

interface Props {
    chamado: IChamado;
}

export default function ChamadoCard(props: Props) {
  return (
    <MDBCard className='m-3'>
      <MDBCardBody>
        <MDBCardTitle>Card title</MDBCardTitle>
        <MDBCardText>
          Some quick example text to build on the card title and make up the bulk of the card's content.
        </MDBCardText>
        <MDBBtn>Button</MDBBtn>
      </MDBCardBody>
    </MDBCard>
  )
}
