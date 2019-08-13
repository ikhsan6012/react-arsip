import React from 'react'

import ContentHeader from '../components/ContentHeader'
import Content from '../components/MonitorPeminjaman'

const MonitorPeminjaman = () => {
  const contentHeader = [
    { name: 'Monitor Peminjaman' }
  ]

  return(
    <main className="content-wrapper">
      <ContentHeader contentHeader={ contentHeader } />
      <Content/>
    </main>
  )  
}
export default MonitorPeminjaman