import React from 'react'

const ListPerekam = ({ perekam }) => {
	const list = perekam.length ? perekam.map((p, pi) => 
		p.lokasi.length ? p.lokasi.map((l, li) => 
			<tr>
				{ li === 0 ? <td>{ p+1 }</td> : '' }
				{ li === 0 ? <td>{ p.nama }</td> : '' }
			</tr>
		) : (
			<tr>
				<td>{ pi+1 }</td>
				<td>{ p.nama }</td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>
		)
	) : <tr><td colSpan="7">Tidak Ada Data</td></tr>

	return(
		<div className="card-body">
			<div className="table-responsive">
				<table className="table table-striped table-bordered table-hover">
					<thead>
						<tr>
							<th className="text-center align-middle no">No</th>
							<th className="text-center align-middle">Nama Perekam</th>
							<th className="text-center align-middle">Gudang</th>
							<th className="text-center align-middle">Lokasi</th>
							<th className="text-center align-middle">Tanggal Mulai</th>
							<th className="text-center align-middle">Status</th>
							<th className="text-center align-middle">Tanggal Selesai</th>
						</tr>
					</thead>
					<tbody>
						{ list }
					</tbody>
				</table>
			</div>
		</div>
	)
}
export default ListPerekam