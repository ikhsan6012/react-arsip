import React, { Component } from 'react'
import ContentHeader from '../../components/ContentHeader'
import Content from './Content'
import swal from 'sweetalert'

import { fetchDataGQL, handleErrors, setToken } from '../../helpers'

export default class Dashboard extends Component {
	state = {
		ket_berkas: {
			isError: false,
			data: []
		},
		wp: {
			isError: false,
			jumlah: 0
		},
		contentHeader: [
			{ name: "Dashboard" }
		],
		dataDetailWP: {
			isHidden: true,
			data: {},
			data2: {}
		},
		dataDetail: {
			isHidden: true,
			data: {}
		},
		eachDetail: {
			isHidden: true,
			data: [],
		}
	}

	getDetailWP = e => {
		const body = {query: `{
			aktif: totalWPs(status: "aktif")
			de: totalWPs(status: "de")
			ne: totalWPs(status: "ne")
			pindah: totalWPs(status: "pindah")
			total: totalWPs
			lastUpdate: lastUpdateWPs
		}`}

		const container = e.target.parentNode.parentNode.parentNode
		const initStyle = { flex: '0 0 33.333333%', maxWidth: '33.333333%'}
		if(container.style.maxWidth === '100%'){
			document.getElementsByName('list').forEach(el => {
				el.hidden = false
			})
			Object.assign(container.style, initStyle)
			this.setState({
				dataDetailWP: { isHidden: true, data: {} }
			})
		} else {
			document.getElementsByName('list').forEach(el => {
				el.hidden = true
			})
			container.hidden = false
			Object.assign(container.style, { flex: '0 0 100%', maxWidth: '100%', transition: 'all 1s' })
			fetchDataGQL(body)
				.then(({data, extensions, errors}) => {
					setToken(extensions)
					if(errors) return handleErrors(errors)
					this.setState({
						dataDetailWP: { isHidden: false, data, data2: data }
					})
				})
		}
	}

	getDetail = e => {
		e.persist()
		const container = e.target.parentNode.parentNode.parentNode
		const initStyle = { flex: '0 0 33.333333%', maxWidth: '33.333333%'}
		const kd_berkas = container.getAttribute('value')
		let body
		if(kd_berkas === 'INDUK'){
			body = {query: `{
				data: ketBerkas(kd_berkas: "${kd_berkas}") {
					berkas_baru
					berkas_lama
					total
					lastUpdate
				}
			}`}
		}else if(kd_berkas === 'PINDAH'){
			body = {query: `{
				data: ketBerkas(kd_berkas: "${kd_berkas}") {
					wajib_pajak_pindah
					berkas_wajib_pajak_pindah
					lastUpdate
				}
			}`}
		}else if(kd_berkas.match(/PKP|LAIN|SERTEL|PBK/)) {
			return false
		}else{
			body = {query: `{
				data: ketBerkas(kd_berkas: "${kd_berkas}"){
					berdasarkan_tanggal_terima
					tidak_berdasarkan_tanggal_terima
					total
					lastUpdate
				}
			}`}
		}
		if(container.style.maxWidth === '100%'){
			document.getElementsByName('list').forEach(el => {
				el.hidden = false
			})
			Object.assign(container.style, initStyle)
			this.setState({
				dataDetail: { isHidden: true, data: {} }
			})
		} else {
			if(!body) return
			fetchDataGQL(body)
				.then(({data, errors, extensions}) => {
					setToken(extensions)
					if(errors) return handleErrors(errors)
					this.setState({ dataDetail: { isHidden: false, data: data.data } })
				})
				.catch(err => { throw err })

			document.getElementsByName('list').forEach(el => {
				el.hidden = true
			})
			container.hidden = false
			Object.assign(container.style, { flex: '0 0 100%', maxWidth: '100%', transition: 'all 1s' })
		}
	}

	componentDidMount(){
		// GET DATA BERKAS
		const body = {
			query: `{
				ket_berkas: ketBerkases {
					kd_berkas
					nama_berkas
					jumlah
				}
				jumlahWP: totalWPs
			}`
		}
		fetchDataGQL(body)
			.then(({data, errors, extensions}) => {
				setToken(extensions)
				if(errors) return swal(errors.message, { icon: 'error' })
					.then(() => {
						document.querySelector('nav .btn-danger').click()
					})
				this.setState({
					ket_berkas: { isError: false, data: data.ket_berkas },
					wp: { isError: false, jumlah: data.jumlahWP}
				})
			})
			.catch(err => {
				console.log(err)
				this.setState({
					ket_berkas: { isError: true, data: [] },
					wp: { isError: true, jumlah: 0 }
				})
			})
	}

	render(){
		return(
			<main className="content-wrapper">
				<ContentHeader contentHeader={ this.state.contentHeader } />
				<Content
					ket_berkas={ this.state.ket_berkas }
					wp={ this.state.wp }
					getDetailWP={ this.getDetailWP }
					getDetail={ this.getDetail }
					dataDetailWP={ this.state.dataDetailWP }
					dataDetail={ this.state.dataDetail }
					eachDetail={ this.state.eachDetail }
				/>
			</main>
		)
	}
}