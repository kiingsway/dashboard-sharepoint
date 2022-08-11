import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IAtualizacaoSecao } from 'interfaces'
import { MDBBtn, MDBBadge } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'

const tempoAtualizacao: number = 15 * 60 // Tempo (segundos) para atualização dos clientes e chamados.
const tempoHabilitarAtualizar: number = 15 // Tempo (segundos) para remover o disabled do botão para evitar muitas requisições feitas pelo usuário.

interface Props {
  atualizacaoSecao: IAtualizacaoSecao;
  handleGetClientesChamados: () => void;
}

export default function HeaderAtualizacao(props: Props) {
  const [segundosAtualizacao, setSegundosAtualizacao] = useState<number>(tempoAtualizacao);
  useEffect(() => {

    // Caso tenha mais de 0 segundos da contagem de atualização, execute um timer para reduzir a contagem em 1.
    if (segundosAtualizacao > 0) {
      const timer = setInterval(() => setSegundosAtualizacao(segundosAtualizacao > 0 ? segundosAtualizacao - 1 : 0), 1000)
      return () => clearInterval(timer)

    } else { // Caso possuir <= 0 segundos para atualização, resete o timer e obtenha os clientes e chamados
      setSegundosAtualizacao(tempoAtualizacao)
      props.handleGetClientesChamados()
    }

  }, [segundosAtualizacao]);

  /**
   * Força atualização dos clientes e chamados pelo setSegundosAtualizacao com o parâmetro 0.
   * Também inicializa ícones de atualização animados próximo ao texto das guias de clientes e chamados.
   * @returns void
   */
  function handleSetSegundosAtualizacao() { setSegundosAtualizacao(0); }


  return (
    <MDBBtn
      type='button'
      color='light'
      className='mx-1 border-0'
      outline
      onClick={handleSetSegundosAtualizacao}
      disabled={
        props.atualizacaoSecao.clientes || props.atualizacaoSecao.chamados ? true :
          segundosAtualizacao > tempoAtualizacao - tempoHabilitarAtualizar
      }
    >

      <FontAwesomeIcon
        icon={faArrowRotateRight}
        spin={props.atualizacaoSecao.clientes || props.atualizacaoSecao.chamados}
        className='me-2' />

      {props.atualizacaoSecao.clientes || props.atualizacaoSecao.chamados ? 'Atualizando...' : 'Atualizar'}


      <MDBBadge
        color='dark'
        className='ms-2'
        >

        {`${String(Math.floor(segundosAtualizacao / 60)).padStart(2, '0')}:${String(segundosAtualizacao % 60).padStart(2, '0')}`}

      </MDBBadge>
    </MDBBtn>
  )
}
