import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBCardFooter,
  MDBCardText,
  MDBCardTitle,
  MDBBtn,
  MDBTooltip,
  MDBContainer,
  MDBInputGroup,
  MDBNavbar,
  MDBIcon
} from 'mdb-react-ui-kit';
import { IChamado, ICliente } from 'interfaces';
import { faCalendar, faClose, faGlobe, faList, faListSquares, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon'
import classNames from 'classnames';
import URIs from '../../services/uris.json'
import { useState } from 'react';

interface Props {
  clientes: ICliente[]
  chamados: IChamado[]
}

export default function Clientes(props: Props) {

  const [search, setSearch] = useState('');

  const filteredClientes = props.clientes.filter(cliente => cliente.Title.toLowerCase().includes(search.toLowerCase()))

  const IconBeforeSearch = () => {

    if (search) return (
      <MDBBtn className='bg-transparent border-0 shadow-0 me-1' onClick={() => setSearch('')}>
        <FontAwesomeIcon icon={faClose} className='bg-transparent text-light' />
      </MDBBtn>
    )
    else return (
      <MDBBtn className='bg-transparent border-0 shadow-0' disabled>
        <FontAwesomeIcon icon={faSearch} className='bg-transparent text-light' />
      </MDBBtn>
    )
  }

  return (
    <>
      <MDBNavbar dark style={{ backgroundColor: '#292E33'}} className='shadow position-relative sticky-top'>
        <div />
        <MDBInputGroup className='my-1 mx-4 w-25 shadow' textClass='bg-transparent border-light shadow p-0' textBefore={<IconBeforeSearch />}>
          <input
            className='form-control py-0 px-3 bg-transparent text-white rounded-end shadow '
            placeholder="Pesquisar..."
            aria-label="Pesquisar cliente"
            type='text'
            value={search}
            onChange={e => setSearch(e.target.value)} />
        </MDBInputGroup>
      </MDBNavbar>

      <MDBContainer className='text-light overflow-auto w-100 d-flex justify-content-center' style={{ height: '80vh' }} breakpoint='sm' >
        <MDBRow style={{maxWidth: '100vm'}}>
          {filteredClientes?.map(cliente => {

            const chamadosDoCliente = props.chamados.filter(chamado => chamado.Cliente.Id === cliente.Id);
            const qtdChamadosPorCliente = chamadosDoCliente.length;
            const chamadosPrevia = chamadosDoCliente.map(chamado => ({ Id: chamado.Id, Title: chamado.Title }))

            const urlCliente = `${URIs.PClientes}/${cliente.InternalNameSubsite}`;
            const urlClienteForm = `${urlCliente}/Lists/${cliente.InternalNameSubsiteList}`;

            return (

              <MDBCol key={cliente.ID} size={12} sm={6} md={4} xl={3} xxl={2} className='mb-4'>
                <MDBCard className='h-100 bg-dark text-light shadow'>
                  <div className='bg-light rounded-top' style={{ height: '150px' }}>

                    <MDBCardImage
                      src={cliente?.logo?.Url}
                      alt={cliente.Title}
                      className='p-4'
                      position='top'
                      style={{ overflow: 'hidden', maxHeight: '150px' }}
                    />

                  </div>
                  <MDBCardBody className='text-center shadow bg-dark'>
                    <MDBCardTitle className=''>{cliente.Title}</MDBCardTitle>

                    <div className=' fw-light my-3'>
                      <MDBCol className={classNames({ 'invisible': !qtdChamadosPorCliente })} style={{ cursor: 'default' }}>

                        <MDBTooltip
                          tag='span'
                          title={chamadosPrevia.map(ch => <p style={{ fontSize: '13px' }}><b>#{ch.Id}</b> | {ch.Title}</p>)}>
                          <FontAwesomeIcon icon={faListSquares} className='me-2' />
                          {qtdChamadosPorCliente} {qtdChamadosPorCliente > 1 ? 'chamados abertos' : 'chamado aberto'}
                        </MDBTooltip>

                      </MDBCol>
                      <MDBCol className='mt-2' style={{ cursor: 'default' }}>

                        <MDBTooltip
                          tag='span'
                          title={<>Cliente criado em <br /> {DateTime.fromISO(cliente.Created, { locale: 'pt-BR' }).toFormat('dd LLL yyyy')}</>}>
                          <small>
                            <FontAwesomeIcon icon={faCalendar} className='me-2' />
                            Criado em {DateTime.fromISO(cliente.Created, { locale: 'pt-BR' }).toFormat('LLL yyyy')}
                          </small>
                        </MDBTooltip>

                      </MDBCol>
                    </div>
                  </MDBCardBody>
                  <MDBCardFooter className='shadow-inner'>
                    <div className='d-flex justify-content-evenly my-2'>

                      <MDBBtn outline
                        className='me-2 shadow-inner w-50 px-1 text-center align-items-center d-flex flex-row flex-wrap justify-content-evenly'
                        color='light'
                        target='__blank'
                        href={urlCliente}
                        title={'Abrir portal de chamados da ' + cliente.Title + ' em outra aba...'}>

                        <FontAwesomeIcon
                          icon={faGlobe}
                          className='' />
                        <span style={{ lineHeight: '0.9em' }}>Portal</span>
                      </MDBBtn>

                      <MDBBtn outline className=' shadow-inner w-50' color='light' target='__blank' href={urlClienteForm} title={'Abrir a lista de chamados da ' + cliente.Title + ' em outra aba...'}>
                        <FontAwesomeIcon icon={faList} className='me-2' />
                        Lista
                      </MDBBtn>

                    </div>

                  </MDBCardFooter>
                </MDBCard>
              </MDBCol>
            )
          })}
        </MDBRow >
      </MDBContainer>
    </>
  );

}
