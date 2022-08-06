import axios from "axios";
import moment from "moment";
import URIs from './uris.json'

function criarItem(site: string, list: string, bodyData: any) {

    const uri = URIs.UriPostFlow
    const uriSp = `_api/web/Lists/${list}/items`;
    
    const body = {
        Method: "GET", // ALTERAR
        Site: uriSp,
        URI: uriSp,
        Body: JSON.stringify(bodyData),
        Headers: {Accept: "application/json;odata=nometadata"}
    }
    // return axios.post(uri,body)
    console.log('Criando item...')
    console.log('URI: ' + site + '/' + uriSp + ' | Corpo: ')
    console.log(bodyData)
}

function editarItem(site: string, list: string, bodyData: any, id: number) {

    const uri = URIs.UriPostFlow
    const uriSp = `_api/web/Lists/${list}/items(${id})`;
    
    const body = {
        Method: "GET", // ALTERAR
        Site: uriSp,
        URI: uriSp,
        Body: JSON.stringify(bodyData),
        Headers: {Accept: "application/json;odata=nometadata"}
    }
    // return axios.post(uri,body)
    console.log('URI: ' + site + '/' + uriSp + ' | Corpo: ')
    console.log(bodyData)
}


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
function obterChamado(cliente: any, chamadoId: number) {

    const uri = URIs.UriPostFlow
    const uriSp = `${URIs.PClientes}/${cliente.InternalNameSubsite}`;
    const pathSp = `_api/web/Lists/${cliente.InternalNameSubsiteList}List/items(${chamadoId})`;
    
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

function obterFeriados() {

    const uri = URIs.UriPostFlow
    const uriSp = `${URIs.PHoras}`;
    const umAnoAtras = moment().subtract(365,'days').format('YYYY-MM-DD')
    const pathSp = `_api/web/Lists/FeriadosList/items?$select=Data&$filter=Data ge '${umAnoAtras}' and Data le '${moment().format('YYYY-MM-DD')}' and Data ne null&$top=5000&$orderBy=Data desc`;
    
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
    obterCamposLista,
    obterFeriados,
    criarItem,
    editarItem
}
