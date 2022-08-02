import React from 'react'

interface Props {
    campo: any
}

export default function CampoForm(props: Props) {

    const htmlTitle = JSON.stringify(props.campo)

    const fieldText = <div className="mb-3 col-3" title={htmlTitle}>
        <label htmlFor="exampleInputEmail1" className="form-label">{props.campo.Title}</label>
        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
        <div id="emailHelp" className="form-text">{props.campo?.Description}</div>
    </div>

    const fieldChoice = <div className="col-md-4">
      <label htmlFor="inputState" className="form-label">{props.campo.Title}{props.campo.Required ? <span className='text-danger fw-bold'>*</span> : ""}</label>
      <select id="inputState" className="form-select">

        {props.campo.Required ? "" :
        <option value="" selected>Selecione uma opção...</option>}

        {props.campo.Choices?.map((c:any) => <option value={c}>{c}</option> )}

      </select><div id="emailHelp" className="form-text">{props.campo?.Description}</div>
    </div>

    const fieldNote = <div className="form-floating">
    <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea"/>
    <label htmlFor="floatingTextarea"></label>
    <div id="emailHelp" className="form-text">{props.campo?.Description}</div>
  </div>

    let respHtml: any

    console.log(props.campo.TypeAsString)
    switch (props.campo.TypeAsString) {
        case 'Text': respHtml = fieldText; break
        case 'Choice': respHtml = fieldChoice; break
        case 'Note': respHtml = fieldNote; break
        default: respHtml = fieldText
    }

    return respHtml
}