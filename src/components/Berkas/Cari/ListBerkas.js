import React, { Fragment, useState } from 'react'
import Aksi from './Aksi'
import { setComplete, deleteLokasi } from '../../../functions/cari'

export const ListBerkasWP = ({ berkases }) => {
	// List Berkas
	const berkas = berkases.length ? berkases.map((b, i) =>
		<tr key={ i }>
			<td className="text-center align-middle">{ i+1 }</td>
			<td className="align-middle">{ b.ket_berkas.nama_berkas }</td>
			<td className="text-center align-middle">{ b.masa_pajak && `${ b.masa_pajak }/${ b.tahun_pajak }` }</td>
			<td className="text-center align-middle">{ b.status_pbk && `${ b.status_pbk } | No. ${ b.nomor_pbk } | ${ b.tahun_pbk }` }</td>
			<td className="text-center align-middle">{`Gudang ${b.lokasi.gudang} | ${b.lokasi.kd_lokasi} | ${b.urutan}`}</td>
			<td className="align-middle">
				{ b.ket_lain && <pre>{ String.raw`${ b.ket_lain }` }</pre> }
			</td>
			<Aksi berkas={ b }/>
		</tr>
	) : <tr><td colSpan="7">Tidak Ada Berkas</td></tr>

	return(
		<Fragment>
			<hr />
			<div className="card-body">
				<input
					id="edit" 
					type="file" 
					accept="application/pdf"
					hidden
				/>
				<div className="table-responsive">
					<table className="table table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th className="align-middle text-center">No</th>
								<th className="align-middle text-center" style={{ minWidth: "200px" }}>Jenis Berkas</th>
								<th className="align-middle text-center" style={{ minWidth: "150px" }}>Masa / Tahun</th>
								<th className="align-middle text-center" style={{ minWidth: "125px" }}>Pemindahbukuan</th>
								<th className="align-middle text-center" style={{ minWidth: "100px" }}>Lokasi</th>
								<th className="align-middle text-center">Keterangan</th>
								<th className="align-middle text-center" style={{ minWidth: "100px" }}>Aksi</th>
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

export const ListBerkasLokasi = ({ berkases }) => {
	const [isComplete, setIsComplete] = useState(berkases[0] ? berkases[0].lokasi.completed : false)
	const lokasi = berkases[0] ? berkases[0].lokasi._id : null

	// List Berkas
	const berkas = berkases.length ? berkases.map((b, i) =>
		<tr key={ b._id }>
			<td className="align-middle text-center">{ i+1 }</td>
			<td className="align-middle">{ b.ket_berkas.nama_berkas }</td>
			<td className="align-middle">{ b.pemilik && <React.Fragment>{ b.pemilik.npwp }<br/>{ b.pemilik.nama_wp }</React.Fragment> }</td>
			<td className="align-middle text-center">{ b.tahun_pajak && `${ b.masa_pajak }/${ b.tahun_pajak }` }</td>
			<td className="align-middle">{ b.penerima && <React.Fragment>{ b.penerima.nama_penerima }<br/>{ b.penerima.tgl_terima }</React.Fragment> }</td>
			<td className="align-middle text-center">{ b.status_pbk && `${ b.status_pbk } | No. ${ b.nomor_pbk } | ${ b.tahun_pbk }` }</td>
			<td className="align-middle text-center">{ b.urutan }</td>
			<td className="align-middle">
				{ b.ket_lain && <pre>{ String.raw`${ b.ket_lain }` }</pre> }
			</td>
			<Aksi berkas={ b } />
		</tr>
	) : <tr><td colSpan="9">Tidak Ada Berkas</td></tr>
	
	return(
		<div className="card-body">
			{ localStorage.getItem('token') && berkases.length ?
				<div className="pull-right mb-2">
					<button className={`btn btn-${ isComplete ? 'danger' : 'primary' } mr-2`} onClick={ setComplete.bind(this, lokasi, !isComplete, setIsComplete) }>
						{ isComplete ? 'Tandai Belum Selesai' : 'Tandai Selesai' }
					</button>
						<button className="btn btn-danger" onClick={ deleteLokasi.bind(this, lokasi) }>Hapus</button>
				</div>
			: '' }
			<div className="table-responsive">
				<table className="table table-striped table-bordered table-hover">
					<thead>
						<tr>
							<th className="text-center align-middle no">No</th>
							<th className="text-center align-middle" style={{ minWidth: "200px" }}>Jenis Berkas</th>
							<th className="text-center align-middle" style={{ minWidth: "145px" }}>NPWP / Nama</th>
							<th className="text-center align-middle" style={{ minWidth: "65px" }}>Masa / Tahun</th>
							<th className="text-center align-middle" style={{ minWidth: "150px" }}>Penerima / Tanggal</th>
							<th className="text-center align-middle" style={{ minWidth: "125px" }}>Pemindahbukuan</th>
							<th className="text-center align-middle" style={{ minWidth: "25px" }}>Urutan</th>
							<th className="text-center align-middle">Keterangan</th>
							<th className="text-center align-middle" style={{ minWidth: "150px" }}>Aksi</th>
						</tr>
					</thead>
					<tbody>
						{ berkas }
					</tbody>
				</table>
			</div>
		</div>
	)
}

export const ListBerkasPenerima = ({ berkases }) => {
	// List Berkas
	const berkas = berkases.length ? berkases.map((b, i) =>
		<tr key={ i }>
			<td className="align-middle text-center">{ i+1 }</td>
			<td className="align-middle">{ b.ket_berkas.nama_berkas }</td>
			<td className="align-middle text-center">{`Gudang ${b.lokasi.gudang} | ${b.lokasi.kd_lokasi} | ${b.urutan}`}</td>
			<td className="align-middle">
				{ b.ket_lain && <pre>{ String.raw`${ b.ket_lain }` }</pre> }
			</td>
			<Aksi berkas={ b } />
		</tr>
	) : <tr><td colSpan="5">Tidak Ada Berkas</td></tr>

	return(
		<Fragment>
			<hr />
			<div className="card-body">
				<input
					id="edit" 
					type="file" 
					accept="application/pdf"
					hidden
				/>
				<div className="table-responsive">
					<table className="table table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th className="align-middle text-center">No</th>
								<th className="align-middle text-center" style={{ minWidth: "200px" }}>Jenis Berkas</th>
								<th className="align-middle text-center" style={{ minWidth: "100px" }}>Lokasi</th>
								<th className="align-middle text-center">Keterangan</th>
								<th className="align-middle text-center" style={{ minWidth: "100px" }}>Aksi</th>
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