import { IChamado } from 'interfaces'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap';

interface Props {
  chamados: IChamado[]
}

interface IFilter {
  field: string;
  value: string;
}

export default function Chamados(props: Props) {

  const [filter, setFilter] = useState<IFilter[]>([]);
  const [chamadosFiltrados, setChamadosFiltrados] = useState<any[]>([]);

  function handleSetFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    const field = e.target.name;
    const value = e.target.value;

    const newFilter = { field, value }

    if (value) setFilter(prevFilter => [...prevFilter.filter(f => f.field !== field), newFilter]);
    else setFilter(prevFilter => prevFilter.filter(f => f.field !== field))

  }

  function filtrarChamados(newChamados: any) {
    for (let filtro of filter) {
      newChamados = newChamados.filter((ch: any) => ch[filtro.field].toString() === filtro.value.toString())
    }
    setChamadosFiltrados(newChamados)
  }

  useEffect(() => {
    const newChamados = props.chamados.map(chamado => {
      return {
        ...chamado,
        AtribuidaTitle: chamado.Atribuida?.Title || '- Sem atribuição -',
        ClienteTitle: chamado.Cliente.Title
      }
    })
    filtrarChamados(newChamados)

  }, [props.chamados, filter])

  const uniqueAttachments = [...new Set(props.chamados.map(chamado => chamado.Attachments))];
  const uniqueClientes = [...new Set(props.chamados.map(chamado => chamado.Cliente.Title))];
  
  const FilterSelect = (pr: {name: string;}) => {

    const unique = [...new Set(props.chamados.map((chamado:any) => chamado[pr.name]))];

    return (
      <Form.Select
        aria-label={pr.name}
        name={pr.name}
        onChange={handleSetFilter}
        // value=''
        value={filter?.filter(f => f.field === pr.name)[0]?.value || ''}
        >
        <option value=''>--Todos--</option>
        {unique.map(item => <option key={item?.toString()} value={item?.toString()}>{item?.toString()}</option>)}
      </Form.Select>
    )
  }

  return (
    <MDBTable color='dark' responsive hover className='w-100 text-break'>
      <MDBTableHead>
        <tr>
          <th scope='col'>
            Anexos
            <FilterSelect name='Attachments'/>
            {/* <Form.Select
              aria-label='fAttachments'
              name='Attachments'
              onChange={handleSetFilter}>
              <option value=''>--Todos--</option>
              {uniqueAttachments.map(item => <option value={item?.toString()}>{item?.toString()}</option>)}
            </Form.Select> */}
          </th>
          <th scope='col'>ID</th>
          <th scope='col'>
            Cliente
            <FilterSelect name='ClienteTitle'/>
            <Form.Select
              aria-label='fClienteTitle'
              name='ClienteTitle'
              onChange={handleSetFilter}>
              <option value=''>--Todos--</option>
              {uniqueClientes.map(item => <option key={item?.toString()} value={item?.toString()}>{item?.toString()}</option>)}
            </Form.Select>
          </th>
          <th scope='col'>Título</th>
          <th scope='col'>Bug em Produção?</th>
          <th scope='col'>Stauts</th>
          <th scope='col'>Atribuído</th>
          <th scope='col'>Descrição</th>
          <th scope='col'>Tipo de Solicitação</th>
          <th scope='col'>Modificado</th>
          <th scope='col'>Email do cliente</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {chamadosFiltrados.map(chamado => (
          <tr key={chamado.Cliente.Id + '#' + chamado.Id}>
            <td>{chamado.Attachments?.toString()}</td>
            <td>{chamado.Id}</td>
            <td>{chamado.Cliente.Title}</td>
            <td>{chamado.Title}</td>
            <td>{chamado.BugEmProducao}</td>
            <td>{chamado.StatusDaQuestao}</td>
            <td>{chamado?.Atribuida?.Title}</td>
            <td>
              <div
                style={{ maxHeight: '200px', maxWidth: '300px', overflow: 'auto' }}
                dangerouslySetInnerHTML={{ '__html': `${chamado.DescricaoDemanda}` }}
              >

              </div>
            </td>
            <td>{chamado.TipoSolicitacao}</td>
            <td>{chamado.Modified}</td>
            <td>{chamado.EmailCliente}</td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>

  )
}
