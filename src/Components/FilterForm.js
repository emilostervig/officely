import React, {Component} from 'react';

import OfficeTypes from './FormElements/OfficeTypes';
import Capacity from './FormElements/Capacity';
import OfficeFacilities from "./FormElements/OfficeFacilities";
import CoWork from "./FormElements/CoWork";
import PriceRange from "./FormElements/PriceRange";
import Orderby from "./FormElements/Orderby"
import CitySelector from "./FormElements/CitySelector";
import PeriodSelector from "./FormElements/PeriodSelector";
import IndustrySelector from "./FormElements/IndustrySelector";
import RadioSelect from "./FormElements/RadioSelect";
import Loader from "./Loader";
import CheckboxSelect from "./FormElements/CheckboxSelect";
import NumberSelector from "./FormElements/NumberSelector";

import initialFilter from './../Data/initialFilter';

class FilterForm extends Component {
    API_URL = process.env.REACT_APP_API_URL;


    constructor(props) {
        super(props);

        this.state = {

        };

        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleFacilitiesChange = this.handleFacilitiesChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleOrderChange = this.handleOrderChange.bind(this);
        this.handleCoWorkChange = this.handleCoWorkChange.bind(this);

    }
    componentDidMount() {
        if(this.props.postCount === 0){
            this.props.getOffices();
        }
    }

    componentWillMount() {

    }

    handleRadioChange(e){
        let textElement = Array.prototype.filter.call(e.target.parentNode.children, function(child){
            return child !== e.target && child.classList.contains('input-title');
        });
        if(textElement){
            this.props.updateFilterValue({
                chosenType: e.target.value,
                chosenTypeText: e.target.dataset.label
            });
        }
    }
    handleFacilitiesChange(e) {
        // current array of options
        const options = [...this.props.chosenFacilities];
        let index;
        let text;
        // check if the check box is checked or unchecked
        if (e.target.checked) {
            // add the numerical value of the checkbox to options array
            options.push(+e.target.value)
        } else {
            // or remove the value from the unchecked checkbox from the array
            index = options.indexOf(+e.target.value)
            options.splice(index, 1)
        }
        let count = options.length;

        if(count){
            if(count === 1){
                text = `(${count}) filter valgt`;
            } else{
                text = `(${count}) filtre valgt`;
            }
        } else{
            text = this.props.chosenFacilitiesDefaultText;
        }
        this.props.updateFilterValue({
            chosenFacilities: options,
            chosenFacilitiesText: text,
        });
    }



    handleCoWorkChange(e) {
        this.props.updateFilterValue({
            coworkChecked: !this.props.coworkChecked,
        });
    }
    handlePriceEnd(values){
        let min = parseInt(values[0]);
        let max = parseInt(values[1]);
        if(min !== this.props.minPrice || max !== this.props.maxPrice){
            this.props.updateParentState('priceChanged', true);

            this.props.updateFilterValue({
                minPrice: min,
                maxPrice: max,
            })
        }
    }
    handlePriceChange(values){
        let min = parseInt(values[0]);
        let max = parseInt(values[1]);
        if(min !== this.props.minPrice || max !== this.props.maxPrice){
            this.props.updateParentState('priceChanged', true);

            this.props.updateFilterValue({
                minPrice: min,
                maxPrice: max,
            })
        }
    }

    handleOrderChange(e){
        let key = e.target.dataset.key;
        let title = e.target.dataset.title;
        if(key && title){
            this.props.updateFilterValue({
                orderbyKey: key,
                orderbyTitle: title
            })
        }
    }

    handlePeriodUpdate = (value) => {
        this.props.updateFilterValue({
            selectedPeriod: value,
        })
    };

    handleCityUpdate = (value) => {
        this.props.updateFilterValue({
            selectedLocations: value,
        })
    };

    handleNumberUpdate = (value) => {
        this.props.updateFilterValue({
            capacity: value
        })
    }
    onIndustryChange = (value) => {
    	this.props.updateFilterValue({
		    selectedIndustry: value.selected,
		    IndustryText: value.text,
	    });
    }

