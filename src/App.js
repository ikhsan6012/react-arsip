import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar'
import Nav from './components/Nav'
import Dashboard from './pages/Dashboard'
import Berkas from './pages/Berkas'
import MonitorLB from './pages/MonitorLB'
import { BrowserRouter as Router } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom'
import { fetchDataGQL, handleErrors, setToken } from './functions/helpers'
import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './static/css/adminlte.min.css'
import './static/css/style.css'
import SaranMasukan from './pages/SaranMasukan'
import UpdateWP from './pages/UpdateWP'
import MonitorPeminjaman from './pages/MonitorPeminjaman'

const App = () => {
  // Get Ket Berkas
	useEffect(() => {
		const getKetBerkas = async body => {
			try {
				const {data, errors, extensions} = await fetchDataGQL(body)
				setToken(extensions)
        if(errors) return handleErrors(errors)
        localStorage.setItem('ket_berkas', JSON.stringify(data.ket_berkas))
			} catch (err) {
        console.error(err)
			}
		}
		const body = { query: `{
			ket_berkas: ketBerkases {
				_id
				kd_berkas
				nama_berkas
			}
		}`}
		getKetBerkas(body)
	}, [])

  return (
    <Router>
      <Sidebar />
      <Nav />
      <Switch>
        <Route exact path="/" component={ Dashboard }/>
        <Route path="/berkas" component={ Berkas }/>
        <Route path="/monitorlb" component={ MonitorLB }/>
        <Route path="/saran-masukan" component={ SaranMasukan }/>
        <Route path="/update-wp" component={ UpdateWP }/>
        <Route path="/monitor-peminjaman" component={ MonitorPeminjaman }/>
      </Switch>
    </Router>
  )
}
export default App 