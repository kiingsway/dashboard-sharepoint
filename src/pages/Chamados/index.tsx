import { faBars, faBatteryCar, faBug, faChartColumn, faClipboard, faClose, faEdit, faEnvelopeOpen, faFileCode, faFileCsv, faFileExcel, faFileLines, faFilePdf, faFilePowerpoint, faFileWord, faFileZipper, faIdCard, faImage, faLaptopFile, faList, faObjectGroup, faPaperclip, faProjectDiagram, faSearch, faSitemap, faTableList, faVideo, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IChamado, IChamadoSelecionado } from 'interfaces'
import { MDBTable, MDBTableHead, MDBTableBody, MDBBadge, MDBBtn, MDBContainer, MDBCol, MDBRow, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownLink, MDBTooltip, MDBInputGroup, MDBNavbar, MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBBtnGroup } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap';
import styles from './Chamados.module.scss'
import URIs from '../../services/uris.json'
import classNames from 'classnames';
import { style } from '@mui/system';
import { DateTime } from 'luxon'

interface Props {
  chamados: IChamado[]
}

interface IFilter {
  field: string;
  value: string;
}

const camposChamado = [
  { Title: 'Anexos', InternalName: 'Attachments' },
  { Title: 'ID', InternalName: 'Id' },
  { Title: 'Cliente', InternalName: 'ClienteTitle' },
  { Title: 'Título', InternalName: 'Title' },
  { Title: 'Bug em Produção?', InternalName: 'BugEmProducao' },
  { Title: 'Status', InternalName: 'StatusDaQuestao' },
  { Title: 'Atribuído', InternalName: 'AtribuidaTitle' },
  { Title: 'Descrição', InternalName: 'DescricaoDemanda' },
  { Title: 'Tipo de Solicitação', InternalName: 'TipoSolicitacao' },
  { Title: 'Modificado', InternalName: 'Modified' },
  { Title: 'E-mail do cliente', InternalName: 'EmailCliente' },
]

