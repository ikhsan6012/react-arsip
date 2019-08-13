import React, { Fragment, useState, useEffect } from 'react'
import { uploadDocument, editDocument, deleteDocument, deleteBerkas } from '../../../functions/aksi'
import { handleBtnFocus } from '../../../functions/cari'
import swal from 'sweetalert';

const hasToken = !!localStorage.getItem('token')
const kriteria = document.querySelector('[name=kriteria]').value

export const UploadDonwloadIcon = ({ berkas }) => {
	const handleClick = e => {
		e.persist()
		const btn = e.target
		if(berkas.file) return window.open(`${process.env.REACT_APP_API_SERVER}/lampiran/${ berkas.file }`)
		if(!hasToken) return swal('Anda Tidak Mempunyai Akses!', { icon: 'error' }).then(() => btn.focus())
		const uploadInput = document.querySelector(`.uploadDocument[data-id="${ berkas._id }"]`)
		uploadInput.click()
	}

	return(
		<Fragment>
			<button className="icon icon-updown mr-2" onClick={ handleClick } data-file={ berkas.file || false }>
				<i className={`fa fa-${ berkas.file ? 'download' : 'upload' } text-${ berkas.file ? 'primary' : hasToken ? 'success' : 'secondary' }`} 
					title="Lihat Dokumen"></i>
				<input
					type="file"
					accept="application/pdf" 
					className="uploadDocument" 
					data-id={ berkas._id }
					hidden 
					onChange={ uploadDocument.bind(this, { berkas, kriteria }) }/>
			</button>
		</Fragment>
	)
}

export const EditDocumentIcon = ({ berkas }) => {
	const handleClick = e => {
		const btn = e.target
		if(!hasToken) return swal('Anda Tidak Mempunyai Akses!', { icon: 'error' }).then(() => btn.focus())
		if(!berkas.file) return document.querySelector(`.uploadDocument[data-id="${ berkas._id }"]`).click()
		const editInput = document.querySelector(`.editDocument[data-id="${ berkas._id }"]`)
		editInput.click()
	}

	return(
		<Fragment>
			<button className="icon icon-eddoc mr-2" onClick={ handleClick }>
				<i className={`fa fa-pencil text-${ hasToken && berkas.file ? 'warning' : 'secondary' }`} 
					title="Edit Dokumen"></i>
				<input 
					type="file" 
					className="editDocument" 
					accept="application/pdf" 
					data-id={ berkas._id }
					hidden 
					onChange={ editDocument.bind(this, { berkas, kriteria }) }/>
			</button>
		</Fragment>
	)
}

export const DeleteDocumentIcon = ({ berkas }) => {
	return(
		<button className="icon icon-deldoc mr-2" onClick={ deleteDocument.bind(this, { hasToken, berkas, kriteria }) }>
			<i 
				className={`fa fa-times text-${ hasToken && berkas.file ? 'danger' : 'secondary' }`} 
				title="Hapus Dokumen"></i>
		</button>
	)
}

export const EditBerkas = ({ berkas }) => {
	const [modalEdit, setModalEdit] = useState('')

	useEffect(() => {
		document.addEventListener('keypress', handleBtnFocus, true)
	}, [])
	
	const showModal = async () => {
		if(!hasToken) return swal('Anda Tidak Mempunyai Akses!', { icon: 'error' })
		const ModalEdit = await import('./ModalEdit.js')
		setModalEdit(
			<ModalEdit.default berkas={ berkas } closeModal = { closeModal } />
		)
	}

	const closeModal = ({ key, success }) => {
		if(key === 'Escape' || success){
			const modalEdit = document.getElementById('modalEdit')
			modalEdit.classList.remove('show')
			setTimeout(() => {
				if(success){
					const kriteria = document.querySelector('[name=kriteria]').value
					if(kriteria.match(/lokasi/i)) document.querySelector('#cariKriteria').click()
					else if(kriteria.match(/npwp|nama_wp/)) document.querySelector(`button[data-id="${ berkas.pemilik._id }"]`).click()
					else if(kriteria.match(/penerima/)) document.querySelector(`button[data-id="${ berkas.penerima._id }"]`).click()
				}
				setModalEdit('')
			}, 150)
		}
	}

	return(<>
		<button className="icon icon-edber mr-2" onClick={ showModal }>
			<i className={`fa fa-pencil-square-o text-${ hasToken ? 'warning' : 'secondary' }`} 
				title="Edit Berkas"></i>
		</button>
		{ modalEdit }
	</>)
}

export const DeleteBerkas = ({ berkas }) => {
	return(
		<button className="icon icon-delber mr-2" onClick={ deleteBerkas.bind(this, ({ hasToken, berkas, kriteria })) }>
			<i className={`fa fa-trash text-${ hasToken ? 'danger' : 'secondary' }`}
				title="Hapus Berkas"></i>
		</button>
	)
}

export const TransactionBerkas = ({ berkas }) => {
	const [modalTransaksi, setModalTransaksi] = useState('')
	
	const showModal = async e => {
		if(!hasToken) return swal('Anda Tidak Mempunyai Akses!', { icon: 'error' })
		const ModalTransaksi = await import('./ModalTransaksi')
		setModalTransaksi(
			<ModalTransaksi.default berkas={ berkas } closeModal={ closeModal } />
		)
	}

	const closeModal = ({ key, success }) => {
		if(key === 'Escape' || success){
			const modalTransaksi = document.getElementById('modalTransaksi')
			modalTransaksi.classList.remove('show')
			setTimeout(() => {
				if(success){
					const kriteria = document.querySelector('[name=kriteria]').value
					if(kriteria.match(/lokasi/i)) document.querySelector('#cariKriteria').click()
					else if(kriteria.match(/npwp|nama_wp/)) document.querySelector(`button[data-id="${ berkas.pemilik._id }"]`).click()
					else if(kriteria.match(/penerima/)) document.querySelector(`button[data-id="${ berkas.penerima._id }"]`).click()
				}
				setModalTransaksi('')
			}, 150)
		}
	}
	
	return(<>
		<button className="icon icon-tranber" onClick={ showModal } >
			<i className={`fa fa-exchange text-${ hasToken ? 'info' : 'secondary' }`}
				title="Pinjam Berkas"></i>
		</button>
		{ modalTransaksi }
	</>)
}