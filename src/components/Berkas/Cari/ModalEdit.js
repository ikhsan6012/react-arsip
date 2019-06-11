import React, { Component } from 'react'
import InputMask from 'react-input-mask'
import swal from 'sweetalert'

import { fetchDataGQL2, handleErrors, setToken } from '../../../helpers'

export default class ModalEdit extends Component {
	state = {
		formData: {},
		disableNamaWP: true,
		disablePemilik: true,
		disablePenerima: true,
		errWPMsg: null,
		kriteria: null,
	}

	closeModal = e => {
		const modalEdit = document.getElementById('modalEdit')
		modalEdit.classList.remove('show')
		setTimeout(() => {
			modalEdit.style.display = 'none'
		}, 150);
		this.setState({ formData: JSON.parse(localStorage.getItem('formData')) })
		localStorage.removeItem('formData')
	}

	changeHandler = async e => {
		const el = e.target
		const name = el.name
		const name2 = el.name.split('-')
		const value = el.value.toUpperCase()
		const formData = this.state.formData
		if(name2.length > 1) formData[name2[0]][name2[1]] = value
		else formData[name] = value
		await this.setState({ formData })
		if(name2[1] === 'npwp') return this.checkNPWP(value)
	}

	checkNPWP = npwp => {
		if(npwp.replace(/[_.-]/g, '').length < 15) {
			return this.setState({
				disableNamaWP: false,
				formData: { 
					...this.state.formData, 
					pemilik: { ...this.state.formData.pemilik, nama_wp: '' }  
				} 
			})
		}
		if(npwp.replace(/[_.-]/g, '').length === 15){
			// Get Nama WP
			const body = {
				query: `{
					wp(npwp: "${npwp}") {
						nama_wp
					}
				}`
			}
			fetchDataGQL2(body)
				.then(({data, errors, extensions}) => {
					setToken(extensions)
					if(errors) return handleErrors(errors)
					if(!data.wp){
						return this.setState({ errWPMsg: 'NPWP Tidak Ditemukan' })
					}
					return this.setState({
						disableNamaWP: true,
						formData: { 
							...this.state.formData,
							pemilik: { ...this.state.formData.pemilik, nama_wp: data.wp.nama_wp }  
						} ,
						errWPMsg: null
					})
				})
		}
	}

	editSubmit = async e => {
		e.preventDefault()
		const formData = this.state.formData
		let isSend = false
		let status
		if(this.state.errWPMsg) {
			status = await swal(this.state.errWPMsg, 'Pilih Status WP untuk menyimpan!', {
				buttons: {
					cancel: 'Batal',
					AKTIF: 'Aktif',
					PINDAH: 'Pindah',
					DE: 'DE'
				},
				icon: 'warning'
			})
		} else {
			isSend = true
		}
		if(isSend || status){
			const body = {query: `
				mutation {
					berkas: editBerkas(id: "${formData._id}", input: {
						lokasi: {
							gudang: ${ formData.lokasi.gudang }
							kd_lokasi: "${ formData.lokasi.kd_lokasi }"
						}
						${ formData.pemilik ? `pemilik: {
							npwp: "${ formData.pemilik.npwp }"
							nama_wp: "${ formData.pemilik.nama_wp }"
							${ status ? `status: "${ status }"` : `` }
						}` : `` }
						${ formData.penerima ? `penerima: {
							nama_penerima: "${ formData.penerima.nama_penerima }"
							tgl_terima: "${ formData.penerima.tgl_terima }"
							${ status ? `status: "${ status }"` : `` }
						}` : `` }
						kd_berkas: "${ formData.ket_berkas.kd_berkas }"
						${ formData.masa_pajak ? `masa_pajak: ${ formData.masa_pajak }` : `` }
						${ formData.tahun_pajak ? `tahun_pajak: ${ formData.tahun_pajak }` : `` }
						urutan: ${ formData.urutan }
						${ formData.ket_lain ? `ket_lain: "${ formData.ket_lain }"` : `` }
					}) {
						_id
					}
				}
			`}
			return fetchDataGQL2(body)
				.then(async ({data, errors, extensions}) => {
					setToken(extensions)
					if(errors) return handleErrors(errors)
					await swal('Berhasil Menyimpan Data...', { icon: 'success' })
					this.closeModal()
					const kriteria = this.state.kriteria
					const formData = JSON.parse(localStorage.getItem('formData'))
					if(kriteria.match(/npwp|nama_wp/i)){
 						return this.props.lihatBerkas(formData.pemilik._id)
					} else if(kriteria.match(/penerima/i)){
						return this.props.lihatBerkas(formData.penerima._id)
					} else {
						return document.querySelector('#cariBerkas').click()
					}
				})
				.catch(err => { throw err })
		}
	}

	componentWillReceiveProps({ berkas }){
		if(!Object.keys(this.props.berkas).length && Object.keys(berkas).length){
			localStorage.setItem('formData', JSON.stringify(berkas))
			this.setState({ kriteria: document.querySelector('[name=kriteria]').value })
		}
		if(this.props.berkas !== berkas){
			this.setState({ formData: berkas })
		}
		if(berkas.pemilik){
			this.setState({ disablePemilik: false })
		}
		if(berkas.penerima){
			this.setState({ disablePenerima: false })
		}
	}
	
