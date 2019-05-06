import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import { fetchDataGQL } from '../../helpers'

export default class MonitorLBContent extends Component {
    state = {
        data: [],
        loading: true
    }

    componentDidMount(){
        const body = {query: `{
            sptlb: getSPTLB{
                _id
                npwp
                no_tt
                tgl_spt
                nilai
                masa_tahun
                res_kom
                sumber
                pb
                tgl_terima
                tgl_jt
            }
        }`}
        return fetchDataGQL(body)
            .then(res => res.json())
            .then(({data}) => {
                data = data.sptlb.map((d, i) => {
                    d.no = i+1
                    return d
                }) 
                this.setState({
                    data,
                    loading: false
                })
            })
    }

    render(){
        return(
            <section className="content">
                <ReactTable
                    data={ this.state.data }
                    columns={[
                        {
                            Header: "No.",
                            width: 50,
                            className: 'text-center',
                            id: 'no',
                            Cell: (row) => <div>{row.index+1}</div>
                        },
                        {
                            Header: "NPWP",
                            accessor: "npwp",
                            width: 175,
                            className: 'text-center'
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
                        },
                        {
                            Header: "Tanggal Jatuh Tempo",
                            accessor: "tgl_jt",
                            className: 'text-center',
                        }
                    ]}
                  defaultPageSize={10}
                  className="-striped -highlight"
                  loading={ this.state.loading }
                  
                />
            </section>
        )
    }

}