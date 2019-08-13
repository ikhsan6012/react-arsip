import React, { useState, useEffect } from 'react'
import InputMask from 'react-input-mask'
import { fetchDataGQL, setToken, handleErrors } from '../../functions/helpers'

const TanggalND = () => {
	const [transaksis, setTransaksis] = useState([])

	const getDataTransaksi = async () => {
		const body = {query: `{
			transaksis(populate: true) {
				_id
				seksi {
					_id
					kode
					nama_seksi
				}
				berkas {
					_id
					ket_berkas {
						_id
						kd_berkas
						nama_berkas
					}
					pemilik {
						_id
						npwp
						nama_wp
					}
					masa_pajak
					tahun_pajak
					pembetulan
					penerima {
						_id
						nama_penerima
						tgl_terima
					}
					status_pbk
					nomor_pbk
					tahun_pbk
					urutan
					lokasi {
						_id
						gudang
						kd_lokasi
					}
					file
					ket_lain
				}
				tgl_nd_diterima
				no_nd_pinjam
				tahun_nd_pinjam
				tgl_nd_pinjam
				no_nd_kirim
				tahun_nd_kirim
				tgl_nd_kirim
				no_nd_kembali
				tahun_nd_kembali
				tgl_nd_kembali
				keterangan
			}
		}`}
		const { data, extensions, errors } = await fetchDataGQL(body)
		setToken(extensions)
		if(errors) return handleErrors(errors)
		setTransaksis(data.transaksis)
	}

	useEffect(() => {
		getDataTransaksi()
	}, [])

	const timestampToLocalDate = timestamp => {
		return new Date(parseInt(timestamp)).toLocaleDateString('id')
	}

	const handleSubmit = async e => {
		e.preventDefault()
		const [_id,no_nd_kembali,tahun_nd_kembali,tgl_nd_kembali] = [...e.target.querySelectorAll('input')].map(d => d.value)
		try {
			const body = {query: `mutation {
				editTransaksi(_id: "${ _id }", input: {
					no_nd_kembali: ${ no_nd_kembali }
					tahun_nd_kembali: ${ tahun_nd_kembali }
					tgl_nd_kembali: "${ tgl_nd_kembali }"
				}){
					_id
				}
			}`}
			const { extensions, errors } = await fetchDataGQL(body)
			setToken(extensions)
			if(errors) return handleErrors()
			getDataTransaksi()
		} catch (err) {
			throw err	
		}
	}

	const list = transaksis.length ? transaksis.map((t,i) => {
		const tgl_jt = new Date(new Date(parseInt(t.tgl_nd_kirim)).getTime() + (86400000 * 30))
		const sisa_hari = !t.tgl_nd_kembali ? parseFloat((tgl_jt - new Date(parseInt(t.tgl_nd_kirim)).getTime()) / 86400000) : ''
		return(
			<tr 
				key={ i } 
				id={ t._id } 
				className={`table-${ sisa_hari === '' ? 'primary' : sisa_hari < 0 ? 'danger' : sisa_hari <= 5 ? 'warning' : '' }`}
			>
				<td className="align-middle text-center">{ i+1 }</td>
				<td className="align-middle text-center">
					{`ND-${ t.no_nd_pinjam }/WPJ.05/KP.02${ t.seksi.kode }/${ t.tahun_nd_pinjam }`}
				</td>
				<td className="align-middle text-center">{ timestampToLocalDate(t.tgl_nd_pinjam) }</td>
				<td className="align-middle">{ t.seksi.nama_seksi }</td>
				<td className="align-middle">
					<ol style={{ paddingLeft: '15px', marginBottom: '0' }}>{ t.berkas.map((b, i) =>
						<li key={ b._id } style={ i !== t.berkas.length - 1 ? { paddingBottom: '10px' } : {} }>
							{ b.ket_berkas.nama_berkas }<br/>
							{ b.pemilik ? b.pemilik.npwp : b.penerima.nama_penerima } / { b.pemilik ? b.pemilik.nama_wp : b.penerima.tgl_terima }
						</li>) 
					}</ol>
				</td>
				<td className="align-middle text-center">{ t.keterangan }</td>
				<td className="align-middle text-center">
					{`ND-${ t.no_nd_kirim }/WPJ.05/KP.0203/${ t.tahun_nd_kirim }`}
				</td>
				<td className="align-middle text-center">{ t.tgl_nd_kirim ? timestampToLocalDate(t.tgl_nd_kirim) : '' }</td>
				<td className="align-middle text-center">{ tgl_jt.toLocaleDateString('id') }</td>
				<td className="align-middle text-center">{ sisa_hari }</td>
				{ t.no_nd_kembali ? <>
					<td className="align-middle text-center">{ `ND-${ t.no_nd_kembali }/WPJ.05/KP.0203/${ t.tahun_nd_kembali }` }</td>
					<td className="align-middle text-center">{ timestampToLocalDate(t.tgl_nd_kembali) }</td>
				</> : <>
					<td colSpan="2" style={{ verticalAlign: 'inherit' }}>
						<form onSubmit={ handleSubmit }>
							<div className="form-row">
								<div className="col-md-3">
									<input type="hidden" value={ t._id } />
									<input
										type="number" 
										className="form-control" 
										placeholder="No." 
										required
									/>
								</div>
								<div className="col-md-4">
									<input 
										type="number" 
										className="form-control" 
										placeholder="Tahun" 
										max={ new Date().getFullYear() }
										min={ new Date().getFullYear() - 10}
										required
									/>
								</div>
								<div className="col-md-5">
									<InputMask 
										mask="99/99/9999" 
										placeholder="dd/mm/yyyy" 
										className="form-control"
										pattern="[0-3]\d.[0-1]\d.20[0-1]\d"
										required
									/>
								</div>
							</div>
							<button type="submit" hidden></button>
						</form>
					</td>
				</> }
			</tr>
		)
	}) : <tr><td colSpan="11">Tidak Ada Data...</td></tr>
	
	return(
		<div className="table-responsive">
			<table className="table table-striped table-bordered table-hover">
				<thead>
					<tr>
						<th className="align-middle text-center no">No</th>
						<th className="align-middle text-center" style={{ minWidth: '185px' }}>No. ND<br/>Pinjam</th>
						<th className="align-middle text-center" style={{ minWidth: '95px' }}>Tanggal ND<br/>Pinjam</th>
						<th className="align-middle text-center" style={{ minWidth: '150px' }}>Nama Seksi Peminjam</th>
						<th className="align-middle text-center" style={{ minWidth: '175px' }}>Berkas<br/>Dipinjam</th>
						<th className="align-middle text-center" style={{ minWidth: '100px' }}>Keterangan</th>
						<th className="align-middle text-center" style={{ minWidth: '185px' }}>No. ND<br/>Kirim</th>
						<th className="align-middle text-center" style={{ minWidth: '95px' }}>Tanggal ND<br/>Kirim</th>
						<th className="align-middle text-center" style={{ minWidth: '105px' }}>Tanggal<br/>Jatuh Tempo</th>
						<th className="align-middle text-center">Sisa Hari</th>
						<th className="align-middle text-center" style={{ minWidth: '200px' }}>No. ND<br/>Kembali</th>
						<th className="align-middle text-center" style={{ minWidth: '100px' }}>Tanggal ND<br/>Kembali</th>
					</tr>
				</thead>
				<tbody>
					{ list }
				</tbody>
			</table>
		</div>
	)
}
export default TanggalND