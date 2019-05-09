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
    const columns = [
      {
        Header: "NPWP",
        accessor: "npwp",
        width: 175,
        className: 'text-center'
      },
      {
        Header: "Nama WP",
        accessor: "nama_wp",
        width: 250,
      },
      {
        Header: "No. Tanda Terima",
        accessor: "no_tt",
        width: 350,
        className: 'text-center'
      },
      {
        Header: "Nilai",
        accessor: "nilai",
        className: 'text-center',
        minWidth: 100
      },
      {
        Header: "Masa / Tahun",
        accessor: "masa_tahun",
        className: 'text-center',
        width: 120
      },
      {
        Header: "Status",
        accessor: "res_kom",
        className: 'text-center',
        width: 215
      },
      {
        Header: "Sumber",
        accessor: "sumber",
        className: 'text-center',
      },
      {
        Header: "Pembetulan",
        accessor: "pb",
        className: 'text-center',
      },
      {
        Header: "Tanggal Terima",
        accessor: "tgl_terima",
        className: 'text-center',
        width: 125
      },
      {
        Header: "Tanggal Jatuh Tempo",
        accessor: "tgl_jt",
        className: 'text-center',
        width: 165
      },
    ]
    return(
      <section className="content">
        <ReactTable
          columns={ localStorage.token 
            ? [
                ...columns, 
                {
                  Header: "No. ND",
                  id: "no_nd",
                  minWidth: 275,
                  accessor: lb => lb.no_nd 
                    ? <span>
                        <i className="fa fa-times mr-2 text-danger" style={{ cursor: 'pointer' }} onClick={ () => this.deleteND(lb._id) }></i>
                        { `ND-${lb.no_nd}/WPJ.05/KP.0203/${lb.tahun_nd}` }
                      </span>
                    : <span>
                        <button name="btn_nd" id={ `btn_${lb._id}` } className="btn btn-primary" onClick={ () => this.showFormND(lb._id) }><strong>+</strong></button>
                        <form name="form_nd" id={ `nd_${ lb._id }` } hidden={ true } onSubmit={ this.addND }>
                          <div className="row">
                            <div className="form-group col-md-5">
                              <input required id={ `input_${ lb._id }` } className="form-control" type="text"/>
                            </div>
                            <div className="form-group col-md-7">
                              <input required id={ `tahun_${ lb._id }` } className="form-control" type="number" placeholder="Tahun"/>
                              <input type="submit" hidden={true}/>
                            </div>
                          </div>
                        </form>
                      </span>,
                  className: 'text-center align-middle',
                }
              ]
            : columns
          }
          manual
          data={ this.state.data }
          pages={ this.state.pages }
          loading={ this.state.loading }
          onFetchData={ this.fetchData }
          filterable
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </section>
    )
  }
}