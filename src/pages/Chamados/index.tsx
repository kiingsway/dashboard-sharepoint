import { IChamado, ICliente, IChamadoSelecionado, IFeriados } from 'interfaces'
import { MDBTable } from 'mdb-react-ui-kit'
import React from 'react'

interface Props {
  clientes: ICliente[]
  chamados: IChamado[]
  feriados?: IFeriados
  setChamadoSelecionado: React.Dispatch<React.SetStateAction<IChamadoSelecionado>>
}

export default function Chamados(props: Props) {

  function tabela() {
    return (
      <>
        <colgroup>
          <col style={{ width: '6%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '30%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '4%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>Nunc commodo facilisis rutrum</th>
            <th>Nunc commodo facilisis rutrum</th>
            <th>Nunc commodo facilisis rutrum</th>
            <th>Nunc commodo facilisis rutrum</th>
            <th>Nunc commodo facilisis rutrum</th>
            <th>Nunc commodo facilisis rutrum</th>
          </tr>
        </thead>
        <tbody>
          <tr>

            <td>Nunc commodo facilisis rutrum</td>
            <td>Nunc commodo facilisis rutrum</td>
            <td>Nunc commodo facilisis rutrum</td>
            <td>Nunc commodo facilisis rutrum</td>
            <td>Nunc commodo facilisis rutrum</td>
            <td>Nunc commodo facilisis rutrum</td>
          </tr>

        </tbody>
      </>
    )
  }


  return (
    <>
      <div>
      </div>
      <div>
        <div className='bg-light'>
          <MDBTable hover responsive>{tabela()}</MDBTable>
          <MDBTable hover responsive="sm">{tabela()}</MDBTable>
          <MDBTable hover responsive="md">{tabela()}</MDBTable>
          <MDBTable hover responsive="lg">{tabela()}</MDBTable>
          <MDBTable hover responsive="xl">{tabela()}</MDBTable>
          <MDBTable hover responsive="xxl">{tabela()}</MDBTable>
        </div>

      </div>
    </>
  )
}
