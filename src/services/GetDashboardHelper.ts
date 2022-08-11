import { IChamado, ICliente } from "interfaces";
import { GetListItem, GetListItems } from 'services/SPRequest1'
import URIs from 'services/uris.json'
import { DateTime } from 'luxon'
declare module 'luxon';

export function obterFeriados() {

  const amanha = DateTime.now().setZone('utc').plus({ days: 1 }).startOf('day').toISO();
  const umAnoAtras = DateTime.now().setZone('utc').minus({ years: 1, days: 1 }).endOf('day').toISO();

  const rest = {
    site: URIs.PHoras,
    list: 'Feriados',
    select: 'Data',
    filter: `Data gt '${umAnoAtras}' and Data lt '${amanha}'`,
    orderBy: 'Data',
    top: 5000,
  }

  return GetListItems(rest)
}

export function obterClientes() {

  const rest = {
    site: URIs.PClientes,
    list: URIs.ListaClientes.InternalName,
    select: 'Id,Title,ClienteInternalName,InternalNameSubsite,InternalNameSubsiteList,logo',
    filter: `Ativo eq 1 and PossuiSuporte eq 1`,
    orderBy: 'Title',
    top: 5000,
  }

  return GetListItems(rest)
}

export async function obterChamados(cliente: ICliente) {

  const rest = {
    site: URIs.PClientes + '/' + cliente.InternalNameSubsite,
    list: cliente.InternalNameSubsiteList,
    select: `Id,Title,Atribuida/Id,Atribuida/Title,Atribuida/EMail,DescricaoDemanda,StatusDaQuestao,Modified,Comentarios,Created,Attachments,BugEmProducao,EmailCliente,TipoSolicitacao,Urg_x00ea_ncia`,
    expand: 'Atribuida',
    filter: `StatusDaQuestao ne 'Resolvida' and
    StatusDaQuestao ne 'Fechada' and
    StatusDaQuestao ne 'Fechado' and
    StatusDaQuestao ne 'Resolvida - Aguardando aprova\u00e7\u00e3o da KPMG' and
    StatusDaQuestao ne 'Fechada – Sem nenhuma atuação' and
    StatusDaQuestao ne 'Concluída - Após validação do cliente'`,
    orderBy: 'Title',
    top: 5000
  }

  return (await GetListItems(rest)).data.value.map((chamado:IChamado) => (
    { ...chamado, Cliente: cliente }
  ))
}

export function obterCampos(cliente: ICliente) {

  return []
}

export function criarChamado(cliente: ICliente) {

}

export function obterChamado(cliente: ICliente, chamadoId: number) {

  const rest = {
    site: URIs.PClientes + '/' + cliente.InternalNameSubsite,
    list: cliente.InternalNameSubsiteList,
    id: chamadoId,
    select: '*',
    top: 5000,
  }
  
  return GetListItem(rest)
}

export function atualizarChamado(cliente: ICliente, chamadoId: number) {

}