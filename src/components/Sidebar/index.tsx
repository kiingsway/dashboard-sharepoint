import React, { useEffect, useState } from 'react'
import { AiTwotonePieChart, AiOutlineBars } from 'react-icons/ai'
import { BsCardList } from 'react-icons/bs'
import { TbBuilding, TbRotate } from 'react-icons/tb'
import { NavLink } from 'react-router-dom'
import { MDBBadge } from 'mdb-react-ui-kit'
import { IChamado, ICliente } from '../../interfaces'
import styles from './Sidebar.module.scss'
import classNames from 'classnames'

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
    <div className={styles.app}>
      <div
        className={classNames(
          styles.sidebar,
          'd-flex flex-column justify-content-between',
          { [styles.sidebar_collapsed]: !isExpanded },
          { [styles.sidebar_expanded]: isExpanded }
        )}>
        <div>

          <div className={styles.sidebar_top}>
            <h1 className={classNames(styles.sidebar_logo, { invisible: !isExpanded })}>Dashboard 22</h1>
            <div className={`${styles.btn_expand} ${styles.btn_slowTransition} p-2 rounded`} onClick={toggleExpand}>
              <AiOutlineBars />
            </div>
          </div>
          {
            menuItems.map((item, index) => (
              <div className='px-2 py-1' key={index}>
                <NavLink
                  to={item.path}
                  className={classNames(styles.btn_nav, styles.btn_fastTransition, 'rounded')}>
                  <div className={styles.btn_nav_text}>
                    <span className='me-3'>
                      {item.icon}
                    </span>
                    <span className={classNames({ invisible: !isExpanded })}>
                      {item.name}
                    </span>
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
        <UpdateCountdown isExpanded={isExpanded} />
      </div>
      <main className={styles.main}>
        {props.children}
      </main>
    </div >
  )
}


const UpdateCountdown = (pr: { isExpanded: boolean }) => {
  const tempoAtualizacao: number = 15 * 60 // Tempo (segundos) para atualização dos clientes e chamados.
  const tempoHabilitarAtualizar: number = 15 // Tempo (segundos) para remover o disabled do botão para evitar muitas requisições feitas pelo usuário.

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
    <div className='px-2 pb-2'>

      <button
        className={classNames(
          styles.btn_reset,
          styles.btn_update,
          styles.btn_slowTransition,
          'rounded',
          { 'flex-row': pr.isExpanded },
          { 'flex-column': !pr.isExpanded },
        )}
        type='button'
        title='Atualizar...'
        onClick={handleSetSegundosAtualizacao}
        disabled={segundosAtualizacao >= tempoAtualizacao - tempoHabilitarAtualizar }
      >
        <TbRotate style={{ marginBottom: 3 }} className='' />
        <span className={classNames({ 'd-none': !pr.isExpanded })}>Atualizar</span>

        <span className={styles.btn_update_badge}>
            {`${String(Math.floor(segundosAtualizacao / 60)).padStart(2, '0')}:${String(segundosAtualizacao % 60).padStart(2, '0')}`}
        </span>

      </button>
    </div>
  )
}