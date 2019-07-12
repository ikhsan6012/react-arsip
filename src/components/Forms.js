import React from 'react'
import InputMask from 'react-input-mask'

export const KdBerkasInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Jenis Berkas { props.required === false ? '' : <span className="text-danger">*</span> }</label>
		<div className="input-group">
			<select
				name="kd_berkas" 
				className="form-control"
				value={ props.value || 1 }
				onChange={ props.onChange }
				required={ props.required || true }
				disabled={ props.disabled || false }
			>
				<option value="" hidden>Pilih Jenis Berkas</option>
				{ props.options }
			</select>
		</div>
	</div>

export const NPWPInput = props => 
	<div className={`form-group col-md-${props.width}`}>
		<label>NPWP { props.required === false ? '' : <span className="text-danger">*</span> }</label>
		<div className="input-group">
			<InputMask 
				mask="99.999.999.9-999.999" 
				placeholder="__.___.___._-___.___" 
				maskChar="_"
				name="npwp"
				className="form-control"
				value={ props.value ? props.value : '' }
				onChange={ props.onChange }
				pattern="\d{2}[.]\d{3}[.]\d{3}[.]\d{1}[-]\d{3}[.]\d{3}"
				required={ props.required || true }
				disabled={ props.disabled || false }
			/>
		</div>
	</div>

export const NamaWPInput = props => 
	<div className={`form-group col-md-${props.width}`}>
		<label>Nama WP { props.required === false ? '' : <span className="text-danger">*</span> }</label>
		<div className="input-group">
			<input 
				type="text"
				name="nama_wp" 
				className="form-control" 
				placeholder="Otomatis Terisi Jika NPWP Ditemukan"
				value={ props.value ? props.value : '' }
				onChange={ props.onChange }
				required={ props.required || true }
				disabled={ props.disabled || false }
			/>
		</div>
	</div>

export const NamaPenerimaInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Nama Penerima { props.required === false ? '' : <span className="text-danger">*</span> }</label>
		<div className="input-group">
			<input 
				type="text" 
				name="nama_penerima" 
				className="form-control"
				value={ props.value ? props.value : '' }
				onChange={ props.onChange }
				required={ props.required || true }
				disabled={ props.disabled || false }
			/>
		</div>
	</div>

export const TglTerimaInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Tanggal Terima { props.required === false ? '' : <span className="text-danger">*</span> }</label>
		<div className="input-group">
			<InputMask 
				mask="99/99/9999" 
				placeholder="dd/mm/yyyy" 
				name="tgl_terima" 
				className="form-control"
				pattern="[0-3]\d.[0-1]\d.20[0-1]\d"
				value={ props.value ? props.value : '' }
				onChange={ props.onChange }
				required={ props.required || true }
				disabled={ props.disabled || false }
			/>
		</div>
	</div>

export const StatusPBKInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Status PBK { props.required === false ? '' : <span className="text-danger">*</span> }</label>
		<div className="input-group">
			<select
				name="status_pbk" 
				className="form-control"
				value={ props.value || 'Terima' }
				onChange={ props.onChange }
				required={ props.required || true }
				disabled={ props.disabled || false }
			>
				<option value="Terima">Terima</option>
				<option value="Tolak">Tolak</option>
			</select>
		</div>
	</div>

export const NoPBKInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Nomor PBK { props.required === false ? '' : <span className="text-danger">*</span> }</label>
		<div className="input-group">
			<input 
				type="number" 
				name="nomor_pbk" 
				className="form-control" 
				min={ 1 }
				pattern="\d*"
				value={ props.value || '' }
				onChange={ props.onChange }
				required={ props.required || true }
				disabled={ props.disabled || false }
			/>
		</div>
	</div>

