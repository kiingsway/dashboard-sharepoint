
export interface IListItems extends IListItemContext {
    top?: number;
    filter?: string;
    orderBy?: string;
}

export interface IListItem extends IListItemContext {
    id: number;
}

interface IListItemContext extends ISharepointSite {
    list: string;
    select?: string;
    expand?: string;
}

interface ISharepointSite {
    site: string;
    headers?: object;
}

export interface IListFields extends IListItems {}