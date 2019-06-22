import React, { Component } from 'react'
import swal from 'sweetalert'

import { fetchDataGQL, handleErrors, setToken } from '../../../functions/helpers'
import { NPWPInput, NamaWPInput, StatusPBKInput, NoPBKInput, GudangInput, KdLokasiInput, UrutanInput, FileInput, KeteranganInput, ButtonSubmit } from '../../../components/Forms'

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
					wp(npwp: "${npwp}") {
						nama_wp
					}
				}`
			}
			fetchDataGQL(body)
				.then(({data, errors, extensions}) => {
					setToken(extensions)
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
		if(formData.file){
			try {
				const data = new FormData()
				data.append('file', formData.file)
				data.append('kd_berkas', this.props.kd_berkas)
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
		if(isSend) {
			const body = {query: `mutation{
				berkas: addBerkas(input: {
					kd_berkas: "${this.props.kd_berkas}"
					pemilik: {
						npwp: "${formData.npwp}"
						nama_wp: "${formData.nama_wp}"
						${ status ? `status: "${status}"` : ``}
					}
					status_pbk: "${formData.status_pbk}"
					nomor_pbk: ${formData.nomor_pbk}
					tahun_pbk: ${formData.tahun_pbk}
					lokasi: {
						gudang: ${formData.gudang}
						kd_lokasi: "${formData.kd_lokasi}"
					}
					urutan: ${formData.urutan}
					${ file ? `file: "${ file }"` : `` }
					${ formData.ket_lain ? `ket_lain: "${ formData.ket_lain }"` : `` }
				}){
					ket_berkas {
						nama_berkas
					}
					pemilik {
						npwp
						nama_wp
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
					<NPWPInput
						width="5"
						value={ this.state.formData.npwp }
						onChange={ this.changeHandler }
					/>
					<NamaWPInput
						width="7"
						value={ this.state.formData.nama_wp }
						onChange={ this.changeHandler }
					/>
					<StatusPBKInput
						width="6"
						value={ this.state.formData.status_pbk }
						onChange={ this.changeHandler }
					/>
					<NoPBKInput
						width="3"
						value={ this.state.formData.nomor_pbk }
						onChange={ this.changeHandler }
					/>
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
					<GudangInput
						width="5"
						value={ this.state.formData.gudang }
						onChange={ this.changeHandler }
					/>
					<KdLokasiInput
						width="4"
						value={ this.state.formData.kd_lokasi }
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