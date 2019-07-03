import React, { useState, useEffect } from 'react'

import { NamaPenerimaInput, TglTerimaInput, GudangInput, KdLokasiInput, KdBerkasInput, UrutanInput, FileInput, KeteranganInput, ButtonSubmit } from '../../../components/Forms'
import { changeHandler, fileHandler,addBerkas } from '../../../functions/form'

const SPTBaru = () => {
	const [formData, setFormData] = useState({})
	const [file, setFile] = useState(null)
	const [isError, setIsError] = useState(false)
	const [errMsg, setErrMsg] = useState('')
	const ket_berkas = JSON.parse(localStorage.getItem('ket_berkas')).filter(data => !data.kd_berkas.match(/(induk|pindah|pkp|sertel|pbk)/i))

	useEffect(() => {
		const { gudang, kd_lokasi, kd_berkas, nama_penerima, tgl_terima, urutan, ket_lain } = JSON.parse(localStorage.getItem('formData')) || {}
		const fd = { gudang: gudang || 1, kd_lokasi, kd_berkas, nama_penerima, tgl_terima, urutan, ket_lain }
		if(fd){
			setFormData(fd)
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
				}, { setFormData, setFile }) }
		>
			<div className="row">
				<GudangInput
					width="7"
					value={ formData.gudang }
					onChange={ changeHandler.bind(this, formData, { setFormData, setErrMsg, setIsError }) }
				/>
				<KdLokasiInput
					width="5"
					value={ formData.kd_lokasi }
					onChange={ changeHandler.bind(this, formData, { setFormData, setErrMsg, setIsError }) }
				/>
				<KdBerkasInput
					width="12"
					value={ formData.kd_berkas }
					onChange={ changeHandler.bind(this, formData, { setFormData, setErrMsg, setIsError }) }
					options={ options }
				/>
				<NamaPenerimaInput
					width="5"
					value={ formData.nama_penerima }
					onChange={ changeHandler.bind(this, formData, { setFormData, setErrMsg, setIsError }) }
				/>
				<TglTerimaInput
					width="4"
					value={ formData.tgl_terima }
					onChange={ changeHandler.bind(this, formData, { setFormData, setErrMsg, setIsError }) }
				/>
				<UrutanInput
					width="3"
					value={ formData.urutan }
					onChange={ changeHandler.bind(this, formData, { setFormData, setErrMsg, setIsError }) }
				/>
				<FileInput
					width="12"
					onChange={ fileHandler.bind(this, { setFile }) }
				/>
				<KeteranganInput
					width="12"
					value={ formData.ket_lain }
					onChange={ changeHandler.bind(this, formData, { setFormData, setErrMsg, setIsError }) }
				/>
				<ButtonSubmit
					width="12"
					float="right"
				/>
			</div>
		</form>	
	)
}
export default SPTBaru