export const TahunPBKInput = props => 
	<div className={`form-group col-md-${props.width}`}>
		<label>Tahun PBK { props.required === false ? '' : <span className="text-danger">*</span> }</label>
		<div className="input-group">
			<input 
				type="number"
				name="tahun_pbk" 
				className="form-control" 
				min={ new Date().getFullYear() - 20 }
				max={ new Date().getFullYear() }
				placeholder={ new Date().getFullYear() }
				pattern="\d*"
				value={ props.value || '' }
				onChange={ props.onChange }
				required={ props.required || true }
				disabled={ props.disabled || false }
			/>
		</div>
	</div>

export const GudangInput = props => 
	<div className={`form-group col-md-${props.width}`}>
		<label>Gudang { props.required === false ? '' : <span className="text-danger">*</span> }</label>
		<div className="input-group">
			<select
				name="gudang" 
				className="form-control"
				value={ props.value || '' }
				onChange={ props.onChange }
				required={ props.required || true }
				disabled={ props.disabled || false }
			>
				<option value="1">Gudang 1</option>
				<option value="2">Gudang 2</option>
			</select>
		</div>
	</div>

export const KdLokasiInput = props => 
	<div className={`form-group col-md-${props.width}`}>
		<label>Lokasi { props.required === false ? '' : <span className="text-danger">*</span> }</label>
		<div className="input-group">
			<input 
				type="text" 
				name="kd_lokasi" 
				className="form-control" 
				placeholder="A6012"
				value={ props.value || '' }
				pattern="\w{1,2}\d{4}"
				onChange={ props.onChange }
				required={ props.required || true }
				disabled={ props.disabled || false }
			/>
		</div>
	</div>

export const MasaPajakInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Masa Pajak { props.required && <span className="text-danger">*</span> }</label>
		<div className="input-group">
			<input 
				type="number"
				name="masa_pajak"
				className="form-control"
				min="0"
				max="12"
				placeholder={ new Date().getMonth() }
				value={ props.value >= 0 ? props.value : ''}
				onChange={ props.onChange }
				required={ props.required === false ? false : true }
				disabled={ props.disabled === true ? true : false }
			/>
		</div>
	</div>

export const TahunPajakInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Tahun Pajak { props.required && <span className="text-danger">*</span> }</label>
		<div className="input-group">
			<input 
				type="number" 
				name="tahun_pajak" 
				className="form-control" 
				min={ new Date().getFullYear() - 15 }
				max={ new Date().getFullYear() }
				placeholder={ new Date().getFullYear() }
				value={ props.value || '' }
				onChange={ props.onChange }
				required={ props.required === false ? false : true }
				disabled={ props.disabled === true ? true : false }
			/>
		</div>
	</div>

export const PembetulanInput = props =>
<div className={`form-group col-md-${props.width}`}>
	<label>Pembetulan { props.required && <span className="text-danger">*</span> }</label>
	<div className="input-group">
		<input 
			type="number" 
			name="pembetulan" 
			className="form-control" 
			min={ 0 }
			value={ props.value || '' }
			onChange={ props.onChange }
			required={ props.required === true ? true : false }
			disabled={ props.disabled === true ? true : false }
		/>
	</div>
</div>

export const UrutanInput = props =>
	<div className={`form-group col-md-${props.width}`}>
		<label>Urutan { props.required === false ? '' : <span className="text-danger">*</span> }</label>
		<div className="input-group">
			<input 
				type="number"
				name="urutan"
				className="form-control"
				placeholder="1"
				min="1"
				step="any"
				value={ props.value || '' }
				onChange={ props.onChange }
				required={ props.required || true }
				disabled={ props.disabled || false }
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
				required={ props.required || false }
				disabled={ props.disabled || false }
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
				value={ props.value || '' }
				onChange={ props.onChange }
				required={ props.required || false }
				disabled={ props.disabled || false }
			></textarea>
		</div>
	</div>

export const ButtonSubmit = props => 
	<div className={`form-group col-md-${props.width}`}>
		<button type="submit" className={`btn btn-primary float-${props.float}`}>Simpan</button>
	</div>