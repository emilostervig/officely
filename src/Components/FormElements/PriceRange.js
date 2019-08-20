import React, {Component} from 'react';

import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";


class PriceRange extends Component {
    API_URL = process.env.REACT_APP_API_URL;


    constructor(props) {
        super(props);

        this.state = {
            value: 0,
        };
        this.formatNumber = this.formatNumber.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.closePopup = this.closePopup.bind(this);
    }


    componentWillMount() {
        document.addEventListener("mousedown", this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }
    closePopup(e){
        this.props.toggleShowOfficePrice()
    };
    handleClick(e){
        if(this.node.contains(e.target)){
            // clicked inside
            return;
        }
        if(this.props.showOfficePrice === true){
            this.closePopup();
        }
    }

    formatNumber(num){
        num = Math.trunc(num)

        return num + ' kr.';
    }



    render(){
        const format = this.formatNumber;
        return (
            <div className="filter-element input-popup" id="office_price_filter" ref={node => this.node = node}>
                <h4 className="filter-heading">
                </h4>
                <div className="input-wrap" onClick={this.props.toggleShowOfficePrice}>
                    <div className="chosen-value">
                        Pris
                    </div>
                </div>
                <div className={`input-popup-content ` + (this.props.showOfficePrice ? 'open' : 'closed')}>
                    <div className="min-price-display">
                        <div className="fake-input">
                            <span className="prefix">Min. </span>
                            <span className={"value"}>
                                {this.props.minPrice}
                            </span>
                            <span className="affix"> kr.</span>
                        </div>
                    </div>
                    <div className="max-price-display">
                        <div className="fake-input">
                            <span className="prefix">Max. </span>
                            <span className={"value"}>
                                {this.props.maxPrice}
                            </span>
                            <span className="affix"> kr.</span>
                        </div>
                    </div>

                    <Nouislider
                        id={"price-slider"}
                        start={[this.props.minPrice, this.props.maxPrice]}
                        range={{min: 0, max: 10000}}
                        step={100}
                        connect
                        onSet={this.props.handlePriceChange}

                    />

                </div>
            </div>
        );
    }

}

export default PriceRange;


