import React, { Component } from 'react'
import Pagination from 'react-js-pagination'
import { fetchDataGQL } from '../../helpers'

export default class Content extends Component {
	state = {
		wps: [],
		activePage: 1,
		begin: 0,
		end: 10,
		totalItemsCount: 0
	}
	
	getWPs = status => {
		const page = this.state.activePage
		const begin = this.state.begin * page 
		const end = this.state.end * page
		const body = {query: `{
			wps: getWPsByStatus(status: "${status}", begin: ${begin}, end: ${end}){
				_id
				npwp
				nama_wp
				status
			}
		}`}
		fetchDataGQL(body)
			.then(res => res.json())
			.then(({data}) => {
				this.setState({ wps: data.wps, totalItemsCount: this.props.dataDetailWP.data[status] })
			})
	}

	render(){
		const detail = Object.entries(this.props.dataDetail.data).map((data, i) => {
			if(data[0] !== 'lastUpdate'){
				return(
					<tr key={ data[0] }>
						{ data[0] === 'total' ? null : <td className="text-center">{ i +1 }</td> }
						{ data[0] === 'total' 
							? <td colSpan='2'>{ data[0].toUpperCase() }</td> 
							: <td style={{ textTransform: 'capitalize' }}>{ data[0].split('_').join(' ') }</td> }
						<td className="text-center">{ data[1] }</td>
					</tr>
				)
			}
			return false
		})
		let lastUpdate = new Date(parseInt(this.props.dataDetail.data.lastUpdate)).toLocaleString('id')
	
		// LIST ITEM
		const ket_berkas = this.props.ket_berkas.data.map(kb => (
			<div className="col-md-4 col-sm-6 col-12" name="list" value={ kb.kd_berkas } key={ kb.kd_berkas }>
				<div className="info-box">
					<span className="info-box-icon bg-info-gradient">
						<i className="fa fa-star-o"></i>
					</span>
					<div className="info-box-content">
						<span className="info-box-text"  style={{ cursor: 'pointer' }} onClick={ this.props.getDetail }>{ kb.nama_berkas }</span>
						<span className="info-box-number">{ kb.jumlah }</span>
					</div>
				</div>
				<div className="card" hidden={ this.props.dataDetail.isHidden }>
					<div className="card-body">
						<div className="table-responsive">
							<table className="table table-striped table-bordered table-hover">
								<thead>
									<tr>
										<th width="10px" className="text-center align-middle">No</th>
										<th className="text-center align-middle">Status</th>
										<th className="text-center">Jumlah</th>
									</tr>
								</thead>
								<tbody>
									{ detail }
								</tbody>
							</table>
						</div>
						{ this.props.dataDetail.data.lastUpdate ? <p className="pull-right">Update terakhir: { lastUpdate }</p> : null }
					</div>
				</div>
			</div>
		))

		const detailWP = Object.entries(this.props.dataDetailWP.data).map((data, i) => {
			if(data[0] !== 'lastUpdate'){
				return(
					<tr key={ data[0] } name="wps">
						{ data[0] === 'total' ? null : <td className="text-center">{ i + 1 }</td> }
						{ data[0] === 'total'
							? <td colSpan='2' onClick={ () => this.getWPs(data[0]) } style={{ cursor: 'pointer' }}>{ data[0].toUpperCase() }</td> 
							: <td onClick={ () => this.getWPs(data[0]) } style={{ cursor: 'pointer' }}>{ data[0].toUpperCase() }</td> }
						<td className="text-center">{ data[1] }</td>
					</tr>
				)
			}
			return false
		})
		let lastUpdateWP = new Date(parseInt(this.props.dataDetailWP.data.lastUpdate)).toLocaleString('id')

		const listWP = this.state.wps.map((wp, i) => {
			return(
				<tr key={wp._id}>
					<td className="text-center" width="10px">{i+1}</td>
					<td className="text-center">{wp.npwp}</td>
					<td>{wp.nama_wp}</td>
				</tr>
			)
		})
	
		return(
			<section className="content">
				<div className="container-fluid">
					<h5 className="md-2">Informasi</h5>
					<div className="row">
						<div className="col-md-4 col-sm-6 col-12" name="list">
							<div className="info-box">
								<span className="info-box-icon bg-info-gradient">
									<i className="fa fa-star-o"></i>
								</span>
								<div className="info-box-content">
									<span className="info-box-text" style={{ cursor: 'pointer' }} onClick={ this.props.getDetailWP }>
										Wajib Pajak
									</span>
									<span className="info-box-number">{this.props.wp.jumlah}</span>
								</div>
							</div>
							<div className="card" hidden={ this.props.dataDetailWP.isHidden }>
								<div className="card-body">
									<div className="table-responsive">
										<table className="table table-striped table-bordered table-hover">
											<thead>
												<tr>
													<th width="10px" className="text-center align-middle">No</th>
													<th className="text-center align-middle">Status</th>
													<th className="text-center align-middle">Jumlah</th>
												</tr>
											</thead>
											<tbody>
												{ detailWP }
											</tbody>
										</table>
									</div>
									{ this.state.wps.length ? (
										<React.Fragment>
											<hr/>
											<div className="row">
												<div className="col-md-6"></div>
												<div className="col-md-6">
													<div className="pull-right">
														<Pagination
														activePage={ this.state.activePage }
														itemsCountPerPage={ this.state.end - this.state.begin }
														totalItemsCount={ this.state.totalItemsCount }
														pageRangeDisplayed={5}
														itemClass="page-item"
														linkClass="page-link"
														onChange={ this.wpsPageHandler }
														/>
													</div>
												</div>
											</div>
											<div className="table-responsive">
												<table className="table table-striped table-bordered table-hover">
													<thead>
														<tr>
															<th width="10px" className="text-center align-middle">No</th>
															<th className="text-center align-middle">NPWP</th>
															<th className="text-center align-middle">Nama WP</th>
														</tr>
													</thead>
													<tbody>
														{ listWP }
													</tbody>
												</table>
											</div>
										</React.Fragment>
									) : null }
									{ this.props.dataDetailWP.data.lastUpdate ? <p className="pull-right">Update terakhir: { lastUpdateWP }</p> : null }
								</div>
							</div>
						</div>
						{ ket_berkas }
					</div>
				</div>
			</section>
		)
	}
}