import { faArrowRotateLeft, faArrowRotateRight, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { IAtualizacaoSecao, IChamado, IChamadoSelecionado, ICliente } from 'interfaces'
import { MDBCard, MDBCardBody, MDBRipple, MDBSpinner, MDBSwitch } from 'mdb-react-ui-kit'
import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, FloatingLabel, Form, Row } from 'react-bootstrap'
import './SelecionarChamado.css'
// import styles from './SelecionarChamado.module.scss'

interface Props {
  clientes: ICliente[];
  listaChamados: IChamado[];
  clienteSelecionado: ICliente;
  chamadoSelecionado: IChamadoSelecionado;
  setClienteSelecionado: any
  handleSelecionarChamado: (chamado: IChamadoSelecionado) => void
  buscarResolvidos: any
  setBuscarResolvidos: any
  atualizacaoSecao: IAtualizacaoSecao
  setAtualizacaoSecao: React.Dispatch<React.SetStateAction<IAtualizacaoSecao>>;
}

export default function SelecionarChamado(props: Props) {

  const [chamadosCliente, setChamadosCliente] = useState<IChamadoSelecionado[]>([]);



  function handleSelectChamado(e: any) {
    const [selectClienteId, selectChamadoId] = e.target.value.split('#').map((id: any) => parseInt(id));

    const chamadoSelecionado: IChamadoSelecionado = selectChamadoId ?
      props.listaChamados
        .filter((chamado: IChamado) => chamado.Id === selectChamadoId && chamado.Cliente.Id === selectClienteId)[0]
      :
      { Id: 0 }

    props.handleSelecionarChamado(chamadoSelecionado)
  }

  /**
   * Toda vez que o cliente for alterado, é obtido os chamados desse cliente e
   * atualizado no state de Chamados. Também é inserido chamados Resolvidos caso a opção esteja ativa.
   * @param e Evento recebido.
   * @returns void
   */
  function handleSelectCliente(e: any) {

    props.setAtualizacaoSecao(prevAtt => ({ ...prevAtt, slcChamados: true }))

    // Verificar elemento ativo para condicionar se cliente foi alterado pelo usuário no selectCliente.
    if (e.target.ownerDocument.activeElement.id === 'FormSelectCliente') props.handleSelecionarChamado({ Id: 0 })

    if (e.target.value) {

      const novoClienteSelecionado: IChamadoSelecionado = props.clientes.filter((cliente: ICliente) => cliente.Id === parseInt(e.target.value))[0];

      props.setClienteSelecionado(novoClienteSelecionado)


    } else {
      props.setBuscarResolvidos(false);

      props.setClienteSelecionado({ Id: 0 });

    }

    props.setAtualizacaoSecao(prevAtt => ({ ...prevAtt, slcChamados: false }))
  }

  useEffect(() => {

    const chamadosDoCliente = props.listaChamados.filter((chamado: IChamado) => chamado.Cliente.Id === props.clienteSelecionado.Id)

    setChamadosCliente(chamadosDoCliente)

  }, [props.clienteSelecionado, props.listaChamados])

  // const txt = `Cliente selecionado: #${props.clienteSelecionado.Id} ${props.clienteSelecionado.Title}
  // Chamado selecionado: #${props.listaChamadoselecionado.Id} do cliente ${props.listaChamadoselecionado?.Cliente?.Title}`;
  // console.log(txt)

  const styleLoadingCard: React.CSSProperties = {
    height: '58px',
    backgroundColor: '#FFF',
    animation: 'background-color: hsl(200, 20%, 80%) 1s linear infinite alternate'
  }


  return (

    <Card className='shadow mb-3'>
      <Card.Body className='pb-1'>
        <Row>
          <Col sm={12} md={!props.clienteSelecionado?.Id ? 12 : 4}>

            <MDBCard className={!props.atualizacaoSecao.clientes ? 'd-none' : 'shadow-0 border-0 skeleton'} style={styleLoadingCard}>
              <MDBCardBody className='p-0 d-flex flex-row align-items-center'>
                <div>
                  <MDBSpinner role='status' className='mx-3' color='secondary'><span className='visually-hidden'>Loading...</span></MDBSpinner>

                </div>
                <div className='text-muted fw-600 d-flex flex-column'>
                  <span className='text-muted'>Obtendo clientes...</span>
                </div>

              </MDBCardBody>
            </MDBCard>

            <FloatingLabel
              controlId='FormSelectCliente'
              label='Cliente'
              className={props.atualizacaoSecao.clientes ? 'd-none' : ''}
            >

              <Form.Select
                id='FormSelectCliente'
                name='FormSelectCliente'
                aria-label='Selecionar cliente'
                defaultValue={props.clienteSelecionado.Id}
                value={props.clienteSelecionado.Id}
                onChange={handleSelectCliente}
                disabled={props.atualizacaoSecao.slcChamados}
                >

                {props.clienteSelecionado.Id ?
                  <option value="">-- Fechar formulário --</option> :
                  <option value="">Selecione o cliente para criar e editar chamados...</option>}

                {props.clientes?.map((cliente: ICliente) => <option key={cliente.Id} value={cliente.Id}>{cliente.Title}</option>)}

              </Form.Select>
            </FloatingLabel>

          </Col>
          <Col sm={12} md={8} className={!props.clienteSelecionado?.Id ? 'd-none' : 'align-items-baseline'}>

            <MDBCard className={!props.atualizacaoSecao.slcChamados ? 'd-none' : 'shadow-0 border-0 skeleton'} style={styleLoadingCard}>
              <MDBCardBody className='p-0 d-flex flex-row align-items-center'>
                <div>
                  <MDBSpinner role='status' className='mx-3' color='secondary'><span className='visually-hidden'>Loading...</span></MDBSpinner>

                </div>
                <div className='text-muted fw-600 d-flex flex-column'>
                  <span className='text-muted'>Obtendo chamados...</span>
                  <span className='text-muted'>Cliente: {props.clienteSelecionado?.Title}</span>
                </div>

              </MDBCardBody>
            </MDBCard>

            <FloatingLabel
              controlId='FormSelectChamado'
              label='Chamado'
              className={props.atualizacaoSecao.slcChamados ? 'd-none' : ''}
            >

              <Form.Select
                name='FormSelectChamado'
                aria-label='Selecionar chamado'
                value={`${props.chamadoSelecionado?.Cliente?.Id}#${props.chamadoSelecionado.Id}`}
                onChange={handleSelectChamado}
                disabled={!props.clienteSelecionado?.Id || props.atualizacaoSecao.slcChamados}
              >
                {!props.clienteSelecionado?.Id ? <option>Selecione o cliente...</option> : null}
                <option value="">Criar chamado... ({chamadosCliente.length ? chamadosCliente.length : 'Nenhum'} encontrado{chamadosCliente.length > 1 ? 's' : ''})</option>

                {props.listaChamados.filter((chamado: IChamado) => chamado.Cliente.Id === props.clienteSelecionado.Id).map((chamado: IChamado) => (
                  <option
                    key={chamado.Id}
                    value={`${chamado?.Cliente?.Id}#${chamado.Id}`}
                  >
                    #{chamado.Id} | {chamado.Title}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>

          </Col>
        </Row>
        <Row>
          <Col>

            <div className="my-2">

              <MDBSwitch
                id='flexSwitchCheckDefault'
                label='Buscar chamados resolvidos (max. 200)'
                checked={props.buscarResolvidos}
                onClick={() => props.setBuscarResolvidos((prevBuscar: any) => !prevBuscar)}
              />
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
