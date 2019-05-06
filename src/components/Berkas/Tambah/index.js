import React from 'react'
import CardHeader from './CardHeader'
import TabPane from './TabPane'

export default props => {
	return(
		<section className="content">
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-12">
						<div className="card">
							<CardHeader
								list={ props.list }
							/>
							<div className="card-body">
								<div className="tab-content">
									<TabPane 
										list={ props.list }
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}