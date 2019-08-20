import React, {Component} from 'react';

class Accordion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            elementHeight: '0px',
        };
        this.accordionEl = React.createRef();

        this.toggleAccordion = this.toggleAccordion.bind(this);
    }

    componentDidMount() {


    }
    componentWillUnmount() {
    }

    toggleAccordion(){
        let insideHeight = this.accordionEl.scrollHeight;
        this.setState({
            isOpen: !this.state.isOpen,
            elementHeight: this.state.isOpen ? '0px' : `${insideHeight}px`
        } )

    }

    render() {
        let comp = this;

        let contentStyle = {
            maxHeight: this.state.elementHeight,
            overflow: "hidden",
            transition: "max-height .2s ease-out"
        };

        return(
            <React.Fragment>
                <div className={"accordion-item " + (this.state.isOpen ? 'open' : 'closed')}>

                    <div className="accordion-title" onClick={this.toggleAccordion}>
                        {this.props.label}
                        <span className="toggle-icon-box"><span className="toggle-icon"/></span>
                    </div>
                    <div className="accordion-content" ref={(node) => this.accordionEl = node} style={contentStyle}>
                        <div className="inner-content" dangerouslySetInnerHTML={{__html: this.props.children}}/>
                    </div>

                </div>
            </React.Fragment>
        )
    }

}

export default Accordion;


