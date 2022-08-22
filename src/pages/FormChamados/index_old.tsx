import { IAtualizacaoSecao, IChamado, IChamadoSelecionado, ICliente, TAppTabs } from 'interfaces';
import { MDBRow, MDBCol, MDBInput, MDBCheckbox, MDBBtn, MDBTextArea, MDBCard, MDBCardBody, MDBCardFooter, MDBCardHeader, MDBCardText, MDBCardTitle, MDBContainer, MDBCardGroup, MDBCardImage } from 'mdb-react-ui-kit';
import React, { Component, useEffect, useState } from 'react'
import { obterClientes, obterChamados, obterFeriados, obterColunas, obterUsuarios, atualizarChamado, criarChamado, obterTodosChamados, obterChamado } from 'services/GetDashboardHelper'
import URIs from '../../services/uris.json'
import classNames from 'classnames';
import 'bootstrap'
import { Button, Card, Col, Container, FloatingLabel, Form, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import SelecionarChamado from './SelecionarChamado/index_old';
import UserField from './UserField';
import ComentariosField from './ComentariosField';
import SharepointFields from './SharepointFields';

interface Props {
  chamadoSelecionado: any;
  clientes: ICliente[];
  chamados: IChamado[];
  handleSelecionarChamado: (chamado: IChamadoSelecionado, tab?: TAppTabs) => void;
  atualizacaoSecao: IAtualizacaoSecao;
  setAtualizacaoSecao: React.Dispatch<React.SetStateAction<IAtualizacaoSecao>>;
  handleAtualizarChamadoLista: (cliente: Partial<ICliente>, chamado: Partial<IChamado>) => void
}

export default function FormChamados(props: Props) {


  const [camposChamado, setCamposChamado] = useState<any>([]);
  const [camposChamadoHtml, setCamposChamadoHtml] = useState(<></>);
  const [clienteSelecionado, setClienteSelecionado] = useState<any>({ Id: 0 });
  const [buscarResolvidos, setBuscarResolvidos] = useState<boolean>(false)
  const [listaChamados, setListaChamados] = useState<IChamado[]>(props.chamados)
  const [formData, setFormData] = useState({});

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

    if (clienteSelecionado.Id !== 0) {

      //Buscar campos
      obterColunas(clienteSelecionado).then(resp => {

        let camposFiltrados = resp
        // Campos filtrados
        camposFiltrados = camposFiltrados.filter((campo: any) => camposParaAparecer.includes(campo.Title))

        setCamposChamado(priorizarCampos(camposFiltrados))
      });

    }

    if (clienteSelecionado.Id) {
      props.setAtualizacaoSecao(prevAtt => ({ ...prevAtt, slcChamados: true }))

      if (buscarResolvidos) {

        obterTodosChamados(clienteSelecionado, 200).then((novosChamados: IChamado[]) => {

          setListaChamados([...props.chamados.filter(chamado => chamado.Cliente.Id !== clienteSelecionado.Id), ...novosChamados])
          props.setAtualizacaoSecao(prevAtt => ({ ...prevAtt, slcChamados: false }))

        })

      } else {

        obterChamados(clienteSelecionado).then((novosChamados: IChamado[]) => {

          if (!novosChamados.filter(chamado => chamado.Id === props.chamadoSelecionado.Id).length) props.handleSelecionarChamado({ Id: 0 })

          setListaChamados([...props.chamados.filter(chamado => chamado.Cliente.Id !== clienteSelecionado.Id), ...novosChamados])
          props.setAtualizacaoSecao(prevAtt => ({ ...prevAtt, slcChamados: false }))

        })

      }
    }

  }, [clienteSelecionado, buscarResolvidos, props.chamados])

  useEffect(() => {
    if (props.chamadoSelecionado?.Cliente?.Id) {
      setClienteSelecionado(props.chamadoSelecionado.Cliente)
    }

  }, [props.chamadoSelecionado])

  function handleFillFormData(e: React.ChangeEvent<HTMLInputElement>) {


    if (!e.target.name) {
      console.error(`Preencha o atributo NAME para o elemento de ID: ${e.target.id}`)
      return;
    }

    setFormData(prevFormData => ({ ...prevFormData, [e.target.name]: e.target.value }))

  }

  function atualizarFormulario() {

    setCamposChamadoHtml(<></>);

    if (camposChamado.length) {
      for (let campo of camposChamado) {
        setCamposChamadoHtml(prevHtml => <>{prevHtml}
          <SharepointFields
            campo={campo}
            chamadoSelecionado={props.chamadoSelecionado}
          />
        </>)
      }

    }
  }

  useEffect(() => {

    atualizarFormulario();

    return;
    let campo: any;

    // DEFININDO CAMPOS
    let html: JSX.Element = <></>;

    switch (campo.TypeAsString) {
      case 'Text':
        // html = fieldText(campo, props.chamadoSelecionado)
        break;
      case 'Number':
        html = <>{html}{fieldNumber(campo, props.chamadoSelecionado)}</>
        break;
      case 'Note':
        html = <>{html}{fieldNote(campo, props.chamadoSelecionado)}</>
        break;
      case 'DateTime':
        html = <>{html}{fieldDate(campo, props.chamadoSelecionado)}</>
        break;
      case 'Choice':
        html = <>{html}{fieldChoice(campo, props.chamadoSelecionado)}</>
        break;
      case 'User':
        html = <>{html}{FieldUser(campo, props.chamadoSelecionado, clienteSelecionado)}</>
        break;
      case 'Boolean':
        html = <>{html}{fieldBoolean(campo, props.chamadoSelecionado)}</>
        break;
      case 'Attachments':
        html = <>{html}{fieldAttachments(campo, props.chamadoSelecionado)}</>
        break;
      default:
        html = <>{html}{fieldUndefined(campo, props.chamadoSelecionado)}</>
    }

  }, [camposChamado, props.chamadoSelecionado])

  function saveChamado(e: any) {
    e.preventDefault();

    let formData: any = {};

    for (let elm of e.target) {
      if (elm.tagName !== 'BUTTON' && elm.name !== 'Attachments') formData[elm.name] = elm.value
    }
    formData.AtribuidaId = formData?.AtribuidaId ? parseInt(formData?.AtribuidaId) : null;

    if (props.chamadoSelecionado.Id === 0) {
      criarChamado(clienteSelecionado, formData).then((chamado: IChamado) => {
        atualizarFormulario();
        props.handleAtualizarChamadoLista(clienteSelecionado, chamado)
      });
      // Obter ID desse chamado e inserir no state Chamados.
    } else {
      atualizarChamado(props.chamadoSelecionado, formData).then((r: any) => {
        atualizarFormulario();
        obterChamado(props.chamadoSelecionado.Cliente, props.chamadoSelecionado.Id).then((chamado: IChamado) => {
          props.handleAtualizarChamadoLista(clienteSelecionado, chamado);
        })
      });
      // Obter versão atualizada desse chamado e substituir no state Chamados
    };

  }

  function resetFormChamado(e: any) {
    e.preventDefault();
    props.handleSelecionarChamado({ Id: 0 })
  }

  const uriEditChamado = `${URIs.PClientes}/${props?.chamadoSelecionado?.Cliente?.InternalNameSubsite}/Lists/${props?.chamadoSelecionado?.Cliente?.InternalNameSubsiteList}/DispForm.aspx?ID=${props?.chamadoSelecionado?.Id}`;

  const uriNewChamado = `${URIs.PClientes}/${clienteSelecionado?.InternalNameSubsite}/Lists/${clienteSelecionado?.InternalNameSubsiteList}/NewForm.aspx`;

  return (

    <>
      <SelecionarChamado
        buscarResolvidos={buscarResolvidos}
        setBuscarResolvidos={setBuscarResolvidos}
        clientes={props.clientes}
        listaChamados={listaChamados}
        chamadoSelecionado={props.chamadoSelecionado}
        clienteSelecionado={clienteSelecionado}
        setClienteSelecionado={setClienteSelecionado}
        handleSelecionarChamado={props.handleSelecionarChamado}
        atualizacaoSecao={props.atualizacaoSecao}
        setAtualizacaoSecao={props.setAtualizacaoSecao}
      />

      <MDBCard className={classNames({ 'd-none': !clienteSelecionado?.Id })}>
        <MDBCardHeader className='d-flex justify-content-between align-items-center'>
          <h4>
            {clienteSelecionado.Title}
            {props.chamadoSelecionado.Id !== 0 ? <> | #{props.chamadoSelecionado.Id} | {props.chamadoSelecionado.Title}</> : <> | Criar chamado</>}

          </h4>

          <div className='text-right d-flex'>

            <MDBBtn
              href={props.chamadoSelecionado.Id ? uriEditChamado : uriNewChamado}
              target='__blank'
              color='secondary'
              outline
              className='me-2 my-1'
            >
              {props.chamadoSelecionado.Id ? 'Editar chamado no PClientes' : 'Criar chamado no PClientes'}
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='ms-2' />
            </MDBBtn>

            <MDBBtn
              color='danger'
              className={props.chamadoSelecionado.Id === 0 ? 'd-none' : ' my-1'}
              onClick={() => props.handleSelecionarChamado({ Id: 0 })}
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
                  <Button size='lg' variant='outline-danger' type="reset" id='btnCancelarEdicao'>
                    Cancelar edição
                  </Button>
                </div>
              </Col>

              <Col sm={12} md={6} lg={3}>
                <div className="d-grid gap-2">
                  <Button size='lg' variant="success" type="submit" id='btnSalvarChamado'>
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


      {campo.EntityPropertyName === 'Comentarios' ?
        <ComentariosField
          campo={campo}
          chamadoSelecionado={chamadoSelecionado}
        /> :
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
        </FloatingLabel>
      }
      <div className='form-text'>{campo.Description}</div>
    </Col>
  )
}

