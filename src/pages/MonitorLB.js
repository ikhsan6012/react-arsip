import React from 'react'

import ContentHeader from '../components/ContentHeader'
import Content from '../components/MonitorLB/Content'

const MonitorLB = () => {
  const contentHeader = [
    { name: 'Monitor SPT LB' }
  ]

  return(
    <main className="content-wrapper">
      <ContentHeader contentHeader={ contentHeader } />
      <Content/>
    </main>
  )  
}
export default MonitorLB