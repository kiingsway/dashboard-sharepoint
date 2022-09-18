import { useState, useRef } from 'react'
import styles from './Clientes.module.scss'
import { IChamado, ICliente } from '../../interfaces';
import { IoMdClose } from 'react-icons/io';
import { TbListDetails } from 'react-icons/tb'
import { TbSearch } from 'react-icons/tb'
import { BsGlobe, BsCardList, BsCalendar } from 'react-icons/bs'
import { MDBCol, MDBRow, MDBContainer, MDBBtn, MDBCardFooter } from 'mdb-react-ui-kit'
import { motion, AnimatePresence } from 'framer-motion'
import URIs from '../../services/uris.json'
import { DateTime } from 'luxon';
import classNames from 'classnames'
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane
} from 'mdb-react-ui-kit';

interface Props { clientes: ICliente[]; chamados: IChamado[]; }

export default function Clientes(props: Props) {

  // useState para pesquisa em Clientes
  const [search, setSearch] = useState('');

  // Use State para expandir card do cliente
  const [selectedCliente, selectCliente] = useState<ICliente | null>(null);


  // useRef para quando clique na Lupa, focar o texto de pesquisa.
  const searchRef = useRef(null);

  // Se existir o searchRef, foque-o.
  const handleClickSearch = () => searchRef.current ? (searchRef.current as any).focus() : null

  // Filtro na lista de clientes com o texto do search.
  const clientesFiltrados = props.clientes
    .filter(cliente => cliente.Title.toLowerCase()
      .includes(search.toLowerCase()))

  return (

    <AnimatePresence>
      <div className='d-flex flex-column w-100 align-items-center'>
        <nav className={classNames('rounded-bottom sticky-top', styles.search_bar)}>
          <MDBContainer breakpoint='sm'>
            <MDBRow>
              <MDBCol size={12}>
                <div className='d-flex'>
                  <div className={classNames(styles.search_icon, 'rounded-start')} onClick={handleClickSearch}>
                    <TbSearch />
                    {clientesFiltrados.length !== props.clientes.length ? clientesFiltrados.length : <></>}
                  </div>
                  <input
                    type="text"
                    value={search}
                    ref={searchRef}
                    title='Pesquisar...'
                    placeholder='Pesquisar...'
                    className={styles.search_text}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <div className={classNames(styles.search_icon, 'rounded-end')} onClick={() => setSearch('')}>
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

              return <ClienteCard
                selectedCliente={selectedCliente}
                selectCliente={selectCliente}
                key={cliente.Id}
                cliente={cliente}
                url={urlCliente}
                urlForm={urlClienteForm}
                qtdChamadosPorCliente={qtdChamadosPorCliente}
                chamadosPrevia={chamadosPrevia}
              />
            })}
          </motion.div>
        </MDBContainer>
      </div >
    </AnimatePresence>
  )
}

interface IClienteCardProps {
  cliente: ICliente;
  url: string;
  urlForm: string;
  qtdChamadosPorCliente: number;
  chamadosPrevia: Pick<IChamado, 'Id' | 'Title'>[];
  selectedCliente: ICliente | null;
  selectCliente: any
}

