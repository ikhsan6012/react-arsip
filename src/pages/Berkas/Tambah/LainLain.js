import React, { useState, useEffect } from 'react'

import { fetchDataGQL, handleErrors, setToken } from '../../../functions/helpers'
import { NPWPInput, NamaWPInput, GudangInput, KdLokasiInput, UrutanInput, FileInput, KeteranganInput, ButtonSubmit, KdBerkasInput, MasaPajakInput, TahunPajakInput } from '../../../components/Forms'
import { changeHandler, fileHandler,addBerkas } from '../../../functions/form'

const LainLain = () => {
	const [ket_berkas, setKet_berkas] = useState([])
	const [disableNamaWP, setDisableNamaWP] = useState(false)
	const [isError, setIsError] = useState(false)
	const [errMsg, setErrMsg] = useState('')
	const [formData, setFormData] = useState({ gudang: 1 })

	// Get Ket Berkas
	useEffect(() => {
		const getKetBerkas = async body => {
			try {
				const {data, errors, extensions} = await fetchDataGQL(body)
				setToken(extensions)
				if(errors) return handleErrors(errors)
				setKet_berkas(data.ket_berkas.filter(data => !data.kd_berkas.match(/(induk|pindah|pkp|sertel|pbk)/i)))
			} catch (err) {
				setIsError(true)
				setErrMsg(err)
			}
		}
		const body = { query: `{
			ket_berkas: ketBerkases {
				_id
				kd_berkas
				nama_berkas
			}
		}`}
		getKetBerkas(body)
	}, [])

	// Options Jenis Berkas
	const options = ket_berkas.map(opt => 
		<option value={ opt.kd_berkas } key={ opt._id }>{ opt.nama_berkas }</option>
	)

	return(
		<form onSubmit={ addBerkas.bind(this, { 
				formData, kd_berkas: formData.kd_berkas, isError, errMsg 
				}, { setFormData }) }
		>
			<div className="row">
				<GudangInput
					width="7"
					value={ formData.gudang }
					onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
				/>
				<KdLokasiInput
					width="5"
					value={ formData.kd_lokasi }
					onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
				/>
				<NPWPInput
					width="5"
					value={ formData.npwp }
					onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
				/>
				<NamaWPInput
					width="7"
					value={ formData.nama_wp }
					disabled={ disableNamaWP }
					onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
				/>
				<KdBerkasInput
					width="12"
					value={ formData.kd_berkas }
					onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
					options={ options }
				/>
				<MasaPajakInput
					width="4"
					value={ formData.masa_pajak }
					onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
				/>
				<TahunPajakInput
					width="5"
					value={ formData.tahun_pajak }
					onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
				/>
				<UrutanInput
					width="3"
					value={ formData.urutan }
					onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
				/>
				<FileInput
					width="12"
					onChange={ fileHandler.bind(this, formData, { setFormData }) }
				/>
				<KeteranganInput
					width="12"
					value={ formData.ket_lain }
					onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
				/>
				<ButtonSubmit
					width="12"
					float="right"
				/>
			</div>
		</form>	
	)
}

export default LainLain

// export default class LainLain extends Component {
// 	state = {
// 		ket_berkas: [],
// 		disableNamaWP: false,
// 		isError: false,
// 		errMsg: '',
// 		formData: {
// 			gudang: 1
// 		},
// 		required: false
// 	}

// 	errorHandler = msg => {
// 		this.setState({
// 			isError: true,
// 			errMsg: msg,
// 			disableNamaWP: false,
// 			formData: { ...this.state.formData, nama_wp: '' }
// 		})
// 		console.error(msg)
// 	}

// 	changeHandler = async e => {
// 		const el = e.target
// 		const name = el.name
// 		const value = el.value.toUpperCase()
// 		await this.setState({formData: { ...this.state.formData, [name]: value }})
// 		if(name === 'npwp') return this.checkNPWP()
// 		if(name === 'kd_berkas') return this.checkKdBerkas(value)
// 	}

