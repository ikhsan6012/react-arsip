import React, { useState } from 'react'

import List from './List'
import { fetchDataGQL, setToken, handleErrors } from '../../functions/helpers'

export const WPItem = props => {
	const [detailWP, setDetailWP] = useState({ isHidden: true, data: {} })

	// Get Detail WP
	const getDetailWP = async e => {
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
			setDetailWP({ isHidden: true, data: {} })
		} else {
			document.getElementsByName('list').forEach(el => {
				el.hidden = true
			})
			container.hidden = false
			Object.assign(container.style, { flex: '0 0 100%', maxWidth: '100%', transition: 'all 1s' })
			const {data, extensions, errors} = await fetchDataGQL(body)
			setToken(extensions)
			if(errors) return handleErrors(errors)
			setDetailWP({ isHidden: false, data })
		}
	}

	return(
		<List detailWP={ detailWP }>
			<span className="info-box-text" style={{ cursor: 'pointer' }} onClick={ getDetailWP }>
				Wajib Pajak
			</span>
			<span className="info-box-number">{ props.wp.jumlah }</span>
		</List>
	)
}

export const BerkasItem = props => {
	const [detail, setDetail] = useState({ isHidden: true, data: {} })

	// Get Detail
	const getDetail = async e => {
		e.persist()
		const container = e.target.parentNode.parentNode.parentNode
		console.log(container)
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
			setDetail({ isHidden: true, data: {} })
		} else {
			if(!body) return
			try {
				const { data, errors, extensions } = await fetchDataGQL(body)
				setToken(extensions)
				if(errors) return handleErrors(errors)
				setDetail({ isHidden: false, data: data.data })
				document.getElementsByName('list').forEach(el => {
					el.hidden = true
				})
				container.hidden = false
				Object.assign(container.style, { flex: '0 0 100%', maxWidth: '100%', transition: 'all 1s' })
			} catch (err) {
				throw err
			}
		}
	}

	return props.ket_berkas.data.map((kb, i) => 
		<List key={ i } detail={ detail } value={ kb.kd_berkas }>
			<span className="info-box-text" style={{ cursor: 'pointer' }} onClick={ getDetail }>{ kb.nama_berkas }</span>
			<span className="info-box-number">{ kb.jumlah }</span>
		</List>	
	)
}