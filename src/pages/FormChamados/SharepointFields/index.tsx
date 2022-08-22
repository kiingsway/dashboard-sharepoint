import { faAlignLeft, faArrowUpRightFromSquare, faFont, faListDots, faRadio, faTextHeight, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IChamadoSelecionado } from 'interfaces';
import React, { useEffect, useState } from 'react'
import { Col, FloatingLabel, Form } from 'react-bootstrap'
import { IFieldProperties } from './interfaces'

interface Props {
  campo: IFieldProperties;
  chamadoSelecionado: IChamadoSelecionado;
}

export default function SharepointFields(props: Props) {

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    
    const ItemValue = formData[props.campo.EntityPropertyName] || "";
    const DefaultValue = props.campo.DefaultValue || "";
    
    console.log(`${props.campo.Title}: ${props.campo.TypeAsString} = "${ItemValue}" {${DefaultValue}}`);

  }, [])

  function handleFillFormData(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prevData:any) => ({ ...prevData, [e.target.name]: e.target.value }))
  }

  useEffect(() => {
    
    const ItemValue = formData[props.campo.EntityPropertyName] || "";
    const DefaultValue = props.campo.DefaultValue || "";
    
    console.log(`${props.campo.Title}: ${props.campo.TypeAsString} = "${ItemValue}" {${DefaultValue}}`);

  },[props.campo])


  useEffect(() => {

    props.chamadoSelecionado.Id ? setFormData(props.chamadoSelecionado) : setFormData({});

  }, [props.chamadoSelecionado])

  return <></>

  /*
    switch (props.campo.TypeAsString) {
      case 'Text':
        return (
          <TextField
            campo={props.campo}
            defaultValue={props.defaultValue}
            handleFillFormData={handleFillFormData}
            formData={formData}
          />)
      case 'Number':
        // html = fieldNumber(campo, props.chamadoSelecionado)
        return <></>
      case 'Note':
        return (
          <NoteField
            campo={props.campo}
            defaultValue={props.defaultValue}
            handleFillFormData={handleFillFormData}
            formData={formData}
          />)
        return <></>
      case 'DateTime':
        // html = fieldDate(campo, props.chamadoSelecionado)
        return <></>
      case 'Choice':
        return (
          <ChoiceField
            campo={props.campo}
            defaultValue={props.defaultValue}
            handleFillFormData={handleFillFormData}
            formData={formData}
            chamadoSelecionado={props.chamadoSelecionado}
          />)
        return <></>
      case 'User':
        // html = FieldUser(campo, props.chamadoSelecionado, clienteSelecionado)
        return <></>
      case 'Boolean':
        // html = fieldBoolean(campo, props.chamadoSelecionado)
        return <></>
      case 'Attachments':
        // html = fieldAttachments(campo, props.chamadoSelecionado)
        return <></>
      default:
        // html = fieldUndefined(campo, props.chamadoSelecionado)
        return <></>
    }*/

}

function LabelInputField(props: { field: any, icon: IconDefinition }) {

  return (
    <div className='d-flex align-items-center' title='teste'>
      <FontAwesomeIcon icon={props.icon} className='me-2 pb-1 fw-light' />
      {props.field.Title}
      {props.field.Required ? <span className='text-danger fw-500 ms-1'>*</span> : <></>}
    </div>
  )

}

function TextField(props: any) {

  return (
    <Col sm={12} md={6} xxl={4} className='mb-4'>
      <FloatingLabel
        controlId={`txt${props.campo.EntityPropertyName}`}
        title={props.campo.Title}
        label={<LabelInputField field={props.campo} icon={faFont} />}
      >

        <Form.Control
          type="text"
          name={props.campo.EntityPropertyName}
          title={props.campo.Title}
          value={props.formData[props.campo.EntityPropertyName] || ''}
          defaultValue={props.defaultValue}
          onChange={props.handleFillFormData}
          aria-label={props.campo.Title}
          required={props.campo.Required}
        />
        <div className='form-text'>{props.campo.Description}</div>

      </FloatingLabel>
    </Col>
  )

}

