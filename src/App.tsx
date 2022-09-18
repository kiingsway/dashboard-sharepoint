import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css';

import Chamados from './pages/Chamados';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Sidebar from './components/Sidebar';

import bClientes from './data/clientes.json'
import bChamados from './data/chamados_big.json'
import { IChamado, ICliente } from './interfaces';
import { DateTime } from 'luxon';
import { diffBusinessDays } from './services/FunctionHelpers';
import { AnimatePresence, motion } from 'framer-motion';


export default function App() {

  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [chamados, setChamados] = useState<IChamado[]>([]);

  const obterClientesChamados = () => {

    setClientes(bClientes as ICliente[]);

    const newChamados = (bChamados as Partial<IChamado>[]).map(chamado => {

      const agora = DateTime.now();
      const modificado = DateTime.fromISO(chamado?.Modified || '');
      const feriados = { Datas: [] };

      return {
        ...chamado,
        diasCorridosSemAtualizar: parseFloat(agora.diff(modificado, 'days').days.toFixed(1)),
        diasUteisSemAtualizar: parseFloat(diffBusinessDays(modificado, agora, feriados?.Datas).toFixed(1)),
        ClienteTitle: chamado?.Cliente?.Title,
        AtribuidaTitle: chamado.Atribuida?.Title || null,
      }

    }) as IChamado[];

    setChamados(newChamados);
  }

  useEffect(() => obterClientesChamados(), [])
  return (
    <BrowserRouter>
      <AnimatePresence>
        <Sidebar clientes={clientes} chamados={chamados}>
          <Routes>
            <Route path='/' element={<Chamados />} />
            <Route path='/dashboard' element={<Dashboard chamados={chamados} clientes={clientes} />} />
            <Route path='/clientes' element={<Clientes clientes={clientes} chamados={chamados} />} />
          </Routes>
        </Sidebar>
      </AnimatePresence>
    </BrowserRouter>
  )
}