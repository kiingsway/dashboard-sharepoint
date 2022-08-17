import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { obterUsuarios } from 'services/GetDashboardHelper'

interface Props {
  campo: any
  clienteSelecionado: any
  chamadoSelecionado: any
}

export default function UserField(props: Props) {

  const [users, setUsers] = useState([]);

  
  useEffect(() => {
    obterUsuarios(props.clienteSelecionado).then((usersItems: any) => { setUsers(usersItems.data.value) });
    
  }, [props.chamadoSelecionado])
  

  const userSelected = props.chamadoSelecionado[props.campo.EntityPropertyName]

console.log(props.chamadoSelecionado)

  return (
    <Form.Select
      title={props.campo.Title}
      name={props.campo.EntityPropertyName + 'Id'}
      aria-label={props.campo.Title}
      value={props.chamadoSelecionado?.Id && userSelected?.Id ? userSelected?.Id : ''}
      onChange={() => { }}
    >
      {props.campo?.Required ? <></> : <option value="">Selecione...</option>}
      {users.map((user:any) => (
        <option value={user.Id} key={user.Id}>{user.Title} ({user?.Email})</option>
      ))}
    </Form.Select>
  )
}
