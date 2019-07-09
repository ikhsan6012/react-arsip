import React, { Fragment } from 'react'
import { UploadDonwloadIcon, EditDocumentIcon, DeleteDocumentIcon, EditBerkas, DeleteBerkas } from './AksiIcons'

const Aksi = props => {
	return(
		<Fragment>
			<td className="text-center align-middle">
				<UploadDonwloadIcon berkas={ props.berkas } />
				<EditDocumentIcon berkas={ props.berkas } />
				<DeleteDocumentIcon berkas={ props.berkas } />
				<span className="mr-2">||</span>
				<EditBerkas berkas={ props.berkas }/>
				<DeleteBerkas berkas={ props.berkas }/>
			</td>
		</Fragment>
	)
}
export default Aksi