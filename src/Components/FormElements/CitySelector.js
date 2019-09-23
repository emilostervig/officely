import React, {Component} from 'react';
import DatePicker from "react-datepicker/es";

class NumberSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popupOpen: false,
            chosen: this.props.startVal || {},
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentWillMount() {
        document.addEventListener("mousedown", this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick = (e) => {
        if(this.node.contains(e.target)){
            // clicked inside
            return;
        }
        if(this.state.popupOpen === true){
            this.toggleShowPopup();
        }
    }
    toggleShowPopup = () => {
        this.setState({
            popupOpen: !this.state.popupOpen,
        });
    };

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


    }

    handleRadioChange = (e) => {
        let textElement = Array.prototype.filter.call(e.target.parentNode.children, function(child){
            return child !== e.target && child.classList.contains('input-title');
        });
        let id = e.target.value;
        let selected = this.props.officeLocations.find((el) => {
            return parseInt(el.id) === parseInt(id);
        })
        if(selected){
            /*
            let selected = {
                id: e.target.value,
                name: e.target.dataset.label
            };
            */

            this.setState({
                chosen: selected,
            }, this.props.onChange(selected));
        }
    };

    unescapeString = (string) => {
        return string
    }

    render(){
        const comp = this;
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
        console.log(this.props.officeLocations);
        let types = this.props.officeLocations;
        let typesMarkup = types.map(function(type){
            return(
                <label key={type.id}>
                    <input type={"radio"} name={comp.props.name} value={type.id} id={comp.props.name+type.id} onChange={comp.handleRadioChange} checked={parseInt(comp.state.chosen.id) === type.id} data-label={type.name}/>
                    <span className="checkmark"/>
                    <span className="input-title">
                        {comp.unescapeString(type.name)} {'count' in type && comp.props.count === true && <span className="count">({type.count})</span>}
                    </span>
                </label>
            )
        });
        let currentType = types.find((el) => {
            return el.id === parseInt(this.state.chosen.id);
        });
        let currentText = currentType !== undefined ? currentType.name : this.props.startText;
        return (
            <React.Fragment>

            <div className="filter-element city-select input-popup type-radio" data-type="radio" ref={node => this.node = node}>
                <h4 className="filter-heading">
                    {this.props.title}
                </h4>
                <div className="input-wrap" onClick={this.toggleShowPopup}>
                    <div className="chosen-value" data-empty-text="Vælg by">
                        {'name' in this.state.chosen ?
                            this.state.chosen.name : "Vælg by"
                        }
                    </div>
                </div>
                <div className={`input-popup-content ` + (this.state.popupOpen ? 'open' : 'closed')}>
                    {typesMarkup}
                </div>
            </div>
            </React.Fragment>
        );
    }

}

export default NumberSelector;


