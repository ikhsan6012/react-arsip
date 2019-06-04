import React, { Component } from 'react'
import InputMask from 'react-input-mask'
import swal from 'sweetalert'

import HasilWP from './HasilWP'
import HasilLokasi from './HasilLokasi'
import HasilPenerima from './HasilPenerima'

import { fetchDataGQL2, handleErrors } from '../../../helpers'

export default class Cari extends Component {
	state = {
		wps: [],
		berkas: [],
	}

	Hasil = ''

	kriteriaHandler = e => {
		const input_kriteria = document.getElementsByName('input_kriteria')
		input_kriteria.forEach(ik => {
			ik.hidden = true
			ik.required = false
			if(ik.classList.contains(`${e.target.value}`)){
				ik.hidden = false
				ik.required = true
			}
			if(ik.classList.contains('penerima')){
				ik.required = false
			}
		})
		this.Hasil = ''
		this.forceUpdate()
	}
	
	changeHandler = e => {
		e.target.value = e.target.value.toUpperCase()
	}
	
	submitHandler = e => {
		e.preventDefault()
		this.setState({ isHiddenHasilWP: true })
		let body
		const kriteria = document.querySelector('[name=kriteria]').value
		switch(kriteria) {
			case 'npwp':
				body = {query: `{
					wps(npwp: "${document.querySelector('.npwp').value}") {
						_id
						npwp
						nama_wp
					}
				}`}
				fetchDataGQL2(body)
					.then(({data, errors}) => {
						if(errors) return handleErrors(errors)
						this.Hasil = <HasilWP
							wps={ data.wps } 
							berkas={ this.state.berkas } 
							lihatBerkas={ this.lihatBerkas } 
							ket_berkas={ this.state.ket_berkas }
							deleteBerkas={ this.deleteBerkas }
						/>
						this.setState({ wps: data.wps })
					})
					.catch(err => { throw err })
				break
			case 'nama_wp':
				body = {query: `{
					wps(nama_wp: "${document.querySelector('.nama_wp').value}") {
						_id
						npwp
						nama_wp
					}
				}`}
				fetchDataGQL2(body)
					.then(({data, errors}) => {
						if(errors) return handleErrors(errors)
						this.Hasil = <HasilWP
							wps={ data.wps } 
							berkas={ this.state.berkas } 
							lihatBerkas={ this.lihatBerkas } 
							ket_berkas={ this.state.ket_berkas }
							deleteBerkas={ this.deleteBerkas }
						/>
						this.setState({ wps: data.wps })
					})
					.catch(err => { throw err })
				break
			case 'lokasi':
				const gudang = document.getElementById('gudang').value
				const kd_lokasi = document.getElementById('kd_lokasi').value
				body = {query: `{
					berkas: berkases(by: lokasi, gudang: ${gudang}, kd_lokasi: "${kd_lokasi}") {
						_id
						ket_berkas {
							kd_berkas
							nama_berkas
						}
						pemilik {
							npwp
							nama_wp
						}
						penerima{
							nama_penerima
							tgl_terima
						}
						lokasi {
							gudang
							kd_lokasi
						}
						masa_pajak
						tahun_pajak
						urutan
						ket_lain
					}
				}`}
				fetchDataGQL2(body)
					.then(({data, errors}) => {
						if(errors) return handleErrors(errors)
						this.Hasil = <HasilLokasi
							ket_berkas={ this.state.ket_berkas }
							berkas={ data.berkas }
							deleteBerkas={ this.deleteBerkas }
						/>
						this.forceUpdate()
					})
					.catch(err => { throw err })
				break
			case 'penerima':
				const nama_penerima = document.getElementById('nama_penerima').value
				const tgl_terima = document.getElementById('tgl_terima').value
				body = {query: `{
					penerima: penerimas(${!tgl_terima ? `nama_penerima: "${nama_penerima}"` : !nama_penerima ? `tgl_terima: "${tgl_terima}"` : `tgl_terima: "${tgl_terima}", nama_penerima: "${nama_penerima}"`}){
						_id
						nama_penerima
						tgl_terima
					}
				}`}
				fetchDataGQL2(body)
					.then(({data, errors}) => {
						if(errors) return handleErrors(errors)
						this.Hasil = <HasilPenerima
							penerima={ data.penerima } 
							ket_berkas={ this.state.ket_berkas }
							deleteBerkas={ this.deleteBerkas }
						/>
						this.forceUpdate()
					})
					.catch(err => { throw err })
				break
			default:
				return
		}
	}

