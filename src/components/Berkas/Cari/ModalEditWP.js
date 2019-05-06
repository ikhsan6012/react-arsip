import React, { Component } from 'react'
import InputMask from 'react-input-mask'
import swal from 'sweetalert'

import { fetchDataGQL } from '../../../helpers'

export default class ModalEdit extends Component {
	state = {
		formData: {},
		isError: false,
		errMsg: '',
		disableNamaWP: true,
	}

	closeModal = e => {
		const modalEdit = document.getElementById('modalEditWP')
		modalEdit.classList.remove('show')
		setTimeout(() => {
			modalEdit.style.display = 'none'
		}, 150);
		this.setState({ formData: this.state.backupForm })
	}

	errorHandler = msg => {
		this.setState({
			isError: true,
			errMsg: msg,
			disableNamaWP: false,
			formData: { ...this.state.formData, nama_wp: '' }
		})
		console.error(msg)
	}

	changeHandler = async e => {
		const el = e.target
		const name = el.name
		const value = el.value.toUpperCase()
		await this.setState({formData: { ...this.state.formData, [name]: value }})
		if(name === 'npwp') return this.checkNPWP()
	}

	checkNPWP = () => {
		const npwp = this.state.formData.npwp
		if(npwp.replace(/[_.-]/g, '').length < 15) {
			return this.setState({disableNamaWP: false, formData: { ...this.state.formData, nama_wp: '' } })
		}
		if(npwp.replace(/[_.-]/g, '').length === 15){
			// Get Nama WP
			const body = {
				query: `{
					wp: getWPByNPWP(npwp: "${npwp}") {
						nama_wp
					}
				}`
			}
			fetchDataGQL(body)
				.then(res => res.json())
				.then(({data}) => {
					if(!data) return this.errorHandler('NPWP Tidak Ditemukan')
					this.setState({
						formData: { ...this.state.formData, nama_wp: data.wp.nama_wp },
						isError: false,
						disableNamaWP: true,
						errMsg: ''
					})
				})
				.catch(err => this.errorHandler(err.message))
		}
	}

	editSubmit = async e => {
		e.preventDefault()
		const formData = this.state.formData
		let isSend = true
		let status
		if(this.state.isError) {
			await swal(`${this.state.errMsg}. Pilih Status WP untuk menyimpan!`, {
				buttons: {
					cancel: 'Batal',
					AKTIF: 'Aktif',
					PINDAH: 'Pindah',
					DE: 'DE'
				}
			})
				.then(value => {
					if(value !== null){
						status = value
					} else {
						isSend = false
					}
				})
		}
		if(isSend){
			const body = {query: `
				mutation {
					berkas: editBerkas(id: "${formData.id}", update: {
						gudang: ${formData.gudang},
						kd_lokasi: "${formData.kd_lokasi}"
						npwp: "${formData.npwp}"
						nama_wp: "${formData.nama_wp}"
						${status ? `status: "${status}"` : ``}
						kd_berkas: "${formData.kd_berkas}"
						${formData.masa_pajak ? `masa_pajak: ${formData.masa_pajak}` : ``}
						${formData.tahun_pajak ? `tahun_pajak: ${formData.tahun_pajak}` : ``}
						urutan: ${formData.urutan}
						${formData.ket_lain ? `ket_lain: "${formData.ket_lain}"` : ``}
					}) {
						pemilik {
							_id
						}
					}
				}
			`}
			return fetchDataGQL(body)
				.then(res => res.json())
				.then(({data}) => {
					this.closeModal()
					this.props.lihatBerkas(this.state.wpId)
				})
				.catch(err => { throw err })
		}
	}

	componentWillReceiveProps(nextProps){
		if(this.props.berkas !== nextProps.berkas){
			const formData = {
				id: nextProps.berkas._id,
				npwp: nextProps.berkas.pemilik.npwp,
				nama_wp: nextProps.berkas.pemilik.nama_wp,
				kd_berkas: nextProps.berkas.ket_berkas.kd_berkas,
				masa_pajak: nextProps.berkas.masa_pajak,
				tahun_pajak: nextProps.berkas.tahun_pajak,
				gudang: nextProps.berkas.lokasi.gudang,
				kd_lokasi: nextProps.berkas.lokasi.kd_lokasi,
				urutan: nextProps.berkas.urutan,
				ket_lain: nextProps.berkas.ket_lain
			}
			this.setState({ 
				formData, 
				backupForm: formData,
				wpId: nextProps.berkas.pemilik._id})
		}
	}
	
	render(){
		const options = this.props.ket_berkas.map(opt => {
			return <option value={ opt.kd_berkas } key={ opt._id }>{ opt.nama_berkas }</option>
		})

		return (
			<div className="modal fade" id="modalEditWP" tabIndex="-1" role="dialog">
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
									<div className="form-group col-md-5">
										<label>NPWP</label>
										<div className="input-group">
											<InputMask 
												mask="99.999.999.9-999.999" 
												placeholder="__.___.___._-___.___" 
												maskChar="_"
												name="npwp"
												className="form-control"
												required
												pattern="\d{2}[.]\d{3}[.]\d{3}[.]\d{1}[-]\d{3}[.]\d{3}"
												value={ this.state.formData.npwp ? this.state.formData.npwp : '' }
												onChange={ this.changeHandler }
											/>
										</div>
									</div>
									<div className="form-group col-md-7">
										<label>Nama WP</label>
										<div className="input-group">
											<input 
												type="text"
												name="nama_wp" 
												className="form-control" 
												placeholder="Otomatis Terisi Jika NPWP Ditemukan"
												disabled={ this.state.disableNamaWP }
												value={ this.state.formData.nama_wp ? this.state.formData.nama_wp : '' }
												onChange={ this.changeHandler }
												required
											/>
										</div>
									</div>
									<div className="form-group col-md-4">
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
									<div className="form-group col-md-3">
										<label>Masa Pajak</label>
										<div className="input-group">
											<input 
												type="number" 
												name="masa_pajak" 
												className="form-control" 
												min="0" 
												max="12" 
												value={ this.state.formData.masa_pajak ? this.state.formData.masa_pajak : '' }
												onChange={ this.changeHandler }
											/>
										</div>
									</div><div className="form-group col-md-3">
										<label>Tahun Pajak</label>
										<div className="input-group">
											<input 
												type="number" 
												name="tahun_pajak" 
												className="form-control" 
												min={ new Date().getFullYear() - 15 }
												max={ new Date().getFullYear() }
												value={ this.state.formData.tahun_pajak ? this.state.formData.tahun_pajak : '' }
												onChange={ this.changeHandler }
											/>
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