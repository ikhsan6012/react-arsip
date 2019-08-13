import React, { useState, useEffect } from 'react'
import { fetchDataGQL, handleErrors, setToken } from '../../functions/helpers'

const Seksi = () => {
	const [seksis, setSeksis] = useState([])
	
	useEffect(() => {
		const getData = async () => {
			try {
				const body = {query: `{
					seksis(populate: true) {
						_id
						kode
						nama_seksi
						transaksi{
							_id
							no_nd_pinjam
							tahun_nd_pinjam
							tgl_nd_pinjam
							no_nd_kirim
							tahun_nd_kirim
							tgl_nd_kirim
							no_nd_kembali
							tahun_nd_kembali
							tgl_nd_kembali
						}
					}
				}`}
				const { data, extensions, errors } = await fetchDataGQL(body)
				setToken(extensions)
				if(errors) return handleErrors
				setSeksis(data.seksis)
			} catch (err) {
				throw err
			}
		}
		getData()
	}, [])

	const list = seksis.map((s, i) => {
		const belum_kembali = s.transaksi.filter(t => !t.tgl_nd_kembali)
		// console.log(belum_kembali)
		let total_jt = 0
		belum_kembali.forEach(t => {
			const jt = parseInt((t.tgl_nd_kirim)) + 2592000000
			if(new Date().getTime() >= jt) total_jt++
			console.log(new Date().getTime() >= jt)
		})
		const sudah_kembali = s.transaksi.filter(t => t.tgl_nd_kembali)
		let total_tl = 0
		sudah_kembali.forEach(t => {
			const jt = parseInt((t.tgl_nd_kirim)) + 2592000000
			if(parseInt(t.tgl_nd_kembali) >= jt) total_tl++
		})
		return(
			<tr key={ i } id={ s._id }>
				<td className="align-middle text-center">{ i+1 }</td>
				<td className="align-middle">{ s.nama_seksi }</td>
				<td className="align-middle text-center">{ s.transaksi.length }</td>
				<td className="align-middle text-center">{ belum_kembali.length ? belum_kembali.length - total_jt : 0 }</td>
				<td className="align-middle text-center">{ total_jt }</td>
				<td className="align-middle text-center">{ sudah_kembali.length ? sudah_kembali.length - total_tl : 0 }</td>
				<td className="align-middle text-center">{ total_tl }</td>
			</tr>
		)
	})
	
	return(
		<div className="table-responsive">
			<table className="table table-striped table-bordered table-hover">
				<thead>
					<tr>
						<th className="align-middle text-center no" rowSpan="2">No</th>
						<th className="align-middle text-center" rowSpan="2">Nama Seksi</th>
						<th className="align-middle text-center" rowSpan="2">Total Peminjaman</th>
						<th className="align-middle text-center" colSpan="2">Belum Dkembalikan</th>
						<th className="align-middle text-center" colSpan="2">Telah Dkembalikan</th>
					</tr>
					<tr>
						<th className="align-middle text-center">Belum Jatuh Tempo</th>
						<th className="align-middle text-center">Jatuh Tempo</th>		
						<th className="align-middle text-center">Tepat Waktu</th>
						<th className="align-middle text-center">Terlambat</th>
					</tr>
				</thead>
				<tbody>
					{ list }
				</tbody>
			</table>
		</div>
	)
}
export default Seksi