import React, { useState, useEffect } from 'react'
import Detail from './Detail'
import { renderToString } from 'react-dom/server'
import { getResume, getDetailsData } from '../../../functions/monitorRekam'

const Resume = () => {
	const [resume, setResume] = useState([])

	useEffect(() => {
		getResume(setResume)
	}, [])

	const getDetails = async e => {
		const tr = e.target.parentNode
		const nextSibling = tr.nextSibling
		const detailsNodes = document.querySelectorAll('.details')
		if(detailsNodes.length) detailsNodes.forEach(detail => detail.remove())
		if(nextSibling) if(nextSibling.classList.contains('details')) return false
		const tgl_rekam = tr.childNodes[1].innerText.split(' ')[1]
		const details = await getDetailsData(tgl_rekam)
		details.sort((a,b) => b.nama.localeCompare(a.nama)).forEach(d => {
			const newNode = document.createElement('tr')
			newNode.className = `details table-${ d.jml_per_tgl.berkas === 0 ? 'danger' : 'primary' }`
			newNode.innerHTML += renderToString(<Detail detail={ d } />)
			tr.after(newNode)
		})
	}

	const list = resume.map((r, i) => {
		const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }
		return(
			<tr key={ r.tgl_rekam } className={ i === 0 ? `table table-success` : ''} style={{ cursor: 'pointer' }} onClick={ getDetails }>
				<td className="text-center align-middle">{ i+1 }</td>
				<td className="text-center align-middle">{ r.tgl_rekam === 's.d. Sekarang' ? r.tgl_rekam : new Date(parseInt(r.tgl_rekam)).toLocaleDateString('id', options) }</td>
				<td className="text-center align-middle">{ r.jml_per_tgl.lokasi.selesai }</td>
				<td className="text-center align-middle">{ r.jml_per_tgl.lokasi.belum }</td>
				<td className="text-center align-middle">{ r.jml_per_tgl.lokasi.total }</td>
				<td className="text-center align-middle">{ r.jml_per_tgl.berkas }</td>
			</tr>
		)
	})

	return(<>
		<div className="card-body">
			<label>Resume Perekaman</label>
			<div className="table-responsive">
				<table className="table table-striped table-bordered table-hover">
					<thead>
						<tr>
							<th className="text-center align-middle no" rowSpan="3">No</th>
							<th className="text-center align-middle" rowSpan="3">Tanggal Rekam</th>
							<th className="text-center align-middle" colSpan="4">Jumlah Terekam</th>
						</tr>
						<tr>
							<th className="text-center align-middle" colSpan="3">Lokasi</th>
							<th className="text-center align-middle" rowSpan="2">Berkas</th>
						</tr>
						<tr>
							<th className="text-center align-middle">Selesai</th>
							<th className="text-center align-middle">Belum Selesai</th>
							<th className="text-center align-middle">Jumlah</th>
						</tr>
					</thead>
					<tbody>
						{ list }
					</tbody>
				</table>
			</div>
		</div>
	</>)
}
export default Resume