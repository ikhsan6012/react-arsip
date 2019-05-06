import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom'
import swal from 'sweetalert'
import Sidebar from './components/Sidebar'
import Nav from './components/Nav'
import Dashboard from './pages/Dashboard'
import Berkas from './pages/Berkas'
import MonitorLB from './pages/MonitorLB'

import 'bootstrap/dist/css/bootstrap.min.css'
import './static/css/adminlte.min.css'
import './static/font-awesome/css/font-awesome.min.css'
import './static/css/style.css'

import { fetchDataGQL } from './helpers'

class App extends Component {
  state = {
    isHiddenLogin: true
  }

  showLogin = e => {
    e.preventDefault()
    this.setState({ isHiddenLogin: !this.state.isHiddenLogin })
    setTimeout(() => {
      const form = document.querySelectorAll('#formLogin .form-control')
      if(this.state.isHiddenLogin === false){
        form[0].focus()
      } else {
        form.forEach(input => input.value = '')
      }
    }, 100)
  }

  login = e => {
    e.preventDefault()
    const username = document.querySelectorAll('#formLogin .form-control')[0].value
    const password = document.querySelectorAll('#formLogin .form-control')[1].value
    const body = {query: `{
      user: getUser(username: "${username}", password: "${password}"){
        _id
        username
        nama
        token
      }
    }`}
    return fetchDataGQL(body)
      .then(res => res.json())
      .then(({data}) => {
        localStorage.setItem('token', data.user.token)
        swal('Login Berhasil!', {
          icon: 'success'
        })
        this.forceUpdate()
      })
      .catch(err => console.log(err))
  }

  logout = () => {
    localStorage.removeItem('token')
    swal('Logout Berhasil!', {
      icon: 'success'
    })
    this.forceUpdate()
  }

  render() {
    return (
      <Router>
        <Sidebar />
        <Nav 
          showLogin={ this.showLogin }
          isHiddenLogin={ this.state.isHiddenLogin }
          login={ this.login }
          logout={ this.logout }
        />
        <Switch>
          <Route exact path="/" component={ Dashboard }/>
          <Route path="/berkas" component={ Berkas }/>
          <Route path="/monitorlb" component={ MonitorLB }/>
        </Switch>
      </Router>
    );
  }
}

export default App 