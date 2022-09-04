import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export type TAppTabs = 'tabFormChamado' | 'tabChamados' | 'tabDashboard' | 'tabClientes';

export interface IChamado {
  Attachments: boolean | undefined;
  AttachmentFiles: IAttachmentsSharepoint[] | any[];
  BugEmProducao: string;
  TipoSolicitacao: string;
  EmailCliente: string;
  ID: number;
  Id: number;
  Title: string;
  StatusDaQuestao: string | null;
  DescricaoDemanda?: string;
  Atribuida?: {
    Id: number;
    Title: string;
    EMail: string;
  };
  Comentarios?: string | null;
  Modified: string;
  Created: string;
  Cliente: {
    ID?: number;
    Id: number;
    Title: string;
    ClienteInternalName: string;
    InternalNameSubsite: string;
    InternalNameSubsiteList: string;
    logo?: IHyperlinkSharepoint;
  }
  diasCorridosSemAtualizar: number;
  diasUteisSemAtualizar: number;
}

interface IHyperlinkSharepoint {
  Description: string;
  Url: string;
}

interface IAttachmentsSharepoint {
  FileName: string;
  ServerRelativePath: {
    DecodeUrl: string
  }
}

export interface IChamadoSelecionado extends Partial<IChamado> { }

export interface ICliente {
  Id: number;
  ID?: number;
  Title: string;
  logo?: {
    Description: string;
    Url: string;
  };
  ClienteInternalName: string;
  InternalNameSubsite: string;
  InternalNameSubsiteList: string;
  Created: string;
}

export interface ILocalStorageFeriado {
  DataRequisicao?: string;
  Datas?: string[];
}

type IFeriados = string[];

export interface IAtualizacaoSecao {
  clientes: boolean;
  chamados: boolean;
  slcChamados: boolean;
  formChamados: boolean;

}

export interface IFiltrosChamados {
  vencido?: object[]
  emAberto?: object[]
  semAtribuido?: object[]
  criadosHoje?: object[]
  clientesComChamados?: object[]
  abertos30dias?: object[]
  pendentesValidacao?: object[]
  abertos15dias?: object[]
}
export interface ITileObject {
  Title: string;
  Subtitle?: string;
  Count: number;
  Total: any;
  Progress: boolean;
  Values: {}[];
  Icon?: IconDefinition
}

interface IColTabelaChamados {
  Attachments: { Title: string; Show: boolean }
  Id: { Title: string, Show: boolean }
  Cliente: { Title: string, Show: boolean }
  Title: { Title: string, Show: boolean }
  BugEmProducao: { Title: string, Show: boolean }
  StatusDaQuestao: { Title: string, Show: boolean }
  Atribuida: { Title: string, Show: boolean }
  TipoSolicitacao: { Title: string, Show: boolean }
  DescricaoDemanda: { Title: string, Show: boolean }
  EmailCliente: { Title: string, Show: boolean }
  Modified: { Title: string, Show: boolean }
  diasCorridosSemAtualizar: { Title: string, Show: boolean }
  diasUteisSemAtualizar: { Title: string, Show: boolean }
}

export interface ISiteUser {
  Id: number;
  LoginName: string;
  Title: string;
  Email?: string;
  UserPrincipalName: string;
}