	deleteBerkas = e => {
		const id = e.target.getAttribute('value')
		swal('Apakah Anda yakin akan menghapus berkas?', {
			icon: 'warning',
			dangerMode: true,
			buttons: ['Batal', true]
		}).then(res => {
			if(res) {
				const body = {query: `
					mutation {
						berkas: deleteBerkas(id: "${id}") {
							pemilik {
								_id
							}
							penerima {
								_id
							}
						}
					}
				`}
				const kriteria = document.querySelector('[name=kriteria]').value
				fetchDataGQL2(body)
					.then(({data, errors}) => {
						if(errors) return handleErrors(errors)
						return swal('Berkas Berhasil Dihapus!', { icon: 'success' })
							.then(() => {
								if(kriteria === 'npwp' || kriteria === 'nama_wp') {
									return document.querySelector(`button[value="${data.berkas.pemilik._id}"]`).click()
								}
								if(kriteria === 'penerima') {
									return document.querySelector(`button[value="${data.berkas.penerima._id}"]`).click()
								}
								return document.getElementById('cariBerkas').click()
							})
					})
					.catch(err => { throw err })
			}
		})
	}

	componentDidMount(){
		const body = { query: `{
			ket_berkas: ketBerkases(projection: "-berkas") {
				_id
				kd_berkas
				nama_berkas
			}
		}`}
		fetchDataGQL2(body)
			.then(({data, errors}) => {
				if(errors) return handleErrors(errors)
				this.setState({ ket_berkas: data.ket_berkas })
			})
			.catch(err => this.setState({
				isError: true,
				errMsg: err
			}))
	}

	render(){
		return(
			<section className="content">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<div className="card">
								<div className="card-header d-flex p-0">
									<div className="col-md-12">
										<div className="form-group col-md-12">
											<form onSubmit={ this.submitHandler }>
												<div className="row">
													<label>Cari Berdasarkan:</label>
													<div className="input-group">
														<select name="kriteria" className="form-control col-md-2" onChange={ this.kriteriaHandler }>
															<option value="npwp">NPWP</option>
															<option value="nama_wp">Nama WP</option>
															<option value="lokasi">Lokasi</option>
															<option value="penerima">Penerima</option>
														</select>
														<InputMask 
															name="input_kriteria" 
															className="form-control col-md-3 npwp" 
															placeholder="NPWP" 
															type="text"
															mask="99.999.999.9" 
															maskChar="_"
															required
															pattern="\d{2}[.]\d{3}[.]\d{3}[.]\d{1}"
															id="npwp"
														/>
														<input
															id="nama_wp" 
															name="input_kriteria" 
															className="form-control col-md-5 nama_wp" 
															placeholder="Nama WP" 
															type="text" 
															hidden 
															onChange={this.changeHandler}
															pattern="[A-Z0-9 ]{3,}"
														/>
														<select id="gudang" name="input_kriteria" className="form-control col-md-2 lokasi" hidden>
															<option value="" hidden>Gudang</option>
															<option value="1">1</option>
															<option value="2">2</option>
														</select>
														<input 
															id="kd_lokasi" 
															name="input_kriteria" 
															className="form-control col-md-2 lokasi" 
															placeholder="Lokasi" 
															type="text" 
															hidden 
															pattern="\w{1,2}\d{4}"
															onChange={this.changeHandler}
														/>
														<InputMask 
															mask="99/99/9999" 
															id="tgl_terima"
															name="input_kriteria" 
															className="form-control col-md-2 penerima"  
															placeholder="Tgl Terima" 
															type="text" 
															hidden
															pattern="[0-3]\d.[0-1]\d.20[0-2]\d"
														/>
														<input 
															id="nama_penerima" 
															name="input_kriteria" 
															className="form-control col-md-5 penerima" 
															placeholder="Nama Penerima" 
															type="text" 
															hidden 
															pattern="[A-Z0-9 ]{3,}"
															onChange={this.changeHandler}
														/>
														<button id="cariBerkas" className="form-control btn btn-primary col-md-1">Cari</button>
													</div>
												</div>
											</form>
										</div>
									</div>
								</div>
								{ this.Hasil }
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	}
}