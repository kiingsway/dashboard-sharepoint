export interface IChamado {
  ID: number;
  Id: number;
  Title: string;
  StatusDaQuestao: string | null;
  DescricaoDemanda: string;
  Atribuida?: {
    Id: number;
    Title: string;
    EMail: string;
  };
  Comentarios: string | null;
  Modified: string;
  Created: string;
  Cliente: string;
  ClienteId: number;
  ClienteInternalName: string;
  InternalNameSubsite: string;
  InternalNameSubsiteList: string;
  diasCorridosSemAtualizar: number;
  diasUteisSemAtualizar: number;
}

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

export interface IChamadoSelecionado {
  Id: number
  Cliente?: string
}

export type TAppTabs = 'tabFormChamado' | 'tabChamados' | 'tabDashboard' | 'tabClientes';