import React from 'react'



export default class IframeMap extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {
            lat,
            lng,
            searchTerm
        } = this.props

        let mapUrl = `https://maps.google.com/maps/embed/v1/search
        ?key=AIzaSyDEyfOQrycakL4z0P9ImSzF92MXKPTnUIU
        &center=${lat}, ${lng}
        &origin=${lat}, ${lng}
        q=${searchTerm}
        &ll=${lat},${lng}
        ;output=embed
        `

        console.log(mapUrl)
        return (
            <React.Fragment>
                        <iframe
                            style={styles.mapFrame}
                            id='gmap_canvas'
                            src={mapUrl}
                            frameBorder='0'
                            scrolling='no'
                            marginHeight='0'
                            marginWidth='0'
                        ></iframe>
            </React.Fragment>
        )
    }
}

const styles = {

    mapFrame: {
        height: '100%',
        width: '100%',
    }
};
