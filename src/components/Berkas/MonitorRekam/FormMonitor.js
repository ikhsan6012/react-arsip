import React, { useEffect } from 'react'
import InputMask from 'react-input-mask'
import { handleSubmit } from '../../../functions/monitorRekam'

const FormMonitor = props => {
	useEffect(() => {
		document.querySelector('#form-monitor input').focus()
	}, [])
	
	return(
		<form id="form-monitor" onSubmit={ handleSubmit.bind(this, props.setLokasis) }>
			<div className="row">
				<label className="mt-2">Masukkan Tanggal Mulai Rekam</label>
				<div className="input-group">
					<InputMask 
						id="tgl_rekam"
						className="form-control col-md-4"  
						type="text" 
						placeholder="Tanggal Rekam" 
						mask="99/99/9999" 
						pattern="[0-3]\d.[0-1]\d.20[0-2]\d"
					/>
					<button className="form-control btn btn-primary col-md-1 mr-2">Cari</button>
				</div>
			</div>
		</form>
	)
}
export default FormMonitor