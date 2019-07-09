import React, { Fragment, useEffect } from 'react'

import ContentHeader from '../../../components/ContentHeader'
import Content from '../../../components/Berkas/Tambah'

import IndukBerkas from './IndukBerkas'
import SPTBaru from './SPTBaru'
import PBK from './PBK'
import LainLain from './LainLain'

const TambahBerkas = () => {
	const contentHeader = [{ name: "Berkas" }, { name: "Tambah Berkas" }]
	const list = [
		{ name: "Induk Berkas", url: "/", component: IndukBerkas, kd_berkas: "INDUK" },
		{ name: "Pindah Masuk", url: "/pindah-masuk", component: IndukBerkas, kd_berkas: "PINDAH" },
		{ name: "SPT Baru", url: "/spt-baru", component: SPTBaru },
		{ name: "PKP", url: "/pkp", component: IndukBerkas, kd_berkas: "PKP" },
		{ name: "Sertel", url: "/sertel", component: IndukBerkas, kd_berkas: "SERTEL" },
		{ name: "PBK", url: "/pbk", component: PBK, kd_berkas: "PBK" },
		{ name: "Lain-Lain", url: "/lain-lain", component: LainLain }
	]

	useEffect(() => {
		return () => {
			localStorage.removeItem('formData')
		}
	}, [])

	return (
		<Fragment>
			<ContentHeader contentHeader={ contentHeader }/>
			<Content list={ list }/>
		</Fragment>
	)
}
export default TambahBerkas