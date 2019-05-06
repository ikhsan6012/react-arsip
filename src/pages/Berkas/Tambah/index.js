import React, { Component, Fragment } from 'react'

import ContentHeader from '../../../components/ContentHeader'
import Content from '../../../components/Berkas/Tambah'

import IndukBerkas from './IndukBerkas'
import SPTBaru from './SPTBaru'
import PBK from './PBK'
import LainLain from './LainLain'

export default class TambahBerkas extends Component {
	state = {
		contentHeader: [
			{ name: "Berkas" },
			{ name: "Tambah Berkas" }
		],
		list: [
			{ name: "Induk Berkas", url: "/", component: IndukBerkas, kd_berkas: "INDUK" },
			{ name: "Pindah Masuk", url: "/pindah-masuk", component: IndukBerkas, kd_berkas: "PINDAH" },
			{ name: "SPT Baru", url: "/spt-baru", component: SPTBaru },
			{ name: "PKP", url: "/pkp", component: IndukBerkas, kd_berkas: "PKP" },
			{ name: "Sertel", url: "/sertel", component: IndukBerkas, kd_berkas: "SERTEL" },
			{ name: "PBK", url: "/pbk", component: PBK, kd_berkas: "PBK" },
			{ name: "Lain-Lain", url: "/lain-lain", component: LainLain }
		]
	}

	render() {
		return(
			<Fragment>
				<ContentHeader 
					contentHeader={ this.state.contentHeader }
				/>
				<Content
					list={ this.state.list }
				/>
			</Fragment>
		)
	}
}