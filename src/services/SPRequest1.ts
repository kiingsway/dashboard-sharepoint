import URIs from 'services/uris.json'
import axios from "axios";

export function GetListItems(site: string, list: string, select?: string | null, expand?: string, filter?: string | null, top?: string | number | null, orderBy?: string | null, headers?: object) {

    const body = {
        Method: "GET",
        Site: site,
        URI: `_api/web/lists/${list}List/items?$select=${select && ''}&$expand=${expand || ''}&$filter=${filter && ''}&$top=${top ? top : 100}&$orderBy=${orderBy && ''}`,
        Headers: headers ? headers : {Accept: "application/json;odata=nometadata"}
    }

    const request = axios.post(URIs.UriPostFlow,body)

    return request
}