const ClienteCard = (pr: IClienteCardProps) => {


  const btnLinksClasses = 'shadow-inner w-50 border-0 text-center align-items-center d-flex flex-row flex-wrap justify-content-evenly ' + styles.footer_button

  const Created = {
    my: DateTime.fromISO(pr.cliente.Created, { locale: 'pt-BR' }).toFormat('LLL yyyy'),
    dmy: DateTime.fromISO(pr.cliente.Created, { locale: 'pt-BR' }).toFormat('dd LLL yyyy')
  }

  const isSelectedCliente = pr.selectedCliente?.Id === pr.cliente.Id;


  return (
    <motion.div
      layout
      transition={{ layout: { duration: .25, type: 'tween' } }}
      className={classNames([
        'col-12',
        `col-md-${(+isSelectedCliente + 1) * 6}`,
        `col-xl-${(+isSelectedCliente + 1) * 3}`,
        `col-xxl-${(+isSelectedCliente + 1) * 2}`,
        'p-2'])}>

      <motion.div layout className={classNames('rounded-top', styles.card_img)}>
          <motion.img
            layout
            src={pr.cliente.logo.Url}
            alt={`Logo do cliente "${pr.cliente.Title}"`}
            onClick={() => pr.selectCliente(isSelectedCliente ? null : pr.cliente)}/>
      </motion.div>


      <motion.div layout className={'card bg-dark ' + styles.clienteCard}>

        <motion.div layout className={`rounded-top ${styles.img}`}>

          <motion.img
            layout
            onClick={() => pr.selectCliente(isSelectedCliente ? null : pr.cliente)}
            src={pr.cliente.logo.Url}
            alt={`Logo do cliente "${pr.cliente.Title}"`}
            className="card-img-top" />

        </motion.div>


        <motion.div layout className='card-body'>
          <motion.div className="d-flex flex-row justify-content-between align-items-top mb-4">
            <motion.div
              className='d-flex justify-content-between align-items-center w-100'>

              <motion.h5
                onClick={() => pr.selectCliente(isSelectedCliente ? null : pr.cliente)}
                className={styles.card_title} >
                {pr.cliente.Title}
              </motion.h5>

              <motion.small className={classNames('text-muted', { 'd-none': !isSelectedCliente })}>
                <BsCalendar className='me-2' style={{ marginBottom: 3 }} />
                <span className='fw-light'>Criado em {Created.my}</span>
              </motion.small>

            </motion.div>
            <motion.div
              layout
              title={`${pr.qtdChamadosPorCliente} ${pr.qtdChamadosPorCliente > 1 ? 'chamados abertos' : 'chamado aberto'} para esse cliente`}
              className={classNames('d-flex align-items-center', { 'd-none': isSelectedCliente })}>
              <BsCardList className='me-2' style={{ marginTop: 3 }} /> {pr.qtdChamadosPorCliente}
            </motion.div>
          </motion.div>
          {
            isSelectedCliente &&
            <motion.div>

              <ClienteDetailsTabs
                qtdChamadosPorCliente={pr.qtdChamadosPorCliente}
                chamadosPrevia={pr.chamadosPrevia}
                cliente={pr.cliente}
              />

              <motion.div
                initial={{ opacity: 0, height: 'initial' }}
                animate={{ opacity: +isSelectedCliente, height: 200 }}
                exit={{ opacity: 0, height: 'initial' }}
                transition={{ duration: 1 }}
                layout
                className={styles.summChamados}
              >
                {pr.chamadosPrevia
                  .map(ch => <p key={ch.Id + ch.Title} ><b>#{ch.Id}</b> | {ch.Title}</p>)
                }

              </motion.div>
            </motion.div>
          }

        </motion.div>
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
      </motion.div>
    </motion.div>
  )
}

interface IClienteDetails {
  qtdChamadosPorCliente: number;
  chamadosPrevia: Pick<IChamado, "Id" | "Title">[];
  cliente: ICliente;
}

const ClienteDetailsTabs = (pr: IClienteDetails) => {
  type TTabs = 'chamados' | 'detalhes'
  const [tab, changeTab] = useState<TTabs>('chamados');
  const setTab = (value: TTabs) => { if (value === tab) return; else changeTab(value) }

  return (
    <>
      <MDBTabs fill className='mb-3'>

        <MDBTabsItem>
          <MDBTabsLink onClick={() => setTab('chamados')} active={tab === 'chamados'} className='bg-dark shadow-0'>
            <BsCardList className='me-2' style={{ marginBottom: 3 }} />
            {pr.qtdChamadosPorCliente} {pr.qtdChamadosPorCliente > 1 ? 'chamados abertos' : 'chamado aberto'}
          </MDBTabsLink>
        </MDBTabsItem>

        <MDBTabsItem>
          <MDBTabsLink onClick={() => setTab('detalhes')} active={tab === 'detalhes'}>
            <TbListDetails className='me-2' style={{ marginBottom: 3 }} />
            Detalhes
          </MDBTabsLink>
        </MDBTabsItem>

      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={tab === 'chamados'}>
          {pr.chamadosPrevia
            .map(ch => <small key={ch.Id + ch.Title} ><b>#{ch.Id}</b> | {ch.Title}</small>)
          }
        </MDBTabsPane>
        <MDBTabsPane show={tab === 'detalhes'}>
          <ul>
            <li>#{pr.cliente.Id}</li>
            <li>Título: {pr.cliente.Title}</li>
            <li>Nome Interno: {pr.cliente.ClienteInternalName}</li>
            <li>Criado: {DateTime.fromISO(pr.cliente.Created, { locale: 'pt-br' }).toFormat(`dd LLL${DateTime.fromISO(pr.cliente.Created).hasSame(DateTime.now(), 'year') ? '' : ' yyyy'}`)}</li>
            <li>URL Relativa: /sites/PClientes/{pr.cliente.InternalNameSubsite}/Lists/{pr.cliente.InternalNameSubsiteList}</li>
          </ul>
        </MDBTabsPane>
      </MDBTabsContent>
    </>
  )
}