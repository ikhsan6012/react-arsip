import React, { Fragment } from 'react'

export default props => {
	return(
		<Fragment>
			{ localStorage.getItem('token')
				? <td className="text-center align-middle">
						{ props.berkas.file
							? <i style={{cursor: 'pointer'}} onClick={ props.getDocument } value={ props.berkas.file } className="fa fa-download text-primary mr-2"></i>
							: <React.Fragment>
									<label htmlFor="upload">
											<i style={{cursor: 'pointer'}} className="fa fa-upload text-success mr-2"></i>
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
								</React.Fragment>
						}
						<i style={{cursor: 'pointer'}} value={ props.berkas._id } onClick={ props.editBerkas } className="fa fa-pencil text-warning mr-2"></i>
						<i style={{cursor: 'pointer'}} value={ props.berkas._id } className="fa fa-exchange text-info mr-2"></i>
						<i style={{cursor: 'pointer'}} value={ props.berkas._id } onClick={ props.deleteBerkas } className="fa fa-trash text-danger"></i>
					</td>
				: null
			}
		</Fragment>
	)
}