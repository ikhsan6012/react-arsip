import React, { Fragment, useState, useEffect } from 'react'
import BerkasItem from './ListBerkas'
import { PG } from '../../Pagination'
import { pageHandler, getBerkas } from '../../../functions/cari'

const HasilWP = props => {
	const [wps, setWPs] = useState([])
	const [berkases, setBerkases] = useState(null)

	useEffect(() => {
		setWPs(props.wps)
	}, [props.wps])

	// List WPs
	const listWPs = wps.length ? wps.map((wp, i) =>
		<tr key={ i }>
			<td className="text-center align-middle">{ i+1 }</td>
			<td className="align-middle">{ wp.npwp }</td>
			<td className="align-middle">{ wp.nama_wp }</td>
			<td className="text-center align-middle">
				<button data-id={ wp._id } className="btn btn-primary" onClick={ getBerkas.bind(this, { setBerkases, wps, setWPs }) }>Lihat Berkas</button>
			</td>
		</tr>
	) : (
		<tr>
			<td colSpan="4">Wajib Pajak Tidak Ditemukan</td>
		</tr>
	)

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
								<th className="text-center align-middle">No</th>
								<th className="text-center align-middle">NPWP</th>
								<th className="text-center">Nama</th>
								<th className="text-center">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{ listWPs }
						</tbody>
					</table>
				</div>
			</div>
			{ berkases && <BerkasItem berkases={ berkases }/> }
		</Fragment>
	)
}
export default HasilWP