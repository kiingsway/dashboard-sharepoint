import React, { useEffect, useState } from 'react'
import FormularioChamado from './FormularioChamado'

interface Props {
  setChamadoSelecionado: any
  chamadoSelecionado: any
  clientes: any
  chamados: any
}

export default function FormChamados(props: Props) {

  const [chamadosCliente, setChamadosCliente] = useState<any>([{Id:0}])

  useEffect(() => {
    // props.chamadoSelecionado?.
    // props.chamadoSelecionado?.
    props.chamadoSelecionado?.Id && filtrarChamados(props.chamadoSelecionado?.ClienteInternalName)

  },[props.chamadoSelecionado])

  function handleCancelarEdicao() {
    props.setChamadoSelecionado({ Id: 0 })

  }

  function filtrarChamados(clienteSelecionado: any) {   

    const chcl = props.chamados.filter((ch:any) => ch.ClienteInternalName === clienteSelecionado)

    setChamadosCliente(chcl)
  }

  function handleFiltrarChamados(e:any) { filtrarChamados(e.target.value) }

  function handleSelecionarChamado(e: any) {
    
    let selId = parseInt(e.target.value.split('#')[0]);
    let selCliente = e.target.value.split('#')[1];

    const selCh = props.chamados.filter(((ch:any) => ch.Id === selId && ch.Cliente === selCliente))
    
    props.setChamadoSelecionado(selCh[0]);

    
  }

  return (
    <>
      <div className="col-md-4">
        <label htmlFor="slcClientes" className="form-label text-white">Cliente</label>
        <select id="slcClientes" onChange={handleFiltrarChamados} className="form-select">
          <option selected={props.chamadoSelecionado?.Id === 0}>Selecione o cliente...</option>
          {
            props.clientes.map((cliente: any) => (
              <option key={cliente.Id} value={cliente.ClienteInternalName} selected={props.chamadoSelecionado?.ClienteInternalName === cliente.ClienteInternalName}>{cliente.Title}</option>
            ))
          }
        </select>
      </div>

      <div className="col-md-4">
        <label htmlFor="slcChamados" className="form-label text-white">Chamado</label>
        <select id="slcChamados" className="form-select" onChange={handleSelecionarChamado}>
          <option value="" selected={props.chamadoSelecionado?.Id === 0}>+ Novo chamado ({chamadosCliente.length} encontrado{chamadosCliente.length > 1 ? 's' : ''})</option>
          {
            chamadosCliente.map((chamado: any) => (
              <option key={chamado.Id + '#' + chamado.Cliente} value={chamado.Id + '#' + chamado.Cliente} selected={props.chamadoSelecionado?.Id === chamado.Id}>{`#${chamado.Id} | ${chamado.Title}`}</option>
            ))
          }
        </select>
      </div>
      <FormularioChamado
        setChamadoSelecionado={props.setChamadoSelecionado}
        chamadoSelecionado={props.chamadoSelecionado}
      />
    </>
  )
}
