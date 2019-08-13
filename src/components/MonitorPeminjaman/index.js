import React from 'react'
import CardHeader from './CardHeader'
import TabPane from './TabPane'
import DashboardSeksi from './DashboardSeksi'
import TanggalND from './TanggalND'

const MonitorPerekaman = () => {
	const list = [
		{ url: '/', name: 'Dashboard Seksi', component: DashboardSeksi },
		{ url: '/tanggal-nd', name: 'Tanggal ND', component: TanggalND },
	]
	
	return(
		<section className="content">
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-12">
						<div className="card">
							<CardHeader list={ list } />
							<div className="card-body">
								<div className="tab-content">
									<TabPane list={ list } />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
export default MonitorPerekaman