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
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
  MDBIcon
} from 'mdb-react-ui-kit';
import { IChamado, ICliente } from 'interfaces';
import { faCalendar, faGlobe, faInfoCircle, faList, faListSquares } from '@fortawesome/free-solid-svg-icons';
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
  const [basicActive, setBasicActive] = useState('tab1');

  const handleBasicClick = (value: string) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };

  return (
    <MDBRow>
      {props.clientes.map(cliente => {

        const chamadosDoCliente = props.chamados.filter(chamado => chamado.Cliente.Id === cliente.Id);
        const qtdChamadosPorCliente = chamadosDoCliente.length;
        const chamadosPrevia = chamadosDoCliente.map(chamado => ({ Id: chamado.Id, Title: chamado.Title }))

        const urlCliente = URIs.PClientes + '/' + cliente.InternalNameSubsite;
        const urlClienteForm = URIs.PClientes + '/' + cliente.InternalNameSubsite + '/Lists/' + cliente.InternalNameSubsiteList;

        return (

          <MDBCol key={cliente.ID} size={12} sm={6} md={4} xl={3} xxl={2} className='mb-4'>
            <MDBCard className='h-100 bg-dark text-light'>
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

                <MDBCardText className=' fw-light my-3'>
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
                </MDBCardText>
              </MDBCardBody>
              <MDBCardFooter className='shadow-inner'>
                <div className='d-flex justify-content-evenly my-2'>

                  <MDBBtn outline
                    className='me-2 shadow-inner'
                    color='light'
                    target='__blank'
                    href={urlCliente}
                    title={'Abrir portal de chamados da ' + cliente.Title + ' em outra aba...'}>

                    <FontAwesomeIcon
                      icon={faGlobe}
                      className='me-2' />

                    Portal
                  </MDBBtn>

                  <MDBBtn outline className='me-2 shadow-inner' color='light' target='__blank' href={urlClienteForm} title={'Abrir a lista de chamados da ' + cliente.Title + ' em outra aba...'}>
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
  );

}
