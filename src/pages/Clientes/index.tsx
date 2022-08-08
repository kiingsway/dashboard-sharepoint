import React from 'react'
import LinkCliente from './LinkCliente'
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBContainer
} from 'mdb-react-ui-kit';
import { ICliente } from 'interfaces';

interface Props {
  clientes: ICliente[]
}

export default function Clientes(props: Props) {

  return (
    <MDBContainer breakpoint="sm">
    <MDBRow className='row-cols-1 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 g-4'>
      {props.clientes.map((cliente: any) => (

      <MDBCol key={cliente.Id}>
        <MDBCard className='h-100'>
          <MDBCardImage
            src={cliente?.logo?.Url}
            position='top'
            className="card-img-top img-cliente"
            alt={`${cliente.Title} logo`}
          />
          <div className='my-4 text-center' style={{height: "60px"}}>
            <span className='fs-3' >{cliente.Title}</span>
          </div>
          <MDBCardBody className='text-center'>
            <MDBCardText>
              <LinkCliente cliente={cliente} />
            </MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      ))}

    </MDBRow>
    </MDBContainer>
  );
  
}
