import React, { useState, useEffect } from 'react'
import { fetchDataGQL, handleErrors, setToken } from '../../../functions/helpers'
import { GudangInput, KdLokasiInput, UrutanInput, NPWPInput, NamaWPInput, NamaPenerimaInput, TglTerimaInput, KdBerkasInput, MasaPajakInput, TahunPajakInput, StatusPBKInput, NoPBKInput, TahunPBKInput, KeteranganInput, PembetulanInput } from '../../Forms'
import { changeHandler } from '../../../functions/tambah'
import { handleBtnFocus } from '../../../functions/cari'
import swal from 'sweetalert';

const ModalEdit = props => {
	const { berkas } = props
	const [formData, setFormData] = useState({})
	const [hasPemilik, setHasPemilik] = useState(false)
	const [disableNamaWP, setDisableNamaWP] = useState(false)
	const [hasPenerima, setHasPenerima] = useState(false)
	const [hasMasa, setHasMasa] = useState(false)
	const [isPBK, setIsPBK] = useState(false)
	const [isLain, setIsLain] = useState(false)
	const [isSPT, setIsSPT] = useState(false)
	const [by, setBy] = useState('npwp')
	const [isError, setIsError] = useState(false)
	const [errMsg, setErrMsg] = useState('')
	const username = localStorage.getItem('username')

	useEffect(() => {
		document.removeEventListener('keypress', handleBtnFocus, true)
		document.addEventListener('keydown', props.closeModal, true)
		setTimeout(() => {
			document.querySelector('[name=gudang]').focus()
		}, 150);
		return () => {
			document.removeEventListener('keydown', props.closeModal, true)
			localStorage.removeItem('formData')
			localStorage.removeItem('pemilik')
			localStorage.removeItem('penerima')
		}
	}, [props.closeModal])

	useEffect(() => {
		const fd = { ...berkas }
		fd.kd_berkas = fd.ket_berkas.kd_berkas
		fd.gudang = fd.lokasi.gudang
		fd.kd_lokasi = fd.lokasi.kd_lokasi
		delete fd.ket_berkas
		delete fd.lokasi
		if(fd.pemilik){
			fd.npwp = fd.pemilik.npwp
			fd.nama_wp = fd.pemilik.nama_wp
			delete fd.pemilik
			setHasPemilik(true)
			setDisableNamaWP(true)
			setIsSPT(fd.kd_berkas.match(/induk|pindah|pkp|sertel/i) ? false : true)
			setBy('npwp')
		}
		if(fd.penerima){
			fd.nama_penerima = fd.penerima.nama_penerima
			fd.tgl_terima = fd.penerima.tgl_terima
			delete fd.penerima
			setHasPenerima(true)
			setDisableNamaWP(true)
			setIsSPT(true)
			setBy('penerima')
		}
		if(fd.status_pbk) setIsPBK(true)
		if(fd.tahun_pajak) setHasMasa(true)
		localStorage.setItem('pemilik', JSON.stringify({ npwp: fd.npwp, nama_wp: fd.nama_wp }))
		localStorage.setItem('penerima', JSON.stringify({ nama_penerima: fd.nama_penerima, tgl_terima: fd.tgl_terima }))
		setFormData(fd)
		const modalEdit = document.querySelector('#modalEdit')
		modalEdit.style.display = 'block'
		setTimeout(() => {
			modalEdit.classList.add('show')
		}, 150)
	}, [berkas])

	const kd_berkasHandler = e => {
		const name = e.target.name
		const kd_berkas = e.target.value
		const { npwp, nama_wp } = JSON.parse(localStorage.getItem('pemilik'))
		const { nama_penerima, tgl_terima } = JSON.parse(localStorage.getItem('penerima'))
		if(kd_berkas.match(/induk|pindah|pkp|sertel/i)){
			setHasPemilik(true)
			setHasPenerima(false)
			setHasMasa(false)
			setIsPBK(false)
			setIsLain(false)
			setIsSPT(false)
			setBy('npwp')
			return setFormData({ 
				...formData, 
				nama_penerima: '', 
				tgl_terima: '', 
				status_pbk: '',
				nomor_pbk: '',
				tahun_pbk: '',
				[name]: kd_berkas, 
				npwp, 
				nama_wp
			})
		}
		if(kd_berkas.match(/pbk/i)){
			setHasPemilik(true)
			setHasPenerima(false)
			setHasMasa(false)
			setIsPBK(true)
			setIsLain(false)
			setIsSPT(false)
			setBy('npwp')
			return setFormData({ ...formData, nama_penerima: '', tgl_terima: '', [name]: kd_berkas, npwp, nama_wp })
		}
		if(kd_berkas.match(/lain/i)){
			setHasPemilik(true)
			setHasPenerima(false)
			setHasMasa(false)
			setIsPBK(false)
			setIsLain(true)
			setIsSPT(false)
			setBy('npwp')
			if(npwp || nama_wp) return setFormData({ 
				...formData, 
				status_pbk: '',
				nomor_pbk: '',
				tahun_pbk: '', 
				[name]: kd_berkas, 
				npwp, 
				nama_wp 
			})
			else return setFormData({ 
				...formData, 
				status_pbk: '',
				nomor_pbk: '',
				tahun_pbk: '', 
				nama_penerima: '', 
				tgl_terima: '' 
			})
		}
		if(kd_berkas.match(/spt|pph|ppn/i)){
			setBy(formData.npwp ? 'npwp' : 'penerima')
			setHasPemilik(formData.npwp ? true : false)
			setHasPenerima(formData.npwp ? false : true)
			setHasMasa(nama_penerima ? false : true)
			setIsLain(false)
			setIsSPT(true)
			if(nama_penerima || tgl_terima) return setFormData({ 
				...formData, 
				status_pbk: '',
				nomor_pbk: '',
				tahun_pbk: '', 
				[name]: kd_berkas, 
				nama_penerima, 
				tgl_terima 
			})
		}
		return setFormData({ ...formData, [name]: kd_berkas })
	}

	const handleBy = e => {
		const value = e.target.value
		setBy(value)
		if(value === 'npwp'){
			const { npwp, nama_wp } = JSON.parse(localStorage.getItem('pemilik'))
			setFormData({ ...formData, nama_penerima: '', tgl_terima: '', npwp, nama_wp })
			setHasPemilik(true)
			setIsLain(false)
			setHasMasa(true)
			setHasPenerima(false)
		}
		if(value === 'penerima'){
			const { nama_penerima, tgl_terima } = JSON.parse(localStorage.getItem('penerima'))
			setFormData({ 
				...formData, 
				npwp: '', 
				nama_wp: '', 
				tahun_pajak: '', 
				masa_pajak: '', 
				pembetulan: '', 
				nama_penerima, 
				tgl_terima 
			})
			setHasPenerima(true)
			setHasPemilik(false)
			setHasMasa(false)
			setDisableNamaWP(true)
			document.querySelector('[name=nama_wp]').disabled = true
		}
	}

	const handleSubmit = async e => {
		e.preventDefault()
		const status = isError ? await swal(`${ errMsg }. Pilih Status WP untuk menyimpan!`, {
			buttons: {
				cancel: 'Batal',
				AKTIF: 'Aktif',
				PINDAH: 'Pindah',
				DE: 'DE'
			}
		}) : null
		const isSend = !status ? await swal('Anda Yakin Akan Mengunggah Dokumen?', {
			icon: 'warning',
			buttons: ['Batal', 'Ya']
		}) : true
		if(isSend){
			const body = {query: `mutation{
				editBerkas(id: "${ berkas._id }", username: "${ username }", input: {
					lokasi: {
						gudang: ${ formData.gudang }
						kd_lokasi: "${ formData.kd_lokasi }"
					}
					${ formData.npwp ?
						`pemilik: {
							npwp: "${ formData.npwp }"
							nama_wp: "${ formData.nama_wp }"
							${ status ? `status: "${ status }"` : `` }
						}`
					: ``}
					kd_berkas: "${ formData.kd_berkas }"
					${ formData.nama_penerima ?
						`penerima: {
							nama_penerima: "${ formData.nama_penerima }"						
							tgl_terima: "${ formData.tgl_terima }"
						}`
					: `` }
					${ formData.masa_pajak ? `masa_pajak: ${ formData.masa_pajak }` : `` }
					${ formData.tahun_pajak ? `tahun_pajak: ${ formData.tahun_pajak }` : `` }
					${ formData.pembetulan ? `pembetulan: ${ formData.pembetulan }` : `` }
					${ formData.status_pbk ? `status_pbk: "${ formData.status_pbk }"` : `` }
					${ formData.nomor_pbk ? `nomor_pbk: ${ formData.nomor_pbk }` : `` }
					${ formData.tahun_pbk ? `tahun_pbk: ${ formData.tahun_pbk }` : `` }
					${ formData.urutan ? `urutan: ${ formData.urutan }` : `` }
					${ formData.ket_lain ? `ket_lain: """${ formData.ket_lain }"""` : `` }
				}){
					_id
				}
			}`}
			const { errors, extensions } = await fetchDataGQL(body)
			setToken(extensions)
			if(errors) return handleErrors(errors)
			await swal('Berhasil Mengedit Berkas!', { icon: 'success', timer: 2000 })
			props.closeModal({ key: 'Escape', success: true })
		}
	}

	// Options
	const options = JSON.parse(localStorage.getItem('ket_berkas')).map(opt =>
		<option key={ opt._id } value={ opt.kd_berkas }>{ opt.nama_berkas }</option>
	)

	return (
		<div className="modal fade" id="modalEdit">
			<div className="modal-dialog modal-dialog-centered" style={{ minWidth: '45vw' }}>
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Konfirmasi Perubahan</h5>
						<button className="close-modal" onClick={ props.closeModal.bind(this, { key: 'Escape' }) }>
							<span>&times;</span>
						</button>
					</div>
					<form onSubmit={ handleSubmit }>
						<div className="modal-body" style={{ overflow: 'auto', maxHeight: '70vh' }}>
							<div className="row">
								<GudangInput
									width="5"
									value={ formData.gudang }
									onChange={ changeHandler.bind(this, formData, { setFormData }) }
								/>
								<KdLokasiInput
									width="4"
									value={ formData.kd_lokasi }
									onChange={ changeHandler.bind(this, formData, { setFormData }) }
								/>
								<UrutanInput
									width="3"
									value={ formData.urutan }
									onChange={ changeHandler.bind(this, formData, { setFormData }) }
								/>
								<KdBerkasInput
									width="8"
									value={ formData.kd_berkas }
									options={ options }
									onChange={ kd_berkasHandler }
								/>
								<div className="form-group col-md-4">
									<label>Berdasarkan { isSPT ? <span className="text-danger">*</span> : '' }</label>
									<div className="input-group">
										<select
											name="by" 
											className="form-control"
											value={ by }
											required={ isSPT }
											disabled={ !isSPT }
											onChange={ handleBy }
										>
											<option value="npwp">NPWP</option>
											<option value="penerima">Penerima</option>
										</select>
									</div>
								</div>
								<NPWPInput
									width="5"
									value={ formData.npwp }
									required={ hasPemilik }
									disabled={ !hasPemilik }
									onChange={ changeHandler.bind(this, formData, { setFormData, setDisableNamaWP, setErrMsg, setIsError }) }
								/>
								<NamaWPInput
									width="7"
									value={ formData.nama_wp }
									required={ hasPemilik }
									disabled={ disableNamaWP }
									onChange={ changeHandler.bind(this, formData, { setFormData }) }
								/>
								<NamaPenerimaInput
									width="7"
									value={ formData.nama_penerima }
									required={ hasPenerima }
									disabled={ !hasPenerima }
									onChange={ changeHandler.bind(this, formData, { setFormData }) }
								/>
								<TglTerimaInput
									width="5"
									value={ formData.tgl_terima }
									required={ hasPenerima }
									disabled={ !hasPenerima }
									onChange={ changeHandler.bind(this, formData, { setFormData }) }
								/>
								<MasaPajakInput
									width="4"
									value={ formData.masa_pajak === 0 ? 0 : formData.masa_pajak || '' }
									required={ hasMasa }
									disabled={ !isLain && !hasMasa }
									onChange={ changeHandler.bind(this, formData, { setFormData }) }
								/>
								<TahunPajakInput
									width="4"
									value={ formData.tahun_pajak || '' }
									required={ hasMasa }
									disabled={ !isLain && !hasMasa }
									onChange={ changeHandler.bind(this, formData, { setFormData }) }
								/>
								<PembetulanInput
									width="4"
									value={ formData.pembetulan }
									disabled={ !isLain && !hasMasa }
									onChange={ changeHandler.bind(this, formData, { setFormData }) }
								/>
								<StatusPBKInput
									width="6"
									value={ formData.status_pbk }
									required={ isPBK }							
									disabled={ !isPBK }		
									onChange={ changeHandler.bind(this, formData, { setFormData }) }
								/>
								<NoPBKInput
									width="3"
									value={ formData.nomor_pbk }
									required={ isPBK }							
									disabled={ !isPBK }
									onChange={ changeHandler.bind(this, formData, { setFormData }) }
								/>
								<TahunPBKInput
									width="3"
									value={ formData.tahun_pbk }
									required={ isPBK }							
									disabled={ !isPBK }
									onChange={ changeHandler.bind(this, formData, { setFormData }) }
								/>
								<KeteranganInput
									width="12"
									value={ formData.ket_lain }
									onChange={ changeHandler.bind(this, formData, { setFormData }) }
								/>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary close-modal" onClick={ props.closeModal.bind(this, { key: 'Escape' }) }>Batal</button>
							<button type="submit" className="btn btn-primary">Simpan</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
export default ModalEdit