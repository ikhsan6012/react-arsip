import React, { Fragment } from 'react'
import Content from '../../../components/Berkas/MonitorRekam'

import ContentHeader from '../../../components/ContentHeader'

const MonitorRekam = () => {
	const contentHeader = [
		{ name: "Berkas" },
		{ name: "Monitoring Perekaman" }
	]

	return(
		<Fragment>
			<ContentHeader contentHeader={ contentHeader }/>
			<Content />
		</Fragment>
	)
}
export default MonitorRekam