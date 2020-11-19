import React from "react";

import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

class ExpPanelList extends React.Component {
    constructor(props) {
        super(props)
        this.expand = this.expand.bind(this)

        this.state = {expanded: false}
    }



    expand = panel => (event, isExpanded) => {
        console.log('event.target', event.target)

        this.setState({expanded: isExpanded ? panel : false})

    };

    componentDidCatch(error, errorInfo) {
        console.log(error)
    }

    render() {

        const {panels} = this.props

        return (
            <React.Fragment>
                {/*<SubheadingComponent title={title}/>*/}
                {panels.map(panel=> {
                    const Component = panel.component || null
                    return (
                    <ExpansionPanel name={panel.title} expanded={this.state.expanded === panel.title} onChange={this.expand(panel.title)} key={panel.id}>
                        <ExpansionPanelSummary aria-label="Expand" expandIcon={<ExpandMoreIcon/>}>
                            <Typography style={styles.heading} >{panel.title}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails xs={12} >
                            <Component data={panel.data || null}/>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    )
                })}
            </React.Fragment>
        )
    }
}

export default ExpPanelList

const styles = {

    heading: {
        // fontSize: theme.typography.pxToRem(15),
        fontfamily: "Open Sans",
        fontSize: "11px",
        color:"gray",
        fontWeight: "bold",
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: 1.33,
        letterSpacing: "1px",
        textTransform: "uppercase",
        flexBasis: '33.33%',
        flexShrink: 0,
    },

}
