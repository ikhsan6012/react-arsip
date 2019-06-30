import React, { Fragment } from 'react'
import Aksi from './Aksi'

const BerkasItem = props => {
	// List Berkas
	const berkas = props.berkases.length ? props.berkases.map((b, i) =>
		<tr key={ i }>
			<td className="text-center align-middle">{ i+1 }</td>
			<td className="align-middle">{ b.ket_berkas.nama_berkas }</td>
			<td className="text-center align-middle">{ b.masa_pajak }</td>
			<td className="text-center align-middle">{ b.tahun_pajak }</td>
			<td className="text-center align-middle">{ b.status_pbk ? `${ b.status_pbk } | No. ${ b.nomor_pbk } | ${ b.tahun_pbk }` : '' }</td>
			<td className="text-center align-middle">{`Gudang ${b.lokasi.gudang} | ${b.lokasi.kd_lokasi} | ${b.urutan}`}</td>
			<td className="align-middle">{ b.ket_lain }</td>
			<Aksi
				berkas={ b }
			/>
		</tr>
	) : (
		<tr>
			<td colSpan="8">Tidak Ada Berkas</td>
		</tr>
	)

	return(
		<Fragment>
			<hr />
			<div className="card-body">
				<div className="table-responsive">
					<input
						id="edit" 
						type="file" 
						accept="application/pdf"
						hidden
					/>
					<table className="table table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th className="align-middle text-center" width="10px">No</th>
								<th className="align-middle text-center" width="200px">Jenis Berkas</th>
								<th className="align-middle text-center" width="75px">Masa Pajak</th>
								<th className="align-middle text-center" width="75px">Tahun Pajak</th>
								<th className="align-middle text-center" width="200px">Pemindahbukuan</th>
								<th className="align-middle text-center" width="200px" style={{ cursor: 'pointer' }}>Lokasi</th>
								<th className="align-middle text-center" style={{ cursor: 'pointer' }}>Keterangan</th>
								<th className="align-middle text-center" width="150px">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{ berkas }
						</tbody>
					</table>
				</div>
			</div>
		</Fragment>
	)
}
export default BerkasItem