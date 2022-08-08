import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export type TAppTabs = 'tabFormChamado' | 'tabChamados' | 'tabDashboard' | 'tabClientes';

export interface IChamado {
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
    ID: number;
    Id: number;
    Title: string;
    ClienteInternalName: string;
    InternalNameSubsite: string;
    InternalNameSubsiteList: string;
    logo?: HyperlinkSharepoint;
  }
  diasCorridosSemAtualizar: number;
  diasUteisSemAtualizar: number;
}

export interface IChamadoSelecionado extends Partial<IChamado> {}

export interface ICliente {
  Id: number;
  ID: number;
  Title: string;
  logo?: {
    Description: string;
    Url: string;
  };
  ClienteInternalName: string;
  InternalNameSubsite: string;
  InternalNameSubsiteList: string;
}

export interface IFeriado {
  DataRequisicao?: string;
  Datas?: string[];
}

export interface IAtualizacaoSecao {
  clientes: boolean;
  chamados: boolean;
  campos: boolean;
}

interface HyperlinkSharepoint {
  Description: string;
  Url: string;
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
  Values: object[];
  Icon?: IconDefinition
}