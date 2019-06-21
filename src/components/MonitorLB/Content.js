import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import { fetchDataGQL, handleErrors, setToken } from '../../helpers'

export default class MonitorSPTLB extends Component {
  state = {
    get: `
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
      tujuan_nd
    `,
    limit: 10,
    data: [],
    filterStyle: {
      border: "1px solid rgba(0,0,0,0.1)",
      background: "#fff",
      padding: "5px 7px",
      fontSize: "inherit",
      borderRadius: "3px",
      fontWeight: "normal",
      outline: "none"
    },
    filterQuery: null,
    sortQuery: null,
    columns: [
      {
        Header: 'NPWP',
        accessor: 'npwp',
        className: 'text-center',
        minWidth: 120,
        resizable: false
      },
      {
        Header: 'Nama WP',
        accessor: 'nama_wp',
        className: 'text-center',
        minWidth: 200,
      },
      {
        Header: 'No Tanda Terima',
        accessor: 'no_tt',
        className: 'text-center',
        minWidth: 225,
        resizable: false
      },
            
      {
        Header: 'Tgl SPT',
        accessor: 'tgl_spt',
        className: 'text-center',
        minWidth: 70,
        resizable: false
      },
      {
        Header: 'Nilai',
        accessor: 'nilai',
        className: 'text-center',
      },
      {
        Header: 'Masa/Tahun',
        accessor: 'masa_tahun',
        className: 'text-center',
        minWidth: 75,
      },
      {
        Header: 'Status',
        accessor: 'res_kom',
        className: 'text-center',
        minWidth: 150,
      },
      {
        Header: 'Sumber',
        accessor: 'sumber',
        className: 'text-center',
        minWidth: 75,
        resizable: false
      },
      {
        Header: 'Pembetulan',
        accessor: 'pb',
        className: 'text-center',
        minWidth: 75,
        resizable: false
      },
      {
        Header: 'Tgl Terima',
        accessor: 'tgl_terima',
        className: 'text-center',
        minWidth: 75,
        resizable: false
      },
      {
        Header: 'Tgl Jatuh Tempo',
        accessor: 'tgl_jt',
        className: 'text-center',
        minWidth: 90,
        resizable: false
      },
      {
        Header: 'Nota Dinas',
        id: 'nd',
        minWidth: 175,
        accessor: lb => lb.no_nd
          ? <React.Fragment>
              <i id={ lb._id } className="fa fa-times text-danger mr-2" style={{ cursor: 'pointer' }} onClick={ this.deleteND }></i>
              { `ND-${lb.no_nd}/WPJ.05/KP.0203/${lb.tahun_nd}` }
            </React.Fragment>
          : <form id={ lb._id } onSubmit={ this.addND }>
              <input type="text" style={{ ...this.state.filterStyle, width: '40%' }} placeholder="No" required/>
              <input type="text" style={{ ...this.state.filterStyle, width: '60%' }} placeholder="Tahun" required pattern="20[0-2]\d"/>
              <button type="submit" hidden>Simpan</button>
            </form>
      },
      {
        Header: 'Seksi Tujuan',
        id: 'tujuan_nd',
        minWidth: 150,
        accessor: lb => {
          let tujuan = lb.tujuan_nd.length 
            ? lb.tujuan_nd.map((tujuan, i) => 
              <div key={ lb.no_tt } className="ml-1 mb-2">
                <i id={ `${lb._id}_${tujuan}` } className="fa fa-times text-danger mr-2" onClick={ this.deleteTujuan } style={{ cursor: 'pointer' }}></i>
                { tujuan }
              </div>)
            : ''
          return(
            <React.Fragment>
              { tujuan }
              <form id={ lb._id } onSubmit={ this.addTujuan }>
                <input type="text" style={{ ...this.state.filterStyle, width: '100%' }} placeholder="Tambah Seksi Tujuan" required/>
              </form>
            </React.Fragment>
          )
        }
      },
    ]
  }

  addND = e => {
    e.preventDefault()
    const id = e.target.id
    const input = e.target.childNodes
    const no_nd = input[0].value
    const tahun_nd = input[1].value
    const body = {query: `mutation{
      lb: addNDLB(id: "${id}", no_nd: "${no_nd}", tahun_nd: ${tahun_nd}){
        no_nd
        tahun_nd
      }
    }`}
    return fetchDataGQL(body)
      .then(({data, extensions, errors}) => {
        setToken(extensions)
        if(errors) return handleErrors(errors)
        let dataState = this.state.data
        dataState = dataState.map(d => {
          if(d._id === id){
            d.no_nd = data.lb.no_nd
            d.tahun_nd = data.lb.tahun_nd
          }
          return d
        })
        this.setState({ data: dataState })
      })
      .catch(err => console.log(err))
  }

