import React, { useState, Fragment } from 'react'
import ContentHeader from '../../../components/ContentHeader'
import Content from './Content'

export default function Register(props){
	const [contentHeader, setcontentHeader] = useState([
		{ name: "Berkas" },
		{ name: "Register Berkas" }
	])

	return(
		<Fragment>
			<ContentHeader contentHeader={ contentHeader }/>
			<Content />
		</Fragment>
	)
}