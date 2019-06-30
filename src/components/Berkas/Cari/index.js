import React, { useState } from 'react'

import Kriteria from './Kriteria'

const Cari = () => {
	const [hasil, setHasil] = useState('')
	const ket_berkas = JSON.parse(localStorage.getItem('ket_berkas'))

	// Handle Hasil
	const handleHasil = async ({ wps, totalWPs, berkases, penerimas }) => {
		setHasil('')
		if(wps){
			const Result = await import('./HasilWP')
			return setHasil(
				<Result.default
					wps={ wps }
					total={ totalWPs }
					ket_berkas={ ket_berkas }
				/>
			)
		}
		if(berkases){
			const Result = await import('./HasilLokasi')
			return setHasil(
				<Result.default
					berkas={ berkases }
					ket_berkas={ ket_berkas }
				/>
			)
		}
		if(penerimas){
			const Result = await import('./HasilPenerima')
			return setHasil(
				<Result.default
					penerima={ penerimas }
					ket_berkas={ ket_berkas }
				/>
			)
		}
	}

	return(
		<section className="content">
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-12">
						<div className="card">
							<div className="card-header d-flex p-0">
								<div className="col-md-12">
									<div className="form-group col-md-12">
										<Kriteria hasil={ data => handleHasil(data) } />
									</div>
								</div>
							</div>
							{ hasil }
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
export default Cari