export default function Chamados(props: Props) {

  const [filter, setFilter] = useState<IFilter[]>([]);
  const [chamadosFiltrados, setChamadosFiltrados] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'card'>('card');

  function handleSetFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    const field = e.target.name;
    const value = e.target.value;

    const newFilter = { field, value }

    if (value) setFilter(prevFilter => [...prevFilter.filter(f => f.field !== field), newFilter]);
    else setFilter(prevFilter => prevFilter.filter(f => f.field !== field))
  }

  function handleRemoveFilter(filterRemove: IFilter) {

    setFilter(prevFilter => prevFilter.filter(f => f !== filterRemove))
  }

  function handleFiltrarChamados() {

    if (!filter.length && !search) setChamadosFiltrados(props.chamados)
    else {

      let newChamados = props.chamados;

      for (let filtro of filter) {
        const valSearch = filtro.value === '!null!' ? '' : filtro?.value?.toString();
        newChamados = newChamados.filter((ch: any) => {
          const chamadoSearch = ch[filtro.field]?.toString() ? ch[filtro.field]?.toString() : '';
          return chamadoSearch === valSearch
        })
      }

      if (search) {

        let newChamadosFiltrados = [];
        for (let chamado of newChamados) {
          let addChamado = false;
          for (let campo in chamado) {
            const valSearch = chamado[campo as keyof typeof chamado];
            const tipoCampo = typeof valSearch;
            const tipoCampoPesquisavel = tipoCampo === 'string' || tipoCampo === 'number';
            if (!tipoCampoPesquisavel) continue
            addChamado = valSearch?.toString().toLowerCase().includes(search?.toLowerCase()) || valSearch === search;
            if (addChamado) break;
          }
          if (addChamado) newChamadosFiltrados.push(chamado)
        }
        newChamados = newChamadosFiltrados;
      }
      setChamadosFiltrados(newChamados)
    }
  }

  const FilterSelect = (pr: { name: string; }) => {

    const field = pr.name;
    let values = props.chamados.map(chamado => {
      let vl = chamado[field as keyof typeof chamado];
      if (vl === null || vl === undefined || vl === '') return null
      else return vl.toString();
    })
    values = [...new Set(values)]
    let newValues: string[] = values.includes(null) ? ['!null!', ...values.filter(val => val !== null).sort() as string[]] : values.sort() as string[];

    const val = filter?.filter(f => f.field === field)[0]?.value || '';

    return (
      <select
        className={'py-1 rounded px-0 bg-dark text-light w-100 ' + styles.th_filter}
        aria-label={field}
        name={field}
        onChange={handleSetFilter}
        value={val}
      >
        <option value=''>--Todos--</option>
        {newValues.map(item => (
          <option key={item} value={item}>
            {item === '!null!' ? (field === 'AtribuidaTitle' ? '(sem atribuição)' : '(vazio)') : item}
          </option>
        ))}
      </select>
    )
  }

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

  useEffect(() => handleFiltrarChamados(), [props.chamados, filter, search])

  return (
    <>
      <MDBNavbar dark style={{ backgroundColor: '#292E33' }} className='mb-4 flex-nowrap align-items-end'>
        <div className='d-flex flex-wrap' style={{ width: '60%' }}>
          {filter.map(f => {
            const campo = camposChamado.filter(c => c.InternalName === f.field)[0];

            return (
              <div
                key={campo.InternalName}
                className={'d-flex text-light rounded mb-2 mx-2 shadow ' + styles.filterBadge}>
                <div>
                  {
                    f.value === '!null!' ?
                      <span className={styles.filterBadge_Value + ' text-muted'}>(vazio)</span>
                      :
                      <span className={styles.filterBadge_Value}>{f.value}</span>
                  }
                  <br />
                  <span className={styles.filterBadge_Field}>{campo.Title}</span>
                </div>

                <MDBBtn
                  outline
                  color='light'
                  className={'border-0 shadow-0 ms-2 rounded h-100 ' + styles.filterBadge_Close}
                  onClick={() => handleRemoveFilter(f)}>
                  <FontAwesomeIcon icon={faClose} />
                </MDBBtn>
              </div>
            )
          })}

        </div>
        <div className='d-flex pe-2 align-items-center' style={{ width: '40%' }}>

          <MDBInputGroup className='my-2 mx-4 shadow w-100' textClass='bg-transparent border-light shadow p-0' textBefore={<IconBeforeSearch />}>
            <input
              className='form-control py-0 px-3 bg-transparent text-white rounded-end shadow '
              placeholder="Pesquisar em tudo..."
              aria-label="Pesquisar chamados"
              type='text'
              value={search}
              onChange={e => setSearch(e.target.value)} />
          </MDBInputGroup>

          <MDBBtnGroup style={{ height: '36px' }}>
            <MDBBtn
              outline
              onClick={() => setView('list')}
              className={view === 'list' ? 'active' : ''}
              title='Visualização de tabela'
              color='light'
            >
              <FontAwesomeIcon icon={faList} />
            </MDBBtn>
            <MDBBtn
              className={view === 'card' ? 'active' : ''}
              outline
              onClick={() => setView('card')}
              title='Visualização de card'
              color='light'
            >
              <FontAwesomeIcon icon={faIdCard} />
            </MDBBtn>

          </MDBBtnGroup>

        </div>
      </MDBNavbar>

      <MDBTable color='dark' borderless responsive hover className='text-break mx-0' style={{ tableLayout: 'fixed' }}>
        <MDBTableHead>
          <tr>
            <th scope='col' className={styles.wb}>Anexos</th>
            <th scope='col' className={styles.wb}>ID</th>
            <th scope='col' className={styles.wb}>Cliente</th>
            <th scope='col' className={styles.wb}>Título</th>
            <th scope='col' className={styles.wb}>Bug em Produção?</th>
            <th scope='col' className={styles.wb}>Status</th>
            <th scope='col' className={styles.wb}>Atribuído</th>
            <th scope='col' className={styles.wb}>Descrição</th>
            <th scope='col' className={styles.wb}>Tipo de Solicitação</th>
            <th scope='col' className={styles.wb}>Modificado</th>
            <th scope='col' className={styles.wb}>Email do cliente</th>
          </tr>
          <tr>
            <th scope='col'><FilterSelect name='Attachments' /></th>
            <th scope='col'></th>
            <th scope='col'><FilterSelect name='ClienteTitle' /></th>
            <th scope='col'></th>
            <th scope='col'><FilterSelect name='BugEmProducao' /></th>
            <th scope='col'><FilterSelect name='StatusDaQuestao' /></th>
            <th scope='col'><FilterSelect name='AtribuidaTitle' /></th>
            <th scope='col'></th>
            <th scope='col'><FilterSelect name='TipoSolicitacao' /></th>
            <th scope='col'></th>
            <th scope='col'><FilterSelect name='EmailCliente' /></th>
          </tr>
        </MDBTableHead>
        <MDBTableBody className='w-100' style={{ borderTop: '1px solid #DDD' }}>
          {chamadosFiltrados.map(chamado => {

            if (view === 'card') return (
              <tr>
                <td colSpan={11}>
                  <MDBCard border='light' className='w-100 bg-dark' >
                    <MDBCardBody className='w-100'>

                      <MDBRow>
                        <MDBCol size={2} className='me-0'>
                          <TdId chamado={chamado} />
                        </MDBCol>
                        <MDBCol size={10}>
                          <MDBRow>
                            <MDBCol>
                              {chamado.Cliente.Title}
                            </MDBCol>
                          </MDBRow>
                          <MDBRow>
                            <MDBCol>
                              <TdTitle chamado={chamado} />
                            </MDBCol>


                          </MDBRow>
                        </MDBCol>
                      </MDBRow>

                    </MDBCardBody>
                  </MDBCard>
                </td>

              </tr>
            );
            else return (
              <tr key={`${chamado.Cliente.Id}#${chamado.Id}`}>
                <TdAttachments chamado={chamado} />
                <TdId chamado={chamado} />
                <TdCliente chamado={chamado} />
                <TdTitle chamado={chamado} />
                <TdBug chamado={chamado} />
                <TdStatusDaQuestao chamado={chamado} />
                <TdAtribuida chamado={chamado} />
                <TdDescricaoDemanda chamado={chamado} />
                <TdTipoSolicitacao chamado={chamado} />
                <TdModified chamado={chamado} />
                <TdEmailCliente chamado={chamado} />
              </tr>
            )
          })}
        </MDBTableBody>
      </MDBTable>
    </>
  )
}

