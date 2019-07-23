import swal from 'sweetalert'
import { fetchDataGQL, handleErrors, setToken } from './helpers'

export const handleSubmit = async (setLokasis, e) => {
	e.preventDefault()
	const tgl_rekam = document.querySelector('#tgl_rekam')
	const perekam = document.querySelector('#perekam')
	if(!localStorage.getItem('status').match(/0|2/)) return swal('Anda Tidak Memiliki Akses...' , { icon: 'error' })
	const input = 
		tgl_rekam && perekam ? `tgl_rekam: "${ tgl_rekam.value }", perekam: "${ perekam.value }"` :
		tgl_rekam ? `tgl_rekam: "${ tgl_rekam.value }"` : `perekam: "${ perekam.value }"`
	const body = {query: `{
		lokasis: monitorRekam(${ input }){
			_id
			gudang
			kd_lokasi
			completed
			time_completed
			created_at
			cancel_msg
			perekam{
				_id
				nama
			}
			jumlah_berkas
		}
	}`}
	try {
		const { data, errors, extensions } = await fetchDataGQL(body)
		setToken(extensions)
		if(errors) return handleErrors(errors)
		setLokasis(data.lokasis)
	} catch (err) {
		console.log(err)
	}
}

export const getDetailRekam = async (lokasi, { setLokasis, setBerkases }) => {
	if(document.getElementById('tbl-lokasi')) {
		setLokasis(JSON.parse(localStorage.getItem('lokasis')))
		return setBerkases([])
	}
	const body = {query: `{
		berkases(by: lokasi, gudang: ${ lokasi.gudang }, kd_lokasi: "${ lokasi.kd_lokasi }") {
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
			}
			urutan
			file
			ket_lain
		}
	}`}
	try {
		const { data, errors, extensions } = await fetchDataGQL(body)
		setToken(extensions)
		if(errors) return handleErrors(errors)
		setLokasis([lokasi])
		setBerkases(data.berkases)
	} catch (err) {
		console.error(err)
	}
}

export const getResume = async (setResume) => {
	const body = {query: `{
		resume: resumeRekam{
			tgl_rekam
			jml_per_tgl{
				lokasi{
					selesai
					belum
					total
				}
				berkas
			}
		}
	}`}
	const { data, errors, extensions } = await fetchDataGQL(body)
	setToken(extensions)
	if(errors) return handleErrors(errors)
	setResume(data.resume)
}

export const getDetailsData = async tgl_rekam => {
	const body = {query: `{
		details: detailsResume(tgl_rekam: "${ tgl_rekam }"){
			nama
			jml_per_tgl{
				lokasi {
					selesai
					belum
					total
				}
				berkas
			}
		}
	}`}
	const { data, errors, extensions } = await fetchDataGQL(body)
	setToken(extensions)
	if(errors) return handleErrors(errors)
	return data.details
}