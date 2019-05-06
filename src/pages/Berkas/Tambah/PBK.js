import React, { Component } from 'react'
import InputMask from 'react-input-mask'

import swal from 'sweetalert'
import { fetchDataGQL } from '../../../helpers'

export default class PBK extends Component {
	state = {
		disableNamaWP: false,
		isError: false,
		errMsg: '',
		formData: {
			gudang: 1,
			status_pbk: 'Terima'
		}
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

	addBerkas = async e => {
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
		if(isSend) {
			const body = {
				query: `mutation {
					berkas: addBerkasPBK(input: {
						kd_berkas: "${this.props.kd_berkas}"
						npwp: "${formData.npwp}"
						${ status ? `status: "${status}"` : ``}
						nama_wp: "${formData.nama_wp}"
						status_pbk: "${formData.status_pbk}"
						nomor_pbk: "${formData.nomor_pbk}"
						tahun_pbk: "${formData.tahun_pbk}"
						gudang: ${formData.gudang}
						kd_lokasi: "${formData.kd_lokasi}"
						urutan: ${formData.urutan}
						${ formData.ket_lain ? `ket_lain: "${ formData.ket_lain }"` : `` }
					}) {
						ket_berkas {
							nama_berkas
						}
						pemilik {
							npwp
							nama_wp
						}
						urutan
					}
				}`
			}
			return fetchDataGQL(body)
				.then(res => res.json())
				.then(({data}) => {
					const alert = document.querySelector('.alert')
					alert.classList.remove('alert-danger')
					alert.classList.add('alert-success')
					alert.innerHTML = `${data.berkas.ket_berkas.nama_berkas} => Nama: ${data.berkas.pemilik.nama_wp}, NPWP: ${data.berkas.pemilik.npwp}`
					alert.hidden = false
					this.setState({
						formData: { ...this.state.formData, npwp: '', nama_wp: '' },
						disableNamaWP: false
					})
					document.querySelector('[name=npwp]').focus()
				})
				.catch(err => {
					const alert = document.querySelector('.alert')
					alert.classList.remove('alert-danger')
					alert.classList.add('alert-success')
					alert.innerHTML = this.state.errMsg
					alert.hidden = true
				})
		}
	}
	
	render() {
		return(
			<form method="post" onSubmit={ this.addBerkas }>
				<div className="row">
					<div className="form-group col-md-5">
						<label>NPWP <span className="text-danger">*</span></label>
						<div className="input-group">
							<InputMask 
								mask="99.999.999.9-999.999" 
								placeholder="__.___.___._-___.___" 
								maskChar="_"
								name="npwp"
								className="form-control"
								defaultValue={ this.state.formData.npwp }
								value={ this.state.formData.npwp ? this.state.formData.npwp : '' }
								onChange={ this.changeHandler }
								required
								pattern="\d{2}[.]\d{3}[.]\d{3}[.]\d{1}[-]\d{3}[.]\d{3}"
							/>
						</div>
					</div>
					<div className="form-group col-md-7">
						<label>Nama WP <span className="text-danger">*</span></label>
						<div className="input-group">
							<input 
								type="text"
								name="nama_wp" 
								className="form-control" 
								placeholder="Otomatis Terisi Jika NPWP Ditemukan"
								disabled={ this.state.disableNamaWP }
								defaultValue={ this.state.formData.nama_wp }
								value={ this.state.formData.nama_wp ? this.state.formData.nama_wp : '' }
								onChange={ this.changeHandler }
								required
							/>
						</div>
					</div>
					<div className="form-group col-md-6">
						<label>Status <span className="text-danger">*</span></label>
						<div className="input-group">
							<select
								name="status_pbk" 
								className="form-control"
								defaultValue={ this.state.formData.status_pbk }
								onChange={ this.changeHandler }
								required
							>
								<option value="Terima">Terima</option>
								<option value="Tolak">Tolak</option>
							</select>
						</div>
					</div>
					<div className="form-group col-md-3">
						<label>Nomor <span className="text-danger">*</span></label>
						<div className="input-group">
							<input 
								type="number" 
								name="nomor_pbk" 
								className="form-control" 
								min={ 1 }
								value={ this.state.formData.nomor_pbk ? this.state.formData.nomor_pbk : '' }
								onChange={ this.changeHandler }
								required
								pattern="\d*"
							/>
						</div>
					</div>
					<div className="form-group col-md-3">
						<label>Tahun <span className="text-danger">*</span></label>
						<div className="input-group">
							<input 
								type="number"
								name="tahun_pbk" 
								className="form-control" 
								min={ new Date().getFullYear() - 20 }
								max={ new Date().getFullYear() }
								placeholder={ new Date().getFullYear() }
								value={ this.state.formData.tahun_pbk ? this.state.formData.tahun_pbk : '' }
								onChange={ this.changeHandler }
								required
								pattern="\d*"
							/>
						</div>
					</div>
					<div className="form-group col-md-5">
						<label>Gudang <span className="text-danger">*</span></label>
						<div className="input-group">
							<select
								name="gudang" 
								className="form-control"
								defaultValue={ this.state.formData.gudang }
								onChange={ this.changeHandler }
								required
							>
								<option value="1">Gudang 1</option>
								<option value="2">Gudang 2</option>
							</select>
						</div>
					</div>
					<div className="form-group col-md-4">
						<label>Lokasi <span className="text-danger">*</span></label>
						<div className="input-group">
							<input 
								type="text" 
								name="kd_lokasi" 
								className="form-control" 
								placeholder="A6012"
								value={ this.state.formData.kd_lokasi ? this.state.formData.kd_lokasi : '' }
								defaultValue={ this.state.formData.kd_lokasi }
								onChange={ this.changeHandler }
								required
								pattern="\w{1,2}\d{4}"
							/>
						</div>
					</div>
					<div className="form-group col-md-3">
						<label>Urutan <span className="text-danger">*</span></label>
						<div className="input-group">
							<input 
								type="number"
								name="urutan"
								className="form-control"
								placeholder="1"
								min="1"
								step="any"
								defaultValue={ this.state.formData.urutan }
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
					<div className="form-group col-md-12">
						<button type="submit" className="btn btn-primary float-right">Simpan</button>
					</div>
				</div>
			</form>	
		)
	}
}