import React, { Component } from 'react'
import InputMask from 'react-input-mask'

import { fetchDataGQL } from '../../../helpers'

export default class ModalEditPenerima extends Component {
	state = {
		formData: {},
		isError: false,
		errMsg: ''
	}

	closeModal = e => {
		const modalEdit = document.getElementById('modalEditPenerima')
		modalEdit.classList.remove('show')
		setTimeout(() => {
			modalEdit.style.display = 'none'
		}, 150);
		this.setState({ formData: this.state.backupForm })
	}

	changeHandler = e => {
		const el = e.target
		const name = el.name
		const value = el.value.toUpperCase()
		this.setState({formData: { ...this.state.formData, [name]: value }})
	}

	editSubmit = e => {
		e.preventDefault()
		const formData = this.state.formData
		const body = {query: `
			mutation {
				berkas: editBerkas(id: "${formData.id}", update: {
					gudang: ${formData.gudang},
					kd_lokasi: "${formData.kd_lokasi}"
					kd_berkas: "${formData.kd_berkas}"
					nama_penerima: "${formData.nama_penerima}"
					tgl_terima: "${formData.tgl_terima}"
					urutan: ${formData.urutan}
					${formData.ket_lain ? `ket_lain: "${formData.ket_lain}"` : ``}
				}) {
					lokasi {
						_id
					}
				}
			}
		`}
		fetchDataGQL(body)
			.then(res => res.json())
			.then(({data}) => {
				this.closeModal()
				this.props.lihatBerkas(this.state.penerimaId)
			})
			.catch(err => { throw err })
	}

	componentWillReceiveProps(nextProps){
		if(this.props.berkas !== nextProps.berkas){
			const formData = {
				id: nextProps.berkas._id,
				kd_berkas: nextProps.berkas.ket_berkas.kd_berkas,
				nama_penerima: nextProps.berkas.penerima.nama_penerima,
				tgl_terima: nextProps.berkas.penerima.tgl_terima,
				gudang: nextProps.berkas.lokasi.gudang,
				kd_lokasi: nextProps.berkas.lokasi.kd_lokasi,
				urutan: nextProps.berkas.urutan,
				ket_lain: nextProps.berkas.ket_lain
			}
			this.setState({ 
				formData, 
				backupForm: formData, 
				penerimaId: nextProps.berkas.penerima._id 
			})
		}
	}

	render(){
		const options = this.props.ket_berkas.filter(kb => !kb.kd_berkas.match(/^(induk|pindah|pkp|sertel)$/i))
			.map(opt => {
				return <option value={ opt.kd_berkas } key={ opt._id }>{ opt.nama_berkas }</option>
			})

		return(
			<div className="modal fade" id="modalEditPenerima" tabIndex="-1" role="dialog">
				<div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: "50vw" }}>
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Konfirmasi Perubahan</h5>
							<button className="close" onClick={ this.closeModal }>
								<span>&times;</span>
							</button>
						</div>
						<form onSubmit={ this.editSubmit }>
							<div className="modal-body">
								<div className="row">
									<div className="form-group col-md-7">
										<label>Gudang</label>
										<div className="input-group">
											<select
												name="gudang" 
												className="form-control"
												value={ this.state.formData.gudang ? this.state.formData.gudang : 1 }
												onChange={ this.changeHandler }
												required
											>
												<option value="1">Gudang 1</option>
												<option value="2">Gudang 2</option>
											</select>
										</div>
									</div>
									<div className="form-group col-md-5">
										<label>Lokasi</label>
										<div className="input-group">
											<input 
												type="text" 
												name="kd_lokasi" 
												className="form-control" 
												placeholder="A6012"
												required
												onChange={ this.changeHandler }
												pattern="\w{1,2}\d{4}"
												value={ this.state.formData.kd_lokasi ? this.state.formData.kd_lokasi : '' }
											/>
										</div>
									</div>
									<div className="form-group col-md-10">
										<label>Jenis Berkas</label>
										<div className="input-group">
											<select
												name="kd_berkas" 
												className="form-control"
												required
												value={ this.state.formData.kd_berkas ? this.state.formData.kd_berkas : '' }
												onChange={ this.changeHandler }
											>
												<option value="" hidden>Pilih Jenis Berkas</option>
												{ options }
											</select>
										</div>
									</div>
									<div className="form-group col-md-2">
										<label>Urutan</label>
										<div className="input-group">
											<input 
												type="number"
												name="urutan"
												className="form-control"
												placeholder="1"
												min="1"
												step="any"
												value={ this.state.formData.urutan ? this.state.formData.urutan : '' }
												onChange={ this.changeHandler }
												required
											/>
										</div>
									</div>
									<div className="form-group col-md-7">
										<label>Nama Penerima</label>
										<div className="input-group">
											<input 
												type="text" 
												name="nama_penerima" 
												className="form-control"
												required
												defaultValue={ this.state.formData.nama_penerima }
												onChange={ this.changeHandler }
												value={ this.state.formData.nama_penerima ? this.state.formData.nama_penerima : '' }
												disabled={ this.state.disablePenerima }
											/>
										</div>
									</div>
									<div className="form-group col-md-5">
										<label>Tanggal Terima</label>
										<div className="input-group">
											<InputMask 
												mask="99/99/9999" 
												placeholder="dd/mm/yyyy" 
												name="tgl_terima" 
												className="form-control"
												required
												pattern="[0-3]\d.[0-1]\d.20[0-1]\d"
												defaultValue={ this.state.formData.tgl_terima }
												value={ this.state.formData.tgl_terima ? this.state.formData.tgl_terima : '' }
												onChange={ this.changeHandler }
												disabled={ this.state.disablePenerima }
											/>
										</div>
									</div>
									<div className="form-group col-md-12">
										<label>Keterangan</label>
										<div className="input-group">
											<textarea 
												name="ket_lain" 
												rows="2" 
												className="form-control"
												defaultValue={ this.state.formData.ket_lain }
												value={ this.state.formData.ket_lain ? this.state.formData.ket_lain : '' }
												onChange={ this.changeHandler }
											></textarea>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" onClick={ this.closeModal }>Batal</button>
								<button type="submit" className="btn btn-primary">Simpan</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	}
}