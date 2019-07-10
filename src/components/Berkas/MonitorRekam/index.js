import React, { useState, useEffect } from 'react'
import FormTanggalRekam from './FormMonitor'

const MonitorRekam = () => {
	const [perekam, setPerekam] = useState([])
	const [listPerekam, setListPerekam] = useState('')

	useEffect(() => {
		setListPerekam('')
		const getListPerekam = async perekam => {
			const Module = await import('./ListPerekam')
			setListPerekam(<Module.default perekam={ perekam } />)
		}
		if(perekam.length) getListPerekam(perekam)
	}, [perekam])

	return(
		<section className="content">
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-12">
						<div className="card">
							<div className="card-header d-flex p-0">
								<div className="col-md-12 ml-1">
									<div className="form-group col-md-12">
										<FormTanggalRekam setPerekam={ setPerekam } />
									</div>
								</div>
							</div>
							{ listPerekam }
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
export default MonitorRekam