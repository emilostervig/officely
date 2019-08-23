import React, {Component} from 'react';

class CoWork extends Component {
    API_URL = process.env.REACT_APP_API_URL;


    constructor(props) {
        super(props);

        this.state = {

        };
    }

    handleCoworkClick = (e) => {
        e.preventDefault();
        let eventClick = new Event('opencowork');
        window.dispatchEvent(eventClick);
    }

    render(){

        return (
            <div className="filter-element" id="office_cowork_filter">
                <label className="filter-heading">
                    <div className="checkbox-wrap">
                        <label htmlFor={"office_cowork"} onClick={ e => e.stopPropagation() }>
                            <input type="checkbox" name="office_cowork" id="office_cowork" value="1" checked={this.props.coworkChecked} onChange={this.props.handleCoWorkChange}/>
                                <span className="checkmark"/>
                                <span className="input-title" >Jeg er interesseret i <span onClick={this.handleCoworkClick}>co-working</span></span>
                        </label>
                    </div>
                </label>
            </div>
        );
    }

}

export default CoWork;


