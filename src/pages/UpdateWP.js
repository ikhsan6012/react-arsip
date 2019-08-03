import React from 'react'
import swal from 'sweetalert'

const importWP = async e => {
	e.persist()
	try {
		const file = e.target.files[0]
		if(file.type !== 'text/csv') throw Error('Hanya Menerima File .csv!')
		const isSend = await swal('Apakah Anda Yakin???', { icon: 'info', buttons: true })
		if(!isSend) {
			e.target.value = ''
			return false
		}
		const body = new FormData()
		body.append('file', file)
		const api = process.env.REACT_APP_API_SERVER || "http://localhost:3001"
		const res = await fetch(`${ api }/importwp`, { method: 'post', body })
		const { matchedCount, insertedCount } = await res.json()
		await swal(`${ matchedCount } WP Diupdate...\n${ insertedCount } WP Ditambahkan...`, { icon: 'success' })
	} catch (err) {
		console.error(err)
	}
	e.target.value = ''
}

const UpdateWP = () => {
	return <input type="file" accept=".csv" title="File .csv" onChange={ importWP } />
}

export default UpdateWP