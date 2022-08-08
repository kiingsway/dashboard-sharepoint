
export interface IListItems extends IListItemContext {
    top?: number;
    filter?: string;
    orderBy?: string;
}

export interface IListItem extends IListItemContext {
    id: number;
}

interface IListItemContext {
    site: string;
    list: string;
    select?: string;
    expand?: string;
    headers?: object;
}