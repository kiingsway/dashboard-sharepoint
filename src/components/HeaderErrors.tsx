import { faBug, faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBNavbar, MDBBtn, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBTextArea, MDBInput } from 'mdb-react-ui-kit'
import React, { useState } from 'react'

interface Props {
  erros?: any
  setErros: any
}

interface iErroSelecionado {
  metodo?: string
  uri?: string
  body?: any
  headers?: any
  response?: any
  message?: string
}

export default function HeaderErrors(props: Props) {
  const [modalErros, setModalErros] = useState(false);
  const [erroSelecionado, setErroSelecionado] = useState<iErroSelecionado>()

  const toggleModalErro = () => setModalErros(!modalErros);

  function handleErroSelecionado(modalId:any) {

    const erroObject = props.erros.filter((erro:any) => erro.id === modalId)[0];

    const erroData = {
      metodo: erroObject?.config?.method?.toUpperCase(),
      uri: erroObject?.config?.url,
      body: JSON.stringify(erroObject?.config?.data, null, 2),
      headers: JSON.stringify(erroObject?.config?.headers, null, 2),
      response: JSON.stringify(erroObject?.response?.data, null, 2),
      message: erroObject?.message
    }

    setErroSelecionado(erroData);
    toggleModalErro();

  }

  function handleFecharErro(modalId: any) {


    const erroObject = props.erros.filter((erro:any) => erro.id === modalId)[0];
    
    // console.log(props.erros)
    props.setErros((prevErros:any) => [...prevErros.filter((prevErro:any) => prevErro !== erroObject)])

  }


  // console.log(props.erros)
  return <>
    {props?.erros.length === 0 ? null : props?.erros?.map((erro: any) => (
      <MDBNavbar key={erro.id} expand='lg' light className='px-4 my-1 shadow border rounded border-light d-flex justify-content-between text-light' bgColor='danger'>
        <div>

          <MDBBtn onClick={() => handleErroSelecionado(erro.id)} outline className='me-2' color='light'>
            <FontAwesomeIcon icon={faBug} />
          </MDBBtn>

          <span style={{fontFamily:'Consolas, monaco, monospace', wordBreak: 'break-all'}}>{erro?.message}: {erro?.request?.responseText}</span>

        </div>
        <div>
          <MDBBtn outline className='border-0' color='light' onClick={() => handleFecharErro(erro.id)}>
            <FontAwesomeIcon icon={faClose} />
          </MDBBtn>
        </div>
      </MDBNavbar>
    ))}

    <MDBModal show={modalErros} setShow={setModalErros} tabIndex='-1' >
      <MDBModalDialog size='xl'>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{erroSelecionado?.message}</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={toggleModalErro} title='Fechar janela'></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
                      
          <MDBInput readOnly label='Method' id='txtErrorMethod' type='text' className='mb-4' value={erroSelecionado?.metodo}/>
          <MDBInput readOnly label='URI' id='txtErrorURI' type='text' className='mb-4' value={erroSelecionado?.uri}/>
          <MDBTextArea readOnly label='Body' id='txtErrorBody' rows={4} className='mb-4' value={erroSelecionado?.body} />
          <MDBTextArea readOnly label='Headers' id='txtErrorHeaders' rows={4} className='mb-4' value={erroSelecionado?.headers} />
          <MDBTextArea readOnly label='Response' id='txtErrorResponse' rows={4} className='mb-4' value={erroSelecionado?.response} />

          </MDBModalBody>

          <MDBModalFooter>
            <MDBBtn color='secondary' onClick={toggleModalErro}>Fechar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  </>
}