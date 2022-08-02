import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableList, faQuestion, faFont, faRightLeft, faUser, faSquareCheck, faRectangleList, faAlignJustify, IconDefinition, fa1 } from '@fortawesome/free-solid-svg-icons'

interface Props {
  campo: any
  chamadoSelecionado: any
}

export default function CampoForm(props: any) {


  if (props.campo.TypeAsString === 'Choice') {
    console.log(props.campo)
    console.log(props.chamadoSelecionado[props.campo.EntityPropertyName])
  }

  return FieldConstructor(props)

  /*switch (props.campo.TypeAsString) {
    case 'Text':
      return FieldText(props)
    case 'Note':
      return FieldNote(props)
    case 'Lookup':
      return Fieldlookup(props)
    case 'Choice':
      return FieldChoice(props)
    case 'User':
      return FieldUser(props)
    case 'Number':
      return FieldNumber(props)
    case 'Boolean':
      return FieldBoolean(props)
    default:
      return FieldDefault(props)
  }*/
}

function FieldConstructor(props: any) {

  const htmlId = `txtFormChamado${props.campo.InternalName}`;

  let html: any;
  let icon: IconDefinition | undefined;

  switch (props.campo.TypeAsString) {
    case 'Text':
      html = FieldText(props);
      icon = faFont
      break;
    case 'Note':
      html = FieldNote(props);
      icon = faAlignJustify
      break;
    case 'Lookup':
      html = Fieldlookup(props);
      icon = faFont
      break;
    case 'Choice':
      html = FieldChoice(props);
      icon = faFont
      break;
    case 'User':
      html = FieldUser(props);
      icon = faUser
      break;
    case 'Number':
      html = FieldNumber(props);
      icon = fa1
      break;
    case 'Boolean':
      html = FieldBoolean(props);
      icon = faSquareCheck
      break;
    default:
      html = FieldDefault(props);
      icon = faQuestion
      break;
  }


  return (

    <div className="row mb-3">

      <label
        htmlFor={htmlId}
        className="col-sm-2 col-form-label"
        title={props.campo.TypeAsString}
      >
        <FontAwesomeIcon icon={icon} className='me-2' />
        {props.campo.Title}
        {props.campo.Required ? <span className='text-danger fw-bold'>*</span> : ''}
      </label>

      <div className="col-sm-10">
        {html}
        <div id={`${htmlId}Help`} className="form-text">{props.campo?.Description}</div>
      </div>

    </div>
  )



}

function FieldDefault(props: any) {

  const htmlId = `txtFormChamado${props.campo.InternalName}`;

  return (
    <input
      type="text"
      className="form-control"
      id={htmlId}
      name={htmlId}
      title={props.campo?.Description}
    />
  )
}
function FieldText(props: any) {

  const htmlId = `txtFormChamado${props.campo.InternalName}`;

  return (
    <input
      type="text"
      className="form-control"
      id={htmlId}
      name={htmlId}
      title={props.campo?.Description}
      value={props.chamadoSelecionado[props.campo.EntityPropertyName]}
    />
  )
}

function FieldNote(props: any) {

  const htmlId = `txaFormChamado${props.campo.InternalName}`;

  return (
    <textarea
      className="form-control"
      id={htmlId}
      value={props.chamadoSelecionado[props.campo.EntityPropertyName]} />
  )
}

function FieldChoice(props: any) {

  const htmlId = `slcFormChamado${props.campo.InternalName}`;

  return (
    <select id={htmlId} className="form-select">
      {props.campo.Required ? "" : <option value="" selected={props.chamadoSelecionado[props.campo.EntityPropertyName] === ""}>Selecione uma opção...</option>}
      {props.campo.Choices?.map((c: any) => <option value={c} selected={c === props.chamadoSelecionado[props.campo.EntityPropertyName]}>{c}</option>)}
    </select>
  )
}

function FieldBoolean(props: any) {

  const htmlId = `slcFormChamado${props.campo.InternalName}`;

  return (
    <select id={htmlId} className="form-select">
      {props.campo.Required ? "" : <option value="" selected>Selecione uma opção...</option>}
      <option value={0}>Sim</option>
      <option value={1}>Não</option>
    </select>
  )
}
function FieldUser(props: any) {

  const htmlId = `slcFormChamado${props.campo.InternalName}`;

  return (
    <select id={htmlId} className="form-select">
      {props.campo.Required ? "" : <option value="" selected>Selecione uma opção...</option>}
      <option value={props.chamadoSelecionado[props.campo.EntityPropertyName]?.Title} selected={props.chamadoSelecionado[props.campo.EntityPropertyName]?.Title}>{props.chamadoSelecionado[props.campo.EntityPropertyName]?.Title}</option>
    </select>
  )
}
function Fieldlookup(props: any) {

  const htmlId = `slcFormChamado${props.campo.InternalName}`;

  return (
    <select id={htmlId} className="form-select">
      {props.campo.Required ? "" : <option value="" selected>Selecione uma opção...</option>}
      {props.campo.Choices?.map((c: any) => <option value={c}>{c}</option>)}
    </select>
  )
}

function FieldNumber(props: any) {

  const htmlId = `txnFormChamado${props.campo.InternalName}`;

  return (
    <input
      type="number"
      className="form-control"
      id={htmlId}
      min={props.campo.MinimumValue}
      max={props.campo.MaximumValue}
      title={props.campo?.Description}
      disabled={props.campo?.ReadOnlyField}
      value={props.chamadoSelecionado[props.campo.EntityPropertyName]}
    />
  )
}