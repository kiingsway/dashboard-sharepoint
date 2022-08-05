import React, { useState } from 'react'
import { useEffect } from 'react'
import { criarItem, editarItem, obterCamposLista } from '../../../../services/SPRequest'
import URIs from '../../../../services/uris.json'
import CampoForm from './CampoForm'

interface Props {
  chamadoSelecionado: any
  setChamadoSelecionado: any
}

export default function FormularioChamado(props: Props) {

  const [camposChamado, setcamposChamado] = useState([]);

  function handleSalvarChamado(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    let formProps = Object({ ...Object.fromEntries(formData) });
    const id = formProps?.AtribuidaId ? parseInt(String(formProps.AtribuidaId)) : null
    formProps.AtribuidaId = id

    //props.chamadoSelecionado?.
    //props.chamadoSelecionado?.
    const urlChamado = URIs.PClientes + '/' + props.chamadoSelecionado?.InternalNameSubsite

    props.chamadoSelecionado?.Id ?
      criarItem(urlChamado, props.chamadoSelecionado?.InternalNameSubsiteList, formProps)
      :
      editarItem(urlChamado, props.chamadoSelecionado?.InternalNameSubsiteList, formProps, props.chamadoSelecionado?.Id)

  }

  function priorizarCampos(campos: any) {
    const camposParaPriorizar = [
      "Título",
      "Descrição da Demanda",
      "Atribuída a",
      "Status da Questão",
      "Comentários"
    ];

    return campos.sort((a: any, b: any) => {

      return camposParaPriorizar.indexOf(a.Title) >= 0 ?
        (camposParaPriorizar.indexOf(a.Title) - camposParaPriorizar.length) - (camposParaPriorizar.indexOf(b.Title) - camposParaPriorizar.length)
        : 0

    });
  }

  useEffect(() => {

    const camposParaAparecer = [
      'Título',
      'Atribuída a',
      'Descrição da Demanda',
      'Status da Questão',
      'Comentários'
    ]

    if (props.chamadoSelecionado?.Id !== 0)
      obterCamposLista(
        URIs.PClientes + '/' + props.chamadoSelecionado?.InternalNameSubsite,
        props.chamadoSelecionado?.InternalNameSubsiteList
      ).then(resp => {
        const camposFiltrados = resp.data.value.filter((campo: any) => camposParaAparecer.includes(campo.Title))
        setcamposChamado(priorizarCampos(camposFiltrados))
      });

    else setcamposChamado([])


  }, [props.chamadoSelecionado])

  if (props.chamadoSelecionado?.Id === 0) {
    return <></>
  } else return (
    <div className='container mt-4' style={{ maxWidth: "900px" }}>
      <div className="card">
        <div className="card-body w-100">
          <form className='row' onReset={() => props.setChamadoSelecionado({ Id: 0 })} onSubmit={handleSalvarChamado}>
            <div className="row mb-4 w-100">
              <div className="col-8 p-2">
                <button type="reset" className="btn w-100 btn-outline-danger">Cancelar edição</button>
              </div>
              <div className="col-4 p-2">
                <button type="submit" className="btn w-100 btn-primary">Salvar</button>
              </div>
            </div>

            {camposChamado.map((campo: any) => {
                return <><CampoForm
                  key={campo.Id}
                  campo={campo}
                  chamadoSelecionado={props.chamadoSelecionado}
                />
                {campo.EntityPropertyName === 'Comentarios' || true ? 

                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="cbEnviarNomeHorario" name='additional.enviarNomeHorario' checked />
                        <label className="form-check-label" htmlFor="cbEnviarNomeHorario">
                          Enviar com nome e horário
                        </label>
                    </div>
                    :
                    ""}
                </>
            })}

            <div className="row mb-4 w-100">
              <div className="col-8 p-2">
                <button type="reset" className="btn w-100 btn-outline-danger">Cancelar edição</button>
              </div>
              <div className="col-4 p-2">
                <button type="submit" className="btn w-100 btn-primary">Salvar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

  )
}
