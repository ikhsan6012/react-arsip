import React, { useEffect, useState } from 'react'
import swal from 'sweetalert'
import { handleBtnFocus } from '../../../functions/cari'
import { TujuanTransaksi, NoND, TahunND, FullND, TanggalND, KeteranganInput } from '../../Forms'
import { fetchDataGQL, handleErrors, setToken } from '../../../functions/helpers'

const ModalTransaksi = props => {
	const [state, setState] = useState({
		seksi: {}, 
		no_nd_pinjam: 1, 
		tahun_nd_pinjam: new Date().getFullYear(), 
		tgl_nd_pinjam: '', 
		no_nd_kirim: 1, 
		tahun_nd_kirim: new Date().getFullYear(), 
		tgl_nd_kirim: '', 
		berkas: props.berkas._id,
		ket_lain: ''
	})
	const [options, setOptions] = useState('')

	useEffect(() => {
		document.removeEventListener('keypress', handleBtnFocus, true)
		document.addEventListener('keydown', props.closeModal, true)
		return () => {
			document.removeEventListener('keydown', props.closeModal, true)
		}
	}, [props.closeModal])

	useEffect(() => {
		const getSeksi = async () => {
			try {
				const body = {query: `{
					seksis {
						_id
						kode
						nama_seksi
					}
				}`}
				const { data, extensions, errors } = await fetchDataGQL(body)
				setToken(extensions)
				if(errors) return handleErrors(errors)
				setTimeout(() => {
					document.getElementsByName('seksi')[0].focus()
				}, 150)
				setOptions(<>{ data.seksis.map(seksi => 
					<option value={`${ seksi.kode }-${ seksi._id }`} key={ seksi._id }>{ seksi.nama_seksi }</option>
				) }</>)
			} catch (err) {
				throw err
			}
		}
		getSeksi()
		const modalTransaksi = document.querySelector('#modalTransaksi')
		modalTransaksi.style.display = 'block'
		setTimeout(() => {
			modalTransaksi.classList.add('show')
		}, 150)
	}, [])

	const handleChange = e => {
		const name = e.target.name
		let value = e.target.value
		let newState = { ...state }
		if(name === 'seksi') {
			const arr = value.split('-')
			newState.seksi = { kode: arr[0], _id: arr[1] }
		}
		else newState[name] = value
		setState(newState)
	}

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const body = {query: `mutation {
				addTransaksi(input: {
					berkas: "${ state.berkas }"
					seksi: "${ state.seksi._id }"
					no_nd_pinjam: ${ state.no_nd_pinjam }
					tahun_nd_pinjam: ${ state.tahun_nd_pinjam }
					tgl_nd_pinjam: "${ state.tgl_nd_pinjam }"
					no_nd_kirim: ${ state.no_nd_kirim }
					tahun_nd_kirim: ${ state.tahun_nd_kirim }
					tgl_nd_kirim: "${ state.tgl_nd_kirim }"
					${ state.ket_lain ? `keterangan: "${ state.ket_lain }"` : '' } 
				}){
					_id
				}
			}`}
			const { extensions, errors } = await fetchDataGQL(body)
			setToken(extensions)
			if(errors) return handleErrors(errors)
			await swal('Berhasil Menyimpan Data!', { icon: 'success', timer: 2000 })
			props.closeModal({ key: 'Escape', success: true })
		} catch (err) {
			throw err
		}
	}
	
	return(
		<div className="modal fade" id="modalTransaksi">
			<div className="modal-dialog modal-dialog-centered" style={{ minWidth: '40vw' }}>
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Konfirmasi Peminjaman</h5>
						<button className="close-modal" onClick={ props.closeModal.bind(this, { key: 'Escape' }) }>
							<span>&times;</span>
						</button>
					</div>
					<form onSubmit={ handleSubmit }>
						<div className="modal-body" style={{ overflow: 'auto', maxHeight: '70vh' }}>
							<div className="row">
								<TujuanTransaksi
									width="12"
									value={`${ state.seksi.kode }-${ state.seksi._id }`}
									options={ options }
									onChange={ handleChange }
								/>
								<NoND 
									width="3"
									name="pinjam"
									label="Pinjam"
									value={ state.no_nd_pinjam }
									onChange={ handleChange }
								/>
								<TahunND 
									width="4"
									name="pinjam"
									label="Pinjam"
									value={ state.tahun_nd_pinjam }
									onChange={ handleChange }
								/>
								<TanggalND 
									width="5"
									name="pinjam"
									label="Pinjam"
									value={ state.tgl_nd_pinjam }
									onChange={ handleChange }
								/>
								<FullND 
									width="12" 
									value={`ND-${ state.no_nd_pinjam }/WJP.05/KP.02${ state.seksi.kode || '__' }/${ state.tahun_nd_pinjam }`} 
								/>
								<NoND 
									width="3"
									name="kirim"
									label="Kirim"
									value={ state.no_nd_kirim }
									onChange={ handleChange }
								/>
								<TahunND 
									width="4"
									name="kirim"
									label="Kirim"
									value={ state.tahun_nd_kirim }
									onChange={ handleChange }
								/>
								<TanggalND 
									width="5"
									name="kirim"
									label="Kirim"
									value={ state.tgl_nd_kirim }
									onChange={ handleChange }
								/>
								<FullND 
									width="12" 
									value={`ND-${ state.no_nd_kirim }/WJP.05/KP.0203/${ state.tahun_nd_kirim }`} 
								/>
								<KeteranganInput 
									width="12"
									value={ state.ket_lain }
									onChange={ handleChange }
								/>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary close-modal" onClick={ props.closeModal.bind(this, { key: 'Escape' }) }>Batal</button>
								<button type="submit" className="btn btn-primary">Simpan</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
export default ModalTransaksi