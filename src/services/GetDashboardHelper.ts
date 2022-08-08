import { ICliente } from "interfaces";
import { GetListItems } from 'services/SPRequest1'
import URIs from 'services/uris.json'
import { DateTime } from 'luxon'
declare module 'luxon';

export function obterFeriados() {

  const amanha = DateTime.now().setZone('utc').plus({days:1}).startOf('day').toISO();
  const umAnoAtras = DateTime.now().setZone('utc').minus({years:1, days:1}).endOf('day').toISO();

  const uri = URIs.PHoras;
  const list = 'Feriados';
  const select = 'Data';
  const filter = `Data gt '${umAnoAtras}' and Data lt '${amanha}'`;
  const orderBy = 'Data'
  const top = 5000;
  
  return GetListItems(uri,list,select,undefined,filter,top,orderBy)
}

export function obterClientes() {
  
  const uri = URIs.PClientes;
  const list = URIs.ListaClientes.InternalName;
  const select = 'Id,Title,ClienteInternalName,InternalNameSubsite,InternalNameSubsiteList,logo';
  const filter = `Ativo eq 1 and PossuiSuporte eq 1`;
  const orderBy = 'Title'
  const top = 5000;

  return GetListItems(uri,list,select,undefined,filter,top,orderBy)
}

export function obterChamados(cliente: ICliente) {

  const uri = URIs.PClientes;
  const list = cliente.InternalNameSubsiteList
  const select = `Id,Title,Atribuida/Id,Atribuida/Title,Atribuida/EMail,DescricaoDemanda,StatusDaQuestao,Modified,Comentarios,Created`;
  const expand = 'Atribuida';
  const filter = `StatusDaQuestao ne 'Resolvida' and StatusDaQuestao ne 'Fechada' and StatusDaQuestao ne 'Fechado' and StatusDaQuestao ne 'Resolvida - Aguardando aprova\u00e7\u00e3o da KPMG' and StatusDaQuestao ne 'Fechada – Sem nenhuma atuação' and StatusDaQuestao ne 'Concluída - Após validação do cliente'`;
  const orderBy = 'Title'
  const top = 5000;

  return GetListItems(uri,list,select,expand,filter,top,orderBy)
}

export function obterCampos(cliente: ICliente) {

  return []
}

export function criarChamado(cliente: ICliente) {

}

export function obterChamado(cliente: ICliente, chamadoId: number) {

  return {}
}

export function atualizarChamado(cliente: ICliente, chamadoId: number) {
  
}
