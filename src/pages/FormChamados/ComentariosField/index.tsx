import React, { useEffect, useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import { FloatingLabel, Form } from 'react-bootstrap';
import { DateTime } from 'luxon'
import { obterUsuarioAtual } from 'services/GetDashboardHelper';
import { ISiteUser } from 'interfaces';

type TComentarioTabs = 'tabAdd' | 'tabEdit'

interface Props {
  campo: any;
  chamadoSelecionado: any;
}

export default function ComentariosField(props: Props) {

  const [verticalActive, setVerticalActive] = useState<TComentarioTabs>('tabAdd');
  const [currentUser, setCurrentUser] = useState<Partial<ISiteUser>>({});
  const [alturaComentarios, setAlturaComentarios] = useState<number>(70)

  function handleComentariosAltura(e: any) {
    // setAlturaComentarios(prevAltura => e.target.scrollHeight >= 70 ? e.target.scrollHeight : prevAltura)
    setAlturaComentarios(e.target.scrollHeight)

  }

  useEffect(() => {
    // if (props.chamadoSelecionado?.Comentarios?.length >= 100) {

    //   setAlturaComentarios(200)

    // }

  }, [props.chamadoSelecionado])

  useEffect(() => {
    obterUsuarioAtual()
      .then((siteUser: ISiteUser) => setCurrentUser(siteUser))
  }, [])

  const handleVerticalClick = (value: TComentarioTabs) => {
    if (value === verticalActive) return
    setVerticalActive(value);
  };

  return (
    <>
      <MDBTabs className='text-center border-0'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleVerticalClick('tabAdd')} active={verticalActive === 'tabAdd'}>
            Adicionar
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleVerticalClick('tabEdit')} active={verticalActive === 'tabEdit'}>
            Editar tudo
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>
      <MDBTabsContent>
        <MDBTabsPane show={verticalActive === 'tabAdd'}>


          <FloatingLabel
            controlId={`txa${props.campo.EntityPropertyName}`}
            label={`Adicionar comentário: [${currentUser.Title} - ${DateTime.now().toFormat('dd/LL/y HH:mm')}]`}
          >
            <Form.Control
              as="textarea"
              name={props.campo.EntityPropertyName}
              style={{ height: alturaComentarios, minHeight: 70, maxHeight: 700 }}
              onMouseUp={handleComentariosAltura}

              onChange={() => { }}
            />

          </FloatingLabel>
        </MDBTabsPane>
        <MDBTabsPane show={verticalActive === 'tabEdit'}>


          <FloatingLabel
            controlId={`txa${props.campo.EntityPropertyName}`}
            label={props.campo.Title}
          >
            <Form.Control
              as="textarea"
              name={props.campo.EntityPropertyName}
              value={props.chamadoSelecionado[props.campo.EntityPropertyName]}
              style={{ height: alturaComentarios, minHeight: 70, maxHeight: 700 }}
              onMouseUp={handleComentariosAltura}

              onChange={() => { }}
            />
          </FloatingLabel>

        </MDBTabsPane>
      </MDBTabsContent>
    </>
  )
}
