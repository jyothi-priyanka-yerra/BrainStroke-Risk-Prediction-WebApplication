import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';

import Dashboard from './components/patientList/patientList';
import PatientForm from './components/patientForm/patientForm';
import PatientDetail from "./components/patientList/patientDetail";
import PopulationStatistics from "./components/populationStatistics/populationStatistics.js";
import Mailbox from './components/messageBox/messages.js';

/*
<ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/create">Create Patient</Link></li>
            <li><Link to="/popStats">Population statistics</Link></li>
            <li><Link to="/mailbox">Mailbox</Link></li>
          </ul>

*/
function App() {

  return (
    <div className="App">
		<BrowserRouter>
		<nav>

      <List size="lg" role="menubar" color="success" orientation="horizontal" variant="solid">
        <ListItem  role="none">
          <Link to="/">
          <ListItemButton role="menuitem" color="success" component="a" variant="solid">
            Dashboard
          </ListItemButton>
          </Link>
        </ListItem>
        <ListDivider />
        <ListItem Link to="/create" role="none">
          <Link to="/create">
          <ListItemButton variant="solid" color="success" role="menuitem" component="a">
            Create Patient
          </ListItemButton>
          </Link>
        </ListItem>
        <ListDivider />
        <ListItem role="none">
          <Link to="/popStats">
          <ListItemButton variant="solid" color="success" role="menuitem" component="a">
            Population statistics
          </ListItemButton>
          </Link>
        </ListItem>
        <ListDivider />
        <ListItem role="none">
          <Link to="/mailbox">
          <ListItemButton variant="solid" color="success" role="menuitem" component="a">
            Mailbox
          </ListItemButton>
          </Link>
        </ListItem>
      </List>
    </nav>
    <div class="mainDiv">
		<Routes>
          <Route exact path='/' element = {<Dashboard />} />
          <Route path='create' element = {<PatientForm step='1'/>} />
          <Route path='patients/:id' element = {<PatientDetail />} />
          <Route path='popStats' element = {<PopulationStatistics/>} />
          <Route path='mailbox' element = {<Mailbox/>} />
        </Routes>
        </div>
		</BrowserRouter>
    </div>
  );
}

export default App;
