import React, { Fragment } from 'react'
import Content from '../../../components/Berkas/Cari'

import ContentHeader from '../../../components/ContentHeader'

const Cari = () => {
	const contentHeader = [
		{ name: "Berkas" },
		{ name: "Cari Berkas" }
	]

	return(
		<Fragment>
			<ContentHeader contentHeader={ contentHeader }/>
			<Content />
		</Fragment>
	)
}
export default Cari