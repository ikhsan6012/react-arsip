import swal from 'sweetalert'
import { fetchDataGQL, handleErrors, setToken } from './helpers'

export const handleSubmit = async (setPerekam, e) => {
	e.preventDefault()
	const tgl_rekam = document.querySelector('#tgl_rekam').value
	if(!localStorage.getItem('status').match(/0|2/)) return swal('Anda Tidak Memiliki Akses...' , { icon: 'error' })
	const body = {query: `{
		perekam: monitorRekam(tgl_rekam: "${ tgl_rekam }"){
			_id
			nama
			lokasi{
				_id
				gudang
				kd_lokasi
				completed
				time_completed
				created_at
			}
		}
	}`}
	try {
		const { data, errors, extension } = await fetchDataGQL(body)
		setToken(extension)
		if(errors) return handleErrors(errors)
		setPerekam(data.perekam)
	} catch (err) {
		console.log(err)
	}
}