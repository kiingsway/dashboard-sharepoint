import { IChamado, IChamadoSelecionado, ICliente } from "interfaces";
import { GetCurrentUser, GetListFields, GetListItem, GetListItems, GetWebUsers, GetWebUsersGroupId, PatchListItem, UploadItemAttachments } from 'services/SPRequest1'
import URIs from 'services/uris.json'
import { DateTime } from 'luxon'

interface IRest {
  site: string;
  list?: string;
  id?: number | string | null;
  select?: string;
  filter?: string;
  expand?: string;
  orderBy?: string;
  top?: number;
  body?: object;
}

export function obterFeriados() {

  const amanha = DateTime.now().setZone('utc').plus({ days: 1 }).startOf('day').toISO();
  const umAnoAtras = DateTime.now().setZone('utc').minus({ years: 1, days: 1 }).endOf('day').toISO();

  const rest: IRest = {
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

  const rest: IRest = {
    site: URIs.PClientes,
    list: URIs.ListaClientes.InternalName,
    select: 'Id,Title,ClienteInternalName,InternalNameSubsite,InternalNameSubsiteList,logo',
    filter: `Ativo eq 1 and PossuiSuporte eq 1`,
    orderBy: 'Title',
    top: 5000,
  }

  return GetListItems(rest)
}

export async function obterTodosChamados(cliente: ICliente, top?: number) {

  const rest: IRest = {
    site: URIs.PClientes + '/' + cliente.InternalNameSubsite,
    list: cliente.InternalNameSubsiteList,
    select: `Id,Title,Atribuida/Id,Atribuida/Title,Atribuida/EMail,DescricaoDemanda,StatusDaQuestao,Modified,Comentarios,Created,Attachments,BugEmProducao,EmailCliente,TipoSolicitacao,Urg_x00ea_ncia,DataPendenteValidacao,AttachmentFiles/FileName,AttachmentFiles/ServerRelativePath`,
    expand: 'Atribuida,AttachmentFiles',
    orderBy: 'Id desc',
    top: top ? top : 5000
  }

  return (await GetListItems(rest)).data.value.map((chamado: IChamado) => (
    { ...chamado, Cliente: cliente }
  ))

}

export async function obterChamados(cliente: ICliente) {

  const rest: IRest = {
    site: URIs.PClientes + '/' + cliente.InternalNameSubsite,
    list: cliente.InternalNameSubsiteList,
    select: `Id,Title,Atribuida/Id,Atribuida/Title,Atribuida/EMail,DescricaoDemanda,StatusDaQuestao,Modified,Comentarios,Created,Attachments,BugEmProducao,EmailCliente,TipoSolicitacao,Urg_x00ea_ncia,DataPendenteValidacao,AttachmentFiles/FileName,AttachmentFiles/ServerRelativePath`,
    expand: 'Atribuida,AttachmentFiles',
    filter: `StatusDaQuestao ne 'Resolvida' and
    StatusDaQuestao ne 'Fechada' and
    StatusDaQuestao ne 'Fechado' and
    StatusDaQuestao ne 'Resolvida - Aguardando aprova\u00e7\u00e3o da KPMG' and
    StatusDaQuestao ne 'Fechada – Sem nenhuma atuação' and
    StatusDaQuestao ne 'Concluída - Após validação do cliente'`,
    orderBy: 'Id desc',
    top: 5000
  }

  return (await GetListItems(rest)).data.value.map((chamado: IChamado) => (
    { ...chamado, Cliente: cliente }
  ))
}

export async function obterColunas(cliente: ICliente) {

  const rest: IRest = {
    site: URIs.PClientes + '/' + cliente.InternalNameSubsite,
    list: cliente.InternalNameSubsiteList,
    filter: `Hidden eq false and ReadOnlyField eq false`,
    top: 5000
  }

  return (await GetListFields(rest)).data.value;
}

export function criarChamado(cliente: ICliente, body: IChamadoSelecionado) {

}

export function obterChamado(cliente: ICliente, chamadoId: number) {

  const rest: IRest = {
    site: URIs.PClientes + '/' + cliente.InternalNameSubsite,
    list: cliente.InternalNameSubsiteList,
    id: chamadoId,
    select: '*',
    top: 5000,
  }

  return GetListItem(rest)
}



export function atualizarChamado(chamadoSelecionado: IChamadoSelecionado, body: IChamadoSelecionado) {

  const rest: IRest = {
    site: URIs.PClientes + '/' + chamadoSelecionado?.Cliente?.InternalNameSubsite,
    list: chamadoSelecionado?.Cliente?.InternalNameSubsiteList,
    id: chamadoSelecionado?.Id,
    body: { ...body, IDChamado: chamadoSelecionado?.Id }
  }
  
  return PatchListItem(rest)
}

export async function obterUsuarios(cliente: ICliente, groupId?: number | null) {

  const rest: IRest = {
    site: URIs.PClientes + '/' + cliente.InternalNameSubsite,
    id: groupId,
    select: '*',
    top: 5000,
    filter: `substringof('${URIs.Dominio}', Email)`
  }

  return groupId ? await GetWebUsersGroupId(rest) : await GetWebUsers(rest)
}

export async function obterUsuarioAtual(cliente: ICliente) {

  const rest: IRest = {
    site: URIs.PClientes + '/' + cliente.InternalNameSubsite,
    select: 'Id,Title,Email,UserPrincipalName'
  }

  return (await GetCurrentUser(rest)).data
}