  deleteND = e => {
    e.preventDefault()
    const id = e.target.id
    const body = {query: `mutation{
      lb: deleteNDLB(id: "${id}"){
        _id
      }
    }`}
    return fetchDataGQL(body)
      .then(({extensions, errors}) => {
        setToken(extensions)
        if(errors) return handleErrors(errors)
        let dataState = this.state.data
        dataState = dataState.map(d => {
          if(d._id === id){
            d.no_nd = ''
            d.tahun_nd = ''
          }
          return d
        })
        this.setState({ data: dataState })
      })
      .catch(err => console.log(err))
  }

  addTujuan = e => {
    e.preventDefault()
    const id = e.target.id
    const tujuan = e.target.firstChild
    const body = {query: `mutation{
      lb: addTujuanLB(id: "${id}", tujuan_nd: "${tujuan.value}"){
        tujuan_nd
      }
    }`}
    return fetchDataGQL(body)
      .then(({data, errors, extensions}) => {
        setToken(extensions)
        if(errors) return handleErrors(errors)
        let dataState = this.state.data
        dataState = dataState.map(d => {
          if(d._id === id) d.tujuan_nd = data.lb.tujuan_nd
          return d
        })
        tujuan.value = ''
        this.setState({ data: dataState })
      })
      .catch(err => {
        console.log(err)
      })
  }

  deleteTujuan = e => {
    let elId = e.target.id.split('_')
    const id = elId[0]
    const tujuan = elId[1]
    const body = {query: `mutation{
      lb: deleteTujuanLB(id: "${id}", tujuan_nd: "${tujuan}"){
        tujuan_nd
      }
    }`}
    return fetchDataGQL(body)
      .then(({data, errors, extensions}) => {
        setToken(extensions)
        if(errors) return handleErrors
        let dataState = this.state.data
        dataState = dataState.map(d => {
          if(d._id === id) d.tujuan_nd = data.lb.tujuan_nd
          return d
        })
        this.setState({ data: dataState })
      })
      .catch(err => console.log(err))
  }

  filterHandler = filter => {
    const filterQuery = filter.map(f => {
      return `{
        filterBy: "${ f.id }"
        value: "${ f.value }"
      }`
    })
    const query = this.state.sortQuery ? `filter: [${ filterQuery.join('\n') }], sort: [${ this.state.sortQuery }]` : `filter: [${ filterQuery.join('\n') }]`
    const body = {query: `{
      lbs(${ query }){
        ${ this.state.get }
      }
    }`}
    return fetchDataGQL(body)
      .then(({data, errors, extensions}) => {
        setToken(extensions)
        if(errors) return handleErrors
        this.setState({ data: data.lbs, filterQuery })
      })
      .catch(err => console.log(err))
  }

  sortHandler = sort => {
    console.log(sort)
    const sortQuery = sort.map(s => {
      return `{
        sortBy: "${ s.id }"
        desc: ${ s.desc }
      }`
    })
    const query = this.state.filterQuery ? `sort: [${ sortQuery.join('\n') }], filter: [${ this.state.filterQuery }]` : `sort: [${ sortQuery.join('\n') }]`
    console.log(query)
    const body = {query: `{
      lbs(${ query }){
        ${ this.state.get }
      }
    }`}
    return fetchDataGQL(body)
      .then(({data, errors, extensions}) => {
        setToken(extensions)
        if(errors) return handleErrors
        this.setState({ data: data.lbs, sortQuery })
      })
      .catch(err => console.log(err))
  }

  componentDidMount(){
    const body = {query: `{
      lbs{
        ${ this.state.get }
      }
    }`}
    fetchDataGQL(body)
      .then(({data, errors, extensions}) => {
        setToken(extensions)
        if(errors) return handleErrors(errors)
        this.setState({ data: [...data.lbs] })
      })
  }

  render() {
    return(
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="custom-file">
                <input type="file" className="custom-file-input" id="importLB" accept="application/json" onChange={ this.fileHandler }/>
                <label id="importLB-label" htmlFor="importLB" className="custom-file-label">import .json</label>
              </div>
            </div>
            <div className="col-md-7" id="import" hidden={ true }>
              <button className="btn btn-secondary mr-2" onClick={ this.resetFile }>Reset</button>
              <button className="btn btn-primary" onClick={ this.submitImport }>Import</button>
            </div>
            <div className="col-md-12">
              <ReactTable
                data={ this.state.data }
                columns={ this.state.columns }
                className="-striped -highlight"
                style={{ fontSize: '10px' }}
                pageSize={ this.state.limit }
                filterable
                manual
                onFilteredChange={ this.filterHandler }
                onSortedChange={ this.sortHandler }
              />
            </div>
          </div>
        </div>
      </section>
    )
  }
}