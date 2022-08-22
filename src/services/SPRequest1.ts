import URIs from 'services/uris.json'
import axios from "axios";

export function GetListItems(rest: any) {

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
export function GetListItem(rest: any) {

    const body = {
        Method: "GET",
        Site: rest.site,
        URI: `_api/web/lists/${rest.list}List/items(${rest.id})` +
            `?$select=${rest.select || ''}` +
            `&$expand=${rest.expand || ''}`,
        Headers: rest.headers ? rest.headers : { Accept: "application/json;odata=nometadata" }
    }

    return axios.post(URIs.UriPostFlow, body)
}

export function UploadItemAttachments(rest?: any, id?: any, attachments?: any) {

    const bodyProd = {
        Method: 'PATCH',
        Site: rest.site,
        URI: `_api/web/lists/${rest.list}List/items(${rest.id})`,
        Headers: { 'IF-MATCH': '*' },
        Body: rest.body
    }

    const att = {
        '$content': attachments.content.split(',')[1],
        '$content-type': 'application/octet-stream'
    }

    const body = {
        Method: 'POST',
        Site: URIs.SiteTest,
        URI: `_api/web/lists/${URIs.ListTest}/items(${id})/AttachmentFiles/add(FileName='${attachments.name}')`,
        Headers: {
            Accept: 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose'
        },
        Body: att
    }

    const request = axios.post(URIs.UriPostFlow, body)

    return request

}

interface IPatchListItem {
    site: string;
    list: string
    id: string | number | null;
    body: object;
    select: string;
    expand: string;
}
export function PatchListItem(rest: Partial<IPatchListItem>) {

    const body = {
        Method: 'PATCH',
        Site: rest.site,
        URI: `_api/web/lists/${rest.list}List/items(${rest.id})` +
        `?$select=${rest.select || ''}` +
        `&$expand=${rest.expand || ''}`,
        Headers: { 'IF-MATCH': '*', 'Content-Type': 'application/json;odata=nometadata' },
        Body: rest.body
    }

    return axios.post(URIs.UriPostFlow, body)
}

interface IPostListItem {
    site: string;
    list: string
    id: string | number | null;
    body: object;
    select?: string
    expand?: string
}
export function PostListItem(rest: Partial<IPostListItem>) {

    const body = {
        Method: 'POST',
        Site: rest.site,
        URI: `_api/web/lists/${rest.list}List/items` +
        `?$select=${rest.select || ''}` +
        `&$expand=${rest.expand || ''}`,
        Headers: { 'Accept': 'application/json;odata=nometadata' },
        Body: rest.body
    }

    return axios.post(URIs.UriPostFlow, body)
}

export function GetListFields(rest: any) {

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

export function GetWebUsers(rest: any) {

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

interface IWebUsersGroupId {
    site: string;
    id?: string | number | null;
    select?: string;
    expand?: string;
    headers?: object;
}
export function GetWebUsersGroupId(rest: IWebUsersGroupId) {

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

interface ICurrentUserRest { site: string, select?: string; }
export function GetCurrentUser(rest: ICurrentUserRest) {

    const body = {
        Method: "GET",
        Site: rest.site,
        URI: `_api/web/CurrentUser` +
            `?$select=${rest.select || ''}`,
        Headers: { Accept: "application/json;odata=nometadata" }
    }

    return axios.post(URIs.UriPostFlow, body)
}