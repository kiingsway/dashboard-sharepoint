import classNames from 'classnames'
import { IChamado, ICliente, IChamadoSelecionado, IFeriados } from 'interfaces'
import { DateTime } from 'luxon'
import { MDBTable } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import './Chamados.module.scss'
import Filtros from './Filtros'

interface Props {
  clientes: ICliente[]
  chamados: IChamado[]
  feriados?: IFeriados
  setChamadoSelecionado: React.Dispatch<React.SetStateAction<IChamadoSelecionado>>
}

const filtrosDefault = {
  Cliente: [],
  Status: [],
  Atribuicao: [],
  Modificado: {
    De: null,
    Até: DateTime.now().endOf('day')
  }
}

const colunasTabelaDefault = {
  Id: true,
  Cliente: true,
  Title: true,
  StatusDaQuestao: true,
  Atribuida: true,
  DescricaoDemanda: true,
  Modified: true
}

export default function Chamados(props: Props) {

  const [chamadosFiltrados, setChamadosFiltrados] = useState<IChamado[]>(props.chamados);
  const [filtros, setFiltros] = useState(filtrosDefault);
  const [colunasTabela, setColunasTabela] = useState(colunasTabelaDefault);

  useEffect(() => setChamadosFiltrados(props.chamados), [props.chamados])

  function tabela() {
    return (
      <>
        <colgroup>
          <col className='colId' />
          <col className='colCliente' />
          <col className='colTitle' />
          <col className='colStatusDaQuestao' />
          <col className='colAtribuida' />
          <col className='colDescricaoDemanda hideFullColumn' />
          <col className='colModified' />
        </colgroup>
        <thead>
          <tr>
            <th className={classNames({'d-none': !colunasTabela.Id})}>Id</th>
            <th>Cliente</th>
            <th>Title</th>
            <th>StatusDaQuestao</th>
            <th>Atribuida</th>
            <th>DescricaoDemanda</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {console.log(chamadosFiltrados)}
          {chamadosFiltrados.map((chamado: IChamado) => (
            <tr>
              <td className={classNames({'d-none': !colunasTabela.Id})}>{chamado.Id}</td>
              <td>{chamado.Cliente.Title}</td>
              <td>{chamado.Title}</td>
              <td>{chamado.StatusDaQuestao}</td>
              <td>{chamado.Atribuida?.Title}</td>
              <td dangerouslySetInnerHTML={{
                  __html: `
                <div style="max-height:230px;max-width:400px;overflow-y:auto;color:white !important;word-break: break-word;">
                  <span id="DescricaoDemanda">${chamado?.DescricaoDemanda?.replace(/color:#000000;/g, '').replace(/color&#58;#000000;/g, '')}</span>
                </div>` }}></td>
              <td>{chamado.Modified}</td>
            </tr>
          ))}

        </tbody>
      </>
    )
  }


  return (
    <div className='d-flex justify-content-between'>
      <div className='w-25'>
        <Filtros/>
      </div>
      <div className='w-75'>
        <div className='bg-light'>
          <MDBTable color='dark' hover responsive>{tabela()}</MDBTable>
        </div>

      </div>
    </div>
  )
}
