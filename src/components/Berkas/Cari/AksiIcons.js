import React, { Fragment } from 'react'
import swal from 'sweetalert'
import { fetchDataGQL, handleErrors, setToken } from '../../../functions/helpers'

const hasToken = !!localStorage.getItem('token')
const kriteria = document.querySelector('[name=kriteria]').value

export const UploadDonwloadIcon = ({ berkas }) => {
	const handleClick = () => {
		if(berkas.file) return window.open(`${process.env.REACT_APP_API_SERVER}/lampiran/${ berkas.file }`)
		if(hasToken){
			const uploadInput = document.querySelector(`.uploadDocument[data-id="${ berkas._id }"]`)
			uploadInput.click()
		}
	}

	const uploadDocument = async e => {
		e.persist()
		const file = e.target.files[0]
		if(file.type !== 'application/pdf'){
			e.target.value = ''
			return swal('File Yang Diunggah Harus Dalam Format .pdf!', { icon: 'error' })
		}
		const isUpload = await swal('Anda Yakin Akan Mengunggah Dokumen?', {
			icon: 'warning',
			buttons: ['Batal', 'Ya']
		})
		if(!isUpload) return e.target.value = ''
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
			if(kriteria.match(/npwp|nama_wp|penerima/)) return document.querySelector(`button[data-id="${berkas.pemilik._id}"]`).click()
			else return document.querySelector('#cariKriteria').click()
		} catch (err) {
			console.error(err)
			swal('Gagal Mengunggah Dokumen!', { icon: 'error' })
		}
	}

	return(
		<Fragment>
			<i 
				style={{ cursor: hasToken || berkas.file ? 'pointer' : 'not-allowed' }} 
				data-file={ berkas.file || false } 
				className={`fa fa-${ berkas.file ? 'download' : 'upload' } text-${ berkas.file ? 'primary' : hasToken ? 'success' : 'secondary' } mr-2`} 
				title="Lihat Dokumen"
				onClick={ handleClick }>
			</i>
			<input type="file" accept="application/pdf" className="uploadDocument" data-id={ berkas._id } hidden onChange={ uploadDocument }/>
		</Fragment>
	)
}

export const EditDocumentIcon = ({ berkas }) => {
	const handleClick = () => {
		if(!hasToken || !berkas.file) return false
		const editInput = document.querySelector(`.editDocument[data-id="${ berkas._id }"]`)
		editInput.click()
	}

	const editDocument = async e => {
		e.persist()
		const file = e.target.files[0]
		if(file.type !== 'application/pdf'){
			e.target.value = ''
			return swal('File Yang Diunggah Harus Dalam Format .pdf!', { icon: 'error' })
		}
		const isEdit = await swal('Anda Yakin Akan Mengganti Dokumen?', {
			icon: 'warning',
			buttons: ['Batal', 'Ya']
		})
		if(!isEdit) return e.target.value = ''
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
			if(kriteria.match(/npwp|nama_wp|penerima/)) return document.querySelector(`button[data-id="${berkas.pemilik._id}"]`).click()
			else return document.querySelector('#cariKriteria').click()
		} catch (err) {
			console.error(err)
			swal('Gagal Mengganti Dokumen!', { icon: 'error' })
		}
	}

	return(
		<Fragment>
			<i
				style={{cursor: hasToken && berkas.file ? 'pointer' : 'not-allowed'}} 
				className={`fa fa-pencil text-${ hasToken && berkas.file ? 'warning' : 'secondary' } mr-2`} 
				title="Edit Dokumen"
				onClick={ handleClick }>
			</i>
			<input type="file" accept="application/pdf" className="editDocument" data-id={ berkas._id } hidden onChange={ editDocument }/>
		</Fragment>
	)
}

export const DeleteDocumentIcon = ({ berkas }) => {
	const deleteDocument = async e => {
		if(!(hasToken && berkas.file)) return console.log('no')
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
			if(kriteria.match(/npwp|nama_wp|penerima/)) return document.querySelector(`button[data-id="${berkas.pemilik._id}"]`).click()
			else return document.querySelector('#cariKriteria').click()
		} catch (err) {
			console.error(err)
			swal('Gagal Menghapus Dokumen!', { icon: 'error' })
		}
	}

	return(
		<i 
			style={{cursor: hasToken && berkas.file ? 'pointer' : 'not-allowed'}} 
			className={`fa fa-times text-${ hasToken && berkas.file ? 'danger' : 'secondary' } mr-2`} 
			title="Hapus Dokumen"
			onClick={ deleteDocument }>
		</i>
	)
}