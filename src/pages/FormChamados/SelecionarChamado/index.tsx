import { IChamadoSelecionado } from 'interfaces'
import React from 'react'

interface Props {
  clienteSelecionado: any
  setClienteSelecionado: React.Dispatch<any>
  setChamadoSelecionado: React.Dispatch<React.SetStateAction<IChamadoSelecionado>>
}

export default function SelecionarChamado(props: Props) {
  return (
    <div>SelecionarChamado</div>
  )
}
