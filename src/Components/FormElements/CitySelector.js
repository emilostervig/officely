import React, {Component} from 'react';

class NumberSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popupOpen: false,
            chosen: this.props.startVal || {},
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }



    handleInputChange(e){
        let target = e.target;
        let optionIndex = target.selectedIndex;
        let selectedOption = target.options[optionIndex];

        let postcode = target[target.selectedIndex].value;
        let municipalCode = selectedOption.parentNode.getAttribute('value');

        let municipal = this.props.municipalities.find( (mun) => {
            return parseInt(mun.code) === parseInt(municipalCode);
        })
        if(municipal){
            let city = municipal.cities.find( (city) => {
                return parseInt(city.postcode) === parseInt(postcode);
            })
        }

        //let val = e.options[e.selectedIndex].value;
    /*
        if(this.props.onUpdate !== undefined){
            this.props.onUpdate(val);
        }
        */


    }

    render(){

        let selectEl;

        if(this.props.municipalities === undefined){
            selectEl = null;
        } else{
            selectEl = <React.Fragment>
                <select onChange={this.handleInputChange}>
                    {this.props.municipalities.map( (mun, i) => {
                        return (
                            <optgroup label={mun.name} key={i} value={mun.code}>

                                {mun.cities.map( (city, i2) => {
                                    return(
                                        <option key={i+"-"+i2} value={city.postcode}>
                                            {city.name}
                                        </option>
                                    )
                                })}
                            </optgroup>
                        )
                    })}
                </select>
            </React.Fragment>
        }
        return (
            <div className="filter-element" id="office_capacity_filter" >
                <h4 className="filter-heading">
                    {this.props.title}
                </h4>
                <div className="input-wrap number-input">
                    {selectEl}
                </div>
            </div>
        );
    }

}

export default NumberSelector;


