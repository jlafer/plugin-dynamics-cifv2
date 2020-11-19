import React from 'react'
import {
    Map,
    GoogleApiWrapper,
    Marker,
} from 'google-maps-react';

import {MdOpenInNew} from "react-icons/all";

import {
    Typography,
    Grid,
    Icon,
    Card,
    CardContent,
    CardActions,
    Paper,
    Button
} from '@material-ui/core'

class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            places: [],
            activeMarker: {},
            selectedPlace: {},
            showingInfoWindow: false,
        };
        this.searchNearby = this.searchNearby.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this)
    }

    searchNearby(mapProps, map) {
        const {google, searchTerm, lat, lng} = this.props;

        const service = new google.maps.places.PlacesService(map);

        // Specify location, radius and place types for your Places API search.
        const request = {
            query: searchTerm,
            location: {lat: lat, lng: lng},
            radius: '1000',

        };
        console.log('!!!request', request);
        service.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                this.setState({places: results});
                console.log('!!!textSearchResults', results)
            }
        });
    };

    onMarkerClick = (props, marker) => {

        console.log('!!!props.selectedPlace', props.selectedPlace);
        this.setState({
            activeMarker: marker,
            selectedPlace: props.selectedPlace,
            showingInfoWindow: true
        })

    };

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,

            })
        }
    };

    render() {
        const {lat, lng, iconUrl,visible, google} = this.props;

        return (
            !(this.props.lat && this.props.lng) ?
                <Typography color={'Secondary'}>Loading...</Typography> :
                <Paper id={'MapPaper'} width={'100%'} style={styles.paper}>
                    {/*<CardContent style={styles.mapContainer}>*/}
                    <Grid
                        container
                        id={'GridContainer1'}
                        direction="column"
                        xs={12}

                        justify="space-evenly"
                        spacing={5}
                        alignItems="stretch"
                    >
                        <Grid
                            container
                            id={'GridContainer2'}
                            xs={12}
                            component={Button}
                            spacing={10}
                            href={
                                'https://www.google.com/maps/place/' + this.state.selectedPlace.formatted_address
                            }
                            target={'_blank'}
                        >
                            <Grid
                                container
                                id={"GridContainer3"}
                                direction={"column"}
                                xs={12}
                            >
                                <Typography
                                    variant={'h6'}
                                    align={'left'}
                                color={'Primary'}>
                                    {this.state.selectedPlace.name}
                                </Typography>
                                <Typography
                                    variant={'subtitle2'}
                                    align={'left'}
                                    color={'Primary'}
                                >
                                    {this.state.selectedPlace.formatted_address}
                                </Typography>

                            </Grid>
                            <MdOpenInNew component={Icon} style={styles.largeIcon} color={'Primary'}/>
                        </Grid>

                        <Grid item xs={12} style={styles.mapContainer}>
                            <Map
                                google={google}
                                onReady={this.searchNearby}
                                zoom={10}
                                style={styles.mapStyles}
                                initialCenter={{lat: lat, lng: lng}}
                                onClick={this.onMapClicked}
                                scrollwheel={false}
                                zoomControl={false}
                                mapTypeControl={false}
                                scaleControl={false}
                                streetViewControl={false}
                                panControl={false}
                                rotateControl={false}
                                visible={visible}
                            >
                                <Marker
                                    position={{lat: lat, lng: lng}}
                                />

                                {this.state.places.map(place => {

                                    return (
                                        <Marker
                                            name={place.name}
                                            selectedPlace={place}
                                            onClick={this.onMarkerClick}
                                            position={place.geometry.location}
                                            icon={{
                                                url: iconUrl,
                                                scaledSize: place === this.state.selectedPlace ? new google.maps.Size(64, 64) : new google.maps.Size(32, 32),

                                            }}
                                        />
                                    )
                                })}
                            </Map>
                        </Grid>
                    </Grid>
                    {/*</CardContent>*/
                    }
                    {/*<CardActions>*/
                    }


                    {/*</CardActions>*/
                    }
                </Paper>
        );
    }


}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDEyfOQrycakL4z0P9ImSzF92MXKPTnUIU'
})(MapContainer);

const styles = {
    mapContainer: {
        // height: '400px',
        'flex': 1,
        'overflow-x': 'hidden'
    },
    card: {
        width: '100%'
    },
    cardContent: {
        outerWidth: '100%'
    },

    mapStyles: {
        position: 'relative',
        flex: 'auto',
        // margin: '10px',
        // width: '80%',
        height: '70%',
    },
    button: {
        width: '100%',
        // borderRadius: '4px',
        // color: '#fff',
        // backgroundColor: '#317d89',
        // textTransform: 'uppercase',
        // minWidth: '150px',
        // margin: '10px 10px 0 0',
    },
    paper: {
        // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        // border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        // color: 'white',
        // width: '100%',
        // outerWidth: '100%'
        // flex: 'auto',
        // position: 'relative'
        // padding: '0 30px',
    },
    gridContainer: {
        display: 'inline-flex',
        // position: 'relative',
        flexGrow: 1,
        flex: 1,
        width: '100%'
    },
    largeIcon: {
        width: 30,
        height: 30
    },

};

/** Example Response from Google
 formatted_address: "11085 Alpharetta Hwy, Roswell, GA 30076, United States"
 ​​
 geometry: Object { location: {…}, viewport: {…} }
 ​​
 html_attributions: Array []
 ​​
 icon: "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png"
 ​​
 id: "d59d105ea1a6ce57475185fa9c68b1d5cec471c3"
 ​​
 name: "Honda Carland"
 ​​
 opening_hours: Object { open_now: Getter & Setter, isOpen: isOpen(l)
    }
 ​​
 photos: Array [ {…} ]
 ​​
 place_id: "ChIJMWVOh5R09YgRY_v73SUoftI"
 ​​
 plus_code: Object { compound_code: "3M27+6M Roswell, Georgia", global_code: "866Q3M27+6M" }
 ​​
 rating: 4.6
 ​​
 reference: "ChIJMWVOh5R09YgRY_v73SUoftI"
 ​​
 types: Array(4) [ "car_dealer", "point_of_interest", "store", … ]
 ​​
 user_ratings_total: 2513
 **/
