import swal from 'sweetalert'
import { fetchDataGQL, setToken, handleErrors } from './helpers'

// Handle WP Error
const errorHandler = ({ msg, npwp, formData }, {
	setIsError, setErrMsg, setDisableNamaWP, setFormData
}) => {
	setIsError(true)
	setErrMsg(msg)
	setDisableNamaWP(false)
	setFormData({ ...formData, npwp, nama_wp: '' })
	console.error(msg)
}

// Check NPWP
const checkNPWP = async ({ npwp, formData }, {
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
			if(!data.wp) return errorHandler({ msg: 'NPWP Tidak Ditemukan', npwp, formData }, {
				setIsError, setErrMsg, setDisableNamaWP, setFormData
			})
			setFormData({ ...formData, npwp, nama_wp: data.wp.nama_wp })
			setIsError(false)
			setDisableNamaWP(true)
			setErrMsg('')
		} catch (err) {
			errorHandler(err.message, npwp)
		}
	} else {
		setDisableNamaWP(false)
		setFormData({ ...formData, npwp, nama_wp: '' })
	}
}

// Handle Input Change
export const changeHandler = (formData, {
	setIsError, setErrMsg, setDisableNamaWP, setFormData
}, e) => {
	const el = e.target
	const name = el.name
	const value = el.value.toUpperCase()
	if(name === 'npwp') return checkNPWP({ npwp: value, formData }, {
		setIsError, setErrMsg, setDisableNamaWP, setFormData 
	})
	setFormData({ ...formData, [name]: value })
}

// Handle File Change
export const fileHandler = (formData, { setFormData }, e) => {
	let file = e.target.files[0]
	if(file.type !== 'application/pdf'){
		return e.target.classList.add('invalid')
	}
	e.target.classList.remove('invalid')
	setFormData({ ...formData, file })
}

// Save Data
export const addBerkas = async ({ formData, kd_berkas, isError, errMsg }, { setFormData }, e) => {
	e.preventDefault()
	let isSend = true
	let status, file
	if(formData.file) {
		const data = new FormData()
		data.append('file', formData.file)
		data.append('npwp', formData.npwp)
		data.append('kd_berkas', kd_berkas)
		const res = await fetch(`${process.env.REACT_APP_API_SERVER}/upload`, {
			method: 'post',
			body: data
		})
		const json = await res.json()
		file = json.file
	}
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
		const body = {
			query: `mutation {
				berkas: addBerkas(input: {
					kd_berkas: "${kd_berkas}"
					lokasi: {
						gudang: ${formData.gudang}
						kd_lokasi: "${formData.kd_lokasi}"
					}
					pemilik: {
						npwp: "${formData.npwp}"
						nama_wp: "${formData.nama_wp}"
						${ status ? `status: "${status}"` : `` }
					}
					${ formData.masa_pajak ? `masa_pajak: ${formData.masa_pajak}` : `` }
					${ formData.tahun_pajak ? `tahun_pajak: ${formData.tahun_pajak}` : `` }
					urutan: ${formData.urutan}
					${ file ? `file: "${file}"` : `` }
					${ formData.ket_lain ? `ket_lain: "${ formData.ket_lain }"` : `` }
				}) {
					ket_berkas {
						nama_berkas
					}
					pemilik {
						npwp
						nama_wp
					}
					masa_pajak
					tahun_pajak
					urutan
				}
			}`
		}
		try {
			const {data, errors, extensions} = await fetchDataGQL(body)
			setToken(extensions)
			if(errors) return handleErrors(errors)
			const alert = document.querySelector('.alert')
			alert.classList.remove('alert-danger')
			alert.classList.add('alert-success')
			alert.innerHTML = `${data.berkas.ket_berkas.nama_berkas} => Nama: ${data.berkas.pemilik.nama_wp}, NPWP: ${data.berkas.pemilik.npwp}`
			alert.hidden = false
			setFormData({ ...formData, npwp: '', nama_wp: '', file: null })
			document.querySelector('[name=npwp]').focus()
			document.getElementById('file').value = ''
		} catch (err) {
			const alert = document.querySelector('.alert')
			alert.classList.remove('alert-danger')
			alert.classList.add('alert-success')
			alert.innerHTML = errMsg
			alert.hidden = true
		}
	}
}