// 	checkNPWP = () => {
// 		const npwp = this.state.formData.npwp
// 		if(npwp.replace(/[_.-]/g, '').length < 15) {
// 			return this.setState({disableNamaWP: false, formData: { ...this.state.formData, nama_wp: '' } })
// 		}
// 		if(npwp.replace(/[_.-]/g, '').length === 15){
// 			// Get Nama WP
// 			const body = {
// 				query: `{
// 					wp(npwp: "${npwp}") {
// 						nama_wp
// 					}
// 				}`
// 			}
// 			fetchDataGQL(body)
// 				.then(({data}) => {
// 					if(!data.wp) return this.errorHandler('NPWP Tidak Ditemukan')
// 					this.setState({
// 						formData: { ...this.state.formData, nama_wp: data.wp.nama_wp },
// 						isError: false,
// 						disableNamaWP: true,
// 						errMsg: ''
// 					})
// 				})
// 				.catch(err => this.errorHandler(err.message))
// 		}
// 	}

// 	checkKdBerkas = value => {
// 		if(!value.match(/LAIN/)){
// 			this.setState({ required: true })
// 		} else {
// 			this.setState({ required: false })
// 		}
// 	}

// 	fileHandler = e => {
// 		let file = e.target.files[0]
// 		if(file.type !== 'application/pdf'){
// 			return e.target.classList.add('invalid')
// 		}
// 		e.target.classList.remove('invalid')
// 		this.setState({ formData: { ...this.state.formData, file } })
// 	}

// 	addBerkas = async e => {
// 		e.preventDefault()
// 		const formData = this.state.formData
// 		let isSend = true
// 		let status, file
// 		if(this.state.isError) {
// 			await swal(`${this.state.errMsg}. Pilih Status WP untuk menyimpan!`, {
// 				buttons: {
// 					cancel: 'Batal',
// 					AKTIF: 'Aktif',
// 					PINDAH: 'Pindah',
// 					DE: 'DE'
// 				}
// 			})
// 				.then(value => {
// 					if(value !== null){
// 						status = value
// 					} else {
// 						isSend = false
// 					}
// 				})
// 		}
// 		if(formData.file) {
// 			let data = new FormData()
// 			data.append('file', formData.file)
// 			data.append('npwp', formData.npwp)
// 			data.append('kd_berkas', formData.kd_berkas)
// 			await fetch(`${process.env.REACT_APP_API_SERVER}/upload`, {
// 				method: 'post',
// 				body: data
// 			}).then(res => res.json())
// 				.then(res => {
// 					return file = res.file
// 				})
// 		}
// 		if(isSend){
// 			const body = {query: `mutation {
// 				berkas: addBerkas(input: {
// 					kd_berkas: "${formData.kd_berkas}"
// 					pemilik: {
// 						npwp: "${formData.npwp}"
// 						nama_wp: "${formData.nama_wp}"
// 						${status ? `status: "${status}"` : ``}
// 					}
// 					${formData.masa_pajak ? `masa_pajak: ${formData.masa_pajak}` : ``}
// 					${formData.tahun_pajak ? `tahun_pajak: ${formData.tahun_pajak}` : ``}
// 					lokasi: {
// 						gudang: ${formData.gudang}
// 						kd_lokasi: "${formData.kd_lokasi}"
// 					}
// 					urutan: ${formData.urutan}
// 					${file ? `file: "${file}"` : ``}
// 					${formData.ket_lain ? `ket_lain: "${formData.ket_lain}"` : ``}
// 				}) {
// 					ket_berkas {
// 						nama_berkas
// 					}
// 					pemilik {
// 						npwp
// 						nama_wp
// 					}
// 					masa_pajak
// 					tahun_pajak
// 				}
// 			}`}
// 			return fetchDataGQL(body)
// 				.then(({data, errors, extensions}) => {
// 					setToken(extensions)
// 					if(errors) return handleErrors(errors)
// 					const alert = document.querySelector('.alert')
// 					alert.classList.remove('alert-danger')
// 					alert.classList.add('alert-success')
// 					alert.innerHTML = `${data.berkas.ket_berkas.nama_berkas}<br/> Nama: ${data.berkas.pemilik.nama_wp}, NPWP: ${data.berkas.pemilik.npwp}${data.berkas.tahun_pajak ? `<br/>Masa/Tahun: ${data.berkas.masa_pajak}/${data.berkas.tahun_pajak}` : ``}`
// 					alert.hidden = false
// 					this.setState({
// 						formData: { ...this.state.formData, npwp: '', nama_wp: '' },
// 						disableNamaWP: false
// 					})
// 					document.querySelector('[name=npwp]').focus()
// 				})
// 				.catch(err => {
// 					const alert = document.querySelector('.alert')
// 					alert.classList.remove('alert-danger')
// 					alert.classList.add('alert-success')
// 					alert.innerHTML = this.state.errMsg
// 					alert.hidden = true
// 				})
// 		}
// 	}

