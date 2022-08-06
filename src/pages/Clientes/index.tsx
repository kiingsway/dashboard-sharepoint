import React from 'react'
import LinkCliente from './LinkCliente'
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBContainer
} from 'mdb-react-ui-kit';

interface Props {
  clientes: Array<Props>
}

export default function Clientes(props: Props) {

  return (
    <MDBContainer breakpoint="sm">
    <MDBRow className='row-cols-1 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 g-4'>
      {props.clientes.map((cliente: any) => (

      <MDBCol>
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
  
  return <>{props.clientes?.map((cliente: any) => (
    <div className="col" key={`${cliente.Id}_${cliente.Title}`}>
      <div className="card h-100 text-center">
        <img src={cliente?.logo?.Url} className="card-img-top img-cliente" alt={`${cliente.Title} logo`} />
        <div className="card-body">
          <h5 className="card-title" style={{ height: "50px" }}>{cliente.Title}</h5>
          <LinkCliente cliente={cliente} />
        </div>
      </div>
    </div>
  ))}</>
}
