import React, { Component, Fragment } from 'react'
import Content from '../../../components/Berkas/Cari'

import ContentHeader from '../../../components/ContentHeader'

export default class TambahBerkas extends Component {
	state = {
		contentHeader: [
			{ name: "Berkas" },
			{ name: "Cari Berkas" }
		]
	}

	render() {
		return(
			<Fragment>
				<ContentHeader contentHeader={ this.state.contentHeader }/>
				<Content />
			</Fragment>
		)
	}
}