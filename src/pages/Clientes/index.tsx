import React from 'react'

interface Props {
  clientes: Array<Props>
}

export default function Clientes(props: Props) {
  const clientes = props.clientes;
  return (
    {
      clientes.map((cliente: any) => (
        <div className="card" style={{ width: "18rem;" }}>
          <img src="..." className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{cliente.Title}</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" className="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      ))
    }
  )
}
