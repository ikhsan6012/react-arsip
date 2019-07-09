import React, { Fragment, useState, useEffect } from 'react'
import { ListBerkasWP, ListBerkasPenerima } from './ListBerkas'
import { PG } from '../../Pagination'
import { pageHandler, getBerkas } from '../../../functions/cari'

export const HasilWP = props => {
	const [wps, setWPs] = useState([])
	const [berkases, setBerkases] = useState(null)

	useEffect(() => {
		setWPs(props.wps)
	}, [props.wps])

	// List WPs
	const listWPs = wps.length ? wps.map((wp, i) =>
		<tr key={ i }>
			<td className="text-center align-middle">{ i+1 }</td>
			<td className="text-center align-middle">{ wp.npwp }</td>
			<td className="align-middle">{ wp.nama_wp }</td>
			<td className="text-center align-middle">
				<button data-id={ wp._id } className="btn btn-primary" onClick={ getBerkas.bind(this, { setBerkases, wps, setWPs }) }>Lihat Berkas</button>
			</td>
		</tr>
	) : <tr><td colSpan="4">Wajib Pajak Tidak Ditemukan</td></tr>

	return(
		<Fragment>
			<div className="card-body">
				<PG
					activePage={ parseInt(document.querySelector('#formSearch').dataset.page) }
					totalItemsCount={ props.total }
					hidden={ props.total <= 5 }
					onChange={ pageHandler }
				/>
				<div className="table-responsive">
					<table className="table table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th className="text-center align-middle no">No</th>
								<th className="text-center align-middle" style={{ width: '300px' }}>NPWP</th>
								<th className="text-center align-middle">Nama</th>
								<th className="text-center align-middle" width="100px">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{ listWPs }
						</tbody>
					</table>
				</div>
			</div>
			{ berkases && <ListBerkasWP berkases={ berkases }/> }
		</Fragment>
	)
}

export const HasilPenerima = props => {
	const [penerimas, setPenerimas] = useState([])
	const [berkases, setBerkases] = useState(null)

	useEffect(() => {
		setPenerimas(props.penerimas)
	}, [props.penerimas])
	
	// List Penerima
	const penerima = penerimas.length ? penerimas.map((p, i) =>
		<tr key={ p._id } id={ p._id }>
			<td className="align-middle text-center">{ i+1 }</td>
			<td className="align-middle">{ p.nama_penerima }</td>
			<td className="align-middle text-center">{ p.tgl_terima }</td>
			<td className="align-middle text-center">
				<button data-id={ p._id } className="btn btn-primary" onClick={ getBerkas.bind(this, { setBerkases, penerimas, setPenerimas }) }>Lihat Berkas</button>
			</td>
		</tr>
	) : <tr><td colSpan="4">Penerima Tidak Ditemukan</td></tr>

	return(
		<Fragment>
			<div className="card-body">
				<PG
					activePage={ parseInt(document.querySelector('#formSearch').dataset.page) }
					totalItemsCount={ props.total }
					hidden={ props.total <= 5 }
					onChange={ pageHandler }
				/>
				<div className="table-responsive">
					<table className="table table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th className="align-middle text-center no">No</th>
								<th className="align-middle text-center">Nama Penerima</th>
								<th className="align-middle text-center">Tgl Terima</th>
								<th className="align-middle text-center" width="100px">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{ penerima }
						</tbody>
					</table>
				</div>
			</div>
			{ berkases && <ListBerkasPenerima berkases={ berkases }/> }
		</Fragment>
	)
}