import React, { useState, useEffect } from 'react'

import { fetchDataGQL, handleErrors, setToken } from '../../../helpers'

export default function Content(props){
	const [ketBerkas, setKetBerkas] = useState([])
	return(
		<section className="content">
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-12">
						<form method="post">
							<div className="row">
								<div className="form-group col-md-5">
									<label>Jenis Berkas <span className="text-danger">*</span></label>
									<div className="input-grout">
										<select className="form-control">
										</select>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	)
}