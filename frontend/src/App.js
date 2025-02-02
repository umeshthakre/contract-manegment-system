import logo from './logo.svg';
import './App.css';
import { useGetAllContractsQuery } from './redux/services/contract';
import {

  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { columns } from './helpers/table/columns';
import { ContractsTable } from './components/ContactsTable';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  BrowserRouter,
  Routes
} from "react-router-dom";
import { FormContext } from './helpers/context/FormContext';
import { useEffect, useState } from 'react';
import EditForm from './components/EditForm';
import { io } from 'socket.io-client';



function App() {


  const [showEditForm, setShowEditForm] = useState()
  const [id, setId] = useState()


  

 

  return (
    <div >

      <FormContext.Provider
        value={{
          showEditForm, setShowEditForm,
          id, setId
        }}
      >
        <BrowserRouter basename='/'>
          <Routes>
            <Route path='/' element={<ContractsTable />} />
            <Route path='/edit-contracts/:id' element={<EditForm />}>

            </Route>

          </Routes>

        </BrowserRouter>

      </FormContext.Provider>
    </div>
  );
}

export default App;
