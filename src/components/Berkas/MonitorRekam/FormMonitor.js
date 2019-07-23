import React, { useState, useEffect } from 'react'
import InputMask from 'react-input-mask'
import { handleSubmit } from '../../../functions/monitorRekam'

const FormMonitor = props => {
	const [kriteria, setKriteria] = useState('tgl_rekam')

	useEffect(() => {
		document.querySelector('[name=kriteria]').focus()		
	}, [])
	
	const TglRekam = 
		<InputMask 
			id="tgl_rekam"
			className="form-control col-md-3"  
			type="text"
			placeholder="Tanggal Mulai Rekam"
			mask="99/99/9999" 
			pattern="[0-3]\d.[0-1]\d.20[0-2]\d"
			required />

	const Perekam =
		<input 
			id="perekam"
			className="form-control col-md-3"
			placeholder="Nama Perekam"
			type="text"
			minLength="3"
			required />

	const KriteriaForm = 
		kriteria.match(/tgl_rekam/) ? TglRekam :
		kriteria.match(/perekam/) ? Perekam : null

	return(
		<form id="form-monitor" onSubmit={ handleSubmit.bind(this, props.setLokasis) }>
			<div className="row">
				<label className="mt-2">Masukkan Tanggal Atau Nama</label>
				<div className="input-group">
					<select name="kriteria" className="form-control col-md-3" value={ kriteria } onChange={ e => setKriteria(e.target.value) }>
						<option value="tgl_rekam">Tanggal Mulai Rekam</option>
						<option value="perekam">Perekam</option>
					</select>
					{ KriteriaForm }
					<button className="form-control btn btn-primary col-md-1 mr-2">Cari</button>
				</div>
			</div>
		</form>
	)
}
export default FormMonitor