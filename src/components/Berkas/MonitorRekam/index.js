import React, { useState, useEffect } from 'react'
import FormTanggalRekam from './FormMonitor'
import Resume from './Resume'

const MonitorRekam = () => {
	const [lokasis, setLokasis] = useState(null)
	const [resume, setResume] = useState(null)
	const [listLokasi, setListLokasi] = useState(null)

	const handleBackBtn = () => {
		setListLokasi(null)
		setResume(<Resume />)
	}
	
	useEffect(() => {
		setListLokasi(null)
		setResume(null)
		const getListLokasi = async lokasis => {
			const Module = await import('./ListLokasi')
			setListLokasi(<Module.default lokasis={ lokasis } handleBackBtn={ handleBackBtn } />)
		}
		if(lokasis) getListLokasi(lokasis)
	}, [lokasis])

	useEffect(() => {
		setResume(<Resume />)
	}, [])

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
							{ resume }
							{ listLokasi }
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
export default MonitorRekam