import React from 'react'

const Detail = ({ detail }) => {
	return(<>
		<td colSpan="2">{ detail.nama }</td>
		<td className="text-center align-middle">{ detail.jml_per_tgl.lokasi.selesai }</td>
		<td className="text-center align-middle">{ detail.jml_per_tgl.lokasi.belum }</td>
		<td className="text-center align-middle">{ detail.jml_per_tgl.lokasi.total }</td>
		<td className="text-center align-middle">{ detail.jml_per_tgl.berkas }</td>
	</>)
}
export default Detail