import { ICliente } from 'interfaces'
import React, { useState } from 'react'
import EditForm from './EditForm'
import SelecionarChamado from './SelecionarChamado'

export default function FormChamados(props: any) {

  const [formFields, setFormFields] = useState<any[]>([])
  const [clienteSelecionado, setClienteSelecionado] = useState<Partial<ICliente>>({ Id: 0 })

  return (
    <div>

      <SelecionarChamado
        clientes={props.clientes}
        chamados={props.chamados}
        clienteSelecionado={clienteSelecionado}
        chamadoSelecionado={props.chamadoSelecionado}
        atualizacaoSecao={props.atualizacaoSecao}
        setClienteSelecionado={setClienteSelecionado}
        handleSelecionarChamado={props.handleSelecionarChamado}
      />

      <div className='mb-2' />
      <EditForm 
        clienteSelecionado={clienteSelecionado}/>
    </div>
  )
}
