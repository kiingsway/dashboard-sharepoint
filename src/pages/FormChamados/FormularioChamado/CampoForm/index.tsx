import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion, faFont, faUser, faSquareCheck, faAlignJustify, IconDefinition, fa1 } from '@fortawesome/free-solid-svg-icons'
import {v4 as uuidv4} from 'uuid'

interface Props {
  campo: any
  chamadoSelecionado: any
}

export default function CampoForm(props: Props) {

  let html: any;
  let icon: IconDefinition | undefined;

  const htmlId = `inputFormChamado${props.campo.EntityPropertyName}`
  const fieldValue = props.chamadoSelecionado !== 0 ? props.chamadoSelecionado[props.campo.EntityPropertyName] : null
  const infos = {...props, fieldValue: fieldValue }


  switch (props.campo.TypeAsString) {
    case 'Text':
      html = FieldText(infos);
      icon = faFont
      break;
    case 'Note':
      html = FieldNote(infos);
      icon = faAlignJustify
      break;
    case 'Lookup':
      html = Fieldlookup(infos);
      icon = faFont
      break;
    case 'Choice':
      html = FieldChoice(infos);
      icon = faFont
      break;
    case 'User':
      html = FieldUser(infos);
      icon = faUser
      break;
    case 'Number':
      html = FieldNumber(infos);
      icon = fa1
      break;
    case 'Boolean':
      html = FieldBoolean(infos);
      icon = faSquareCheck
      break;
    default:
      html = FieldDefault(infos);
      icon = faQuestion
      break;
  }


  return (

    <div className="row mb-3">

      <label
        htmlFor={htmlId}
        className="col-sm-2 col-form-label"
        
      >
        <FontAwesomeIcon icon={icon} title={props.campo.TypeShortDescription} className='me-2' />
        {props.campo.Title}
        {props.campo.Required ? <span className='text-danger fw-bold'>*</span> : ''}
      </label>

      <div className="col-sm-10">
        {html}
        <div id={uuidv4()} className="form-text">
          {props.campo?.Description}
        </div>
      </div>

    </div>
  )
}


function FieldDefault(props: any) {

  const htmlId = `inputFormChamado${props.campo.InternalName}`;

  return (
    <input
      type="text"
      className="form-control"
      id={htmlId}
      name={htmlId}
      title={props.campo?.Description}
      required={props.campo.Required}
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
      name={props.campo.EntityPropertyName}
      title={props.campo?.Description}
      value={props.fieldValue}
    />
  )
}

function FieldNote(props: any) {

  const htmlId = `txaFormChamado${props.campo.InternalName}`;

  return (
    <textarea
      className="form-control"
      id={htmlId}
      name={props.campo.EntityPropertyName}
      value={props.fieldValue}
      rows={props.fieldValue ? 5 : 0}
      />
  )
}

function FieldChoice(props: any) {

  const htmlId = `slcFormChamado${props.campo.InternalName}`;
  const valorCampo = props.fieldValue

  return (
    <select id={htmlId} name={props.campo.EntityPropertyName} className="form-select">
      {props.campo.Required ? "" : <option value="" selected={valorCampo === ""}>Selecione uma opção...</option>}
      {props.campo.Choices?.map((c: any) => <option key={c} value={c} selected={c === valorCampo}>{c}</option>)}
    </select>
  )
}

function FieldBoolean(props: any) {

  const htmlId = `slcFormChamado${props.campo.InternalName}`;

  return (
    <select defaultValue={+ props.fieldValue} id={htmlId} name={props.campo.EntityPropertyName} className="form-select">
      {props.campo.Required ? "" : <option value="" selected>Selecione uma opção...</option>}
      <option value={1}>Sim</option>
      <option value={0}>Não</option>
    </select>
  )
}
function FieldUser(props: any) {

  const htmlId = `slcFormChamado${props.campo.InternalName}`;
  const valorCampo = props.fieldValue

  return (
    <select name={props.campo.EntityPropertyName + 'Id'} defaultValue={valorCampo?.Id} id={htmlId} className="form-select">
      {props.campo.Required ? "" : <option value="" selected>Selecione uma opção...</option>}
      <option
      value={valorCampo?.Id}
      selected={valorCampo?.Id}>{valorCampo?.Title} &lt;{valorCampo?.EMail}&gt;</option>
    </select>
  )
}
function Fieldlookup(props: any) {

  const htmlId = `slcFormChamado${props.campo.InternalName}`;

  return (
    <select name={props.campo.EntityPropertyName + 'Id'} id={htmlId} className="form-select">
      {props.campo.Required ? "" : <option value="" selected>Selecione uma opção...</option>}
      {props.campo.Choices?.map((c: any) => <option key={c} value={c}>{c}</option>)}
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
      name={props.campo.EntityPropertyName}
      min={props.campo.MinimumValue}
      max={props.campo.MaximumValue}
      title={props.campo?.Description}
      disabled={props.campo?.ReadOnlyField}
      value={props.fieldValue}
    />
  )
}