import React, { Component } from 'react'

import ContentHeader from '../components/ContentHeader'
import Content from '../components/MonitorLB/Content'

export default class MonitorLB extends Component{
    state = {
        contentHeader: [
            { name: 'Monitor SPT LB' }
        ]
    }
    render(){
        return(
			<main className="content-wrapper">
				<ContentHeader contentHeader={ this.state.contentHeader } />
				<Content/>
			</main>
		)
    }
}