import React, {Component} from 'react';
import SearchInput from "./SearchInput";

class CitySelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popupOpen: false,
            chosen: this.props.selectedLocations || [],
            searchString: "",
        };
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



    handleCheckboxChange = (e) => {
        let textElement = Array.prototype.filter.call(e.target.parentNode.children, function(child){
            return child !== e.target && child.classList.contains('input-title');
        });
        let id = parseInt(e.target.value);
        let checked = e.target.checked;

        let selected = this.props.officeLocations.find((el) => {
            return parseInt(el.id) === parseInt(id);
        })

        if(checked){
            selected = [...this.props.selectedLocations, id];
        } else{
            selected = this.props.selectedLocations.filter(function (val) {
                return parseInt(val) !== parseInt(id);
            })
        }
        this.setState({
            chosen: selected,
        }, this.props.onChange(selected));

    };

    unescapeString = (string) => {
        return string
    }


    onSearchClear = () => {
        this.setState({
            searchString: "",
        })
    }

    onSearchUpdate = (val) => {
        this.setState({
            searchString: val,
        })
    }

    render(){
        const comp = this;

        let search = this.state.searchString;
        let types = this.props.officeLocations;
        let topLevelTypes  = this.props.officeLocations.filter( (el) => {
            return parseInt(el.parent) === 0;
        })
        if(search.length > 0){
            types = types.filter((el) => {
                let reg = RegExp('('+search+')', 'gmi');
                return reg.test(el.name);
            })
            topLevelTypes = [];
        } else{
            types = [];
        }
        let typesMarkup = types.map(function(type){
            return(
                <label key={type.id}>
                    <input type={"checkbox"} name={comp.props.name} value={type.id} id={comp.props.name+type.id} onChange={comp.handleCheckboxChange} checked={comp.props.selectedLocations.includes(parseInt(type.id))} data-label={type.name}/>
                    <span className="checkmark"/>
                    <span className="input-title">
                        {comp.unescapeString(type.name)} {'count' in type && comp.props.count === true && <span className="count">({type.count})</span>}
                    </span>
                </label>
            )
        });

        let topLevelTypesMarkup = topLevelTypes.map( (type) => {
            return (
            <label key={type.id}>
                <input type={"checkbox"} name={comp.props.name} value={type.id} id={comp.props.name+type.id} onChange={comp.handleCheckboxChange} checked={comp.props.selectedLocations.includes(parseInt(type.id))} data-label={type.name}/>
                <span className="checkmark"/>
                <span className="input-title">
                        {comp.unescapeString(type.name)} {'count' in type && comp.props.count === true && <span className="count">({type.count})</span>}
                    </span>
            </label>
            )
        });



        if(types.length === 0 && search.length > 0){
            typesMarkup = <h4 className={"no-results"}>Ingen byer fundet. Prøv igen.</h4>
        }
        let currentType = types.find((el) => {
            return el.id === parseInt(this.state.chosen.id);
        });
        let currentText = currentType !== undefined ? currentType.name : this.props.startText;
        return (
            <React.Fragment>

            <div className="filter-element city-select input-popup type-checkbox" data-type="checkbox" ref={node => this.node = node}>
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
                    <div className="search">
                        <SearchInput
                            placeholder={"Søg..."}
                            onClear={this.onSearchClear}
                            onUpdate={this.onSearchUpdate}
                        />
                    </div>
                    <hr className="divider"/>
                    {topLevelTypesMarkup}
                    {typesMarkup}
                </div>
            </div>
            </React.Fragment>
        );
    }

}

export default CitySelector;