    handleTypeChange = (value) => {
        this.props.updateFilterValue({
            chosenType: value
        });
    }



    render() {
        let foundCount;
        if(parseInt(this.props.postCount) > 0){
            foundCount = <React.Fragment>Oplev de <span className={"count"}>{this.props.postCount}</span> kontorpladser der passer til din søgning</React.Fragment>;
        } else if(parseInt(this.props.postCount ) === 0 && this.props.postsLoading !== true){
            foundCount = <React.Fragment>Ingen kontorer fundet med dine filtre, prøv venligst igen</React.Fragment>;
        }
        if(this.props.filterDataLoaded === false){
            return (<Loader/>)
        }
        return(

            <form id={"office-filter"} className={"office-filter-form"}>
                <div className="main-form">
                    <div className="container-fluid retina-max office-container">
                        <div className="field-wrap">


                            <CitySelector
                                title={"By"}
                                officeLocations={this.props.officeLocations}
                                selectedLocations={this.props.selectedLocations}
                                onChange={this.handleCityUpdate}
                                name={"city-selector"}
                            />

                            <NumberSelector
                                maxVal={99}
                                minVal={0}
                                startVal={this.props.capacity}
                                onUpdate={this.handleNumberUpdate}
                            />


                            <RadioSelect
                                options={this.props.officeTypes}
                                count={true}
                                enableAll={true}
                                allText={"Alle typer"}
                                startText={"Alle typer"}
                                defaultSelected={this.props.chosenType}
                                initialValue={initialFilter.chosenType}
                                onChange={this.handleTypeChange}
                                name={"type_radio"}
                                id={"office_type_filter"}
                                heading={"Kontor type"}
                            />

                            <PeriodSelector
                                periods={this.props.periods}
                                title={"Periode"}
                                onUpdate={this.handlePeriodUpdate}
                                selected={this.props.selectedPeriod}
                                updateParentState={this.props.updateParentState}
                                />
                            <PriceRange
                                handlePriceChange={this.handlePriceChange}
                                minPrice={this.props.minPrice}
                                maxPrice={this.props.maxPrice}
                                minPriceDefault={this.props.minPriceDefault}
                                maxPriceDefault={this.props.maxPriceDefault}
                                showOfficePrice={this.props.showOfficePrice}
                                //toggleShowOfficePrice={this.toggleShowOfficePrice}
                                priceChanged={this.props.priceChanged}
                            />

                            <OfficeFacilities
                                handleCheckboxChange={this.handleFacilitiesChange}
                                officeFacilities={this.props.officeFacilities}
                                chosenFacilities={this.props.chosenFacilities}
                                chosenFacilitiesText={this.props.chosenFacilitiesText}
                                chosenFacilitiesDefaultText={this.chosenFacilitiesDefaultText}

                            />


							<CheckboxSelect
								options={this.props.industries}
								count={false}
								startText={"Branche"}
								selected={this.props.selectedIndustry}
								onChange={this.onIndustryChange}
								name={"industry_checkbox"}
								id={"office_industry_filter"}
								className={"invert-color"}
							/>
                            <div className={"clear-form filter-element"} onClick={ () => { this.props.clearFilter() }}>
                                <div className="input-wrap"><div className="chosen-value">Ryd søgning</div></div>
                            </div>
                        </div>
                        <div className="field-wrap bottom-row">
                            <CoWork
                                coworkChecked={this.props.coworkChecked}
                                handleCoWorkChange={this.handleCoWorkChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="after-form">
                    <div className="container-fluid retina-max office-container">
                        <div className="field-wrap order">
                            <div className="filter-element">
                                <h4 className="found-posts">
                                    {foundCount}
                                </h4>
                            </div>

                            <Orderby
                                orderbyTitle={this.props.orderbyTitle}
                                orderbyKey={this.props.orderbyKey}
                                showOrderby={this.props.showOrderby}
                                handleOrderChange={this.handleOrderChange}

                            />



                        </div>
                    </div>
                </div>



            </form>
        )
    }

}

export default FilterForm;


