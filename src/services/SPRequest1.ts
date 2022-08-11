import URIs from 'services/uris.json'
import axios from "axios";
import { IListItems, IListItem } from 'services/interfaces'

export function GetListItems(rest: IListItems) {

    const body = {
        Method: "GET",
        Site: rest.site,
        URI: `_api/web/lists/${rest.list}List/items` +
            `?$select=${rest.select || ''}` +
            `&$expand=${rest.expand || ''}` +
            `&$filter=${rest.filter || ''}` +
            `&$top=${rest.top || 100}` +
            `&$orderBy=${rest.orderBy || ''}`,
        Headers: rest.headers ? rest.headers : { Accept: "application/json;odata=nometadata" }
    }

    const request = axios.post(URIs.UriPostFlow, body)

    return request
}
export function GetListItem(rest: IListItem) {

    const body = {
        Method: "GET",
        Site: rest.site,
        URI: `_api/web/lists/${rest.list}List/items(${rest.id})` +
            `?$select=${rest.select || ''}` +
            `&$expand=${rest.expand || ''}`,
        Headers: rest.headers ? rest.headers : { Accept: "application/json;odata=nometadata" }
    }

    const request = axios.post(URIs.UriPostFlow, body)

    return request
}