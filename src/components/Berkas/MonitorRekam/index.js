import React, { useState, useEffect } from 'react'
import FormTanggalRekam from './FormMonitor'

const MonitorRekam = () => {
	const [lokasis, setLokasis] = useState(null)
	const [listLokasi, setListLokasi] = useState('')
	
	useEffect(() => {
		setListLokasi('')
		const getListLokasi = async lokasis => {
			const Module = await import('./ListLokasi')
			setListLokasi(<Module.default lokasis={ lokasis } />)
		}
		if(lokasis) getListLokasi(lokasis)
	}, [lokasis])

	return(
		<section className="content">
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-12">
						<div className="card">
							<div className="card-header d-flex p-0">
								<div className="col-md-12 ml-1">
									<div className="form-group col-md-12">
										<FormTanggalRekam setLokasis={ setLokasis } />
									</div>
								</div>
							</div>
							{ listLokasi }
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
export default MonitorRekam