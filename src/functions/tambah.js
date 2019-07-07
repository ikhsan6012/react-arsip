import swal from 'sweetalert'
import { fetchDataGQL, setToken, handleErrors } from './helpers'

// Handle WP Error
const errorHandler = ({ msg, npwp, formData, fdls }, {
	setIsError, setErrMsg, setDisableNamaWP, setFormData
}) => {
	if(setIsError) setIsError(true)
	if(setErrMsg) setErrMsg(msg)
	if(setDisableNamaWP) setDisableNamaWP(false)
	localStorage.setItem('formData', JSON.stringify({ ...fdls, npwp }))
	setFormData({ ...formData, npwp, nama_wp: '' })
	console.error(msg)
}

// Check NPWP
const checkNPWP = async ({ npwp, formData, fdls }, {
	setIsError, setErrMsg, setDisableNamaWP, setFormData 
}) => {
	if(npwp.replace(/[_.-]/g, '').length === 15){
		// Get Nama WP
		const body = {
			query: `{
				wp(npwp: "${npwp}") {
					nama_wp
				}
			}`
		}
		try {
			const {data, extensions} = await fetchDataGQL(body)
			setToken(extensions)
			if(!data.wp) {
				return errorHandler({ msg: 'NPWP Tidak Ditemukan', npwp, formData, fdls }, {
					setIsError, setErrMsg, setDisableNamaWP, setFormData
				})
			}
			localStorage.setItem('formData', JSON.stringify({ ...fdls, npwp, nama_wp: data.wp.nama_wp }))
			setFormData({ ...formData, npwp, nama_wp: data.wp.nama_wp })
			if(setIsError) setIsError(false)
			if(setDisableNamaWP) setDisableNamaWP(true)
			if(setErrMsg) setErrMsg('')
		} catch (err) {
			errorHandler(err.message, npwp)
		}
	} else {
		if(setDisableNamaWP) setDisableNamaWP(false)
		localStorage.setItem('formData', JSON.stringify({ ...fdls, npwp, nama_wp: '' }))
		setFormData({ ...formData, npwp, nama_wp: '' })
	}
}

// Handle Input Change
export const changeHandler = (formData, {
	setIsError, setErrMsg, setDisableNamaWP, setFormData
}, e) => {
	const el = e.target
	const name = el.name
	let value
	if(name.match(/status_pbk/)) value = el.value
	else value = el.value.toUpperCase()
	const fdls = JSON.parse(localStorage.getItem('formData'))
	if(name === 'npwp') return checkNPWP({ npwp: value, formData, fdls }, {
		setIsError, setErrMsg, setDisableNamaWP, setFormData 
	})
	localStorage.setItem('formData', JSON.stringify({ ...fdls, [name]: value }))
	setFormData({ ...formData, [name]: value })
}

// Handle File Change
export const fileHandler = ({ setFile }, e) => {
	let file = e.target.files[0]
	if(file.type !== 'application/pdf'){
		return e.target.classList.add('invalid')
	}
	e.target.classList.remove('invalid')
	setFile(file)
}

// Add Berkas
export const addBerkas = async ({ formData, kd_berkas, file, isError, errMsg }, { setFormData, setFile }, e) => {
	e.preventDefault()
	const alert = document.querySelector('.alert')
	alert.hidden = true
	let isSend = true
	let status
	if(isError) {
		const value = await swal(`${errMsg}. Pilih Status WP untuk menyimpan!`, {
			buttons: {
				cancel: 'Batal',
				AKTIF: 'Aktif',
				PINDAH: 'Pindah',
				DE: 'DE'
			}
		})
		value !== null ? status = value : isSend = false
	}
	if(isSend) {
		if(file) {
			const data = new FormData()
			data.append('file', file)
			if(formData.npwp) data.append('npwp', formData.npwp)
			data.append('kd_berkas', kd_berkas)
			const res = await fetch(`${process.env.REACT_APP_API_SERVER}/upload`, {
				method: 'post',
				body: data
			})
			const json = await res.json()
			file = json.file
		}
		const username = localStorage.getItem('username')
		const body = {
			query: `mutation {
				berkas: addBerkas(username: "${ username }" input: {
					kd_berkas: "${ kd_berkas }"
					lokasi: {
						gudang: ${ formData.gudang }
						kd_lokasi: "${ formData.kd_lokasi }"
					}
					${ formData.npwp ? `pemilik: {
						npwp: "${ formData.npwp }"
						nama_wp: "${ formData.nama_wp }"
						${ status ? `status: "${ status }"` : `` }
					}` : `` }
					${ formData.nama_penerima ? `penerima: {
						nama_penerima: "${ formData.nama_penerima }"
						tgl_terima: "${ formData.tgl_terima }"
						${ status ? `status: "${ status }"` : `` }
					}` : `` }
					${ formData.status_pbk ? `status_pbk: "${ formData.status_pbk }"` : `` }
					${ formData.nomor_pbk ? `nomor_pbk: ${ formData.nomor_pbk }` : `` }
					${ formData.tahun_pbk ? `tahun_pbk: ${ formData.tahun_pbk }` : `` }
					${ formData.masa_pajak ? `masa_pajak: ${ formData.masa_pajak }` : `` }
					${ formData.tahun_pajak ? `tahun_pajak: ${ formData.tahun_pajak }` : `` }
					urutan: ${ formData.urutan }
					${ file ? `file: "${ file }"` : `` }
					${ formData.ket_lain ? `ket_lain: """${ formData.ket_lain }"""` : `` }
				}) {
					_id
					ket_berkas{
						_id
						kd_berkas
						nama_berkas
					}
					pemilik{
						_id
						npwp
						nama_wp
					}
					masa_pajak
					tahun_pajak
					penerima{
						_id
						nama_penerima
						tgl_terima
					}
					status_pbk
					nomor_pbk
					tahun_pbk
					urutan
					ket_lain
				}
			}`
		}
		try {
			const { data, errors, extensions } = await fetchDataGQL(body)
			setToken(extensions)
			if(errors) return handleErrors(errors)
			alert.classList.remove('alert-danger')
			alert.classList.add('alert-success')
			alert.innerHTML = data.berkas.pemilik
				? `${ data.berkas.ket_berkas.nama_berkas } => Nama: ${ data.berkas.pemilik.nama_wp }, NPWP: ${ data.berkas.pemilik.npwp }`
				: `${ data.berkas.ket_berkas.nama_berkas } => Penerima: ${ data.berkas.penerima.nama_penerima }, Tanggal Terima: ${ data.berkas.penerima.nama_penerima }`
			alert.hidden = false
			setFormData({ ...formData, npwp: '', nama_wp: '' })
			data.berkas.pemilik
				? document.querySelector('[name=npwp]').focus()
				: document.querySelector('[name=nama_penerima]').focus()
			document.getElementById('file').value = ''
			setFile(null)
		} catch (err) {
			const alert = document.querySelector('.alert')
			alert.classList.add('alert-danger')
			alert.classList.remove('alert-success')
			alert.innerHTML = err
			alert.hidden = true
		}
	}
}