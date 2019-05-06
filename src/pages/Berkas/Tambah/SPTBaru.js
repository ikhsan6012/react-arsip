import React, { Component } from 'react'
import InputMask from 'react-input-mask'

import { fetchDataGQL } from '../../../helpers'

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

	addBerkas = e => {
		e.preventDefault()
		const formData = this.state.formData
		const body = {query: `mutation {
			berkas: addBerkasSPTBaru(input: {
				gudang: ${formData.gudang}
				kd_lokasi: "${formData.kd_lokasi}"
				kd_berkas: "${formData.kd_berkas}"
				nama_penerima: "${formData.nama_penerima}"
				tgl_terima: "${formData.tgl_terima}"
				urutan: ${formData.urutan}
				${formData.ket_lain ? `ket_lain: "${formData.ket_lain}"` : ``}
			}) {
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
			.then(res => res.json())
			.then(({data}) => {
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
			ket_berkas: getSemuaKetBerkas {
				_id
				kd_berkas
				nama_berkas
			}
		}`}
		fetchDataGQL(body)
			.then(res => res.json())
			.then(({data}) => this.setState({ ket_berkas: data.ket_berkas }))
			.catch(err => this.setState({
				isError: true,
				errMsg: err
			}))
	}

	render(){
		const ket_berkas = this.state.ket_berkas.filter(data => !data.kd_berkas.match(/(induk|pindah|pkp|sertel)/i))
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