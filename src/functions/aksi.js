import swal from 'sweetalert'
import { fetchDataGQL, setToken, handleErrors } from './helpers'

const username = localStorage.getItem('username')

const handleMutation = (kriteria, berkas) => {
	if(kriteria.match(/npwp|nama_wp|penerima/)) {
		const id = kriteria.match(/npwp|nama_wp/) ? berkas.pemilik._id : berkas.penerima._id
		return document.querySelector(`button[data-id="${ id }"]`).click()
	}
	else return document.querySelector('#cariKriteria').click()
}

export const uploadDocument = async ({ berkas, kriteria }, e) => {
	e.persist()
	const btn = e.target.parentNode
	const file = e.target.files[0]
	if(file.type !== 'application/pdf'){
		e.target.value = ''
		await swal('File Yang Diunggah Harus Dalam Format .pdf!', { icon: 'error' })
		return btn.focus()
	}
	const isUpload = await swal('Anda Yakin Akan Mengunggah Dokumen?', {
		icon: 'warning',
		buttons: ['Batal', 'Ya']
	})
	if(!isUpload) {
		e.target.value = ''
		return btn.focus()
	}
	try {
		const formData = new FormData()
		formData.append('file', file)
		formData.append('kd_berkas', berkas.ket_berkas.kd_berkas)
		if(berkas.pemilik) formData.append('npwp', berkas.pemilik.npwp)
		const upload = await fetch(`${process.env.REACT_APP_API_SERVER}/upload`, {
			method: 'post',
			body: formData
		})
		const res = await upload.json()
		const body = { query: `mutation{
			berkas: addBerkasDocument(id: "${ berkas._id }", file: "${ res.file }") {
				_id
			}
		}`}
		const { errors, extensions } = await fetchDataGQL(body)
		setToken(extensions)
		if(errors) return handleErrors(errors)
		await swal('Berhasil Mengunggah Dokumen...', { icon: 'success' })
		e.target.value = ''
		btn.focus()
		return handleMutation(kriteria, berkas)
	} catch (err) {
		console.error(err)
		await swal('Gagal Mengunggah Dokumen!', { icon: 'error' })
		btn.focus()
	}
}

export const editDocument = async ({ berkas, kriteria }, e) => {
	e.persist()
	const btn = e.target.parentNode
	const file = e.target.files[0]
	if(file.type !== 'application/pdf'){
		e.target.value = ''
		await swal('File Yang Diunggah Harus Dalam Format .pdf!', { icon: 'error' })
		return btn.focus()
	}
	const isEdit = await swal('Anda Yakin Akan Mengganti Dokumen?', {
		icon: 'warning',
		buttons: ['Batal', 'Ya']
	})
	if(!isEdit) {
		e.target.value = ''
		return btn.focus()
	}
	try {
		const formData = new FormData()
		formData.append('file', file)
		formData.append('filename', berkas.file)
		const upload = await fetch(`${process.env.REACT_APP_API_SERVER}/upload`, {
			method: 'post',
			body: formData
		})
		await upload.json()
		await swal('Berhasil Mengganti Dokumen...', { icon: 'success' })
		e.target.value = ''
		btn.focus()
		return handleMutation(kriteria, berkas)
	} catch (err) {
		console.error(err)
		await swal('Gagal Mengganti Dokumen!', { icon: 'error' })
		btn.focus()
	}
}

export const deleteDocument = async ({ hasToken, berkas, kriteria }, e) => {
	const btn = e.target
	if(!hasToken) return swal('Anda Tidak Mempunyai Akses!', { icon: 'error' }).then(() => btn.focus())
	if(!berkas.file) return swal('Tidak Ada Dokumen Yang Dihapus!', { icon: 'warning' }).then(() => btn.focus())
	const isDelete = await swal('Anda Yakin Akan Menghapus Dokumen?', {
		icon: 'warning',
		buttons: ['Batal', 'Ya']
	})
	if(!isDelete) return false
	try {
		const body = {query: `mutation{
			deleteBerkasDocument(id: "${ berkas._id }"){
				_id
			}
		}`}
		const { errors, extensions } = await fetchDataGQL(body)
		setToken(extensions)
		if(errors) return handleErrors(errors)
		const del = await fetch(`${process.env.REACT_APP_API_SERVER}/delete`, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ file: berkas.file })
		})
		const res = await del.json()
		if(res.errors) return handleErrors(res.errors)
		await swal('Berhasil Menghapus Dokumen...', { icon: 'success' })
		btn.focus()
		return handleMutation(kriteria, berkas)
	} catch (err) {
		console.error(err)
		swal('Gagal Menghapus Dokumen!', { icon: 'error' })
	}
}



export const deleteBerkas = async ({ hasToken, berkas, kriteria }) => {
	if(!hasToken) return swal('Anda Tidak Mempunyai Akses!', { icon: 'error' })
	try {
		const isDelete = await swal('Anda Yakin Akan Menghapus Dokumen?', {
			icon: 'warning',
			buttons: ['Batal', 'Ya']
		})
		if(!isDelete) return false
			const body = {query: `mutation{
			deleteBerkas(id: "${ berkas._id }", username: "${ username }"){
				_id
			}
		}`}
		const { errors, extensions } = await fetchDataGQL(body)
		setToken(extensions)
		if(errors) return handleErrors(errors)
		if(berkas.file){
			const del = await fetch(`${process.env.REACT_APP_API_SERVER}/delete`, {
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ file: berkas.file })
			})
			const res = await del.json()
			if(res.errors) return handleErrors(res.errors)
		}
		await swal('Berhasil Menghapus Berkas...', { icon: 'success' })
		return handleMutation(kriteria, berkas)
	} catch (err) {
		console.error(err)
		swal('Gagal Menghapus Dokumen!', { icon: 'error' })
	}
}