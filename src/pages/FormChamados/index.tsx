import { IChamado, IChamadoSelecionado, ICliente } from 'interfaces';
import { MDBRow, MDBCol, MDBInput, MDBCheckbox, MDBBtn, MDBTextArea, MDBCard, MDBCardBody, MDBCardFooter, MDBCardHeader, MDBCardText, MDBCardTitle, MDBContainer } from 'mdb-react-ui-kit';
import React, { Component, useEffect, useState } from 'react'
import { criarItem, editarItem, obterCamposLista as obterCamposLista1 } from '../../services/SPRequest'
import { obterClientes, obterChamados, obterFeriados, obterColunas } from 'services/GetDashboardHelper'
import URIs from '../../services/uris.json'
import classNames from 'classnames';
import 'bootstrap'
import { Button, Card, Col, Container, FloatingLabel, Form, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

interface Props {
  chamadoSelecionado: IChamadoSelecionado;
  clientes: ICliente[];
  chamados: IChamado[];
  setChamadoSelecionado: React.Dispatch<React.SetStateAction<IChamadoSelecionado>>;
}

export default function FormChamados(props: Props) {

  const [camposChamado, setCamposChamado] = useState([]);
  const [camposChamadoHtml, setCamposChamadoHtml] = useState(<></>);
  const [clienteSelecionado, setClienteSelecionado] = useState<any>({ Id: 0 });

  useEffect(() => {

    const camposParaAparecer = [
      'Título',
      'Atribuída a',
      'Descrição da Demanda',
      'Status da Questão',
      'Comentários'
    ]

    function priorizarCampos(campos: any) {
      const camposParaPriorizar = [
        "Título",
        "Status da Questão",
        "Descrição da Demanda",
        "Atribuída a",
        "Comentários"
      ];

      return campos.sort((a: any, b: any) => {

        return camposParaPriorizar.indexOf(a.Title) >= 0 ?
          (camposParaPriorizar.indexOf(a.Title) - camposParaPriorizar.length) - (camposParaPriorizar.indexOf(b.Title) - camposParaPriorizar.length)
          : 0

      });
    }

    if (props.chamadoSelecionado.Id !== 0) {

      //Buscar campos
      obterColunas(clienteSelecionado).then(resp => {
        // const camposFiltrados = resp.data.value.filter((campo: any) => camposParaAparecer.includes(campo.Title))
        setCamposChamado(priorizarCampos(resp))
      });

    }

  }, [clienteSelecionado])

  useEffect(() => {
    if (props.chamadoSelecionado.Id !== 0) setClienteSelecionado(props.chamadoSelecionado.Cliente)
    else setClienteSelecionado({ Id: 0 })

  }, [props.chamadoSelecionado.Id])

  useEffect(() => {

    if (camposChamado.length) {
      setCamposChamadoHtml(<></>)

      for (let campo of camposChamado as any) {

        // DEFININDO CAMPOS
        let html: JSX.Element;

        switch (campo.TypeAsString) {
          case 'Text':
            html = fieldText(campo, props.chamadoSelecionado)
            break;
          case 'Number':
            html = fieldNumber(campo, props.chamadoSelecionado)
            break;
          case 'Note':
            html = fieldNote(campo, props.chamadoSelecionado)
            break;
          case 'DateTime':
            html = fieldDate(campo, props.chamadoSelecionado)
            break;
          case 'Choice':
            html = fieldChoice(campo, props.chamadoSelecionado)
            break;
          case 'User':
            html = fieldUser(campo, props.chamadoSelecionado)
            break;
          case 'Boolean':
            html = fieldBoolean(campo, props.chamadoSelecionado)
            break;
          case 'Attachments':
            html = fieldAttachments(campo, props.chamadoSelecionado)
            break;
          default:
            html = fieldUndefined(campo, props.chamadoSelecionado)


        }

        setCamposChamadoHtml(prevHtml => <>{prevHtml}{html}</>)
      }
    }

  }, [camposChamado])

  function saveChamado(e: any) {
    e.preventDefault();
    console.log('Salvando...')

  }

  function resetFormChamado(e: any) {
    e.preventDefault();
    props.setChamadoSelecionado({ Id: 0 })
  }

  return (

    <>
      <MDBCard className={classNames({ 'd-none': clienteSelecionado.Id === 0 })}>
        <MDBCardHeader className='d-flex justify-content-between align-items-center'>
          <h4>
            {clienteSelecionado.Title}
            {props.chamadoSelecionado.Id !== 0 ? <> | #{props.chamadoSelecionado.Id} | {props.chamadoSelecionado.Title}</> : <>Novo chamado</>}

          </h4>

          <MDBBtn
            color='danger'
            className={props.chamadoSelecionado.Id === 0 ? 'd-none' : ''}
            onClick={() => props.setChamadoSelecionado({ Id: 0 })}
          >
            Cancelar edição
          </MDBBtn>

        </MDBCardHeader>
        <MDBCardBody>

          <Form onReset={resetFormChamado} onSubmit={saveChamado}>

            <Container>
              <Row>

                {camposChamadoHtml}


              </Row>
              <Row>

                <Col sm={12} md={6}>
                  <div className="d-grid gap-2">
                    <Button size='lg' variant='outline-danger' type="reset">
                      Cancelar edição
                    </Button>
                  </div>
                </Col>

                <Col sm={12} md={6}>
                  <div className="d-grid gap-2">
                    <Button size='lg' variant="success" type="submit">
                      Salvar
                    </Button>
                  </div>
                </Col>

              </Row>
            </Container>
          </Form>
        </MDBCardBody>
        <MDBCardFooter>


        </MDBCardFooter>
      </MDBCard>
    </>
  )
}



function fieldText(campo: any, chamadoSelecionado: any) {

  return (
    <Col sm={12} lg={6} className='mb-4'>

      <FloatingLabel
        controlId={`txt${campo.EntityPropertyName}`}
        title={campo.Title}
        label={campo.Title}
      >

        <Form.Control
          value={chamadoSelecionado[campo.EntityPropertyName]}
          type="text"
          title={campo.Title}
          onChange={() => { }}
        />
        <div className='form-text'>{campo.Description}</div>

      </FloatingLabel>
    </Col>
  )
}


function fieldNote(campo: any, chamadoSelecionado: any) {

  return (
    <Col sm={12} className='mb-4'>
      <FloatingLabel
        controlId={`txa${campo.EntityPropertyName}`}
        label={campo.Title}
      >
        <Form.Control
          as="textarea"
          value={chamadoSelecionado[campo.EntityPropertyName]}
          style={{ height: chamadoSelecionado[campo.EntityPropertyName]?.length > 400 ? '200px' : '60px' }}
          onChange={() => { }}
        />
        <div className='form-text'>{campo.Description}</div>
      </FloatingLabel>
    </Col>
  )
}


function fieldUser(campo: any, chamadoSelecionado: any) {

  const TitleEmail: string = chamadoSelecionado[campo.EntityPropertyName]?.Title + ' (' + chamadoSelecionado[campo.EntityPropertyName]?.EMail + ')';

  return (
    <Col sm={12} lg={6} className='mb-4'>

      <FloatingLabel
        controlId={`txt${campo.EntityPropertyName}`}
        label={campo.Title}
      >

        <Form.Control
          value={TitleEmail}
          type="text"
          onChange={() => { }}
        />
        <div className='form-text'>{campo.Description}</div>

      </FloatingLabel>
    </Col>
  )

}


function fieldChoice(campo: any, chamadoSelecionado: any) {

  return (
    <Col sm={12} lg={6} className='mb-4'>
      <FloatingLabel
        controlId={`floating${campo.EntityPropertyName}`}
        label={campo.Title}
      >
        <Form.Select
          aria-label={campo.Title}
          value={chamadoSelecionado.Id !== 0 ? chamadoSelecionado[campo.EntityPropertyName] : campo.DefaultValue}
          onChange={() => { }}
        >
          {campo.Required ? <></> : <option value="">Selecione o valor...</option>}
          {campo.Choices.map((valor: any) => {
            return (
              <option value={valor}>{valor}</option>
            )
          })}
        </Form.Select>
        <div className='form-text'>{campo.Description}</div>
      </FloatingLabel>

    </Col>
  )

}



function fieldBoolean(campo: any, chamadoSelecionado: any) {

  return (
    <Col sm={6} lg={3} className='mb-4'>
      <FloatingLabel
        controlId={`floating${campo.EntityPropertyName}`}
        label={campo.Title}
      >
        <Form.Select
          aria-label={campo.Title}
          value={chamadoSelecionado.Id !== 0 ? chamadoSelecionado[campo.EntityPropertyName] : campo.DefaultValue}
          onChange={() => { }}
        >
          {campo.Required ? <></> : <option value="">Selecione o valor...</option>}
          <option value='true'>Sim</option>
          <option value='false'>Não</option>
        </Form.Select>
        <div className='form-text'>{campo.Description}</div>
      </FloatingLabel>

    </Col>
  )

}


function fieldNumber(campo: any, chamadoSelecionado: any) {

  return (
    <Col sm={12} lg={6} className='mb-4'>

      <FloatingLabel
        controlId={`txn${campo.EntityPropertyName}`}
        label={campo.Title}
      >

        <Form.Control
          value={chamadoSelecionado[campo.EntityPropertyName]}
          type="number"
          min={campo.MinimumValue}
          max={campo.MaximumValue}
          onChange={() => { }}
        />
        <div className='form-text'>{campo.Description}</div>

      </FloatingLabel>
    </Col>
  )

}


function fieldDate(campo: any, chamadoSelecionado: any) {

  return (
    <Col sm={12} lg={6} className='mb-4'>

      <FloatingLabel
        controlId={`txn${campo.EntityPropertyName}`}
        label={campo.Title}
      >

        <Form.Control
          value={chamadoSelecionado[campo.EntityPropertyName]}
          type="date"
          onChange={() => { }}
        />
        <div className='form-text'>{campo.Description}</div>

      </FloatingLabel>
    </Col>
  )

}

function fieldAttachments(campo: any, chamadoSelecionado: any) {

  // console.log(chamadoSelecionado)

  return (
    <Col sm={12} className='mb-4'>

      <Row>
        <Col sm={12}>

          <Form.Group controlId={`txt${campo.EntityPropertyName}`}>
            <Form.Label>{campo.Title}</Form.Label>
            <Form.Control type="file" placeholder='Selecione...' onChange={() => { }} />
            <div className='form-text'>{campo.Description}</div>
          </Form.Group>


        </Col>
        <Col sm={12}>
          <Row>
            {chamadoSelecionado.AttachmentFiles.map((anexo: any) => {

              const formatFile = anexo.FileName.split('.').slice(-1)[0]
              
              const imageFile = formatFile === 'png' || formatFile === 'jpg' || formatFile === 'jpeg'
              console.log(imageFile)

              return imageFile ? (
                <Col sm={4}>
                  <Card className='shadow my-2'>
                    <Card.Img
                    variant="top"
                    src={URIs.Host + anexo.ServerRelativePath.DecodedUrl}
                    
                    />
                    <Card.Body>
                        <FontAwesomeIcon icon={faPaperclip} className='me-2' />
                        <Button
                        style={{wordBreak: 'break-all'}}
                        variant="link"
                        className='p-0'
                        href={URIs.Host + anexo.ServerRelativePath.DecodedUrl}
                        target='__blank'><span style={{wordBreak: 'break-all'}}>{anexo.FileName}</span></Button>
                    </Card.Body>
                  </Card>
                </Col>

              )
                : (

                  <Col sm={4}>
                    <Card className='shadow my-2'>
                      <Card.Body>
                        <FontAwesomeIcon icon={faPaperclip} className='me-2' />
                        <Button variant="link" className='p-0' href={URIs.Host + anexo.ServerRelativePath.DecodedUrl} target='__blank'>{anexo.FileName}</Button>
                      </Card.Body>
                    </Card>
                  </Col>

                )

              return (
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faPaperclip} className='me-2' />
                  <Button variant="link" className='p-0' href={URIs.Host + anexo.ServerRelativePath.DecodedUrl} target='__blank'>{anexo.FileName}</Button>
                </ListGroup.Item>
              )
            })}
          </Row>
        </Col>
      </Row>

    </Col>
  )

}
function fieldUndefined(campo: any, chamadoSelecionado: any) {

  // console.log(campo.TypeAsString)

  return (
    <Col sm={12} lg={6} className='mb-4'>

      <FloatingLabel
        controlId={`txt${campo.EntityPropertyName}`}
        label={campo.Title}
      >

        <Form.Control
          value={chamadoSelecionado[campo.EntityPropertyName]}
          type="text"
          onChange={() => { }}
        />
        <div className='form-text'>{campo.Description}</div>

      </FloatingLabel>
    </Col>
  )

}