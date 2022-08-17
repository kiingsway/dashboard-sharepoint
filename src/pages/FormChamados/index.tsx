import { IChamado, IChamadoSelecionado, ICliente } from 'interfaces';
import { MDBRow, MDBCol, MDBInput, MDBCheckbox, MDBBtn, MDBTextArea, MDBCard, MDBCardBody, MDBCardFooter, MDBCardHeader, MDBCardText, MDBCardTitle, MDBContainer } from 'mdb-react-ui-kit';
import React, { Component, useEffect, useState } from 'react'
import { criarItem, editarItem, obterCamposLista as obterCamposLista1 } from '../../services/SPRequest'
import { obterClientes, obterChamados, obterFeriados, obterColunas, obterUsuarios } from 'services/GetDashboardHelper'
import URIs from '../../services/uris.json'
import classNames from 'classnames';
import 'bootstrap'
import { Button, Card, Col, Container, FloatingLabel, Form, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { useTab } from '@mui/base';
import SelecionarChamado from './SelecionarChamado';
import { convertToObject } from 'typescript';
import UserField from './UserField';

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
      'Status da Questão',
      'Descrição da Demanda',
      'Comentários',
      'Anexos'
    ]

    function priorizarCampos(campos: any) {
      const camposParaPriorizar = [
        "Título",
        "Status da Questão",
        "Atribuída a",
        "Descrição da Demanda",
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

        let camposFiltrados = resp
        // Campos filtrados
        camposFiltrados = camposFiltrados.filter((campo: any) => camposParaAparecer.includes(campo.Title))

        setCamposChamado(priorizarCampos(camposFiltrados))
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
            html = FieldUser(campo, props.chamadoSelecionado, clienteSelecionado)
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


    let form: any = {};

    for (let elm of e.target) {
      form[elm.name] = elm.value
    }
    console.log(form);

  }

  function resetFormChamado(e: any) {
    e.preventDefault();
    props.setChamadoSelecionado({ Id: 0 })
  }

  const uriChamado = `${URIs.PClientes}/${props?.chamadoSelecionado?.Cliente?.InternalNameSubsite}/Lists/${props?.chamadoSelecionado?.Cliente?.InternalNameSubsiteList}/DispForm.aspx?ID=${props?.chamadoSelecionado?.Id}`;

  return (

    <>
      <SelecionarChamado
        clienteSelecionado={clienteSelecionado}
        setClienteSelecionado={setClienteSelecionado}
        setChamadoSelecionado={props.setChamadoSelecionado}
      />
      <MDBCard className={classNames({ 'd-none': clienteSelecionado.Id === 0 })}>
        <MDBCardHeader className='d-flex justify-content-between align-items-center'>
          <h4>
            {clienteSelecionado.Title}
            {props.chamadoSelecionado.Id !== 0 ? <> | #{props.chamadoSelecionado.Id} | {props.chamadoSelecionado.Title}</> : <>Novo chamado</>}

          </h4>

          <div className='text-right d-flex'>

            <MDBBtn
              href={uriChamado}
              target='__blank'
              color='secondary'
              outline
              className={props.chamadoSelecionado.Id === 0 ? 'd-none' : 'me-2 my-1'}
            >
              Abrir formulário no PClientes
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='ms-2' />
            </MDBBtn>

            <MDBBtn
              color='danger'
              className={props.chamadoSelecionado.Id === 0 ? 'd-none' : ' my-1'}
              onClick={() => props.setChamadoSelecionado({ Id: 0 })}
            >
              Cancelar edição
            </MDBBtn>
          </div>

        </MDBCardHeader>
        <Form onReset={resetFormChamado} onSubmit={saveChamado}>
          <MDBCardBody>


            <Container>
              <Row>
                {camposChamadoHtml}
              </Row>
            </Container>

          </MDBCardBody>
          <MDBCardFooter>
            <Row>

              <Col sm={12} md={6} lg={9}>
                <div className="d-grid gap-2">
                  <Button size='lg' variant='outline-danger' type="reset">
                    Cancelar edição
                  </Button>
                </div>
              </Col>

              <Col sm={12} md={6} lg={3}>
                <div className="d-grid gap-2">
                  <Button size='lg' variant="success" type="submit">
                    Salvar
                  </Button>
                </div>
              </Col>

            </Row>


          </MDBCardFooter>
        </Form>
      </MDBCard>
    </>
  )
}

function fieldText(campo: any, chamadoSelecionado: any) {

  return (
    <Col sm={12} md={6} xxl={4} className='mb-4'>

      <FloatingLabel
        controlId={`txt${campo.EntityPropertyName}`}
        title={campo.Title}
        label={campo.Title}
      >

        <Form.Control
          value={chamadoSelecionado[campo.EntityPropertyName]}
          name={campo.EntityPropertyName}
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
    <Col sm={12} xxl={6} className='mb-4'>
      <FloatingLabel
        controlId={`txa${campo.EntityPropertyName}`}
        label={campo.Title}
      >
        <Form.Control
          as="textarea"
          name={campo.EntityPropertyName}
          value={chamadoSelecionado[campo.EntityPropertyName]}
          style={{ height: chamadoSelecionado[campo.EntityPropertyName]?.length > 200 ? '200px' : '60px' }}
          onChange={() => { }}
        />
        <div className='form-text'>{campo.Description}</div>
      </FloatingLabel>
    </Col>
  )
}

function FieldUser(campo: any, chamadoSelecionado: any, clienteSelecionado: any) {

  const userSelected = chamadoSelecionado[campo.EntityPropertyName]
  const TitleEmail: string = chamadoSelecionado[campo.EntityPropertyName]?.Title + ' (' + chamadoSelecionado[campo.EntityPropertyName]?.EMail + ')';

  // const fieldUsers = [{Id:0}];

  // const [FieldUsers, setFieldUsers] = useState([])

  const FieldUsers: any[] = [];

  obterUsuarios(chamadoSelecionado.Cliente).then((usersItems: any) => { console.log(usersItems.data.value) })

  return (
    <Col sm={12} md={6} xxl={4} className='mb-4'>
      <FloatingLabel
        controlId={`floating${campo.EntityPropertyName}`}
        label={campo.Title}
      >
        <UserField
          campo={campo}
          clienteSelecionado={clienteSelecionado}
          chamadoSelecionado={chamadoSelecionado}
        />


        {/* <Form.Select
          name={campo.EntityPropertyName + 'Id'}
          aria-label={campo.Title}
          value={chamadoSelecionado?.Id !== 0 ? userSelected?.Id : ''}
          onChange={() => { }}
        >
          {campo?.Required ? <></> : <option value="">Selecione...</option>}

          {obterUsuarios(chamadoSelecionado.Cliente)
          .then(async (usersItems:any) => usersItems.data.value
          .map(async (user:any) => (
            <option value={user?.Id}>{user?.Title} ({user?.Email})</option>
            )
          ))}




          {/* {FieldUsers?.filter((item:any) => item?.Id === userSelected?.Id).length >= 1 ? <></> : <option value={userSelected?.Id}>
            {userSelected?.Title} ({chamadoSelecionado[campo.EntityPropertyName]?.EMail})
          </option>}

          {FieldUsers?.map((user: any) => {
            return (
              <option value={user?.Id}>{user?.Title} ({user?.Email})</option>
            )
          })} </Form.Select>*/}
      <div className='form-text'>{campo.Description}</div>
    </FloatingLabel>

    </Col >
  )

}

function fieldChoice(campo: any, chamadoSelecionado: any) {

  return (
    <Col sm={12} md={6} xxl={3} className='mb-4'>
      <FloatingLabel
        controlId={`floating${campo.EntityPropertyName}`}
        label={campo.Title}
      >
        <Form.Select
          aria-label={campo.Title}
          name={campo.EntityPropertyName}
          value={chamadoSelecionado.Id !== 0 ? chamadoSelecionado[campo.EntityPropertyName] : campo.DefaultValue}
          onChange={() => { }}
        >
          {campo.Required ? <></> : <option value="">Selecione...</option>}
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
    <Col sm={6} md={3} xxl={2} className='mb-4'>
      <FloatingLabel
        controlId={`floating${campo.EntityPropertyName}`}
        label={campo.Title}
      >
        <Form.Select
          name={campo.EntityPropertyName}
          aria-label={campo.Title}
          value={chamadoSelecionado.Id !== 0 ? chamadoSelecionado[campo.EntityPropertyName] : campo.DefaultValue}
          onChange={() => { }}
        >
          {campo.Required ? <></> : <option value="">Selecione...</option>}
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
    <Col sm={12} md={6} xxl={3} className='mb-4'>

      <FloatingLabel
        controlId={`txn${campo.EntityPropertyName}`}
        label={campo.Title}
      >

        <Form.Control
          name={campo.EntityPropertyName}
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
    <Col sm={12} md={6} xxl={3} className='mb-4'>

      <FloatingLabel
        controlId={`txn${campo.EntityPropertyName}`}
        label={campo.Title}
      >

        <Form.Control
          value={chamadoSelecionado[campo.EntityPropertyName]}
          type="date"
          name={campo.EntityPropertyName}
          onChange={() => { }}
        />
        <div className='form-text'>{campo.Description}</div>

      </FloatingLabel>
    </Col>
  )

}

function fieldAttachments(campo: any, chamadoSelecionado: any) {

  return (
    <Col sm={12} className='mb-4'>

      <Row>
        <Col sm={12}>

          <Form.Group controlId={`txt${campo.EntityPropertyName}`}>
            <Form.Label>{campo.Title}</Form.Label>
            <Form.Control type="file" placeholder='Selecione...'
              name={campo.EntityPropertyName} onChange={() => { }} />
            <div className='form-text'>{campo.Description}</div>
          </Form.Group>


        </Col>
        <Col sm={12}>
          <Row>
            {chamadoSelecionado.AttachmentFiles.map((anexo: any) => {

              const formatFile = anexo.FileName.split('.').slice(-1)[0]

              const imageFile = formatFile === 'png' || formatFile === 'jpg' || formatFile === 'jpeg'

              return imageFile ? (
                <Col sm={6} lg={4} xxl={2} key={anexo.FileName}>
                  <Card className='shadow my-2'>
                    <Card.Img
                      variant="top"
                      src={URIs.Host + anexo.ServerRelativePath.DecodedUrl}

                    />
                    <Card.Body>
                      <div className='d-flex align-items-baseline'>

                        <FontAwesomeIcon icon={faPaperclip} className='me-2' />
                        <Button
                          style={{ wordBreak: 'break-all' }}
                          variant="link"
                          className='p-0'
                          href={URIs.Host + anexo.ServerRelativePath.DecodedUrl}
                          target='__blank'><span style={{ wordBreak: 'break-all' }}>{anexo.FileName}</span></Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

              )
                : (

                  <Col sm={6} key={anexo.FileName}>
                    <Card className='shadow my-2'>
                      <Card.Body>
                        <FontAwesomeIcon icon={faPaperclip} className='me-2' />
                        <Button variant="link" className='p-0' href={URIs.Host + anexo.ServerRelativePath.DecodedUrl} target='__blank'>{anexo.FileName}</Button>
                      </Card.Body>
                    </Card>
                  </Col>

                )
            })}
          </Row>
        </Col>
      </Row>

    </Col>
  )

}

function fieldUndefined(campo: any, chamadoSelecionado: any) {

  return (
    <Col sm={12} md={6} xxl={3} className='mb-4'>

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