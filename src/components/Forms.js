import React from 'react'
import InputMask from 'react-input-mask'

export const KdBerkasInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Jenis Berkas <span className="text-danger">*</span></label>
		<div className="input-group">
			<select
				name="kd_berkas" 
				className="form-control"
				required
				defaultValue={ props.value }
				onChange={ props.onChange }
			>
				<option value="" hidden>Pilih Jenis Berkas</option>
				{ props.options }
			</select>
		</div>
	</div>

export const NPWPInput = props => 
	<div className={`form-group col-md-${props.width}`}>
		<label>NPWP <span className="text-danger">*</span></label>
		<div className="input-group">
			<InputMask 
				mask="99.999.999.9-999.999" 
				placeholder="__.___.___._-___.___" 
				maskChar="_"
				name="npwp"
				className="form-control"
				defaultValue={ props.value }
				value={ props.value ? props.value : '' }
				onChange={ props.onChange }
				required
				pattern="\d{2}[.]\d{3}[.]\d{3}[.]\d{1}[-]\d{3}[.]\d{3}"
			/>
		</div>
	</div>

export const NamaWPInput = props => 
	<div className={`form-group col-md-${props.width}`}>
		<label>Nama WP <span className="text-danger">*</span></label>
		<div className="input-group">
			<input 
				type="text"
				name="nama_wp" 
				className="form-control" 
				placeholder="Otomatis Terisi Jika NPWP Ditemukan"
				disabled={ props.disabled }
				defaultValue={ props.value }
				value={ props.value ? props.value : '' }
				onChange={ props.onChange }
				required
			/>
		</div>
	</div>

export const NamaPenerimaInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Nama Penerima <span className="text-danger">*</span></label>
		<div className="input-group">
			<input 
				type="text" 
				name="nama_penerima" 
				className="form-control"
				required
				defaultValue={ props.value }
				onChange={ props.onChange }
				value={ props.value ? props.value : '' }
			/>
		</div>
	</div>

export const TglTerimaInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Tanggal Terima <span className="text-danger">*</span></label>
		<div className="input-group">
			<InputMask 
				mask="99/99/9999" 
				placeholder="dd/mm/yyyy" 
				name="tgl_terima" 
				className="form-control"
				required
				pattern="[0-3]\d.[0-1]\d.20[0-1]\d"
				defaultValue={ props.value }
				value={ props.value ? props.value : '' }
				onChange={ props.onChange }
			/>
		</div>
	</div>

export const StatusPBKInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Status <span className="text-danger">*</span></label>
		<div className="input-group">
			<select
				name="status_pbk" 
				className="form-control"
				defaultValue={ props.value }
				onChange={ props.onChange }
				required
			>
				<option value="Terima">Terima</option>
				<option value="Tolak">Tolak</option>
			</select>
		</div>
	</div>

export const NoPBKInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Nomor <span className="text-danger">*</span></label>
		<div className="input-group">
			<input 
				type="number" 
				name="nomor_pbk" 
				className="form-control" 
				min={ 1 }
				value={ props.value ? props.value : '' }
				onChange={ props.onChange }
				required
				pattern="\d*"
			/>
		</div>
	</div>

export const GudangInput = props => 
	<div className={`form-group col-md-${props.width}`}>
		<label>Gudang <span className="text-danger">*</span></label>
		<div className="input-group">
			<select
				name="gudang" 
				className="form-control"
				defaultValue={ props.value }
				onChange={ props.onChange }
				required
			>
				<option value="1">Gudang 1</option>
				<option value="2">Gudang 2</option>
			</select>
		</div>
	</div>

export const KdLokasiInput = props => 
	<div className={`form-group col-md-${props.width}`}>
		<label>Lokasi <span className="text-danger">*</span></label>
		<div className="input-group">
			<input 
				type="text" 
				name="kd_lokasi" 
				className="form-control" 
				placeholder="A6012"
				value={ props.value ? props.value : '' }
				defaultValue={ props.value }
				onChange={ props.onChange }
				required
				pattern="\w{1,2}\d{4}"
			/>
		</div>
	</div>

export const MasaPajakInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Masa Pajak</label>
		<div className="input-group">
			<input 
				type="number"
				name="masa_pajak"
				className="form-control"
				min="0"
				max="12"
				placeholder={ new Date().getMonth() }
				defaultValue={ props.value }
				onChange={ props.onChange }
				required={ props.required }
			/>
		</div>
	</div>

export const TahunPajakInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Tahun Pajak</label>
		<div className="input-group">
			<input 
				type="number" 
				name="tahun_pajak" 
				className="form-control" 
				min={ new Date().getFullYear() - 15 }
				max={ new Date().getFullYear() }
				placeholder={ new Date().getFullYear() }
				defaultValue={ props.value }
				onChange={ props.onChange }
			/>
		</div>
	</div>

export const UrutanInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Urutan <span className="text-danger">*</span></label>
		<div className="input-group">
			<input 
				type="number"
				name="urutan"
				className="form-control"
				placeholder="1"
				min="1"
				step="any"
				defaultValue={ props.value }
				onChange={ props.onChange }
				required
			/>
		</div>
	</div>

export const FileInput = props => 
	<div className={`form-group col-md-${props.width}`}>
		<label>Lampiran <span className="text-warning" style={{ fontSize: '.75em' }}>pdf only!</span></label>
		<div className="input-group">
			<input 
				id="file"
				type="file" 
				name="file"
				accept="application/pdf"
				className="form-control-file"
				onChange={ props.onChange }
			/>
		</div>
	</div>

export const KeteranganInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Keterangan</label>
		<div className="input-group">
			<textarea 
				name="ket_lain" 
				rows="2" 
				className="form-control"
				defaultValue={ props.value }
				value={ props.value ? props.value : '' }
				onChange={ props.onChange }
			></textarea>
		</div>
	</div>

export const ButtonSubmit = props => 
	<div className={`form-group col-md-${props.width}`}>
		<button type="submit" className={`btn btn-primary float-${props.float}`}>Simpan</button>
	</div>