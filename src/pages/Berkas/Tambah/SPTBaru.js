import React, { Component } from 'react'
import InputMask from 'react-input-mask'

import { fetchDataGQL, handleErrors, setToken } from '../../../helpers'
import swal from 'sweetalert';

export default class SPTBaru extends Component {
	state = {
		ket_berkas: [],
		isError: false,
		errMsg: '',
		formData: {
			gudang: 1
		}
	}

	changeHandler = e => {
		const el = e.target
		const name = el.name
		const value = el.value.toUpperCase()
		this.setState({formData: { ...this.state.formData, [name]: value }})
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
		let file
		if(formData.file){
			try {
				const data = new FormData()
				data.append('file', formData.file)
				data.append('kd_berkas', this.state.formData.kd_berkas)
				const generate = await fetch(`${process.env.REACT_APP_API_SERVER}/upload`, {
					method: 'post',
					body: data
				})
				const res = await generate.json()
				file = res.file
			} catch (error) {
				return swal('Gagal Mengunggah Dokumen...', { icon: 'error' })
			}
		}
		const body = {query: `mutation{
			berkas: addBerkas(input: {
				lokasi: {
					gudang: ${formData.gudang}
					kd_lokasi: "${formData.kd_lokasi}"
				}
				kd_berkas: "${formData.kd_berkas}"
				penerima: {
					nama_penerima: "${formData.nama_penerima}"
					tgl_terima: "${formData.tgl_terima}"
				}
				urutan: ${formData.urutan}
				${file ? `file: "${file}"` : ``}
				${formData.ket_lain ? `ket_lain: "${formData.ket_lain}"` : ``}
			}){
				ket_berkas {
					nama_berkas
				}
				penerima {
					nama_penerima
					tgl_terima
				}
			}
		}`}
		return fetchDataGQL(body)
			.then(({data, errors, extensions}) => {
				setToken(extensions)
				if(errors) return handleErrors(errors)
				const alert = document.querySelector('.alert')
				alert.classList.remove('alert-danger')
				alert.classList.add('alert-success')
				alert.innerHTML = `${data.berkas.ket_berkas.nama_berkas} => Penerima: ${data.berkas.penerima.nama_penerima}, Tgl Terima: ${data.berkas.penerima.tgl_terima}`
				alert.hidden = false
				this.setState({
					formData: { ...this.state.formData, nama_penerima: '', tgl_terima: '' }
				})
				document.querySelector('[name=nama_penerima]').focus()
			})
			.catch(err=> {
				const alert = document.querySelector('.alert')
				alert.classList.remove('alert-danger')
				alert.classList.add('alert-success')
				alert.innerHTML = this.state.errMsg
				alert.hidden = true
			})
	}

	componentDidMount(){
		const body = { query: `{
			ket_berkas: ketBerkases(nama_berkas: "spt") {
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
		const ket_berkas = this.state.ket_berkas
		const options = ket_berkas.map(opt => {
			return <option value={ opt.kd_berkas } key={ opt._id }>{ opt.nama_berkas }</option>
		})

		return(
			<form id="form-spt-baru" onSubmit={ this.addBerkas }>
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
						<div
							className="input-group"
						>
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
					<div className="form-group col-md-5">
						<label>Nama Penerima <span className="text-danger">*</span></label>
						<div className="input-group">
							<input 
								type="text" 
								name="nama_penerima" 
								className="form-control"
								required
								defaultValue={ this.state.formData.nama_penerima }
								onChange={ this.changeHandler }
								value={ this.state.formData.nama_penerima ? this.state.formData.nama_penerima : '' }
							/>
						</div>
					</div>
					<div className="form-group col-md-4">
						<label>Tanggal Terima <span className="text-danger">*</span></label>
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