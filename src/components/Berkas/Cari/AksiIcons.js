import React, { Fragment } from 'react'
import { uploadDocument, editDocument, deleteDocument, deleteBerkas } from '../../../functions/aksi'

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

	return(
		<Fragment>
			<i 
				style={{ cursor: hasToken || berkas.file ? 'pointer' : 'not-allowed' }} 
				className={`fa fa-${ berkas.file ? 'download' : 'upload' } text-${ berkas.file ? 'primary' : hasToken ? 'success' : 'secondary' } mr-2`} 
				data-file={ berkas.file || false } 
				title="Lihat Dokumen"
				onClick={ handleClick }>
			</i>
			<input 
				type="file" 
				accept="application/pdf" 
				className="uploadDocument" 
				data-id={ berkas._id }
				hidden 
				onChange={ uploadDocument.bind(this, { berkas, kriteria }) }/>
		</Fragment>
	)
}

export const EditDocumentIcon = ({ berkas }) => {
	const handleClick = () => {
		if(!hasToken || !berkas.file) return false
		const editInput = document.querySelector(`.editDocument[data-id="${ berkas._id }"]`)
		editInput.click()
	}

	return(
		<Fragment>
			<i
				style={{cursor: hasToken && berkas.file ? 'pointer' : 'not-allowed'}} 
				className={`fa fa-pencil text-${ hasToken && berkas.file ? 'warning' : 'secondary' } mr-2`} 
				title="Edit Dokumen"
				onClick={ handleClick }>
			</i>
			<input 
				type="file" 
				className="editDocument" 
				accept="application/pdf" 
				data-id={ berkas._id }
				hidden 
				onChange={ editDocument.bind(this, { berkas, kriteria }) }/>
		</Fragment>
	)
}

export const DeleteDocumentIcon = ({ berkas }) => {
	return(
		<i 
			style={{cursor: hasToken && berkas.file ? 'pointer' : 'not-allowed'}} 
			className={`fa fa-times text-${ hasToken && berkas.file ? 'danger' : 'secondary' } mr-2`} 
			title="Hapus Dokumen"
			onClick={ deleteDocument.bind(this, { hasToken, berkas, kriteria }) }>
		</i>
	)
}

export const EditBerkas = ({ berkas }) => {
	const showModal = () => {
		if(!hasToken) return false
	}

	return(
		<i 
			style={{ cursor: hasToken ? 'pointer' : 'not-allowed' }} 
			className={`fa fa-pencil-square-o text-${ hasToken ? 'warning' : 'secondary' } mr-2`} 
			title="Edit Berkas"
			onClick={ showModal }>
		</i>
	)
}

export const DeleteBerkas = ({ berkas }) => {
	return(
		<i 
			style={{ cursor: hasToken ? 'pointer' : 'not-allowed' }} 
			className={`fa fa-trash text-${ hasToken ? 'danger' : 'secondary' }`}
			title="Hapus Berkas"
			onClick={ deleteBerkas.bind(this, ({ hasToken, berkas, kriteria })) }>
		</i>
	)
}