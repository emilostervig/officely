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
                        <label>
                            <input type="checkbox" name="office_cowork" id="office_cowork" value="1" checked={this.props.coworkChecked} onChange={this.props.handleCoWorkChange}/>
                                <span className="checkmark"/>
                                <span className="input-title" onClick={this.handleCoworkClick}>Jeg er interesseret i co-working</span>
                        </label>
                    </div>
                </label>
            </div>
        );
    }

}

export default CoWork;


