import React, { useState, useEffect } from 'react'

import { NPWPInput, NamaWPInput, GudangInput, KdLokasiInput, UrutanInput, FileInput, KeteranganInput, ButtonSubmit } from '../../../components/Forms'
import { changeHandler, fileHandler, addBerkas } from '../../../functions/tambah'

const IndukBerkas = props => {
	const [formData, setFormData] = useState({})
	const [file, setFile] = useState(null)
	const [disableNamaWP, setDisableNamaWP] = useState(false)
	const [isError, setIsError] = useState(false)
	const [errMsg, setErrMsg] = useState('')

	useEffect(() => {
		const { npwp, nama_wp, gudang, kd_lokasi, urutan, ket_lain } = JSON.parse(localStorage.getItem('formData')) || {}
		const fd = { npwp, nama_wp, gudang: gudang || 1, kd_lokasi, urutan, ket_lain }
		if(fd){
			setFormData(fd)
			if(fd.nama_wp) setDisableNamaWP(true)
		}
		setTimeout(() => {
			document.querySelector('[name=npwp]').focus()
		}, 100)
	}, [])
	
	return(
		<form onSubmit={ addBerkas.bind(this, {
			formData, kd_berkas: props.kd_berkas, file, isError, errMsg 
			}, { setFormData, setFile }) }
		>
			<div className="row">
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
				<GudangInput
					width="5"
					value={ formData.gudang }
					onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
				/>
				<KdLokasiInput
					width="4"
					value={ formData.kd_lokasi }
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
export default IndukBerkas