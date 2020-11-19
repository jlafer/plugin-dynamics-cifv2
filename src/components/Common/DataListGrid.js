import React from 'react'
// import PropTypes from 'prop-types';

import {Card, CardContent, CardActions} from '@material-ui/core'
// import {withTaskContext} from '@twilio/flex-ui'

import InfoComponent from '../Common/InfoComponent'
import SubheadingComponent from '../Common/SubheadingComponent'


class DataListGrid extends React.Component {
    // constructor(props) {
    //     super(props)
    // }

    componentDidMount() {
        // this.setState({loading:this.props.loading})
    }

    render() {

        const {rows, title} = this.props;

        return (
            <React.Fragment>
                <SubheadingComponent title={title}/>
                <Card style={styles.card}>
                    <CardContent>
                        {
                            rows.map((row,i) => {
                                const Icon = row.icon;
                                return (
                                    <InfoComponent
                                        key={`info_component_${i}`}
                                        title={row.title}
                                        value={row.value}
                                        icon={<Icon/>}
                                        hr={true}
                                    />
                                )
                            })
                        }
                    </CardContent>
                    <CardActions>

                    </CardActions>
                </Card>
            </React.Fragment>
        )
    }
}

// DataListGrid.propTypes = {
//     rows: PropTypes.arrayOf(PropTypes.shape({
//         title: PropTypes.string,
//         value: PropTypes.node,
//         icon: PropTypes.element
//     })),
//     title: PropTypes.string,
// };
//
const styles = {
    card: {
        background: '#fff',
        padding: 20,
        minWidth: 150,
        margin: '0 0 20px 0',
        border: '1px solid #d0d0d0',
        borderTop: 'none',
    }
};

export default DataListGrid
