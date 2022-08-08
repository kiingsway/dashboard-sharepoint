import { MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
import { Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Props {
  dados: any
  bar1: any
  bar2?: any
}

export default function Grafico(props: Props) {

  const [dados, setDados] = useState(props.dados)

  useEffect(() => {

    setDados(props.dados)

  }, [props.dados])

  function tooltipContent(e?: any) {

    
    const dado = dados.filter((dado:any) => dado.name === e.label)[0];
    if (!dado) return

    const titleCard = dado.fullName || dado.name || '-'

    const valueBar1 = dado[props.bar1.id] || '';
    const valueBar2 = props?.bar2 ? dado[props.bar2?.id] : 0;
  
    return (
      
      <MDBCard className='shadow'>
        <MDBCardBody>
          <p>{titleCard} (total: {valueBar1 + valueBar2})</p>
          <h6>Chamados:</h6>
          <p className='my-0'>{dado[props.bar1.id] ? dado[props.bar1.id] : 0} {props.bar1.title.toLowerCase()}</p>
          {
            props?.bar2 ?
            <p className='my-0'>{dado[props?.bar2.id] ? dado[props?.bar2.id] : 0} {props.bar2.title.toLowerCase()}</p>
            :
            <></>
          }
        </MDBCardBody>
      </MDBCard>
    )
  }


  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={dados}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" minTickGap={10} />
        <YAxis />
        <Tooltip content={tooltipContent} />
        <Legend />
        <Bar dataKey={props.bar1.id} name={props.bar1.title} stackId="a" fill="#00B74A" />
        {
          props?.bar2 ? 
          <Bar dataKey={props.bar2.id} name={props.bar2.title} stackId="a" fill="#F93154" />
          :
          <></>
        }
      </BarChart>
    </ResponsiveContainer>
  );
}
