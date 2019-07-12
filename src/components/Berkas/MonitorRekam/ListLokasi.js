import React from 'react'

const ListLokasi = ({ lokasis }) => {
	const list = lokasis.length ? lokasis.map((lokasi, i) => 
		<tr key={ lokasi._id }>
			<td className="text-center align-middle">{ i+1 }</td>
			<td className="align-middle">{ lokasi.perekam.nama }</td>
			<td className="text-center align-middle">{ lokasi.gudang }</td>
			<td className="text-center align-middle">{ lokasi.kd_lokasi }</td>
			<td className="text-center align-middle">{ new Date(parseInt(lokasi.created_at)).toISOString() }</td>
			<td className="text-center align-middle">
				{ lokasi.time_completed ? new Date(parseInt(lokasi.time_completed)).toISOString() : '' }
			</td>
			<td className="text-center align-middle">{ lokasi.completed ?
				<h6 style={{ marginBottom: 0 }}><span className="badge badge-pill badge-success">Selesai</span></h6> :
				<h6 style={{ marginBottom: 0 }}><span className="badge badge-pill badge-danger">Belum Selesai</span></h6>
			}</td>
		</tr>
	) : <tr><td colSpan="7">Tidak Ada Data...</td></tr>
		
	
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
							<th className="text-center align-middle">Waktu Mulai</th>
							<th className="text-center align-middle">Waktu Selesai</th>
							<th className="text-center align-middle">Status</th>
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
export default ListLokasi