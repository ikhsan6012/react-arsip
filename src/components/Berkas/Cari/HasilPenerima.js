import React, { Component } from 'react'
import Pagination from 'react-js-pagination'

import Aksi from './Aksi'
import ModalEdit from './ModalEdit'

import { fetchDataGQL, handleErrors, setToken } from '../../../helpers'

export default class HasilPenerima extends Component {
	state = {
		berkasModal: {},
		penerima: [],
		isHiddenBerkas: true,
		berkas: [],
		activePage: 1,
		begin: 0,
		end: 5,
	}

	penerimaPageHandler = page => {
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
			berkas: berkases(by: penerima, id: "${id}") {
				_id
				ket_berkas{
					kd_berkas
					nama_berkas
				}
				penerima {
					_id
					nama_penerima
					tgl_terima
				}
				lokasi{
					gudang
					kd_lokasi
				}
				urutan
				file
				ket_lain
			}
		}`}
		fetchDataGQL(body)
			.then(({data, errors, extensions}) => {
				setToken(extensions)
				if(errors) return handleErrors(errors)
				this.props.setId(id)
				this.setState({
					berkas: data.berkas,
					penerima: this.state.penerima.filter(p => p._id === id),
					isHiddenBerkas: false,
					isHiddenPagination: true
				})
			})
			.catch(err => { throw err })
	}

	componentDidMount(){
		this.setState({ 
			penerima: this.props.penerima,
			isHiddenPagination: this.props.penerima.length <= 5 ? true : false
		})
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.penerima !== this.state.penerima){
			this.setState({
				isHiddenBerkas: true,
				penerima: nextProps.penerima,
				isHiddenPagination: nextProps.penerima.length <= 5 ? true : false
			})
		}
	}

	render(){
		let noPenerima = 1 * this.state.begin + 1
		const penerima = this.state.penerima.length ? this.state.penerima.slice(this.state.begin, this.state.end).map(p => (
			<tr key={ p._id } id={ p._id }>
				<td className="text-center">{ noPenerima++ }</td>
				<td>{ p.nama_penerima}</td>
				<td className="text-center">{ p.tgl_terima}</td>
				<td className="text-center">
					<button onClick={ this.lihatBerkas } className="btn btn-primary" value={ p._id }>Lihat Berkas</button>
				</td>
			</tr>
		)) : (
			<tr>
				<td colSpan="8">Penerima Tidak Ditemukan</td>
			</tr>
		)
		
		let noBerkas = 1
		const berkas = this.state.berkas.length ? this.state.berkas.map(b => (
			<tr key={ b._id }>
				<td className="text-center align-middle">{ noBerkas++ }</td>
				<td className="align-middle">{ b.ket_berkas.nama_berkas }</td>
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

		return(
			<React.Fragment>
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-striped table-bordered table-hover">
							<thead>
								<tr>
									<th className="text-center align-middle" width="50px">No</th>
									<th className="text-center align-middle">Nama Penerima</th>
									<th className="text-center align-middle">Tgl Terima</th>
									<th className="text-center align-middle" width="100px">Aksi</th>
								</tr>
							</thead>
							<tbody>
								{ penerima }
							</tbody>
						</table>
					</div>
					<div className="pull-right" hidden={ this.state.isHiddenPagination }>
						<Pagination 
							activePage={ this.state.activePage }
							itemsCountPerPage={5}
							totalItemsCount={ this.state.penerima.length }
							pageRangeDisplayed={5}
							itemClass="page-item"
							linkClass="page-link"
							onChange={ this.penerimaPageHandler }
						/>
					</div>
				</div>
				<hr hidden={ this.state.isHiddenBerkas }/>
				<div className="card-body" hidden={ this.state.isHiddenBerkas }>
					<div className="table-responsive">
						<table className="table table-striped table-bordered table-hover">
							<thead>
								<tr>
									<th className="text-center align-middle" width="50px">No</th>
									<th className="text-center align-middle">Jenis Berkas</th>
									<th className="text-center align-middle" width="200px">Lokasi</th>
									<th className="text-center align-middle">Keterangan</th>
									{ localStorage.getItem('token') &&
										<th className="text-center align-middle" width="150px">Aksi</th>
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