	render(){
		const options = this.props.ket_berkas.map(opt => {
			return <option value={ opt.kd_berkas } key={ opt._id }>{ opt.nama_berkas }</option>
		})

		return (
			<div className="modal fade" id="modalEdit" tabIndex="-1" role="dialog">
				<div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: "50vw" }}>
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Konfirmasi Perubahan</h5>
							<button className="close" onClick={ this.closeModal }>
								<span>&times;</span>
							</button>
						</div>
						<form onSubmit={ this.editSubmit }>
							<div className="modal-body">
								<div className="row">
									<div className="form-group col-md-6">
										<label>Gudang</label>
										<div className="input-group">
											<select
												name="lokasi-gudang" 
												className="form-control"
												value={ this.state.formData.lokasi ? this.state.formData.lokasi.gudang : 1 }
												onChange={ this.changeHandler }
												required
											>
												<option value="1">Gudang 1</option>
												<option value="2">Gudang 2</option>
											</select>
										</div>
									</div>
									<div className="form-group col-md-4">
										<label>Lokasi</label>
										<div className="input-group">
											<input 
												type="text" 
												name="lokasi-kd_lokasi" 
												className="form-control" 
												placeholder="A6012"
												onChange={ this.changeHandler }
												pattern="\w{1,2}\d{4}"
												value={ this.state.formData.lokasi ? this.state.formData.lokasi.kd_lokasi : '' }
												required
											/>
										</div>
									</div>
									<div className="form-group col-md-2">
										<label>Urutan</label>
										<div className="input-group">
											<input 
												type="number"
												name="urutan"
												className="form-control"
												placeholder="1"
												min="1"
												step="any"
												value={ this.state.formData.urutan ? this.state.formData.urutan : '' }
												onChange={ this.changeHandler }
												required
											/>
										</div>
									</div>
									<div className="form-group col-md-5">
										<label>NPWP</label>
										<div className="input-group">
											<InputMask 
												mask="99.999.999.9-999.999" 
												placeholder="__.___.___._-___.___" 
												maskChar="_"
												name="pemilik-npwp"
												className="form-control"
												pattern="\d{2}[.]\d{3}[.]\d{3}[.]\d{1}[-]\d{3}[.]\d{3}"
												value={ this.state.formData.pemilik ? this.state.formData.pemilik.npwp : '' }
												onChange={ this.changeHandler }
												required={ !this.state.disablePemilik }
												disabled={ this.state.disablePemilik }
											/>
										</div>
									</div>
									<div className="form-group col-md-7">
										<label>Nama WP</label>
										<div className="input-group">
											<input 
												type="text"
												name="pemilik-nama_wp" 
												className="form-control" 
												placeholder="Otomatis Terisi Jika NPWP Ditemukan"
												value={ this.state.formData.pemilik ? this.state.formData.pemilik.nama_wp : '' }
												onChange={ this.changeHandler }
												required={ !this.state.disablePemilik }
												disabled={ this.state.disableNamaWP }
											/>
										</div>
									</div>
									<div className="form-group col-md-7">
										<label>Nama Penerima</label>
										<div className="input-group">
											<input 
												type="text" 
												name="penerima-nama_penerima" 
												className="form-control"
												onChange={ this.changeHandler }
												value={ this.state.formData.penerima ? this.state.formData.penerima.nama_penerima : '' }
												required={ !this.state.disablePenerima }
												disabled={ this.state.disablePenerima }
											/>
										</div>
									</div>
									<div className="form-group col-md-5">
										<label>Tanggal Terima</label>
										<div className="input-group">
											<InputMask 
												mask="99/99/9999" 
												placeholder="dd/mm/yyyy" 
												name="penerima-tgl_terima" 
												className="form-control"
												pattern="[0-3]\d.[0-1]\d.20[0-1]\d"
												value={ this.state.formData.penerima ? this.state.formData.penerima.tgl_terima : '' }
												onChange={ this.changeHandler }
												required={ !this.state.disablePenerima }
												disabled={ this.state.disablePenerima }
											/>
										</div>
									</div>
									<div className="form-group col-md-6">
										<label>Jenis Berkas</label>
										<div className="input-group">
											<select
												name="ket_berkas-kd_berkas" 
												className="form-control"
												required
												value={ this.state.formData.ket_berkas ? this.state.formData.ket_berkas.kd_berkas : '' }
												onChange={ this.changeHandler }
											>
												<option value="" hidden>Pilih Jenis Berkas</option>
												{ options }
											</select>
										</div>
									</div>
									<div className="form-group col-md-3">
										<label>Masa Pajak</label>
										<div className="input-group">
											<input 
												type="number" 
												name="masa_pajak" 
												className="form-control" 
												min="0" 
												max="12" 
												value={ this.state.formData.masa_pajak ? this.state.formData.masa_pajak : '' }
												onChange={ this.changeHandler }
											/>
										</div>
									</div><div className="form-group col-md-3">
										<label>Tahun Pajak</label>
										<div className="input-group">
											<input 
												type="number" 
												name="tahun_pajak" 
												className="form-control" 
												min={ new Date().getFullYear() - 15 }
												max={ new Date().getFullYear() }
												value={ this.state.formData.tahun_pajak ? this.state.formData.tahun_pajak : '' }
												onChange={ this.changeHandler }
											/>
										</div>
									</div>
									<div className="form-group col-md-12">
										<label>Keterangan</label>
										<div className="input-group">
											<textarea 
												name="ket_lain" 
												rows="2" 
												className="form-control"
												defaultValue={ this.state.formData.ket_lain }
												value={ this.state.formData.ket_lain ? this.state.formData.ket_lain : '' }
												onChange={ this.changeHandler }
											></textarea>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" onClick={ this.closeModal }>Batal</button>
								<button type="submit" className="btn btn-primary">Simpan</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	}
}