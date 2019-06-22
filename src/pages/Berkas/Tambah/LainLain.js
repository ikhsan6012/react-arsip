import React, { Component } from 'react'
import InputMask from 'react-input-mask'

import { fetchDataGQL, handleErrors, setToken } from '../../../functions/helpers'
import swal from 'sweetalert'

export default class LainLain extends Component {
	state = {
		ket_berkas: [],
		disableNamaWP: false,
		isError: false,
		errMsg: '',
		formData: {
			gudang: 1
		},
		required: false
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
		if(name === 'kd_berkas') return this.checkKdBerkas(value)
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
					wp(npwp: "${npwp}") {
						nama_wp
					}
				}`
			}
			fetchDataGQL(body)
				.then(({data}) => {
					if(!data.wp) return this.errorHandler('NPWP Tidak Ditemukan')
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

	checkKdBerkas = value => {
		if(!value.match(/LAIN/)){
			this.setState({ required: true })
		} else {
			this.setState({ required: false })
		}
	}

	fileHandler = e => {
		let file = e.target.files[0]
		if(file.type !== 'application/pdf'){
			return e.target.classList.add('invalid')
		}
		e.target.classList.remove('invalid')
		this.setState({ formData: { ...this.state.formData, file } })
	}

	addBerkas = async e => {
		e.preventDefault()
		const formData = this.state.formData
		let isSend = true
		let status, file
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
		if(formData.file) {
			let data = new FormData()
			data.append('file', formData.file)
			data.append('npwp', formData.npwp)
			data.append('kd_berkas', formData.kd_berkas)
			await fetch(`${process.env.REACT_APP_API_SERVER}/upload`, {
				method: 'post',
				body: data
			}).then(res => res.json())
				.then(res => {
					return file = res.file
				})
		}
		if(isSend){
			const body = {query: `mutation {
				berkas: addBerkas(input: {
					kd_berkas: "${formData.kd_berkas}"
					pemilik: {
						npwp: "${formData.npwp}"
						nama_wp: "${formData.nama_wp}"
						${status ? `status: "${status}"` : ``}
					}
					${formData.masa_pajak ? `masa_pajak: ${formData.masa_pajak}` : ``}
					${formData.tahun_pajak ? `tahun_pajak: ${formData.tahun_pajak}` : ``}
					lokasi: {
						gudang: ${formData.gudang}
						kd_lokasi: "${formData.kd_lokasi}"
					}
					urutan: ${formData.urutan}
					${file ? `file: "${file}"` : ``}
					${formData.ket_lain ? `ket_lain: "${formData.ket_lain}"` : ``}
				}) {
					ket_berkas {
						nama_berkas
					}
					pemilik {
						npwp
						nama_wp
					}
					masa_pajak
					tahun_pajak
				}
			}`}
			return fetchDataGQL(body)
				.then(({data, errors, extensions}) => {
					setToken(extensions)
					if(errors) return handleErrors(errors)
					const alert = document.querySelector('.alert')
					alert.classList.remove('alert-danger')
					alert.classList.add('alert-success')
					alert.innerHTML = `${data.berkas.ket_berkas.nama_berkas}<br/> Nama: ${data.berkas.pemilik.nama_wp}, NPWP: ${data.berkas.pemilik.npwp}${data.berkas.tahun_pajak ? `<br/>Masa/Tahun: ${data.berkas.masa_pajak}/${data.berkas.tahun_pajak}` : ``}`
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

	componentDidMount(){
		const body = { query: `{
			ket_berkas: ketBerkases {
				_id
				kd_berkas
				nama_berkas
			}
		}`}
		fetchDataGQL(body)
			.then(({data, errors, extensions}) => {
				setToken(extensions)
				if(errors) return handleErrors(errors)
				this.setState({ ket_berkas: data.ket_berkas })
			})
			.catch(err => this.setState({
				isError: true,
				errMsg: err
			}))
	}

	render(){
		const ket_berkas = this.state.ket_berkas.filter(data => !data.kd_berkas.match(/(induk|pindah|pkp|sertel|pbk)/i))
		const options = ket_berkas.map(opt => {
			return <option value={ opt.kd_berkas } key={ opt._id }>{ opt.nama_berkas }</option>
		})
		
		return(
			<form id="form-lain-lain" onSubmit={ this.addBerkas }>
				<div className="row">
					<div className="form-group col-md-7">
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
					<div className="form-group col-md-5">
						<label>Lokasi <span className="text-danger">*</span></label>
						<div className="input-group">
							<input 
								type="text" 
								name="kd_lokasi" 
								className="form-control" 
								placeholder="A6012"
								required
								defaultValue={ this.state.formData.kd_lokasi }
								onChange={ this.changeHandler }
								pattern="\w{1,2}\d{4}"
								value={ this.state.formData.kd_lokasi ? this.state.formData.kd_lokasi : '' }
							/>
						</div>
					</div>
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
					<div className="form-group col-md-12">
						<label>Jenis Berkas <span className="text-danger">*</span></label>
						<div className="input-group">
							<select
								name="kd_berkas" 
								className="form-control"
								required
								defaultValue={ this.state.formData.kd_berkas }
								onChange={ this.changeHandler }
							>
								<option value="" hidden>Pilih Jenis Berkas</option>
								{ options }
							</select>
						</div>
					</div>
					<div className="form-group col-md-4">
						<label>Masa Pajak</label>
						<div className="input-group">
							<input 
								type="number"
								name="masa_pajak"
								className="form-control"
								min="0"
								max="12"
								placeholder={ new Date().getMonth() }
								defaultValue={ this.state.formData.masa_pajak }
								onChange={ this.changeHandler }
								required={ this.state.required }
							/>
						</div>
					</div><div className="form-group col-md-5">
						<label>Tahun Pajak</label>
						<div className="input-group">
							<input 
								type="number" 
								name="tahun_pajak" 
								className="form-control" 
								min={ new Date().getFullYear() - 15 }
								max={ new Date().getFullYear() }
								placeholder={ new Date().getFullYear() }
								defaultValue={ this.state.formData.tahun_pajak }
								onChange={ this.changeHandler }
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
						<label>Lampiran <span className="text-warning" style={{ fontSize: '.75em' }}>pdf only!</span></label>
						<div className="input-group">
							<input 
								id="file"
								type="file" 
								name="file"
								accept="application/pdf"
								className="form-control-file"
								onChange={ this.fileHandler }
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