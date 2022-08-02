import axios from "axios";
import URIs from './uris.json'

function obterClientes() {

    const uri = URIs.UriPostFlow
    const uriSp = `${URIs.PClientes}`;
    const pathSp = `_api/web/Lists/${URIs.ListaClientes.InternalName}/items${URIs.ListaClientes.Query}`;
    
    const body = {
        Method: "GET",
        Site: uriSp,
        URI: pathSp,
        Headers: {Accept: "application/json;odata=nometadata"}
    }
    return axios.post(uri,body)
}
function obterChamados(cliente: any) {

    const uri = URIs.UriPostFlow
    const uriSp = `${URIs.PClientes}/${cliente.InternalNameSubsite}`;
    const pathSp = `_api/web/Lists/${cliente.InternalNameSubsiteList}List/items${URIs.Chamados.Query}`;
    
    const body = {
        Method: "GET",
        Site: uriSp,
        URI: pathSp,
        Headers: {Accept: "application/json;odata=nometadata"}
    }
    return axios.post(uri,body)
}

function obterCamposLista(uriSite: any, list: any) {

    const uri = URIs.UriPostFlow

    const uriSp = uriSite;
    const pathSp = `_api/web/Lists/${list}List/Fields?$filter=Hidden eq false and ReadOnlyField eq false&$top=5000`;
    
    const body = {
        Method: "GET",
        Site: uriSp,
        URI: pathSp,
        Headers: {Accept: "application/json;odata=nometadata"}
    }

    return axios.post(uri,body)

}

export {
    obterClientes,
    obterChamados,
    obterCamposLista

}
