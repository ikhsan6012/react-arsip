import React, { useState, useEffect } from 'react'
import { getDetailRekam } from '../../../functions/monitorRekam'

const ListLokasi = props => {
	const [lokasis, setLokasis] = useState([])
	const [berkases, setBerkases] = useState([])
	const [detailRekam, setDetailRekam] = useState('')

	useEffect(() => {
		localStorage.setItem('lokasis', JSON.stringify(props.lokasis))
		setLokasis(props.lokasis)
		setDetailRekam('')
		return () => localStorage.removeItem('lokasis')
	}, [props.lokasis])

	useEffect(() => {
		setDetailRekam('')
		const renderDetailRekam = async berkases => {
			const Module = await import('./DetailRekam')
			setDetailRekam(<Module.default berkases={ berkases } />)
		}
		if(berkases.length) renderDetailRekam(berkases)
	}, [berkases])

	const list = lokasis.length ? lokasis.sort((a,b) => a.perekam.nama.localeCompare(b.perekam.nama)).map((lokasi, i) => {
		const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }
		return(
			<tr key={ lokasi._id } style={{ cursor: 'pointer' }} onClick={ getDetailRekam.bind(this, lokasi, { setLokasis, setBerkases }) }>
				<td className="text-center align-middle">{ i+1 }</td>
				<td className="align-middle">{ lokasi.perekam.nama }</td>
				<td className="text-center align-middle">{ lokasi.gudang }</td>
				<td className="text-center align-middle">{ lokasi.kd_lokasi }</td>
				<td className="text-center align-middle">{ lokasi.jumlah_berkas }</td>
				<td className="text-center align-middle">{ new Date(parseInt(lokasi.created_at)).toLocaleString('id', options) }</td>
				<td className="text-center align-middle">
					{ lokasi.time_completed ? new Date(parseInt(lokasi.time_completed)).toLocaleString('id', options) : '' }
				</td>
				<td className="text-center align-middle">{ lokasi.cancel_msg ?
					<h6 style={{ marginBottom: 0 }}><span className="badge badge-pill badge-warning">Dibuka Kembali</span></h6> :
					lokasi.completed ?
						<h6 style={{ marginBottom: 0 }}><span className="badge badge-pill badge-success">Selesai</span></h6> :
						<h6 style={{ marginBottom: 0 }}><span className="badge badge-pill badge-danger">Belum Selesai</span></h6>
				}</td>
				<td className="align-middle">{ lokasi.cancel_msg }</td>
			</tr>
		)
	}) : <tr><td colSpan="9">Tidak Ada Data...</td></tr>
		
	
	return(<>
		<div className="card-body">
			<label style={{ width: '100%' }}>
				Daftar Perekaman 
				<button className="btn btn-secondary float-right" onClick={ props.handleBackBtn }>Kembali</button>
			</label>
			<div className="table-responsive">
				<table className="table table-striped table-bordered table-hover">
					<thead>
						<tr>
							<th className="text-center align-middle no">No</th>
							<th className="text-center align-middle">Nama Perekam</th>
							<th className="text-center align-middle">Gudang</th>
							<th className="text-center align-middle">Lokasi</th>
							<th className="text-center align-middle">Jumlah Berkas</th>
							<th className="text-center align-middle">Waktu Mulai</th>
							<th className="text-center align-middle">Waktu Selesai</th>
							<th className="text-center align-middle">Status</th>
							<th className="text-center align-middle">Keterangan</th>
						</tr>
					</thead>
					<tbody>
						{ list }
					</tbody>
				</table>
			</div>
		</div>
		{ detailRekam }
	</>)
}
export default ListLokasi