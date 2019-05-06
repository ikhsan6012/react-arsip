import React from 'react'
import { Route } from 'react-router-dom'

import Tambah from './Tambah'
import Cari from './Cari'

export default () => {
	return(
		<main className="content-wrapper">
			<Route path="/berkas/tambah" component={ Tambah }/>
			<Route path="/berkas/cari" component={ Cari }/>
		</main>
	)
}