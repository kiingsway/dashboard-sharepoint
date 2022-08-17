import URIs from 'services/uris.json'
import axios from "axios";
import { IListItems, IListItem, IListFields } from 'services/interfaces'

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

export function GetListFields(rest: IListFields) {

    const body = {
        Method: "GET",
        Site: rest.site,
        URI: `_api/web/lists/${rest.list}List/Fields` +
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

export function GetWebUsers(rest:any) {

    const body = {
        Method: "GET",
        Site: rest.site,
        URI: `_api/web/siteUsers` +
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
export function GetWebUsersGroupId(rest:any) {

    const body = {
        Method: "GET",
        Site: rest.site,
        URI: `_api/web/SiteGroups/GetById(${rest.id})/` +
            `?$select=${rest.select || ''}` +
            `&$expand=${rest.expand || ''}`,
        Headers: rest.headers ? rest.headers : { Accept: "application/json;odata=nometadata" }
    }

    const request = axios.post(URIs.UriPostFlow, body)

    return request

}