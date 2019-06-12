import React, { Component } from 'react'
import Pagination from 'react-js-pagination'

import Aksi from './Aksi'
import ModalEdit from './ModalEdit'

import { fetchDataGQL2, handleErrors, setToken } from '../../../helpers'

export default class HasilWP extends Component {
	state = {
		berkas: [],
		wps: [],
		isHiddenBerkas: true,
		berkasModal: {},
		activePage: 1,
		begin: 0,
		end: 5,
	}

	wpsPageHandler = page => {
		this.setState({
			activePage: page,
			begin: page * 5 - 5,
			end: page * 5
		})
	}

	editBerkas = e => {
		const id = e.target.getAttribute('value')
		const modalEdit = document.getElementById('modalEdit')
		modalEdit.style.display = 'block'
		if(modalEdit.style.display === 'block'){
			document.addEventListener('keyup', e => {
				if(e.keyCode === 27){
					document.querySelector('.close').click()
				} 
			})
		}
		setTimeout(() => {
			modalEdit.classList.add('show')
			this.setState({ berkasModal: this.state.berkas.find(b => b._id === id) })
		}, 150);
	}

	lihatBerkas = e => {
		let id = e.target ? e.target.value : e
		const body = {query: `{
			berkas: berkases(by: pemilik, id: "${id}"){
				_id
				ket_berkas {
					kd_berkas
					nama_berkas
				}
				pemilik {
					_id
					npwp
					nama_wp
				}
				penerima {
					_id
					nama_penerima
					tgl_terima
				}
				masa_pajak
				tahun_pajak
				status_pbk
				nomor_pbk
				tahun_pbk
				lokasi {
					gudang
					kd_lokasi
				}
				urutan
				file
				ket_lain
			}
		}`}
		return fetchDataGQL2(body)
			.then(({data, errors, extensions}) => {
				setToken(extensions)
				if(errors) return handleErrors(errors)
				this.props.setId(id)
				this.setState({ 
					berkas: data.berkas,
					wps: this.state.wps.filter(wp => wp._id === id),
					isHiddenBerkas: false,
					isHiddenPagination: true
				})
			})
			.catch(err => { throw err })
	}

	componentDidMount(){
		this.setState({
			wps: this.props.wps,
			isHiddenPagination: this.props.wps.length <= 5 ? true : false
		})
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.wps !== this.state.wps){
			this.setState({
				isHiddenBerkas: true,
				wps: nextProps.wps,
				isHiddenPagination: nextProps.wps.length <= 5 ? true : false
			})
		}
	}
	
	render() {
		let noWP = 1 * this.state.begin + 1
		const wp = this.state.wps.length > 0 ? this.state.wps.slice(this.state.begin, this.state.end).map(li => (
			<tr key={li._id}>
				<td className="text-center align-middle">{noWP++}</td>
				<td className="align-middle">{li.npwp}</td>
				<td className="align-middle">{li.nama_wp}</td>
				<td className="text-center align-middle"><button onClick={ this.lihatBerkas } value={li._id} className="btn btn-primary">Lihat Berkas</button></td>
			</tr>
		)) : (
			<tr>
				<td colSpan="4">Wajib Pajak Tidak Ditemukan</td>
			</tr>
		)

		let noBerkas = 1
		const berkas = this.state.berkas.length ? this.state.berkas.map(b => (
			<tr key={ b._id }>
				<td className="text-center align-middle">{ noBerkas++ }</td>
				<td className="align-middle">{ b.ket_berkas.nama_berkas }</td>
				<td className="text-center align-middle">{ b.masa_pajak }</td>
				<td className="text-center align-middle">{ b.tahun_pajak }</td>
				<td className="text-center align-middle">{ b.status_pbk ? `${ b.status_pbk } | No. ${ b.nomor_pbk } | ${ b.tahun_pbk }` : '' }</td>
				<td className="text-center align-middle">{`Gudang ${b.lokasi.gudang} | ${b.lokasi.kd_lokasi} | ${b.urutan}`}</td>
				<td className="align-middle">{ b.ket_lain }</td>
				<Aksi
					berkas={ b }
					getDocument={ this.props.getDocument }
					addDocument={ this.props.addDocument }
					editBerkas={ this.editBerkas }
					deleteBerkas={ this.props.deleteBerkas }
					editDocument={ this.props.editDocument }
					deleteDocument={ this.props.deleteDocument }
				/>
			</tr>
		)) : (
			<tr>
				<td colSpan="8">Tidak Ada Berkas</td>
			</tr>
		)

		return (
			<React.Fragment>
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-striped table-bordered table-hover">
							<thead>
								<tr>
									<th width="10px" className="text-center align-middle">No</th>
									<th width="200px" className="text-center align-middle">NPWP</th>
									<th className="text-center">Nama</th>
									<th width="100px" className="text-center">Aksi</th>
								</tr>
							</thead>
							<tbody>
								{ wp }
							</tbody>
						</table>
					</div>
					<div className="pull-right" hidden={ this.state.isHiddenPagination }>
						<Pagination 
							activePage={ this.state.activePage }
							itemsCountPerPage={5}
							totalItemsCount={ this.state.wps.length }
							pageRangeDisplayed={5}
							itemClass="page-item"
							linkClass="page-link"
							onChange={ this.wpsPageHandler }
						/>
					</div>
				</div>
				<hr hidden={ this.state.isHiddenBerkas }/>
				<div className="card-body" hidden={ this.state.isHiddenBerkas }>
					<div className="table-responsive">
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
									{ localStorage.getItem('token') &&
										<th className="align-middle text-center" width="150px">Aksi</th>
									}
								</tr>
							</thead>
							<tbody>
								{ berkas }
							</tbody>
						</table>
					</div>
				</div>
				<ModalEdit
					ket_berkas={ this.props.ket_berkas }
					berkas={ this.state.berkasModal }
					lihatBerkas={ this.lihatBerkas }
				/>
			</React.Fragment>
		)
	}
}