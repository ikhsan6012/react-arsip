import React, { Fragment } from 'react'
import { UploadDonwloadIcon, EditDocumentIcon, DeleteDocumentIcon } from './AksiIcons'

const Aksi = props => {
	return(
		<Fragment>
			<td className="text-center align-middle">
				<UploadDonwloadIcon berkas={ props.berkas } />
				<EditDocumentIcon berkas={ props.berkas } />
				<DeleteDocumentIcon berkas={ props.berkas } />
			</td>
			{/* { localStorage.getItem('token')
				? <td className="text-center align-middle">
						{ props.berkas.file
							? <React.Fragment>
									<i style={{cursor: 'pointer'}} onClick={ props.getDocument } value={ props.berkas.file } className="fa fa-download text-primary mr-2" title="Lihat Dokumen"></i>
									<label htmlFor="edit">
										<i style={{cursor: 'pointer'}} className="fa fa-pencil text-warning mr-2" title="Edit Dokumen"></i>
									</label>
									<input
										_id={ props.berkas._id }
										kd_berkas={ props.berkas.ket_berkas.kd_berkas }
										npwp={ props.berkas.pemilik ? props.berkas.pemilik.npwp : null }
										type="file" 
										id="edit" 
										accept="application/pdf"
										onChange={ props.editDocument }
										hidden
									/>
									<i style={{cursor: 'pointer'}} onClick={ props.deleteDocument } value={ props.berkas.file } className="fa fa-times text-danger mr-2" title="Hapus Dokumen"></i>
								</React.Fragment>
							: <React.Fragment>
									<label htmlFor="upload">
										<i style={{cursor: 'pointer'}} className="fa fa-upload text-success mr-2" title="Unggah Dokumen"></i>
									</label>
									<input
										_id={ props.berkas._id }
										kd_berkas={ props.berkas.ket_berkas.kd_berkas }
										type="file" 
										id="upload" 
										accept="application/pdf"
										onChange={ props.addDocument }
										hidden
									/>
									<i style={{cursor: 'not-allowed'}} className="fa fa-pencil text-secondary mr-2" title="Edit Dokumen"></i>
									<i style={{cursor: 'not-allowed'}} className="fa fa-times text-secondary mr-2" title="Hapus Dokumen"></i>
								</React.Fragment>
						}
						<span className="mr-2">||</span>
						<i style={{cursor: 'pointer'}} value={ props.berkas._id } onClick={ props.editBerkas } className="fa fa-pencil-square-o text-warning mr-2" title="Edit Berkas"></i>
						<i style={{cursor: 'pointer'}} value={ props.berkas._id } onClick={ props.deleteBerkas } className="fa fa-trash text-danger" title="Hapus Berkas"></i>
					</td>
				: null
			} */}
		</Fragment>
	)
}
export default Aksi