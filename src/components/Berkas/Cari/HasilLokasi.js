import React, { Component } from 'react'

import ModalEditLokasi from './ModalEditLokasi'

export default class HasilLokasi extends Component {
	state = {
		berkasModal: {}
	}

	editBerkas = e => {
		const id = e.target.getAttribute('value')
		const modalEdit = document.getElementById('modalEditLokasi')
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
			this.setState({ berkasModal: this.props.berkas.find(b => b._id === id) })
		}, 150);
	}

	render(){
		let noBerkas = 1
		const berkas = this.props.berkas.length ? this.props.berkas.map(b => (
			<tr key={ b._id }>
				<td className="text-center">{ noBerkas++ }</td>
				<td>{ b.ket_berkas.nama_berkas }</td>
				<td>{ b.pemilik ? <React.Fragment>{b.pemilik.npwp} /<br/>{b.pemilik.nama_wp}</React.Fragment> : '' }</td>
				<td className="text-center">{ b.tahun_pajak ? `${b.masa_pajak}/${b.tahun_pajak}` : '' }</td>
				<td>{ b.penerima ? <React.Fragment>{b.penerima.nama_penerima}<br/>{b.penerima.tgl_terima}</React.Fragment> : '' }</td>
				<td className="text-center">{ b.urutan }</td>
				<td>{ b.ket_lain }</td>
				{ localStorage.getItem('token')
					? <td className="text-center">
							{
								b.ket_berkas.kd_berkas === 'INDUK' 
									? b.file
										? <i style={{cursor: 'pointer'}} onClick={ this.getDocument } value={ b.file } className="fa fa-download text-primary mr-2"></i>
										: <i style={{cursor: 'not-allowed'}} className="fa fa-download text-secondary mr-2"></i>
									: null
							}
							<i style={{cursor: 'pointer'}} value={ b._id } onClick={ this.editBerkas } className="fa fa-pencil text-warning mr-2"></i>
							<i style={{cursor: 'pointer'}} value={ b._id } className="fa fa-exchange text-info mr-2"></i>
							<i style={{cursor: 'pointer'}} value={ b._id } onClick={ this.props.deleteBerkas } className="fa fa-trash text-danger"></i>
						</td>
					: null
				}
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
									<th className="text-center align-middle">No</th>
									<th className="text-center align-middle" width="150px">Jenis Berkas</th>
									<th className="text-center align-middle" width="200px">NPWP / Nama</th>
									<th className="text-center align-middle" width="75px">Masa / Tahun</th>
									<th className="text-center align-middle">Penerima / Tanggal</th>
									<th className="text-center align-middle" width="77px">Urutan</th>
									<th className="text-center align-middle">Keterangan</th>
									{ localStorage.getItem('token')
										? <th className="text-center align-middle" width="125px">Aksi</th>
										: null
									}
								</tr>
							</thead>
							<tbody>
								{ berkas }
							</tbody>
						</table>
					</div>
				</div>
				<ModalEditLokasi
					ket_berkas={ this.props.ket_berkas }
					berkas={ this.state.berkasModal }
				/>
			</React.Fragment>
		)
	}
}