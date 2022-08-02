import React, { useState } from 'react'
import { useEffect } from 'react'
import { obterCamposLista } from '../../../../services/SPRequest'
import URIs from '../../../../services/uris.json'
import CampoForm from './CampoForm'

interface Props {
  chamadoSelecionado: any
}

export default function FormularioChamado(props: Props) {

  const [camposChamado, setcamposChamado] = useState([])


  useEffect(() => {

    if (props.chamadoSelecionado.Id !== 0) {
      const uri = URIs.PClientes + '/' + props.chamadoSelecionado.InternalNameSubsite
      obterCamposLista(uri, props.chamadoSelecionado.InternalNameSubsiteList).then(resp => setcamposChamado(resp.data.value))

    } else {
      setcamposChamado([]);

    }


  }, [props.chamadoSelecionado])





  return (
    <div className='container mt-4' style={{ maxWidth: "900px" }}>

      <div className="card">
        <div className="card-body w-100">
          {/* {JSON.stringify(props.chamadoSelecionado)} */}
          <form className='row'>
            {camposChamado.map((campo: any) => (
              <CampoForm
                key={campo.Id}
                campo={campo}
              />))}
              <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>

  )
}
