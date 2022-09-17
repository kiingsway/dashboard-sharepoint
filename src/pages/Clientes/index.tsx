import { useState, useRef } from 'react'
import styles from './Clientes.module.scss'
import { IChamado, ICliente } from '../../interfaces';
import { IoMdClose } from 'react-icons/io';
import { TbSearch } from 'react-icons/tb'
import { BsGlobe, BsCardList, BsCalendar } from 'react-icons/bs'
import {
  MDBCard, MDBCardBody, MDBCol,
  MDBRow, MDBCardImage, MDBContainer,
  MDBCardTitle, MDBBtn, MDBCardFooter
} from 'mdb-react-ui-kit'
import { motion } from 'framer-motion'
import URIs from '../../services/uris.json'
import { DateTime } from 'luxon';

interface Props { clientes: ICliente[]; chamados: IChamado[]; }

export default function Clientes(props: Props) {

  // useState para pesquisa em Clientes
  const [search, setSearch] = useState('');

  // useRef para quando clique na Lupa, focar o texto de pesquisa.
  const searchRef = useRef(null);

  // Se existir o searchRef, foque-o.
  const handleClickSearch = () => searchRef.current ? (searchRef.current as any).focus() : null

  // Filtro na lista de clientes com o texto do search.
  const clientesFiltrados = props.clientes
    .filter(cliente => cliente.Title.toLowerCase()
      .includes(search.toLowerCase()))

  return (
    <div className='d-flex flex-column w-100 align-items-center'>
      <nav className={`rounded-bottom ${styles.nav} sticky-top`}>
        <MDBContainer breakpoint='sm'>
          <MDBRow>
            <MDBCol size={12}>
              <div className='d-flex'>
                <div className={`${styles.icon} ${styles.icon_btn} text-light rounded-start`} onClick={handleClickSearch}>
                  <TbSearch />
                  {clientesFiltrados.length !== props.clientes.length ? clientesFiltrados.length : <></>}
                </div>
                <input
                  type="text"
                  value={search}
                  ref={searchRef}
                  title='Pesquisar...'
                  placeholder='Pesquisar...'
                  className={`w-100 ${styles.inputtext}`}
                  onChange={e => setSearch(e.target.value)}
                />
                <div className={`${styles.icon} ${styles.icon_btn} ${styles.icon_del} text-light rounded-end`} onClick={() => setSearch('')}>
                  <IoMdClose />
                </div>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </nav>

      <MDBContainer breakpoint='xxl'>

        <motion.div
          layout
          className='row px-3 pt-3 w-100 m-0 flex-row'>

          {clientesFiltrados.map(cliente => {

            const chamadosDoCliente = props.chamados.filter(chamado => chamado.Cliente.Id === cliente.Id);
            const qtdChamadosPorCliente = chamadosDoCliente.length;
            const chamadosPrevia = chamadosDoCliente.map(chamado => ({ Id: chamado.Id, Title: chamado.Title }))

            const urlCliente = `${URIs.PClientes}/${cliente.InternalNameSubsite}`;
            const urlClienteForm = `${urlCliente}/Lists/${cliente.InternalNameSubsiteList}`;

            return (
              <ClienteCard
                key={cliente.Id}
                cliente={cliente}
                url={urlCliente}
                urlForm={urlClienteForm}
                qtdChamadosPorCliente={qtdChamadosPorCliente}
                chamadosPrevia={chamadosPrevia}
              />)
          })}


        </motion.div>
      </MDBContainer>
    </div >
  )
}

interface IClienteCardProps {
  cliente: ICliente;
  url: string;
  urlForm: string;
  qtdChamadosPorCliente: number;
  chamadosPrevia: Pick<IChamado, 'Id' | 'Title'>[];
}

const ClienteCard = (pr: IClienteCardProps) => {

  const btnLinksClasses = 'shadow-inner w-50 border-0 text-center align-items-center d-flex flex-row flex-wrap justify-content-evenly ' + styles.footer_button

  const Created = {
    my: DateTime.fromISO(pr.cliente.Created, { locale: 'pt-BR' }).toFormat('LLL yyyy'),
    dmy: DateTime.fromISO(pr.cliente.Created, { locale: 'pt-BR' }).toFormat('dd LLL yyyy')
  }

  return (
    <motion.div
      layout
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0 }}
      exit={{ opacity: 0, scale: 0 }}
      whileHover={{ scale: 1.05 }}
      className='col-12 col-md-6 col-xl-3 col-xxl-2 p-2'>

      <MDBCard background='dark' className={styles.clienteCard}>

        <div className={`rounded-top ${styles.img}`}>

          <MDBCardImage
            src={pr.cliente.logo.Url}
            alt={`Logo do cliente "${pr.cliente.Title}"`}
            position='top'
          />

        </div>
        <MDBCardBody>
          <MDBCardTitle>{pr.cliente.Title}</MDBCardTitle>


          <Tooltip tooltip={<small className='text-muted'>{Created.dmy}</small>}>

            <BsCalendar className='me-2' style={{ marginBottom: 3 }} />
            <span className='fw-ligt'>Criado em {Created.my}</span>

          </Tooltip>
          <Tooltip
            tooltip={<>{pr.chamadosPrevia.map(ch => <p key={ch.Id + ch.Title} className={styles.fs_13px}><b>#{ch.Id}</b> | {ch.Title}</p>)}</>}>
            <BsCardList className='me-2' />
            {pr.qtdChamadosPorCliente} {pr.qtdChamadosPorCliente > 1 ? 'chamados abertos' : 'chamado aberto'}
          </Tooltip>


        </MDBCardBody>
        <MDBCardFooter className={styles.footer}>
          <MDBBtn
            outline
            className={btnLinksClasses + ' px-2'}
            color='light'
            target='__blank'
            href={pr.url}
            title={'Abrir portal de chamados da ' + pr.cliente.Title + ' em outra aba...'}>

            <BsGlobe />
            <span className={styles.lh_0}>Portal</span>
          </MDBBtn>
          <MDBBtn
            outline
            className={btnLinksClasses + ' px-3'}
            color='light'
            target='__blank'
            href={pr.urlForm}
            title={'Abrir a lista de chamados da ' + pr.cliente.Title + ' em outra aba...'}>

            <BsCardList />
            <span className={styles.lh_0}>Lista</span>
          </MDBBtn>
        </MDBCardFooter>
      </MDBCard>
    </motion.div >
  )
}

const Tooltip = (pr: { tooltip: string | JSX.Element; children: any; }) => {

  const textMotion = {
    rest: {
      x: 0,
      transition: { duration: 2, type: "tween", ease: "easeIn" }
    },
    hover: {
      x: 10,
      transition: { duration: 0.4, type: "tween", ease: "easeOut" }
    }
  };

  const slashMotion = {
    rest: { opacity: 0, ease: "easeOut", duration: 0.2, type: "tween" },
    hover: {
      opacity: 1,
      transition: { duration: 0.4, type: "tween", ease: "easeIn" }
    }
  };

  return (
    <motion.div
      initial='rest'
      whileHover='hover'
      animate='rest'
    >
      <motion.div variants={textMotion} className='mb-1'>
        {pr.children}
      </motion.div>

      <motion.div variants={slashMotion} className={[styles.lh_0, styles.divTooltip].join(' ')}>
        {pr.tooltip}
      </motion.div>

    </motion.div>
  )
}