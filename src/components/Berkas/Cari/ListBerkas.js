import React, { Fragment, useState } from 'react'
import Aksi from './Aksi'
import { setComplete, deleteLokasi } from '../../../functions/cari'

export const ListBerkasWP = ({ berkases }) => {
	// List Berkas
	const berkas = berkases.length ? berkases.map((b, i) =>
		<tr key={ i }>
			<td className="text-center align-middle">{ i+1 }</td>
			<td className="align-middle">{ b.ket_berkas.nama_berkas }</td>
			<td className="text-center align-middle">
				{ b.tahun_pajak ? `${ b.masa_pajak }/${ b.tahun_pajak }` : '' }
				{ b.pembetulan ? <><br/>{ b.pembetulan }</> : '' }
			</td>
			<td className="text-center align-middle">{ b.status_pbk ? <>
				{ b.status_pbk }<br/>
				No. { b.nomor_pbk } | { b.tahun_pbk }
			</> : '' }</td>
			{ localStorage.getItem('token') ? 
				<td className="text-center align-middle"><>
					Gudang { b.lokasi.gudang } | { b.lokasi.kd_lokasi }<br/>
					{ b.urutan }
				</></td>
			: '' }
			<td className="align-middle">{ b.ket_lain &&<pre>
				{ String.raw`${ b.ket_lain }` }
			</pre> }</td>
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
								<th className="align-middle text-center" style={{ minWidth: "150px" }}>Jenis Berkas</th>
								<th className="align-middle text-center" style={{ minWidth: "100px" }}>Masa / Tahun<br/>Pembetulan</th>
								<th className="align-middle text-center" style={{ minWidth: "125px" }}>Pemindahbukuan</th>
								{ localStorage.getItem('token') ?
									<th className="align-middle text-center" style={{ minWidth: "140px" }}>Gudang | Lokasi<br/>Urutan</th>
								: ''}
								<th className="align-middle text-center">Keterangan</th>
								<th className="align-middle text-center" style={{ minWidth: "150px" }}>Aksi</th>
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
			<td className="align-middle">{ b.pemilik && <>
				{ b.pemilik.nama_wp }<br/>
				{ b.pemilik.npwp }
			</> }</td>
			<td className="text-center align-middle">
				{ b.tahun_pajak ? `${ b.masa_pajak }/${ b.tahun_pajak }` : '' }
				{ b.pembetulan ? <><br/>{ b.pembetulan }</> : '' }
			</td>
			<td className="align-middle">{ b.penerima && <>
				{ b.penerima.nama_penerima }<br/>
				{ b.penerima.tgl_terima }
			</> }</td>
			<td className="text-center align-middle">{ b.status_pbk ? <>
				{ b.status_pbk }<br/>
				No. { b.nomor_pbk } | { b.tahun_pbk }
			</> : '' }</td>
			<td className="align-middle text-center">{ b.urutan }</td>
			<td className="align-middle">{ b.ket_lain &&<pre>
				{ String.raw`${ b.ket_lain }` }
			</pre> }</td>
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
							<th className="text-center align-middle" style={{ minWidth: "150px" }}>Jenis Berkas</th>
							<th className="text-center align-middle" style={{ minWidth: "142px" }}>Nama Wajib Pajak<br/>NPWP</th>
							<th className="text-center align-middle" style={{ minWidth: "100px" }}>Masa / Tahun<br/>Pembetulan</th>
							<th className="text-center align-middle" style={{ minWidth: "150px" }}>Nama Penerima<br/>Tanggal Terima</th>
							<th className="text-center align-middle" style={{ minWidth: "1px" }}>Pemindahbukuan</th>
							<th className="text-center align-middle" style={{ minWidth: "65px" }}>Urutan</th>
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
			{ localStorage.getItem('token') ?
				<td className="align-middle text-center">{`Gudang ${b.lokasi.gudang} | ${b.lokasi.kd_lokasi} | ${b.urutan}`}</td>
			: '' }
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
								<th className="align-middle text-center" style={{ minWidth: "150px" }}>Jenis Berkas</th>
								{ localStorage.getItem('token') ?
									<th className="align-middle text-center" style={{ minWidth: "140px" }}>Lokasi</th>
								: '' }
								<th className="align-middle text-center">Keterangan</th>
								<th className="align-middle text-center" style={{ minWidth: "150px" }}>Aksi</th>
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