function ChoiceField(props: any) {

  /** Do objeto FormData, obtém o valor da propriedade que vem do campo sendo gerado. */
  const ItemValue = props.formData[props.campo.EntityPropertyName] || "";
  const DefaultValue = props.campo.DefaultValue || "";

  const newChoices = [...new Set([...props.campo?.Choices, DefaultValue, ItemValue])]
  console.log(ItemValue)
  // console.log(newChoices)


  // Pegar o valor do selecionado agora mesmo que não esteja na lista
  // Se o DefaultValue estiver vazio, mesmo required, deixar um option vazio
  if (props.campo.Title === 'Atendimento Proposto') {
    // console.log(props.campo)
  }

  // Se valor não estiver preenchido
  if (!ItemValue) {


    // Se propriedade da coluna 'DefaultValue' estiver preenchido e chamado é novo
    if (props.campo.DefaultValue && props.chamadoSelecionado.Id === 0)
      props.handleFillFormData({ target: { name: props.campo.EntityPropertyName, value: props.campo.DefaultValue } });

    else props.handleFillFormData({ target: { name: '', value: '' } });

  }

  if (!props.campo?.Choices.includes(ItemValue)) {

    // console.log(`Valor do campo ${ItemValue} não inclui nos Choices: ${JSON.stringify(props.campo?.Choices)}.`)

  }

  /** Array de choices para estar como option no select.
   * 
   * Array que contém os valores da propriedade Choices (opções do campo Sharepoint);
   * O valor padrão do campo (DefaultValue) caso este não esteja em Choices;
   * E o valor que estiver preenchido, caso também não esteja em Choices.
   * 
   * DefaultValue && ItemValue ? Selecionar ItemValue
   * DefaultValue && '' ? Selecionar DefaultValue
   * DefaultValue == '' ? Selecionar DefaultValue
   * ItemValue ? Selecionar ItemValue : Selecionar DefaultValue
  */

  return (

    <Col sm={12} md={6} xxl={4} className='mb-4'>
      <FloatingLabel
        controlId={`slc${props.campo.EntityPropertyName}`}
        title={props.campo.Title}
        label={<LabelInputField field={props.campo} icon={faListDots} />}
      >
        <Form.Select
          value={ItemValue || ''}
          defaultValue={props.campo.DefaultValue}
          name={props.campo.EntityPropertyName}
          title={props.campo.Title}
          aria-label={props.campo.Title}
          onChange={props.handleFillFormData}
          required={props.campo.Required}
        >
          {props.campo.Required && props.campo.DefaultValue ? <></> : <option value="">Selecione...</option>}
          {props.campo?.Choices.includes(ItemValue) ? <></> : <option value={ItemValue} key={ItemValue}>{ItemValue}</option>}
          {props.campo?.Choices.map((valor: any) => {
            return (
              <option value={valor} key={valor}>{valor}</option>
            )
          })}
        </Form.Select>
        <div className='form-text'>{props.campo.Description}</div>
      </FloatingLabel>

    </Col>
  )
}

function NoteField(props: any) {

  // const initialValue = props.formData[props.campo.EntityPropertyName] ? props.formData[props.campo.EntityPropertyName] : props.campo.DefaultValue;

  return (
    <Col sm={12} xxl={6} className='mb-4'>


      {props.campo.EntityPropertyName === 'Comentarios' && false ?
        <></>// <ComentariosField campo={campo} chamadoSelecionado={chamadoSelecionado} />
        :
        <FloatingLabel
          controlId={`txa${props.campo.EntityPropertyName}`}
          title={props.campo.Title}
          label={<LabelInputField field={props.campo} icon={faAlignLeft} />}
        >
          <Form.Control
            as="textarea"

            name={props.campo.EntityPropertyName}
            title={props.campo.Title}
            value={props.formData[props.campo.EntityPropertyName] || ''}
            defaultValue={props.defaultValue}
            onChange={props.handleFillFormData}
            aria-label={props.campo.Title}
            required={props.campo.Required}

            style={{ height: props.formData[props.campo.EntityPropertyName]?.length > 200 ? '200px' : '60px' }}
          />
        </FloatingLabel>
      }
      <div className='form-text'>{props.campo.Description}</div>
    </Col>
  )
}