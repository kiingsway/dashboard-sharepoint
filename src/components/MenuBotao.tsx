import React from 'react'

import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  internalname: string
  titulo: string
  contagem?: number | string
  mostrarContador: boolean
  menuSelecionado: boolean
  icon: IconDefinition
  chamadoSelecionado?: any
}

export default function MenuBotao(props: Props) {
  return (
    <button className={`nav-link d-flex justify-content-between align-items-center ${props.menuSelecionado ? " active" : ""}`}
        data-bs-toggle="pill"
        type="button"
        role="tab"
        id={`v-pills-${props.internalname}-tab`}
        data-bs-target={`#v-pills-${props.internalname}`}
        aria-controls={`v-pills-${props.internalname}`}
        aria-selected={props.menuSelecionado}
        title={props.titulo}>
        <div>
          <FontAwesomeIcon icon={props.icon} className='me-2' />
          {props.titulo}
        </div>
        {
          props.mostrarContador ?
            <span className="badge rounded-pill text-bg-light">{props.contagem}</span>
            :
            ""
        }
      </button>
  )
}
