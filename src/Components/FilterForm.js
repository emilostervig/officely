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

class FilterForm extends Component {
    API_URL = process.env.REACT_APP_API_URL;


    constructor(props) {
        super(props);

        this.state = {
            /*chosenType: 'all',
            chosenTypeText: 'Alle typer',
            showOfficeType: false,*/
        };

        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleOrderChange = this.handleOrderChange.bind(this);
        this.toggleShowOfficeType = this.toggleShowOfficeType.bind(this);
        this.toggleShowOfficeFacilities = this.toggleShowOfficeFacilities.bind(this);
        this.toggleShowOfficePrice = this.toggleShowOfficePrice.bind(this);
        this.toggleShowOrderby = this.toggleShowOrderby.bind(this);
        this.handleCoWorkChange = this.handleCoWorkChange.bind(this);

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
    handleCheckboxChange(e) {
        // current array of options
        const options = this.props.chosenFacilities;
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

    handleIndustryChange = (selected) => {
        this.props.updateFilterValue({
            selectedIndustry: selected
        })
        console.log(selected);
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
    toggleShowOfficeFacilities(){
        let show = this.props.showOfficeFacilities;
        if(show === true){
            this.props.updateParentState('showOfficeFacilities', false)
        } else{
            // hide all other
            this.props.updateParentState('showOfficeFacilities', true)
        }
    }
    toggleShowOfficeType(){
        if(this.props.showOfficeType === true){
            this.props.updateParentState('showOfficeType', false)
        } else{
            // hide all other
            this.props.updateParentState('showOfficeType', true)
        }
    }

    toggleShowOfficePrice(){
        if(this.props.showOfficePrice === true){
            this.props.updateParentState('showOfficePrice', false)
        } else{
            // hide all other
            this.props.updateParentState('showOfficePrice', true)
        }
    }
    toggleShowOrderby(){
        if(this.props.showOrderby === true){
            this.props.updateParentState('showOrderby', false)
        } else{
            // hide all other
            this.props.updateParentState('showOrderby', true)
        }
    }

    handlePeriodUpdate = (value) => {
        this.props.updateFilterValue({
            selectedPeriod: value,
        })
    }

    render() {
        let foundCount;
        if(parseInt(this.props.postCount) > 0){
            foundCount = <React.Fragment>Oplev de <span className={"count"}>{this.props.postCount}</span> kontorpladser der passer til din søgning</React.Fragment>;
        } else if(parseInt(this.props.postCount ) === 0 && this.props.postsLoading !== true){
            foundCount = <React.Fragment>Ingen kontorer fundet med dine filtre, prøv venligst igen</React.Fragment>;
        }
        //const foundCount = this.props.postCount > 0 ? <React.fragment>Oplev de <span className={"count"}>${this.props.postCount}</span> kontorpladser der passer til din søgning</React.fragment>: '';
        //const handleOrderChange = this.handleOrderChange;
        return(

            <form id={"office-filter"} className={"office-filter-form"}>
                <div className="main-form">
                    <div className="grid-container">
                        <div className="field-wrap">
                            <CitySelector
                                title={"By"}
                                municipalities={[
                                    {
                                        code: 1,
                                        name: 'København',
                                        cities: [
                                            {
                                                name: 'Frederiksberg',
                                                postcode: 1000,

                                            },
                                            {
                                                name: 'Nørrebro',
                                                postcode: 1100
                                            }
                                        ]
                                    }
                                ]}
                                />
                            <Capacity
                                updateFilterValue={this.props.updateFilterValue}
                                capacity={this.props.capacity}
                            />
                            <OfficeTypes
                                handleRadioChange={this.handleRadioChange}
                                toggleShowOfficeType={this.toggleShowOfficeType}
                                officeTypes={this.props.officeTypes}
                                chosenType={this.props.chosenType}
                                chosenTypeText={this.props.chosenTypeText}
                                showOfficeType={this.props.showOfficeType}
                                updateParentState={this.props.updateParentState}
                            />

                            <PeriodSelector
                                periods={this.props.periods}
                                title={"Periode"}
                                onUpdate={this.handlePeriodUpdate}
                                selected={this.props.selectedPeriod}
                                />
                            <PriceRange
                                handlePriceChange={this.handlePriceChange}
                                minPrice={this.props.minPrice}
                                maxPrice={this.props.maxPrice}
                                showOfficePrice={this.props.showOfficePrice}
                                toggleShowOfficePrice={this.toggleShowOfficePrice}
                            />

                            <OfficeFacilities
                                handleCheckboxChange={this.handleCheckboxChange}
                                toggleShowOfficeFacilities={this.toggleShowOfficeFacilities}
                                officeFacilities={this.props.officeFacilities}
                                chosenFacilities={this.props.chosenFacilities}
                                chosenFacilitiesText={this.props.chosenFacilitiesText}
                                chosenFacilitiesDefaultText={this.chosenFacilitiesDefaultText}
                                showOfficeFacilities={this.props.showOfficeFacilities}

                            />

                            <IndustrySelector
                                industries={[
                                    {
                                        code: 1,
                                        name: 'Reklame'
                                    },
                                    {
                                        code: 2,
                                        name: "It & udvikling"
                                    },
                                    {
                                        code: 3,
                                        name: "E-commerce"
                                    },
                                    {
                                        code: 4,
                                        name: "Salg & service"
                                    }
                                ]}
                                />

                                <RadioSelect
                                    options={this.props.industries}
                                    count={true}
                                    enableAll={true}
                                    allText={"Alle brancher"}
                                    name={"industry_radio"}
                                    startText={"Branche"}
                                    defaultSelected={this.props.selectedIndustry.id}
                                    onChange={this.handleIndustryChange}
                                    />
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
                    <div className="grid-container">
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
                                toggleShowOrderby={this.toggleShowOrderby}
                            />



                        </div>
                    </div>
                </div>



            </form>
        )
    }

}

export default FilterForm;


