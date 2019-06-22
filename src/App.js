import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Nav from './components/Nav'
import Dashboard from './pages/Dashboard'
import Berkas from './pages/Berkas'
import MonitorLB from './pages/MonitorLB'

import 'bootstrap/dist/css/bootstrap.min.css'
import './static/css/adminlte.min.css'
import './static/font-awesome/css/font-awesome.min.css'
import './static/css/style.css'

const App = () => {
  return (
    <Router>
      <Sidebar />
      <Nav />
      <Switch>
        <Route exact path="/" component={ Dashboard }/>
        <Route path="/berkas" component={ Berkas }/>
        <Route path="/monitorlb" component={ MonitorLB }/>
      </Switch>
    </Router>
  )
}

export default App 