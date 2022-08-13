
import { MDBAccordion, MDBAccordionItem, MDBCheckbox } from 'mdb-react-ui-kit';

interface Props {
  setColunasTabela: any
  colunasTabela: any

}

/** Define quais colunas (nome interno) estarão desabilitadas para remover da tabela de chamados.
 * Insira-as em minúsculo para comparação em toLowerCase().*/
const colunasPerpetuas: string[] = ['id'];

export default function Filtros(props: Props) {

  function handleToggleColumn(column: any) {
    props.setColunasTabela((prevColumns: any) => ({...prevColumns, [column]: {...prevColumns[column], Show: !prevColumns[column]['Show']}}))
  }

  function handleToggleAllColumns(e:any) {

    for (let col in props.colunasTabela) {

      if (colunasPerpetuas.includes(col.toLowerCase())) continue;
      
      props.setColunasTabela((prevCols: any) => ({
          ...prevCols,
          [col]: {
            ...prevCols[col],
            Show: e.target.checked
          }
      }))
    }
  }

  let columns = [];
  for (let column in props.colunasTabela) columns.push(column);  

  return (
    <>
      <MDBAccordion>
        <MDBAccordionItem collapseId={1} headerTitle='Mostrar/Esconder colunas'>
          <MDBCheckbox
            name='toggleAllColumns'
            id='chbToggleAllColumns'
            onChange={handleToggleAllColumns}
            label='Mostrar/Esconder todas'
          />
          <hr />
          {columns.map(column => (
            <MDBCheckbox
              key={column}
              name={column}
              id={`chb${column}`}
              onChange={() => handleToggleColumn(column)}
              label={props.colunasTabela[column]['Title']}
              checked={props.colunasTabela[column]['Show']}
              disabled={colunasPerpetuas.includes(column.toLowerCase())}
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