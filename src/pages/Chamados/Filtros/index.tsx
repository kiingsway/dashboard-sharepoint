
import { MDBAccordion, MDBAccordionItem, MDBCheckbox } from 'mdb-react-ui-kit';
import React from 'react'

interface Props {
  setColunasTabela: any
  colunasTabela: any

}

export default function Filtros(props: Props) {

  function handleToggleColumn(column: any) {
    props.setColunasTabela((prevColumns: any) => ({...prevColumns, [column]: {...prevColumns[column], Show: !prevColumns[column]['Show']}}))
  }

  let columns = [];
  for (let column in props.colunasTabela) columns.push(column);  

  return (
    <>
      <MDBAccordion className='me-2'>
        <MDBAccordionItem collapseId={1} headerTitle='Mostrar/Esconder colunas'>
          {columns.map(column => (
            <MDBCheckbox
              key={column}
              name={column}
              id={`chb${column}`}
              onChange={() => handleToggleColumn(column)}
              label={props.colunasTabela[column]['Title']}
              checked={props.colunasTabela[column]['Show']}
              disabled={column.toLowerCase() === 'id'}
              />
          ))}
        </MDBAccordionItem>
        <MDBAccordionItem collapseId={2} className='d-none' headerTitle='Classificação...'>
          <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse
          plugin adds the appropriate classes that we use to style each element. These classes control the overall
          appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with
          custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go
          within the <code>.accordion-body</code>, though the transition does limit overflow.
        </MDBAccordionItem>
        <MDBAccordionItem collapseId={3}  className='d-none' headerTitle='Filtros...'>
          <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse
          plugin adds the appropriate classes that we use to style each element. These classes control the overall
          appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with
          custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go
          within the <code>.accordion-body</code>, though the transition does limit overflow.
        </MDBAccordionItem>
      </MDBAccordion>
    </>
  );
}