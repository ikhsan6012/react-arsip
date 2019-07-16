import swal from 'sweetalert'
import { fetchDataGQL, handleErrors, setToken } from './helpers'

export const handleSubmit = async (setLokasis, e) => {
	e.preventDefault()
	const tgl_rekam = document.querySelector('#tgl_rekam').value
	if(!localStorage.getItem('status').match(/0|2/)) return swal('Anda Tidak Memiliki Akses...' , { icon: 'error' })
	const body = {query: `{
		lokasis: monitorRekam(tgl_rekam: "${ tgl_rekam }"){
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
		const { data, errors, extension } = await fetchDataGQL(body)
		setToken(extension)
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
		const { data, errors, extension } = await fetchDataGQL(body)
		setToken(extension)
		if(errors) return handleErrors(errors)
		setLokasis([lokasi])
		setBerkases(data.berkases)
	} catch (err) {
		console.error(err)
	}
}