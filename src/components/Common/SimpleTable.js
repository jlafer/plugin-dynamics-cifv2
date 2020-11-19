import React, {Component} from 'react'
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
}
    from '@material-ui/core'
import _ from "lodash";

export default class SimpleTable extends Component {
    constructor(props) {
        super(props)

    }


    // createData(keys, data = []) {
    //
    //     keys.map(k => {
    //         let row = [k]
    //         data.map(d => )
    //     })
    //
    // }

    render() {

        let {data} = this.props
        if (data === [] || data ==={} || data === undefined) data = [{}]

        const headers = Object.keys(data[0])
        console.log('!!!SimpleTable Data', data)


        return (
            <React.Fragment>
                <Paper>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {headers.map(header => {
                                    return (
                                        <TableCell key={header}>{_.startCase(header)}</TableCell>
                                    )
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, idx) => {
                                return (<TableRow key={idx.toString()} >
                               { headers.map(header => {
                                    return (
                                            <TableCell key={header}>{row[header]}</TableCell>
                                    )
                                })}
                                </TableRow>)
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </React.Fragment>
        )
    }

}




// export default { SimpleTable }
