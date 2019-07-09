import React, { Fragment, useState, useEffect } from 'react'
import InputMask from 'react-input-mask'

import { changeHandler, submitHandler } from '../../../functions/cari'

const Kriteria = props => {
	const [kriteria, setKriteria] = useState('npwp')

	useEffect(() => {
		document.querySelector('[name=kriteria]').focus()
	}, [])

	const NPWPInput =
		<InputMask 
			id="npwp"
			className="form-control col-md-3" 
			type="text"
			placeholder="NPWP" 
			mask="99.999.999.9"
			maskChar="_"
			pattern="\d{2}[.]\d{3}[.]\d{3}[.]\d{1}"
			required
		/>

	const NamaWPInput = 
		<input
			id="nama_wp" 
			className="form-control col-md-5" 
			type="text" 
			placeholder="Nama WP" 
			pattern="[A-Z0-9 ]{3,}"
			required
			onChange={ changeHandler }
		/>

	const LokasiInput = 
		<Fragment>
			<select id="gudang" className="form-control col-md-2" required>
				<option defaultValue="1">1</option>
				<option value="2">2</option>
			</select>
			<input 
				id="kd_lokasi" 
				className="form-control col-md-2" 
				type="text" 
				placeholder="Lokasi" 
				pattern="\w{1,2}\d{4}"
				required
				onChange={ changeHandler }
			/>
		</Fragment>

	const PenerimaInput =
		<Fragment>
			<InputMask 
				id="tgl_terima"
				className="form-control col-md-2"  
				type="text" 
				placeholder="Tgl Terima" 
				mask="99/99/9999" 
				pattern="[0-3]\d.[0-1]\d.20[0-2]\d"
			/>
			<input 
				id="nama_penerima" 
				className="form-control col-md-5" 
				type="text" 
				placeholder="Nama Penerima" 
				pattern="[A-Z0-9 ]{3,}"
				onChange={ changeHandler }
			/>
		</Fragment>

	// Kriteria Form
	const kriteriaForm =
		kriteria.match(/npwp/) ? NPWPInput :
		kriteria.match(/nama_wp/) ? NamaWPInput :
		kriteria.match(/lokasi/) ? LokasiInput :
		kriteria.match(/penerima/) ? PenerimaInput : ``

	return(
		<form id="formSearch" data-page={ 1 } onSubmit={ submitHandler.bind(this, { kriteria, props }) }>
			<div className="row">
				<label>Cari Berdasarkan:</label>
				<div className="input-group">
					<select name="kriteria" className="form-control col-md-2" value={ kriteria } onChange={ e => setKriteria(e.target.value) }>
						<option value="npwp">NPWP</option>
						<option value="nama_wp">Nama WP</option>
						<option value="lokasi">Lokasi</option>
						<option value="penerima">Penerima</option>
					</select>
					{ kriteriaForm }
					<button id="cariKriteria" className="form-control btn btn-primary col-md-1">Cari</button>
				</div>
			</div>
		</form>
	)
}

export default Kriteria