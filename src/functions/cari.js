import { fetchDataGQL, setToken, handleErrors } from './helpers'
import swal from 'sweetalert';

// Set Value To Uppercase
export const changeHandler = e => {
	e.target.value = e.target.value.toUpperCase()
	document.querySelector('#formSearch').dataset.page = 1
}

// Submit Search
export const submitHandler = async ({ kriteria, props }, e) => {
	e.preventDefault()
	if(kriteria.match(/lokasi/i) && !localStorage.getItem('token')) return swal({
		text: 'Anda Tidak Memiliki Akses...',
		icon: 'error'
	})
	const form = document.querySelector('#formSearch')
	const page = form.dataset.page
	const limit = [page * 5 - 5, 5]
	const input = [...form.querySelectorAll('input, select')].filter((v, i) => i > 0)
	const formData = {}
	input.forEach(v => formData[v.id] = v.value)
	const body = {query: `{
		${ kriteria.match(/npwp|nama_wp/) ? `
			wps(by: ${ kriteria }, search: {
				${ kriteria }: "${ formData[kriteria] }"
			}, begin: ${ limit[0] }, end: ${ limit[1] }){
				_id
				npwp
				nama_wp
			}
			totalWPs(${ kriteria }: "${ formData[kriteria] }")
		` : kriteria.match(/lokasi/) ? `
			berkases(by: lokasi, gudang: ${ formData.gudang }, kd_lokasi: "${ formData.kd_lokasi }") {
				_id
				ket_berkas {
					_id
					kd_berkas
					nama_berkas
				}
				pemilik {
					_id
					npwp
					nama_wp
				}
				penerima {
					_id
					nama_penerima
					tgl_terima
				}
				masa_pajak
				tahun_pajak
				pembetulan
				status_pbk
				nomor_pbk
				tahun_pbk
				lokasi {
					_id
					gudang
					kd_lokasi
					completed
					time_completed
				}
				urutan
				file
				ket_lain
			}
		` : kriteria.match(/penerima/) ? `
			penerimas(${ formData.tgl_terima ? `tgl_terima: "${ formData.tgl_terima }",` : `` } ${ formData.nama_penerima ? `nama_penerima: "${ formData.nama_penerima }"` : `` }){
				_id
				nama_penerima
				tgl_terima
			}
		` : ``
	}}`}
	const { data, errors, extensions } = await fetchDataGQL(body)
	setToken(extensions)
	if(errors) return handleErrors(errors)
	props.hasil(data)
}

// Handle Page
export const pageHandler = page => {
	const form = document.querySelector('#formSearch')
	const submitButton = document.querySelector('#cariBerkas')
	form.dataset.page = page
	submitButton.click()
}

// Get Berkas
export const getBerkas = async ({ setBerkases, wps, setWPs, penerimas, setPenerimas }, e) => {
	const id = e.target.dataset.id
	const by = wps ? 'pemilik' : 'penerima'
	const body = {query: `{
		berkases(by: ${ by }, id: "${id}"){
			_id
			ket_berkas {
				_id
				kd_berkas
				nama_berkas
			}
			pemilik {
				_id
				npwp
				nama_wp
			}
			penerima {
				_id
				nama_penerima
				tgl_terima
			}
			masa_pajak
			tahun_pajak
			pembetulan
			status_pbk
			nomor_pbk
			tahun_pbk
			lokasi {
				_id
				gudang
				kd_lokasi
				completed
				time_completed
			}
			urutan
			file
			ket_lain
		}
	}`}
	const { data, errors, extensions } = await fetchDataGQL(body)
	setToken(extensions)
	if(errors) return handleErrors(errors)
	setBerkases(data.berkases)
	if(wps) return setWPs(wps.filter(wp => wp._id === id))
	if(penerimas) return setPenerimas(penerimas.filter(p => p._id === id))
}

export const handleBtnFocus = ({ key, ctrlKey }) => {
	const activeElement = document.activeElement
	let listElement
	switch (key) {
		case 'A':
			listElement = document.querySelectorAll('.icon-updown')
			break
		case 'S':
			listElement = document.querySelectorAll('.icon-eddoc')
			break
		case 'D':
			listElement = document.querySelectorAll('.icon-deldoc')
			break
		case 'F':
			listElement = document.querySelectorAll('.icon-edber')
			break
		case 'G':
			listElement = document.querySelectorAll('.icon-delber')
			break
		default:
			return false
		}
	const isActive = [...listElement].indexOf(activeElement)
	if(!ctrlKey) {
		if(isActive === listElement.length - 1) return listElement[0].focus()
		return listElement[isActive + 1].focus()
	}
	else {
		if(isActive === 0) return listElement[listElement.length - 1].focus()
		return listElement[isActive - 1].focus()
	}
}

export const setComplete = async (lokasi, isComplete, setIsComplete) => {
	try {
		const isSend = isComplete ?
			await swal('Apakah Anda Yakin?', {
				icon: 'warning',
				buttons: ['Batal', 'Ya']
			}) :
			await swal('Silahkan Masukkan Alasan Pembatalan...', {
				icon: 'warning',
				content: {
					element: 'input'
				},
				buttons: ['Batal', 'Ya']
			})
		if(isSend){
			const username = localStorage.getItem('username')
			const body = {query: `mutation{
				lokasi: setComplete(username: "${ username }", lokasi: "${ lokasi }", completed: ${ isComplete }, cancel_msg: ${ !isComplete ? `"${ isSend }"` : `null` }){
					completed
					time_completed
				}
			}`}
			const { data, errors, extensions } = await fetchDataGQL(body)
			setToken(extensions)
			if(errors) return handleErrors(errors)
			const completed = data.lokasi.completed
			if(completed) await swal({
				icon: 'success',
				text: 'Terima Kasih Telah Menyelesaikan Tugas Hari Ini...',
			})
			if(!completed) await swal({
				icon: 'info',
				text: 'Tetap Semangat! Tinggal Dikit Lagi Kok...',
			})
			setIsComplete(data.lokasi.completed)
		}
	} catch (err) {
		console.log(err)
	}
}

export const deleteLokasi = async lokasi => {
	const isDelete = await swal('Apakah Anda Yakin Akan Menghapus Lokasi ?', {
		icon: 'warning',
		buttons: ['Batal', 'Ya']
	})
	if(isDelete){
		try {
			const body = {query: `mutation{
				lokasi: deleteLokasi(id: "${ lokasi }"){
					_id
				}
			}`}
			const { extensions, errors } = await fetchDataGQL(body)
			setToken(extensions)
			if(errors) return handleErrors(errors)
			document.getElementById('cariKriteria').click()
		} catch (err) {
			console.log(err)
		}
	}
}