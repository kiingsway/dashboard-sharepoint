import { faCableCar, faCaretDown, faDroplet, faFilter, faGears, faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { ICliente, IChamado, IFeriados, IChamadoSelecionado, IColTabelaChamados } from 'interfaces'
import { DateTime } from 'luxon'
import { MDBNavbar, MDBContainer, MDBNavbarToggler, MDBIcon, MDBCollapse, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink, MDBBtn, MDBInputGroup, MDBCol, MDBRow, MDBTable, MDBTableBody, MDBTableHead, MDBDropdown, MDBDropdownItem, MDBDropdownLink, MDBDropdownMenu, MDBDropdownToggle, MDBPopover, MDBPopoverBody, MDBPopoverHeader, MDBListGroup, MDBListGroupItem, MDBCheckbox, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBCard, MDBCardBody, MDBCardFooter, MDBCardHeader, MDBCardText, MDBCardTitle } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import ChamadoCard from './ChamadoCard'

interface Props {
  clientes: ICliente[]
  chamados: IChamado[]
  feriados?: IFeriados
  setChamadoSelecionado: React.Dispatch<React.SetStateAction<IChamadoSelecionado>>
}

const colunasTabelaDefault: IColTabelaChamados = {
  Attachments: { Title: 'Anexo', Show: false },
  Id: { Title: 'ID', Show: true },
  Cliente: { Title: 'Cliente', Show: true },
  Title: { Title: 'Título', Show: true },
  BugEmProducao: { Title: 'Bug em Produção?', Show: false },
  StatusDaQuestao: { Title: 'Status', Show: true },
  Atribuida: { Title: 'Atribuído a', Show: true },
  TipoSolicitacao: { Title: 'Tipo de solicitação', Show: false },
  DescricaoDemanda: { Title: 'Descrição', Show: true },
  EmailCliente: { Title: 'E-mail do cliente', Show: false },
  Modified: { Title: 'Modificado', Show: true },
  diasCorridosSemAtualizar: { Title: 'Dias (corridos) sem atualizar', Show: true },
  diasUteisSemAtualizar: { Title: 'Dias (úteis) sem atualizar', Show: true },
}

export default function ChamadosCard(props: Props) {

  const [colunasTabela, setColunasTabela] = useState<IColTabelaChamados>(colunasTabelaDefault);
  const [basicModal, setBasicModal] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>('');

  const [chamadosFiltrados, setChamadosFiltrados] = useState(props.chamados);

  let colunasChamado: string[] = [];
  for (let column in colunasTabelaDefault) colunasChamado.push(column);

  useEffect(() => {
    setChamadosFiltrados(props.chamados);

  }, [props.chamados])

  function handleSearchChamados(e:any) {
    setSearchText(e.target.value)

    const colunasChamadoAtual = colunasChamado.filter((col:any) => (colunasTabela as any)[col]['Show'])

    if(searchText) setChamadosFiltrados(props.chamados.filter((chamado:IChamado) => (
      chamado.Title.toLowerCase().includes(searchText.toLowerCase())
    )))
    else setChamadosFiltrados(props.chamados)
    

  }


  const toggleShow = () => setBasicModal(!basicModal);


  function handleFilter(keyFilter: string, valueFilter: string) {

    console.log(keyFilter + ' | ' + valueFilter)

  }

  function btnFilter(Title: string) {

    return (
      <div className='d-flex justify-content-between align-items-center'>
        <FontAwesomeIcon icon={faFilter} className='me-2' />
        {Title}
        <FontAwesomeIcon icon={faCaretDown} className='ms-2' />
      </div>
    )
  }

  return (
    <>
      <header className='bg-secondary rounded-bottom d-flex align-items-center justify-content-center text-white px-3 shadow'>
        <MDBRow className='w-100'>
          <MDBCol size={12} sm={6} md={3} className='my-3'>

            <MDBInputGroup className=' w-100' noBorder textAfter={<FontAwesomeIcon icon={faSearch} />}>
              <input
              className='form-control bg-dark border-0 text-white'
              type='text'
              placeholder='Pesquisar em qualquer campo...'
              onChange={handleSearchChamados}
              value={searchText}
              defaultValue={searchText}
              />
            </MDBInputGroup>

          </MDBCol>
          <MDBCol size={12} sm={6} md={3} className='my-3'>

            <MDBBtn block outline color='secondary' className='text-white border' onClick={toggleShow}>
              <FontAwesomeIcon icon={faFilter} className='me-2' />
              Filtros

            </MDBBtn>

          </MDBCol>
        </MDBRow>
      </header>

      <MDBContainer breakpoint='sm'>

        <MDBTable responsive="sm" className='text-white' color='dark' hover>
          <colgroup>
            {colunasChamado.map(colunaChamado => <col key={`col${colunaChamado}`} id={`col${colunaChamado}`} />)}
          </colgroup>

          <MDBTableHead>
            <tr>
              {colunasChamado.map(col => (<th key={col} className={classNames({ 'd-none': !(colunasTabela as any)[col].Show })}>{(colunasTabela as any)[col].Title}</th>))}
            </tr>

          </MDBTableHead>
          <MDBTableBody>
            {chamadosFiltrados.map((chamado: IChamado) => (
              <tr key={`${chamado.Id}#${chamado.Cliente.Title}`}>
                <td className={classNames({ 'd-none': !colunasTabela.Attachments.Show })}>{chamado.Attachments}</td>
                <td className={classNames({ 'd-none': !colunasTabela.Id.Show })}>{chamado.Id}</td>
                <td className={classNames({ 'd-none': !colunasTabela.Cliente.Show })}>{chamado.Cliente.Title}</td>
                <td className={classNames({ 'd-none': !colunasTabela.Title.Show })}>{chamado.Title}</td>
                <td className={classNames({ 'd-none': !colunasTabela.BugEmProducao.Show })}>{chamado.BugEmProducao}</td>
                <td className={classNames({ 'd-none': !colunasTabela.StatusDaQuestao.Show })}>{chamado.StatusDaQuestao}</td>
                <td className={classNames({ 'd-none': !colunasTabela.Atribuida.Show })}>{chamado?.Atribuida?.Title}</td>
                <td className={classNames({ 'd-none': !colunasTabela.TipoSolicitacao.Show })}>{chamado.TipoSolicitacao}</td>
                <td className={classNames({ 'd-none': !colunasTabela.DescricaoDemanda.Show })} dangerouslySetInnerHTML={{
                  __html: `<div style="max-height:230px;max-width:400px;overflow-y:auto;color:white !important;word-break: break-word;">
              <span id="DescricaoDemanda">${chamado?.DescricaoDemanda?.replace(/color:#000000;/g, '').replace(/color&#58;#000000;/g, '')}</span>
              </div>` }} />
                <td className={classNames({ 'd-none': !colunasTabela.EmailCliente.Show })}>{chamado.EmailCliente}</td>
                <td className={classNames({ 'd-none': !colunasTabela.Modified.Show })}>{DateTime.fromISO(chamado.Modified).toFormat('dd/MMM/y T')}</td>
                <td className={classNames({ 'd-none': !colunasTabela.diasCorridosSemAtualizar.Show })}>{chamado.diasCorridosSemAtualizar}</td>
                <td className={classNames({ 'd-none': !colunasTabela.diasUteisSemAtualizar.Show })}>{chamado.diasUteisSemAtualizar}</td>
              </tr>

            ))}
          </MDBTableBody>
        </MDBTable>


      </MDBContainer>

      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
        <MDBModalDialog size='xl'>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Filtros </MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>

              <MDBContainer>
                <MDBRow>
                  <h2>Filtros</h2>
                </MDBRow>
                <MDBRow>

                  <MDBCol size={12} sm={6} lg={3}>

                    <MDBCard alignment='center'>
                      <MDBCardHeader>Clientes</MDBCardHeader>
                      <MDBCardBody>
                        <MDBCardTitle>Special title treatment</MDBCardTitle>
                        <MDBCardText>With supporting text below as a natural lead-in to additional content.</MDBCardText>
                        <MDBBtn href='#'>Button</MDBBtn>
                      </MDBCardBody>
                      <MDBCardFooter className='text-muted'>2 days ago</MDBCardFooter>
                    </MDBCard>

                  </MDBCol>

                  <MDBCol size={12} sm={6} lg={3}>

                    <MDBCard alignment='center'>
                      <MDBCardHeader>Status</MDBCardHeader>
                      <MDBCardBody>
                        <MDBCardTitle>Special title treatment</MDBCardTitle>
                        <MDBCardText>With supporting text below as a natural lead-in to additional content.</MDBCardText>
                        <MDBBtn href='#'>Button</MDBBtn>
                      </MDBCardBody>
                      <MDBCardFooter className='text-muted'>2 days ago</MDBCardFooter>
                    </MDBCard>

                  </MDBCol>
                  <MDBCol size={12} sm={6} lg={3}>

                    <MDBCard alignment='center'>
                      <MDBCardHeader>Atribuição</MDBCardHeader>
                      <MDBCardBody>
                        <MDBCardTitle>Special title treatment</MDBCardTitle>
                        <MDBCardText>With supporting text below as a natural lead-in to additional content.</MDBCardText>
                        <MDBBtn href='#'>Button</MDBBtn>
                      </MDBCardBody>
                      <MDBCardFooter className='text-muted'>2 days ago</MDBCardFooter>
                    </MDBCard>

                  </MDBCol>
                  <MDBCol size={12} sm={6} lg={3}>

                    <MDBCard alignment='center'>
                      <MDBCardHeader>Vencimento</MDBCardHeader>
                      <MDBCardBody>
                        <MDBCardTitle>Special title treatment</MDBCardTitle>
                        <MDBCardText>With supporting text below as a natural lead-in to additional content.</MDBCardText>
                        <MDBBtn href='#'>Button</MDBBtn>
                      </MDBCardBody>
                      <MDBCardFooter className='text-muted'>2 days ago</MDBCardFooter>
                    </MDBCard>

                  </MDBCol>


                </MDBRow>
                <MDBRow>
                  <MDBCol size={12}>
                    <hr />

                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <h2>Campos na tabela</h2>
                </MDBRow>
                <MDBRow>

                  <MDBCol size={12}>

                    <MDBCard alignment='center'>
                      <MDBCardHeader>Clientes</MDBCardHeader>
                      <MDBCardBody>
                        <MDBCardTitle>Special title treatment</MDBCardTitle>
                        <MDBCardText>With supporting text below as a natural lead-in to additional content.</MDBCardText>
                        <MDBBtn href='#'>Button</MDBBtn>
                      </MDBCardBody>
                      <MDBCardFooter className='text-muted'>2 days ago</MDBCardFooter>
                    </MDBCard>

                  </MDBCol>
                </MDBRow>
              </MDBContainer>


            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleShow}>
                Close
              </MDBBtn>
              <MDBBtn>Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  )
}
