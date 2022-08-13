import { faGears } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { IChamado, ICliente, IChamadoSelecionado, IFeriados, IColTabelaChamados } from 'interfaces'
import { DateTime } from 'luxon'
import { MDBBtn, MDBCollapse, MDBTable } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import './Chamados.module.scss'
import Filtros from './Filtros'

interface Props {
  clientes: ICliente[]
  chamados: IChamado[]
  feriados?: IFeriados
  setChamadoSelecionado: React.Dispatch<React.SetStateAction<IChamadoSelecionado>>
}

const filtrosDefault = {
  Cliente: [],
  Status: [],
  Atribuicao: [],
  Modificado: {
    De: null,
    Até: DateTime.now().endOf('day')
  }
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
  diasCorridosSemAtualizar: { Title: 'Dias (corridos) sem atualizar', Show: false },
  diasUteisSemAtualizar: { Title: 'Dias (úteis) sem atualizar', Show: false },
}

export default function Chamados(props: Props) {
  
  const [showConfig, setShowConfig] = useState(false);
  const [chamadosFiltrados, setChamadosFiltrados] = useState<IChamado[]>(props.chamados);
  const [filtros, setFiltros] = useState(filtrosDefault);
  const [colunasTabela, setColunasTabela] = useState(colunasTabelaDefault);

  const toggleShow = () => setShowConfig(!showConfig);
  
  // Adicionar Colunas Tabela no Local Storage

  useEffect(() => setChamadosFiltrados(props.chamados), [props.chamados])

  // useEffect(() => console.table(chamadosFiltrados), [chamadosFiltrados])

  let colunasChamado: string[] = [];
  for (let column in colunasTabelaDefault) colunasChamado.push(column);

  // console.log('Colunas Tabela:')
  // console.table(colunasTabela)

  function tabela() {
    return (
      <>
        <colgroup>
        
          {colunasChamado.map(colunaChamado => <col key={`col${colunaChamado}`} id={`col${colunaChamado}`} /> )}

        </colgroup>


        <thead><tr>
          {colunasChamado.map(col => (<th key={col} className={classNames({ 'd-none': !(colunasTabela as any)[col].Show })}>{(colunasTabela as any)[col].Title}</th>))}
        </tr></thead>
        <tbody>
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
                </div>` }}/>
                <td className={classNames({ 'd-none': !colunasTabela.EmailCliente.Show })}>{chamado.EmailCliente}</td>
                <td className={classNames({ 'd-none': !colunasTabela.Modified.Show })}>{DateTime.fromISO(chamado.Modified).toFormat('dd/MMM/y T')}</td>
                <td className={classNames({ 'd-none': !colunasTabela.diasCorridosSemAtualizar.Show })}>{chamado.diasCorridosSemAtualizar}</td>
                <td className={classNames({ 'd-none': !colunasTabela.diasUteisSemAtualizar.Show })}>{chamado.diasUteisSemAtualizar}</td>
              </tr>
          ))}
        </tbody>
        <tfoot><tr>
          {colunasChamado.map(col => <th key={col} className={classNames({ 'd-none': !(colunasTabela as any)[col].Show })}>{(colunasTabela as any)[col].Title}</th>)}
        </tr></tfoot>
      </>
    )
  }


  return (
    <div className='d-flex justify-content-start'>
      <div className='w-10 me-2'>
      <MDBBtn outline={!showConfig} className='mb-2' color='light' onClick={toggleShow}><FontAwesomeIcon icon={faGears}/></MDBBtn>
      <MDBCollapse show={showConfig}>
        
        <Filtros
        colunasTabela={colunasTabela}
        setColunasTabela={setColunasTabela}
        />
      </MDBCollapse>
      </div>
      <div className='w-90'>
        <div className='bg-light'>
          <MDBTable color='dark' hover responsive>{tabela()}</MDBTable>
        </div>
      </div>
    </div>
  )
}
