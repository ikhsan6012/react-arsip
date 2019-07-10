import React from 'react'
import { Route } from 'react-router-dom'

import Tambah from './Tambah'
import Cari from './Cari'
import MonitorRekam from './MonitorRekam';

const Berkas = () => {
	return(
		<main className="content-wrapper">
			<Route path="/berkas/tambah" component={ Tambah }/>
			<Route path="/berkas/cari" component={ Cari }/>
			<Route path="/berkas/monitor-rekam" component={ MonitorRekam }/>
		</main>
	)
}
export default Berkas