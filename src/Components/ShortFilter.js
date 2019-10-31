import React, {Component} from 'react';

import {Link} from 'react-router-dom';
import OfficeTypes from './FormElements/OfficeTypes';
import Capacity from './FormElements/Capacity';
import CoWork from "./FormElements/CoWork";
import CitySelector from "./FormElements/CitySelector";
import Loader from "./Loader";


class ShortFilter extends Component {
	API_URL = process.env.REACT_APP_API_URL;
	OFFICE_URL = process.env.REACT_APP_OFFICE_URL;


	constructor(props) {
		super(props);

		this.state = {

		};

		this.handleRadioChange = this.handleRadioChange.bind(this);
		this.handleCoWorkChange = this.handleCoWorkChange.bind(this);

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


	handleCoWorkChange(e) {
		this.props.updateParentState({
			coworkChecked: !this.props.coworkChecked
		});
		/*
		this.props.updateFilterValue({
			coworkChecked: !this.props.coworkChecked,
		});
		 */
	}

	handlePeriodUpdate = (value) => {
		this.props.updateParentState({
			selectedPeriod: value,
		})
		/*
		this.props.updateFilterValue({
			selectedPeriod: value,
		})
		 */
	};

	handleCityUpdate = (value) => {
		this.props.updateParentState({
			selectedLocations: value,
		})
		/*
		this.props.updateFilterValue({
			selectedLocations: value,
		})
		 */
	};


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
						<Capacity
							updateFilterValue={this.props.updateParentState}
							capacity={this.props.capacity}
						/>
						<OfficeTypes
							handleRadioChange={this.handleRadioChange}
							officeTypes={this.props.officeTypes}
							chosenType={this.props.chosenType}
							chosenTypeText={this.props.chosenTypeText}
							updateParentState={this.props.updateParentState}
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


