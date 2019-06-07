import React, { Component } from 'react'

import Aksi from './Aksi'
import ModalEdit from './ModalEdit'

export default class HasilLokasi extends Component {
	state = {
		berkasModal: {}
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
			this.setState({ berkasModal: this.props.berkas.find(b => b._id === id) })
		}, 150);
	}

	render(){
		let noBerkas = 1
		const berkas = this.props.berkas.length ? this.props.berkas.sort((a, b) => a.urutan - b.urutan).map(b => (
			<tr key={ b._id }>
				<td className="text-center">{ noBerkas++ }</td>
				<td>{ b.ket_berkas.nama_berkas }</td>
				<td>{ b.pemilik ? <React.Fragment>{b.pemilik.npwp} /<br/>{b.pemilik.nama_wp}</React.Fragment> : '' }</td>
				<td className="text-center">{ b.tahun_pajak ? `${b.masa_pajak}/${b.tahun_pajak}` : '' }</td>
				<td>{ b.penerima ? <React.Fragment>{b.penerima.nama_penerima}<br/>{b.penerima.tgl_terima}</React.Fragment> : '' }</td>
				<td className="text-center">{ b.urutan }</td>
				<td>{ b.ket_lain }</td>
				<Aksi
					berkas={ b }
					getDocument={ this.getDocument }
					addDocument={ this.addDocument }
					editBerkas={ this.editBerkas }
					deleteBerkas={ this.props.deleteBerkas }
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
									<th className="text-center align-middle">No</th>
									<th className="text-center align-middle" width="150px">Jenis Berkas</th>
									<th className="text-center align-middle" width="200px">NPWP / Nama</th>
									<th className="text-center align-middle" width="75px">Masa / Tahun</th>
									<th className="text-center align-middle">Penerima / Tanggal</th>
									<th className="text-center align-middle" width="77px">Urutan</th>
									<th className="text-center align-middle">Keterangan</th>
									<th className="text-center align-middle" width="125px">Aksi</th>
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
				/>
			</React.Fragment>
		)
	}
}