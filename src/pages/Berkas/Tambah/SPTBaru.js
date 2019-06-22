import React, { Component } from 'react'
import swal from 'sweetalert'

import { fetchDataGQL, handleErrors, setToken } from '../../../functions/helpers'
import { NamaPenerimaInput, TglTerimaInput, GudangInput, KdLokasiInput, KdBerkasInput, UrutanInput, FileInput, KeteranganInput, ButtonSubmit } from '../../../components/Forms'

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
					<GudangInput
						width="7"
						value={ this.state.formData.gudang }
						onChange={ this.changeHandler }
					/>
					<KdLokasiInput
						width="5"
						value={ this.state.formData.kd_lokasi }
						onChange={ this.changeHandler }
					/>
					<KdBerkasInput
						width="12"
						value={ this.state.formData.kd_berkas }
						onChange={ this.changeHandler }
						options={ options }
					/>
					<NamaPenerimaInput
						width="5"
						value={ this.state.formData.nama_penerima }
						onChange={ this.changeHandler }
					/>
					<TglTerimaInput
						width="4"
						value={ this.state.formData.tgl_terima }
						onChange={ this.changeHandler }
					/>
					<UrutanInput
						width="3"
						value={ this.state.formData.urutan }
						onChange={ this.changeHandler }
					/>
					<FileInput
						width="12"
						onChange={ this.fileHandler }
					/>
					<KeteranganInput
						width="12"
						value={ this.state.formData.ket_lain }
						onChange={ this.changeHandler }
					/>
					<ButtonSubmit
						width="12"
						float="right"
					/>
				</div>
			</form>	
		)
	}
}