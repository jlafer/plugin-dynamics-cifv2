import React from "react";

export default class FlexButton extends React.Component {
    constructor(props) {
        super(props)

        let backgroundColor = localStorage.getItem(
            'fte-main-button-background-color',
        )
        let bgcolor =
            backgroundColor === null || typeof backgroundColor === 'undefined'
                ? '#2F7286'
                : backgroundColor

        let fontColor = localStorage.getItem('fte-main-buton-text-color')
        let txtcolor =
            fontColor === null || typeof fontColor === 'undefined'
                ? '#FFF'
                : fontColor

        this.state = {
            bgColor: bgcolor,
            txtColor: txtcolor,
        }
    }

    render() {
        const {text,href} = this.props
        const Icon = this.props.icon
        return (
            <React.Fragment>
                <Button
                    color='primary'
                    href={href}
                    target={href ? '_blank' : null}
                    style={styles.button}
                >
                    {text}
                    <Icon/>
                </Button>
            </React.Fragment>
        )
    }
}

const styles = {
    button: {
        borderRadius: '4px',
        color: '#fff',
        backgroundColor: '#317d89',
        textTransform: 'uppercase',
        minWidth: '150px',
        margin: '10px 10px 0 0',
    },
}
