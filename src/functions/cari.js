import { fetchDataGQL, setToken, handleErrors } from './helpers'

// Set Value To Uppercase
export const changeHandler = e => {
	e.target.value = e.target.value.toUpperCase()
	document.querySelector('#formSearch').dataset.page = 1
}

// Submit Search
export const submitHandler = async ({ kriteria, props }, e) => {
	e.preventDefault()
	const form = document.querySelector('#formSearch')
	const page = form.dataset.page
	const limit = [page * 5 - 5, 5]
	const input = [...form.querySelectorAll('input, select')].filter((v, i) => i > 0)
	const formData = {}
	input.forEach(v => formData[v.id] = v.value)
	const body = {query: `{
		${ kriteria.match(/npwp|nama_wp/) ? `
			wps(by: ${ kriteria }, search: {
				${ kriteria }: "${ formData[kriteria] }"
			}, begin: ${ limit[0] }, end: ${ limit[1] }){
				_id
				npwp
				nama_wp
			}
			totalWPs(${ kriteria }: "${ formData[kriteria] }")
		` : kriteria.match(/lokasi/) ? `
			berkases(by: lokasi, gudang: ${ formData.gudang }, kd_lokasi: "${ formData.kd_lokasi }") {
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
				file
				ket_lain
			}
		` : kriteria.match(/penerima/) ? `
			penerimas(${ formData.tgl_terima ? `tgl_terima: "${ formData.tgl_terima }",` : `` } ${ formData.nama_penerima ? `nama_penerima: "${ formData.nama_penerima }"` : `` }){
				_id
				nama_penerima
				tgl_terima
			}
		` : ``
	}}`}
	const { data, errors, extensions } = await fetchDataGQL(body)
	setToken(extensions)
	if(errors) return handleErrors(errors)
	props.hasil(data)
}

// Handle Page
export const pageHandler = page => {
	const form = document.querySelector('#formSearch')
	const submitButton = document.querySelector('#cariBerkas')
	form.dataset.page = page
	submitButton.click()
}

// Get Berkas
export const getBerkas = async ({ setBerkases, wps, setWPs }, e) => {
	const id = e.target.dataset.id
	const body = {query: `{
		berkases(by: pemilik, id: "${id}"){
			_id
			ket_berkas {
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
			status_pbk
			nomor_pbk
			tahun_pbk
			lokasi {
				gudang
				kd_lokasi
			}
			urutan
			file
			ket_lain
		}
}`}
	const { data, errors, extensions } = await fetchDataGQL(body)
	setToken(extensions)
	if(errors) return handleErrors(errors)
	setWPs(wps.filter(wp => wp._id === id))
	setBerkases(data.berkases)
}