function FieldUser(campo: any, chamadoSelecionado: any, clienteSelecionado: any) {

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
              <option value={valor} key={valor}>{valor}</option>
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

  const anexos: object[] = chamadoSelecionado.AttachmentFiles || [];

  return (
    <div className={classNames({ 'd-none': !chamadoSelecionado.AttachmentFiles?.length })}>
      <hr />
      <h3>Anexos</h3>

      <Col sm={12} className='mb-4'>
        <MDBCardGroup>
          {chamadoSelecionado.AttachmentFiles?.map((anexo: any) => {

            const formatFile = anexo.FileName.split('.').slice(-1)[0];

            const imageFile = formatFile === 'png' || formatFile === 'jpg' || formatFile === 'jpeg';

            return (
              <MDBCard>
                <MDBCardImage
                  src={URIs.Host + anexo.ServerRelativePath.DecodedUrl}
                  alt='...'
                  className={classNames({ 'd-none': !imageFile })}
                  position='top' />
                <MDBCardBody>
                  <MDBCardTitle>
                    <FontAwesomeIcon icon={faPaperclip} className='me-2' />
                    <Button
                      variant="link"
                      className='p-0'
                      href={URIs.Host + anexo.ServerRelativePath.DecodedUrl}
                      target='__blank'>
                      <span style={{ wordBreak: 'break-all', textTransform: 'none' }}>{anexo.FileName}</span>
                    </Button>
                  </MDBCardTitle>
                  <MDBCardText>
                    This is a wider card with supporting text below as a natural lead-in to additional content. This
                    content is a little bit longer.
                  </MDBCardText>
                </MDBCardBody>
                <MDBCardFooter>
                  <small className='text-muted'>Last updated 3 mins ago</small>
                </MDBCardFooter>
              </MDBCard>


            )
          })}
        </MDBCardGroup>
      </Col>
    </div>
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