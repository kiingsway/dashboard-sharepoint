import React from 'react'
import LinkCliente from './LinkCliente'

interface Props {
  clientes: Array<Props>
}

export default function Clientes(props: Props) {
  // console.log(props.clientes)
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
