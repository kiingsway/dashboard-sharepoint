import classNames from 'classnames';
import { IAtualizacaoSecao, IChamado, IChamadoSelecionado, ICliente, TAppTabs } from 'interfaces'
import { MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBCardTitle, MDBCardText, MDBCardFooter, MDBContainer, MDBCol, MDBRow, MDBSwitch, MDBSpinner } from 'mdb-react-ui-kit'
import React, { FormEvent, useEffect, useState } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'
import { obterChamados, obterColunas, obterTodosChamados } from 'services/GetDashboardHelper';

interface Props {
  clientes: ICliente[];
  chamados: IChamado[];
  clienteSelecionado: Partial<ICliente>;
  setClienteSelecionado: React.Dispatch<React.SetStateAction<Partial<ICliente>>>;
  chamadoSelecionado: IChamadoSelecionado;
  atualizacaoSecao: IAtualizacaoSecao;
  handleSelecionarChamado: (chamado: IChamadoSelecionado, tab?: TAppTabs) => void
}

interface IElmLoading { chamados: boolean; }

export default function SelecionarChamado(props: Props) {

  const [listaChamados, setListaChamados] = useState<IChamado[]>(props.chamados);
  const [buscarResolvidos, setBuscarResolvidos] = useState<boolean>(false);
  const [elmLoading, setElmLoading] = useState<IElmLoading>({ chamados: false });

  useEffect(() => {

    setElmLoading({ chamados: true })

    if (buscarResolvidos) {
      obterTodosChamados(props.clienteSelecionado, 200).then((novosChamados: any) => {

        const chamadosSemCliente = props.chamados.filter((chamado: any) => props.clienteSelecionado.Id !== chamado.Cliente.Id);
        setListaChamados([...chamadosSemCliente, ...novosChamados]);
        setElmLoading({ chamados: false })

      });

    } else {
      setListaChamados(props.chamados);
      setElmLoading({ chamados: false });
    }

    if (!props.clienteSelecionado.Id) {
      console.log("Cliente Selecionado ID: " + props.clienteSelecionado.Id)
      setBuscarResolvidos(false);
    }

  }, [buscarResolvidos, props.clienteSelecionado])

  function handleSelectChamado(e: any) {

    const [selectClienteId, selectChamadoId] = e.target.value.split('#').map((id: any) => parseInt(id));

    function filterSameCliente(chamado: any) {

      return chamado.Id === selectChamadoId && chamado.Cliente.Id === selectClienteId
    }

    const chamadoSelecionado: IChamadoSelecionado = selectChamadoId ?
      listaChamados.filter(filterSameCliente)[0] : { Id: 0 }

    props.handleSelecionarChamado(chamadoSelecionado)
  }

  function handleSelectCliente(e: any) {

    setElmLoading(prevState => ({ ...prevState, chamados: true }))

    // Verificar elemento ativo para condicionar se cliente foi alterado pelo usuário no selectCliente.
    if (e.target?.ownerDocument?.activeElement?.id === 'FormSelectCliente') props.handleSelecionarChamado({ Id: 0 })

    if (e.target.value) {

      const novoClienteSelecionado: IChamadoSelecionado = props.clientes.filter((cliente: ICliente) => cliente.Id === parseInt(e.target.value))[0];
      props.setClienteSelecionado(novoClienteSelecionado)

    } else {
      setBuscarResolvidos(false);
      props.setClienteSelecionado({ Id: 0 });
    }


    setElmLoading(prevState => ({ ...prevState, chamados: false }))
  }

  useEffect(() =>
    console.log('-'),
    // props.clienteSelecionado
    [props.clienteSelecionado])

  let chamadosDoCliente = listaChamados.filter(chamado => chamado.Cliente.Id === props.clienteSelecionado?.Id);

  return (
    <MDBCard className='rounded-0 rounded-bottom bg-dark'>
      <MDBCardBody>
        <MDBContainer className='p-0'>
          <MDBRow>
            <MDBCol size={12} className={classNames('my-1')} md={props.clienteSelecionado.Id ? 4 : 12}>

              <SkeletonInput show={props.atualizacaoSecao.clientes} message={'Obtendo clientes...'} />

              <FloatingLabel
                controlId='FormSelectCliente'
                label='Cliente'
                className={classNames('bg-dark text-light', { 'd-none': props.atualizacaoSecao.clientes })}
              >

                <Form.Select
                  className={classNames('bg-dark text-light', { 'd-none': props.atualizacaoSecao.clientes })}
                  id='FormSelectCliente'
                  name='FormSelectCliente'
                  aria-label='Selecionar cliente'
                  onChange={handleSelectCliente}
                  disabled={props.atualizacaoSecao.clientes || props.atualizacaoSecao.slcChamados || elmLoading.chamados}>

                  {props.clienteSelecionado.Id ?
                    <option value="">-- Fechar formulário --</option> :
                    <option value="">Selecione o cliente para criar e editar chamados...</option>}
                  {props.clientes.map((cliente: any) => <option key={cliente.Id} value={cliente.Id}>{cliente.Title}</option>)}

                </Form.Select>
              </FloatingLabel>

            </MDBCol>
            <MDBCol size={12} md={8} className={classNames('my-1', { 'd-none': !props.clienteSelecionado?.Id })}>


              <SkeletonInput show={props.atualizacaoSecao.clientes} message={'Obtendo clientes...'} />

              <SkeletonInput show={!props.atualizacaoSecao.clientes && props.atualizacaoSecao.chamados} message={'Obtendo chamados...'} />

              <SkeletonInput
                show={!props.atualizacaoSecao.clientes && !props.atualizacaoSecao.chamados && elmLoading.chamados}
                message={`Obtendo chamados da ${props.clienteSelecionado.Title}...`}
              />

              <FloatingLabel
                controlId='FormSelectChamado'
                label='Chamado'
                className={classNames('bg-dark text-light', { 'd-none': props.atualizacaoSecao.clientes || props.atualizacaoSecao.chamados || elmLoading.chamados })}
              >

                <Form.Select
                  id='FormSelectCliente'
                  className={classNames('bg-dark text-light', { 'd-none': props.atualizacaoSecao.clientes || props.atualizacaoSecao.chamados || elmLoading.chamados })}
                  name='FormSelectCliente'
                  aria-label='Selecionar chamado'
                  onChange={handleSelectChamado}
                  disabled={props.atualizacaoSecao.clientes}>

                  <option value="">Novo chamado ({chamadosDoCliente.length ? chamadosDoCliente.length : 'Nenhum'} encontrado{chamadosDoCliente.length > 1 ? 's' : ''})...</option>
                  {chamadosDoCliente.map(chamado => (
                    <option
                      key={`${chamado.Id}#${chamado.Cliente.Id}`}
                      value={`${chamado.Id}#${chamado.Cliente.Id}`}
                    >
                      {chamado.Cliente.Title} | #{chamado.Id} | {chamado.Title}
                    </option>
                  ))}

                </Form.Select>
              </FloatingLabel>

            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>

              <div className='mt-2'>
                <MDBSwitch
                  checked={buscarResolvidos}
                  onClick={() => setBuscarResolvidos((prevBuscar: any) => !prevBuscar)}
                  id='flexSwitchCheckDefault'
                  className='text-light'
                  label={<span className='text-light'>Obter chamados resolvidos (máx. 200)</span>} />
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </MDBCardBody>
    </MDBCard>
  )

}


function SkeletonInput(props: { show: boolean, message: string }) {

  const styleLoadingCard: React.CSSProperties = {
    height: '58px',
    backgroundColor: '#FFF',
    animation: 'background-color: hsl(200, 20%, 80%) 1s linear infinite alternate'
  }

  return (
    <MDBCard className={!props.show ? 'd-none' : 'shadow-0 border-0 skeleton'} style={styleLoadingCard}>
      <MDBCardBody className='p-0 d-flex flex-row align-items-center'>
        <div>
          <MDBSpinner role='status' className='mx-3' color='secondary'><span className='visually-hidden'>Carregando...</span></MDBSpinner>
        </div>
        <div className='text-muted fw-600 d-flex flex-column'>
          <span className='text-muted'>{props.message}</span>
        </div>
      </MDBCardBody>
    </MDBCard>
  )
}