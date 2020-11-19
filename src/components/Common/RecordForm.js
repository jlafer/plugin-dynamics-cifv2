import React from 'react'
import _ from 'lodash'
import {
    Typography,
    Avatar,
    Divider,
    Grid,
    Paper,
    Card,
    CardContent,
    CardMedia,
    TextField

} from "@material-ui/core";
import InfoComponent from "./InfoComponent";
// import SimpleTable from "./SimpleTable";
import SimpleTable from "./SimpleTable";


export default class RecordForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {hasError: null}
    }

    componentDidCatch(error, errorInfo) {
        this.setState({hasError: true})
        console.error('!!!RecordForm', error)
        // console.error('!!!RecordForm errorInfo', JSON.parse(errorInfo.componentStack))
    }

    render() {

        console.log('!!!RecordForm.props', this.props)

        const {imageURL, name, primaryData, details, related} = this.props || {}
        return (
            <React.Fragment>
                <Grid container direction={"column"} spacing={8}>
                    <Grid item>
                    <Paper component={Grid} container>
                        {/*<Grid container direction={'row'}>*/}

                        <Avatar title={name} src={imageURL} style={styles.largeAvatar}/>
                        <Divider light orientation="vertical"/>
                        <Grid style={styles.detail} item xs={8} >
                            <Typography align={'left'} style={styles.header} variant={'h4'}>{name}
                            </Typography>
                            <Divider light/>
                            {Object.keys(primaryData).map(k => {
                                const label = _.startCase(k)
                                const value = primaryData[k]
                                return (
                                  <Typography align={'left'} variant={'subtitle1'} key={k}>
                                    {label}: {value}
                                  </Typography>
                                )
                            })}
                        </Grid>
                        {/*</Grid>*/}
                    </Paper>
                    </Grid>
                    <Divider light/>
                    <Grid item>
                    <Typography align={'left'} style={styles.heading}>Details</Typography>
                    <Paper component={Grid} container >
                        {Object.keys(details).map(k => {
                            const label = _.startCase(k)
                            const value = details[k]
                            return (
                                <Grid item xs={6} style={styles.detail} key={k}>
                                    <Typography style={styles.label}>{label}</Typography>
                                    <Typography style={styles.value}>{value}</Typography>
                                    <Divider dark="true"/>
                                </Grid>
                            )
                        })}
                    </Paper>
                    </Grid>
                    <Divider light/>
                    {Object.keys(related).map(k => {
                        return (
                            <React.Fragment key={k}>
                                <Typography align={'left'} style={styles.heading}>{_.startCase(k)}</Typography>
                                <SimpleTable
                                    data={related[k]}
                                />
                            </React.Fragment>
                        )
                    })}

                </Grid>
            </React.Fragment>
        )
    }
}

const defaultProps = {
    imageURL: '',
    name: '',
    primaryData: {},
    details: {},
    related: {}
}


RecordForm.defaultProps = defaultProps

const styles = {
    gridPaper: {
        display: 'flex'
    },
    details: {
        display: 'flex',
        flexDirection: 'column'
    },
    cardContent: {
        flex: '1 0 auto'
    },
    largeAvatar: {
        'height': '85px',
        'width': '85px',
        margin: 'auto',
    },
    header: {

        align: 'center'
    },
    label: {
        fontSize: '10px',
        lineHeight: 1.6,
        textAlign: 'left',
        marginTop: '10px',
    },
    value: {
        paddingBottom: '6px',
        fontSize: '14px',
        lineHeight: 1.43,
        textAlign: 'left',
    },
    detail: {
      padding:'10px'
    },
    heading: {
        // fontSize: theme.typography.pxToRem(15),
        fontfamily: "Open Sans",
        fontSize: "11px",
        color: "gray",
        fontWeight: "bold",
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: 1.33,
        letterSpacing: "1px",
        textTransform: "uppercase",
        flexBasis: '33.33%',
        flexShrink: 0,
        padding: '5px'
    },
}



