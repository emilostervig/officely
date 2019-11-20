import React, {Component} from 'react';

import {Link} from 'react-router-dom';
import OfficeTypes from './FormElements/OfficeTypes';
import Capacity from './FormElements/Capacity';
import CoWork from "./FormElements/CoWork";
import CitySelector from "./FormElements/CitySelector";
import Loader from "./Loader";
import NumberSelector from "./FormElements/NumberSelector";
import RadioSelect from "./FormElements/RadioSelect";


class ShortFilter extends Component {
	API_URL = process.env.REACT_APP_API_URL;
	OFFICE_URL = process.env.REACT_APP_OFFICE_URL;


	constructor(props) {
		super(props);

		this.state = {

		};


	}
	componentWillMount() {

	}
	handleFormSubmit = (e) => {
		e.preventDefault();

		let filterValues = {};
		filterValues.capacity = this.props.capacity;
		filterValues.locations = this.props.selectedLocations;
		filterValues.type = this.props.chosenType;
		filterValues.cowork = this.props.coworkChecked;

		window.sessionStorage.setItem('officeFilter', JSON.stringify(filterValues));


		window.location = this.OFFICE_URL;
	};

	handleTypeChange = (value) => {
		this.props.updateFilterValue({
			chosenType: value
		});
	}


	handleCoWorkChange = (e) => {
		this.props.updateParentState({
			coworkChecked: !this.props.coworkChecked
		});
	}

	handlePeriodUpdate = (value) => {
		this.props.updateParentState({
			selectedPeriod: value,
		})

	};

	handleCityUpdate = (value) => {
		this.props.updateParentState({
			selectedLocations: value,
		})

	};
	handleNumberUpdate = (value) => {
		this.props.updateParentState({
			capacity: value
		})
	}


	render() {
		if(this.props.filterDataLoaded === false){
			return (<Loader/>)
		}
		return(

			<form id={"office-short-filter"} className={"office-filter-form"}>
				<div className="main-form">
					<div className="field-wrap top-row">

						<CitySelector
							title={"By"}
							officeLocations={this.props.officeLocations}
							selectedLocations={this.props.selectedLocations}
							onChange={this.handleCityUpdate}
							name={"city-selector"}

						/>
						<NumberSelector
							capacity={this.props.capacity}
							maxVal={99}
							minVal={0}
							startVal={1}
							onUpdate={this.handleNumberUpdate}
						/>

						<RadioSelect
							options={this.props.officeTypes}
							count={true}
							enableAll={true}
							allText={"Alle typer"}
							startText={"Alle typer"}
							defaultSelected={this.props.chosenType}
							initialValue={[]}
							onChange={this.handleTypeChange}
							name={"type_radio"}
							id={"office_type_filter"}
							heading={"Kontor type"}
						/>

						<div className="filter-element" id="submit-filter">
							<button value="submit" className="submit" onClick={this.handleFormSubmit}>
								Kom godt i gang
								<span className="arrow-right-icon icomoon icon-right"/>
							</button>
						</div>

					</div>
					<div className="field-wrap bottom-row">
						<CoWork
							coworkChecked={this.props.coworkChecked}
							handleCoWorkChange={this.handleCoWorkChange}
						/>
					</div>
				</div>

			</form>
		)
	}

}

export default ShortFilter;