// 	componentDidMount(){
// 		const body = { query: `{
// 			ket_berkas: ketBerkases {
// 				_id
// 				kd_berkas
// 				nama_berkas
// 			}
// 		}`}
// 		fetchDataGQL(body)
// 			.then(({data, errors, extensions}) => {
// 				setToken(extensions)
// 				if(errors) return handleErrors(errors)
// 				this.setState({ ket_berkas: data.ket_berkas })
// 			})
// 			.catch(err => this.setState({
// 				isError: true,
// 				errMsg: err
// 			}))
// 	}

// 	render(){
// 		const ket_berkas = this.state.ket_berkas.filter(data => !data.kd_berkas.match(/(induk|pindah|pkp|sertel|pbk)/i))
// 		const options = ket_berkas.map(opt => {
// 			return <option value={ opt.kd_berkas } key={ opt._id }>{ opt.nama_berkas }</option>
// 		})
		
// 		return(
// 			<form id="form-lain-lain" onSubmit={ this.addBerkas }>
// 				<div className="row">
// 					<GudangInput
// 						width="7"
// 						value={ this.state.formData.gudang }
// 						onChange={ this.changeHandler }
// 					/>
// 					<KdLokasiInput
// 						width="5"
// 						value={ this.state.formData.kd_lokasi }
// 						onChange={ this.changeHandler }
// 					/>
// 					<NPWPInput
// 						width="5"
// 						value={ this.state.formData.npwp }
// 						onChange={ this.changeHandler }
// 					/>
// 					<NamaWPInput
// 						width="7"
// 						value={ this.state.formData.nama_wp }
// 						disabled={ this.state.disableNamaWP }
// 						onChange={ this.changeHandler }
// 					/>
// 					<KdBerkasInput
// 						width="12"
// 						value={ this.state.formData.kd_berkas }
// 						onChange={ this.changeHandler }
// 						options={ options }
// 					/>
// 					<MasaPajakInput
// 						width="4"
// 						value={ this.state.formData.masa_pajak }
// 						onChange={ this.changeHandler }
// 						required={ this.state.required }
// 					/>
// 					<TahunPajakInput
// 						width="5"
// 						value={ this.state.formData.tahun_pajak }
// 						onChange={ this.changeHandler }
// 					/>
// 					<UrutanInput
// 						width="3"
// 						value={ this.state.formData.urutan }
// 						onChange={ this.changeHandler }
// 					/>
// 					<FileInput
// 						width="12"
// 						onChange={ this.fileHandler }
// 					/>
// 					<KeteranganInput
// 						width="12"
// 						value={ this.state.formData.ket_lain }
// 						onChange={ this.changeHandler }
// 					/>
// 					<ButtonSubmit
// 						width="12"
// 						float="right"
// 					/>
// 				</div>
// 			</form>	
// 		)
// 	}
// }