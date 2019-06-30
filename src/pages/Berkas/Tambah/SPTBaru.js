import React, { useState } from 'react'

import { NamaPenerimaInput, TglTerimaInput, GudangInput, KdLokasiInput, KdBerkasInput, UrutanInput, FileInput, KeteranganInput, ButtonSubmit } from '../../../components/Forms'
import { changeHandler, fileHandler,addBerkas } from '../../../functions/form'

const SPTBaru = () => {
	const [isError, setIsError] = useState(false)
	const [errMsg, setErrMsg] = useState('')
	const [formData, setFormData] = useState({ gudang: 1, status_pbk: 'Terima' })
	const ket_berkas = JSON.parse(localStorage.getItem('ket_berkas')).filter(data => !data.kd_berkas.match(/(induk|pindah|pkp|sertel|pbk)/i))

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
					onChange={ fileHandler.bind(this, formData, { setFormData }) }
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