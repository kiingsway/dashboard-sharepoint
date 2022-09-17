import React, { useEffect, useState } from 'react'
import { AiTwotonePieChart, AiOutlineBars } from 'react-icons/ai'
import { BsCardList } from 'react-icons/bs'
import { TbBuilding, TbRotate } from 'react-icons/tb'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'
import { MDBBadge } from 'mdb-react-ui-kit'
import { IChamado, ICliente } from '../../interfaces'

interface IMenuItem {
  path: string;
  name: string;
  icon: JSX.Element;
  count?: number;
}

interface Props {
  chamados: IChamado[];
  clientes: ICliente[];
  children: any;
}

export default function Sidebar(props: Props) {

  const [isExpanded, setExpand] = useState(true);

  const toggleExpand = () => setExpand(prev => !prev)

  const menuItems: IMenuItem[] = [
    { path: '/', name: 'Chamados', count: props.chamados.length, icon: <BsCardList /> },
    { path: '/dashboard', name: 'Dashboard', icon: <AiTwotonePieChart /> },
    { path: '/clientes', name: 'Clientes', count: props.clientes.length, icon: <TbBuilding /> },
  ]

  return (
    <div className="sidebar-container rounded-end">
      <div className="sidebar d-flex flex-column justify-content-between " style={{ width: isExpanded ? '250px' : '65px' }}>
        <div>

          <div className="top_section">
            <h1 className={`logo ${isExpanded ? '' : 'invisible'}`}>Dashboard 22</h1>
            <div className="bars p-2 rounded" onClick={toggleExpand}>
              <AiOutlineBars />
            </div>
          </div>
          {
            menuItems.map((item, index) => (
              <div className='px-2 py-1' key={index}>
                <NavLink to={item.path} className='link rounded d-flex align-items-center justify-content-between'>
                  <div className='d-flex flex-nowrap'>
                    <div className="icon me-3">{item.icon}</div>
                    <div className={`link_text ${isExpanded ? '' : 'invisible'}`}>{item.name}</div>
                  </div>
                  {
                    item.count && isExpanded ?
                      <MDBBadge className='ms-2 text-dark' color='light'>{item.count}</MDBBadge>
                      :
                      <></>
                  }
                </NavLink>
              </div>
            ))
          }
        </div>
        <div className='p-0'>

          <UpdateCountdown />

          {
            isExpanded ?
              <div className='p-2'>

                <button
                  title='Atualizar'
                  type='button'
                  className='btnAtualizar rounded px-4 py-2 mb-1 rounded d-flex flex-row align-items-center justify-content-between w-100'
                  onClick={() => console.log('foi')}
                  disabled
                >
                  <TbRotate />
                  <span>Atualizar</span>
                  <MDBBadge className='text-dark' color='light'>
                    <span className='small'>00:00</span>
                  </MDBBadge>
                </button>
              </div>
              :
              <div className='rounded d-flex flex-column align-items-center justify-content-between p-2'>
                <button
                  title='Atualizar'
                  type='button'
                  className='btnAtualizar rounded px-2 py-1 mb-1'
                  onClick={() => console.log('foi')}
                  disabled>
                  <TbRotate />
                  <MDBBadge className='text-dark' color='light'>
                    <span className='small'>00:00</span>
                  </MDBBadge>
                </button>
              </div>
          }
        </div>
      </div>
      <main>
        {props.children}
      </main>
    </div>
  )
}


const UpdateCountdown = () => {
  const tempoAtualizacao: number = 15 * 60 // Tempo (segundos) para atualização dos clientes e chamados.
  const tempoHabilitarAtualizar: number = 3 // Tempo (segundos) para remover o disabled do botão para evitar muitas requisições feitas pelo usuário.

  const [segundosAtualizacao, setSegundosAtualizacao] = useState<number>(tempoAtualizacao);
  useEffect(() => {

    // Caso tenha mais de 0 segundos da contagem de atualização, execute um timer para reduzir a contagem em 1.
    if (segundosAtualizacao > 0) {
      const timer = setInterval(() => setSegundosAtualizacao(segundosAtualizacao > 0 ? segundosAtualizacao - 1 : 0), 1000)
      return () => clearInterval(timer)

    } else { // Caso possuir <= 0 segundos para atualização, resete o timer e obtenha os clientes e chamados
      setSegundosAtualizacao(tempoAtualizacao)
      // props.handleGetClientesChamados()
    }

    /**
     * Força atualização dos clientes e chamados pelo setSegundosAtualizacao com o parâmetro 0.
     * Também inicializa ícones de atualização animados próximo ao texto das guias de clientes e chamados.
     * @returns void
     */

  }, [segundosAtualizacao]);

  const handleSetSegundosAtualizacao = () => setSegundosAtualizacao(0)

  return (
    <div className='p-2'>

      <button
        // className='d-flex justify-content-between rounded w-100 p-2 bg-dark text-light align-items-center'
        className='link'
        type='button'
        title='Atualizar...'
        onClick={handleSetSegundosAtualizacao}
      >
        <div>
          <TbRotate style={{ marginBottom: 3 }} className='mx-2' />
          Atualizar
        </div>

        <MDBBadge className='text-dark' color='light'>
          <span className='small'>
            {`${String(Math.floor(segundosAtualizacao / 60)).padStart(2, '0')}:${String(segundosAtualizacao % 60).padStart(2, '0')}`}
          </span>
        </MDBBadge>

      </button>
    </div>
  )
}