interface ITdProps { chamado: IChamado }

type TFileType = 'image' | 'design' | 'video' | 'csv' | 'site' | 'compacted' | 'pdf' | 'bi' | 'word' | 'powerpoint' | 'excel' | 'email' | 'txt' | 'exe' | 'code' | 'project' | undefined;

const TdAttachments = (pr: ITdProps) => {

  const dataAttachments = pr.chamado.AttachmentFiles?.map((anexo: any) => {

    const formatFile = anexo.FileName.split('.').pop().toLowerCase();
    let icon: IconDefinition = faPaperclip;
    let type: TFileType;

    switch (formatFile) {
      case 'json':
      case 'xml':
      case 'har':
      case 'js':
      case 'html':
      case 'css':
        icon = faFileCode; type = 'code'; break;
      case 'avi':
      case 'mp4':
      case 'mkv':
      case 'gif':
      case 'wmv':
        icon = faVideo; type = 'video'; break;
      case 'png':
      case 'jpeg':
      case 'jpg':
      case 'svg':
      case 'ico':
        icon = faImage; type = 'image'; break;
      case 'zip':
      case 'rar':
      case '7z':
      case 'gz':
        icon = faFileZipper; type = 'compacted'; break;
      case 'xls':
      case 'xlsm':
      case 'xlsx':
        icon = faFileExcel; type = 'excel'; break;
      case 'ppt':
      case 'pptx':
        icon = faFilePowerpoint; type = 'powerpoint'; break;
      case 'doc':
      case 'docx':
        icon = faFileWord; type = 'word'; break;
      case 'msg':
      case 'eml':
        icon = faEnvelopeOpen; type = 'email'; break;
      case 'csv':
        icon = faFileCsv; type = 'csv'; break;
      case 'txt':
        icon = faFileLines; type = 'txt'; break;
      case 'pdf':
        icon = faFilePdf; type = 'pdf'; break;
      case 'exe':
        icon = faLaptopFile; type = 'exe'; break;
      case 'vsdx':
        icon = faProjectDiagram; type = 'project'; break;
      case 'ai':
        icon = faObjectGroup; type = 'design'; break;
      case 'pbix':
        icon = faChartColumn; type = 'bi'; break;
      case 'sppkg':
        icon = faSitemap; type = 'site'; break;
      default:
        icon = icon; type = undefined; break;
    }

    const PClientesHost = /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(URIs.PClientes);
    const url = `https://${PClientesHost?.[1]}${anexo?.ServerRelativePath?.DecodedUrl}`

    return {
      ...anexo,
      formatFile,
      icon,
      type,
      url
    }
  })

  return (
    <td className={`${styles.col} ${styles.col_Attachments}`}>
      <div className='text-center' style={{ maxWidth: '120px' }}>

        {dataAttachments?.map((anexo: any) => {

          const TooltipContent = () => (
            <div className='text-start' >
              <img
                src={anexo.url}
                className={classNames('img-thumbnail my-1', { 'd-none': anexo.type !== 'image' })}
                alt='...'
              />
              <p className='p-0 m-0 fw-bold' style={{ fontSize: '16px' }}>{anexo.FileName}</p>
              <p className='p-0 m-0'>{anexo?.ServerRelativePath?.DecodedUrl}</p>
              <span className='text-muted'>Clique para abrir...</span>
            </div>
          )

          return (

            <MDBTooltip
              key={anexo.FileName}
              wrapperProps={{ width: '200px' }}
              wrapperClass='p-0 m-0 bg-transparent border-0'
              title={<TooltipContent />}
            >
              <MDBBtn
                outline
                color='light'
                className='mx-0 border-0'
                href={anexo.url}
                target='__blank'>

                <FontAwesomeIcon icon={anexo.icon} />
              </MDBBtn>
            </MDBTooltip>
          )
        })}
      </div>
    </td>
  )
  return (
    <td className={`${styles.col} ${styles.col_Attachments}`}>
      <div className='text-center'>
        {pr.chamado.AttachmentFiles?.map(anexo => (
          <MDBBtn outline className='border-0' color='light'>
            <FontAwesomeIcon icon={faPaperclip} />
          </MDBBtn>
        ))}
      </div>
    </td>
  )
}
const TdId = (pr: ITdProps) => {

  const modificadoAlerta = {
    perigo: pr.chamado.diasUteisSemAtualizar >= 2.1,
    atencao: pr.chamado.diasUteisSemAtualizar >= 1.7 && pr.chamado.diasUteisSemAtualizar < 2.1,
    sucesso: pr.chamado.diasUteisSemAtualizar < 1.7
  }

  const statusAlerta = {
    atencao: pr.chamado.StatusDaQuestao === 'Aberto'
  }

  const atribuidoAlerta = {
    perigo: !pr.chamado?.Atribuida
  }

  const geralAlerta = {
    perigo: modificadoAlerta.perigo || atribuidoAlerta.perigo,
    atencao: modificadoAlerta.atencao || statusAlerta.atencao,
    sucesso: modificadoAlerta.sucesso
  }

  // Para evitar que múltiplas classes aparecam, aqui é verificado se algum mais 'forte' está true antes de colocar true.
  const geralApenasUmTrue = {
    perigo: geralAlerta.perigo,
    atencao: geralAlerta.atencao && !geralAlerta.perigo,
    sucesso: geralAlerta.sucesso && !geralAlerta.atencao && !geralAlerta.perigo
  }

  const uriChamado = `${URIs.PClientes}/${pr.chamado.Cliente.InternalNameSubsite}/Lists/${pr.chamado.Cliente.InternalNameSubsiteList}/EditForm.aspx?ID=${pr.chamado.Id}`;

  return (
    <td className={`${styles.col} ${styles.col_Id}`}>
      <MDBBtn
        href={uriChamado}
        target='__blank'
        outline
        className={`px-3 py-2 m-0 w-100 ${styles.btng}`}
        color={geralApenasUmTrue.perigo ? 'danger' : (geralApenasUmTrue.atencao ? 'warning' : 'success')}>

        <FontAwesomeIcon icon={faEdit} className='me-2' />
        #{pr.chamado.Id}

      </MDBBtn>
    </td>
  )
}
const TdCliente = (pr: ITdProps) => {
  return (
    <td className={`${styles.col} ${styles.col_Cliente}`}>
      <MDBBtn
        outline
        target='__blank'
        title={`Ir para o portal da ${pr.chamado.Cliente.Title}...`}
        href={`${URIs.PClientes}/${pr.chamado.Cliente.InternalNameSubsite}`}
        className={`border-0 ${styles.text_normal}`} color='light'>
        {pr.chamado.Cliente.Title}

      </MDBBtn>
    </td>
  )
}
const TdTitle = (pr: ITdProps) => {
  return (
    <td className={`${styles.col} ${styles.col_Title}`}>
      {pr.chamado.Title}
    </td>
  )
}
const TdBug = (pr: ITdProps) => {
  const bugEmProd = pr.chamado.BugEmProducao?.toLowerCase() === 'sim'
  return (
    <td className={`${styles.col} ${styles.col_Bug}`}>
      <MDBBadge
        color='danger'
        className={classNames(
          { 'bg-transparent': !bugEmProd },
          { 'fs-6': bugEmProd }
        )}>
        {bugEmProd ? <FontAwesomeIcon icon={faBug} className='me-2' /> : <></>}
        {pr.chamado.BugEmProducao}
      </MDBBadge>
    </td>
  )
}
const TdStatusDaQuestao = (pr: ITdProps) => {
  const status = pr.chamado.StatusDaQuestao?.toLowerCase();
  return (
    <td className={`${styles.col} ${styles.col_StatusDaQuestao}`}>
      <span className={classNames({ 'text-warning': status?.includes('abert') })}>
        {pr.chamado.StatusDaQuestao}
      </span>
    </td>
  )
}
const TdAtribuida = (pr: ITdProps) => {
  return (
    <td className={`${styles.col} ${styles.col_Atribuida} ${pr.chamado.Atribuida?.Title ? '' : 'text-danger'}`}>
      {pr.chamado.Atribuida?.Title ? pr.chamado.Atribuida.Title : '(sem atribuição)'}
    </td>
  )
}
const TdDescricaoDemanda = (pr: ITdProps) => {
  return (
    <td className={`${styles.col} ${styles.col_DescricaoDemanda}`}>
      <div
        style={{ maxHeight: '200px', maxWidth: '300px', overflow: 'auto' }}
        dangerouslySetInnerHTML={{ '__html': `${pr.chamado.DescricaoDemanda}` }}
      ></div>
    </td>
  )
}
const TdTipoSolicitacao = (pr: ITdProps) => {
  return (
    <td className={`${styles.col} ${styles.col_TipoSolicitacao}`}>
      {pr.chamado.TipoSolicitacao}
    </td>
  )
}
const TdModified = (pr: ITdProps) => {

  const modificadoAlerta = {
    perigo: pr.chamado.diasUteisSemAtualizar >= 2.1,
    atencao: pr.chamado.diasUteisSemAtualizar >= 1.7 && pr.chamado.diasUteisSemAtualizar < 2.1,
    sucesso: pr.chamado.diasUteisSemAtualizar < 1.7
  }

  return (
    <td className={`${styles.col} ${styles.col_Modified}`}>
      <p title={`${pr.chamado.diasCorridosSemAtualizar} dias corridos sem modificar`}>
        <span

          className={classNames(
            { 'text-danger': modificadoAlerta.perigo },
            { 'text-warning': modificadoAlerta.atencao },
            { 'text-success': modificadoAlerta.sucesso }
          )}>{pr.chamado.diasUteisSemAtualizar}</span> dias úteis sem modificar
      </p>
      <p title={pr.chamado.Modified}>
        {DateTime.fromISO(pr.chamado.Modified).toFormat('dd/LL - HH:mm')}
      </p>
    </td>
  )
}
const TdEmailCliente = (pr: ITdProps) => {
  return (
    <td className={`${styles.col} ${styles.col_EmailCliente}`}>
      {pr.chamado.EmailCliente}
    </td>
  )
}
