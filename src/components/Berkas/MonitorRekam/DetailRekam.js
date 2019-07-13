import React from 'react'

const DetailRekam = ({ berkases }) => {
	const urutan = [], duplicate_urutan = []
	for(let b of berkases){
		if(!urutan.includes(b.urutan)) urutan.push(b.urutan)
		else duplicate_urutan.push(b.urutan)
	}
	
	const listBerkas = berkases.length ? berkases.sort((a, b) => a.urutan - b.urutan).map((b, i) => {
		const isDuplicate = duplicate_urutan.includes(b.urutan) ? 'table-danger' : ''
		const isJumped = () => {
			if(!berkases[i-1]) return ''
			if(!(b.urutan - berkases[i-1].urutan).toString().match(/1|0/)) return 'table-danger'
		}
		const title = isDuplicate ? 'Duplikat Urutan' : isJumped() ? 'Terdapat Urutan Yang Hilang Sebelum Ini' : ''
		return(
			<tr key={ b._id } className={`${ isDuplicate } ${ isJumped() }`} title={ title }>
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
			</tr>
		)
	}) : <tr><td colSpan="8">Tidak Ada Berkas</td></tr>
	
	return(<>
		<hr/>
		<div className="card-body">
			<div className="table-responsive">
				<table id="tbl-lokasi" className="table table-striped table-bordered table-hover">
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
						</tr>
					</thead>
					<tbody>
						{ listBerkas }
					</tbody>
				</table>
			</div>
		</div>
	</>)
}
export default DetailRekam