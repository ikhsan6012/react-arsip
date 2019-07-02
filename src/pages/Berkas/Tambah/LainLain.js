import React, { useState, useEffect } from 'react'

import { NPWPInput, NamaWPInput, GudangInput, KdLokasiInput, UrutanInput, FileInput, KeteranganInput, ButtonSubmit, KdBerkasInput, MasaPajakInput, TahunPajakInput } from '../../../components/Forms'
import { changeHandler, fileHandler,addBerkas } from '../../../functions/form'

const LainLain = () => {
	const [formData, setFormData] = useState({})
	const [file, setFile] = useState(null)
	const [disableNamaWP, setDisableNamaWP] = useState(false)
	const [isError, setIsError] = useState(false)
	const [errMsg, setErrMsg] = useState('')
	const ket_berkas = JSON.parse(localStorage.getItem('ket_berkas')).filter(data => !data.kd_berkas.match(/(induk|pindah|pkp|sertel|pbk)/i))

	useEffect(() => {
		const { gudang, kd_lokasi, npwp, nama_wp, kd_berkas, masa_pajak, tahun_pajak, urutan, ket_lain } = JSON.parse(localStorage.getItem('formData'))
		const fd = { gudang, kd_lokasi, npwp, nama_wp, kd_berkas, masa_pajak, tahun_pajak, urutan, ket_lain }
		if(fd){
			setFormData(fd)
			if(fd.nama_wp) setDisableNamaWP(true)
		}
		setTimeout(() => {
			document.querySelector('[name=gudang]').focus()
		}, 100)
	}, [])

	// Options Jenis Berkas
	const options = ket_berkas.map(opt => 
		<option value={ opt.kd_berkas } key={ opt._id }>{ opt.nama_berkas }</option>
	)

	return(
		<form onSubmit={ addBerkas.bind(this, { 
				formData, kd_berkas: formData.kd_berkas, file, isError, errMsg 
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
					required={ formData.kd_berkas ? !formData.kd_berkas.match(/lain/i) : true }
					onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
				/>
				<TahunPajakInput
					width="5"
					value={ formData.tahun_pajak }
					required={ formData.kd_berkas ? !formData.kd_berkas.match(/lain/i) : true }
					onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
				/>
				<UrutanInput
					width="3"
					value={ formData.urutan }
					onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
				/>
				<FileInput
					width="12"
					onChange={ fileHandler.bind(this, { setFile }) }
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