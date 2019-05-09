import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import { fetchDataGQL } from '../../helpers'

export default class MonitorLBContent extends Component {
  state = {
    data: [],
    pages: null,
    loading: true,
  }

  addND = e => {
    e.preventDefault()
    const id = e.target.id.split('_')[1]
    const value = document.getElementById(`input_${ id }`).value
    const tahun = document.getElementById(`tahun_${ id }`).value
    const body = {query: `mutation {
      sptlb: addNDLB(id: "${id}", value: "${value}", tahun: ${tahun}){
        _id
        no_nd
        tahun_nd
      }
    }`}
    fetchDataGQL(body)
      .then(res => res.json())
      .then(({data}) => {
        document.getElementById(`input_${ id }`).value = ""
        document.getElementById(`tahun_${ id }`).value = ""
        data = this.state.data.map(d => {
          if(d._id === data.sptlb._id){
            return { ...d, no_nd: data.sptlb.no_nd, tahun_nd: data.sptlb.tahun_nd }
          }else{
            return d
          } 
        })
        this.setState({ data })
      })
      .catch(err => {
        console.error(err)
      })
  }

  deleteND = id => {
    const body = {query: `mutation {
      sptlb: deleteNDLB(id: "${id}"){
        _id
        no_nd
        tahun_nd
      }
    }`}
    fetchDataGQL(body)
      .then(res => res.json())
      .then(({data}) => {
        data = this.state.data.map(d => {
          if(d._id === data.sptlb._id){
            return { ...d, no_nd: data.sptlb.no_nd, tahun: data.sptlb.tahun_nd }
          }else{
            return d
          } 
        })
        this.setState({ data })
      })
      .catch(err => {
        console.error(err)
      })
  }

  showFormND = id => {
    const btns = document.getElementsByName('btn_nd')
    const forms = document.getElementsByName('form_nd')
    const reset = () => {
      btns.forEach(btn => btn.hidden = false)
      forms.forEach(form => form.hidden = true)
    }
    reset()
    const btnND = document.getElementById(`btn_${ id }`)
    const formND = document.getElementById(`nd_${ id }`)
    const inputND = document.getElementById(`input_${ id }`)
    btnND.hidden = true
    formND.hidden = false
    inputND.focus()
  }

  fetchData = (state, instance) => {
    const sorted = state.sorted
    const filtered = state.filtered
    const sort = sorted.length > 0 ? `sorted: [
      ${ sorted.map(s => `{
        sortBy: "${ s.id }"
        order: ${ s.desc ? -1 : 1 }
      }`) }
    ]` : ``
    const filter = filtered.length > 0 ? `filtered: [
      ${ filtered.map(f => `{
        filterBy: "${ f.id }"
        value: "${ f.value }"
      }`) }
    ]` : ``
    const body = {query: `{
      sptlb: getSPTLB(
        pageSize: ${state.pageSize}
        page: ${state.page}
        ${ sort }
        ${ filter }
      ) {
        _id
        npwp
        nama_wp
        no_tt
        tgl_spt
        nilai
        masa_tahun
        res_kom
        sumber
        pb
        tgl_terima
        tgl_jt
        no_nd
        tahun_nd
      }
      total: getTotalSPTLB
    }`}
    fetchDataGQL(body)
      .then(res => res.json())
      .then(({data}) => {
        const pages = data.total / state.pageSize
        this.setState({ 
          data: data.sptlb,
          loading: false,
          pages: pages - Math.floor(pages) > 0 ? Math.floor(pages) + 1 : Math.floor(pages)
        })
      })
      .catch(err => console.error(err))
  }

  render(){
    const formStyle = {
      border: "1px solid rgba(0,0,0,0.1)",
      background: "#fff",
      padding: "5px 7px",
      fonSize: "inherit",
      borderRadius: "3px",
      fontWeight: "normal",
      outline: "none",
      margin: "5px"
    }
    const tdStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
    const columns = [
      {
        Header: "NPWP",
        accessor: "npwp",
        minWidth: 125,
        style: tdStyle
      },
      {
        Header: "Nama WP",
        accessor: "nama_wp",
        minWidth: 200,
        style: { ...tdStyle, justifyContent: 'flex-start' }
      },
      {
        Header: "No. Tanda Terima",
        accessor: "no_tt",
        minWidth: 250,
        style: tdStyle
      },
      {
        Header: "Nilai",
        accessor: "nilai",
        minWidth: 150,
        style: tdStyle
      },
      {
        Header: "Masa / Tahun",
        accessor: "masa_tahun",
        minWidth: 100,
        style: tdStyle
      },
      {
        Header: "Status",
        accessor: "res_kom",
        minWidth: 150,
        style: tdStyle
      },
      {
        Header: "Sumber",
        accessor: "sumber",
        minWidth: 75,
        style: tdStyle
      },
      {
        Header: "Pembetulan",
        accessor: "pb",
        minWidth: 80,
        style: tdStyle
      },
      {
        Header: "Tanggal Terima",
        accessor: "tgl_terima",
        width: 100,
        style: tdStyle
      },
      {
        Header: "Tanggal Jatuh Tempo",
        accessor: "tgl_jt",
        width: 125,
        style: tdStyle
      },
    ]
    return(
      <section className="content">
        <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <ReactTable
              columns={ localStorage.token
                ? [
                    ...columns, 
                    {
                      Header: "No. ND",
                      id: "no_nd",
                      minWidth: 175,
                      resizable: false,
                      accessor: lb => lb.no_nd 
                        ? <span>
                            <i className="fa fa-times mr-2 text-danger" style={{ cursor: 'pointer' }} onClick={ () => this.deleteND(lb._id) }></i>
                            { `ND-${lb.no_nd}/WPJ.05/KP.0203/${lb.tahun_nd}` }
                          </span>
                        : <span>
                            <i name="btn_nd" id={ `btn_${lb._id}` } className="fa fa-plus text-primary" style={{ cursor: 'pointer' }} onClick={ () => this.showFormND(lb._id)}></i>
                            <form name="form_nd" id={ `nd_${ lb._id }` } hidden={ true } onSubmit={ this.addND }>
                                  <input required id={ `input_${ lb._id }` } style={{ ...formStyle, width: '60px' }} type="text" placeholder="No."/>
                                  <input required id={ `tahun_${ lb._id }` } style={{ ...formStyle, width: '85px' }} type="number" placeholder="Tahun"/>
                                  <input type="submit" hidden={true}/>
                            </form>
                          </span>,
                      className: 'text-center',
                    }
                  ]
                : [ 
                    ...columns,
                    {
                      Header: "No. ND",
                      id: "no_nd",
                      minWidth: 175,
                      resizable: false,
                      accessor: lb => lb.no_nd
                        ? `ND-${lb.no_nd}/WPJ.05/KP.0203/${lb.tahun_nd}`
                        : null,
                      className: 'text-center'
                    }
                  ]
              }
              manual
              data={ this.state.data }
              pages={ this.state.pages }
              loading={ this.state.loading }
              onFetchData={ this.fetchData }
              filterable
              defaultPageSize={10}
              className="-striped -highlight"
              style={{ fontSize: '10px' }}
            />
          </div>
        </div>
        </div>
      </section>
    )
  }
}