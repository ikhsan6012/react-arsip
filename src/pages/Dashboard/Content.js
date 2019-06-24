import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'

import { fetchDataGQL, setToken } from '../../functions/helpers'
import { WPItem, BerkasItem } from './Items'

const Content = props => {
	const [wp, setWP] = useState({ isError: false, jumlah: 0 })
	const [ket_berkas, setKet_berkas] = useState({ isError: false, data: [] })

	// Get Jumlah WP Dan Ket Berkas
	useEffect(() => {
		const getWP_KetBerkas = async body => {
			try {
				const {data, errors, extensions} = await fetchDataGQL(body)
				setToken(extensions)
				if(errors) return swal(errors.message, { icon: 'error' })
					.then(() => {
						document.querySelector('nav .btn-danger').click()
					})
				setWP({ isError: false, jumlah: data.jumlahWP })
				setKet_berkas({ isError: false, data: data.ket_berkas })
			} catch (err) {
				setWP({ isError: true, jumlah: 0 })
				setKet_berkas({ isError: true, data: [] })
			}
		}
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
		getWP_KetBerkas(body)
	}, [])

	return(
		<section className="content">
			<div className="container-fluid">
				<h5 className="md-2">Informasi</h5>
				<div className="row">
					<WPItem wp={ wp } />
					<BerkasItem ket_berkas={ ket_berkas } />
				</div>
			</div>
		</section>
	)
}
export default Content