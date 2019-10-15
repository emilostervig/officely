import React, {Component} from 'react';

import formatTitle from '../functions/formatTitle';

class CheckboxSelect extends Component {
	constructor(props) {
		super(props);

		this.state = {
			popupOpen: false,
			selected: this.props.selected != null ? [...this.props.selected] : [],
			edge: false,
		};
		this.node = React.createRef();
		this.popupContent = React.createRef();
		this.handleClick = this.handleClick.bind(this);
		this.togglePopup = this.togglePopup.bind(this);
	}
	componentDidMount() {
		document.addEventListener("mousedown", this.handleClick, false);
	}
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClick, false);
	}
	onOpen = () => {
		let box = this.popupContent;
		let bound = box.getBoundingClientRect();
		if(bound.right > (window.innerWidth || document.documentElement.clientWidth)){
			this.setState({
				edge: true,
			})
		}
	}
	togglePopup(e){
		if(this.state.popupOpen !== true){
			this.onOpen();
		}
		this.setState({
			popupOpen: !this.state.popupOpen,
		})
	}

	handleCheckboxChange = (e) => {
		// current array of options
		const options = [...this.props.selected];
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
		this.props.onChange({
			selected: options,
			text: text,
		});
	};

	handleClick(e){
		if(this.node.current === null || this.node.contains(e.target)){
			// clicked inside
			return;
		}
		if(this.state.popupOpen === true){
			this.togglePopup();
		}
	}

	render() {
		let comp = this;
		let types = this.props.options || [];
		types = types.slice(0);
		if(this.props.enableAll === true && !types.find((el) => {return el.id === 0})){
			types.unshift({
				id: 0,
				name: this.props.allText,
			})
		}

		let typesFilter;
		let typesMarkup = types.map(function(type){
			return(
				<label key={type.id}>
					<input  type={"checkbox"}
				        name={comp.props.name}
				        value={type.id}
				        id={`${comp.props.name}+${type.id}`}
				        onChange={comp.handleCheckboxChange}
				        //checked={parseInt(comp.props.selected.id) === parseInt(type.id)}
				        checked={comp.props.selected.includes(parseInt(type.id))}
				        data-label={type.name}
			        />
					<span className="checkmark"/>
					<span className="input-title">
                        {formatTitle(type.name)} {'count' in type && comp.props.count === true && <span className="count">({type.count})</span>}
                    </span>
				</label>
			)
		});
		let currentType = types.find((el) => {
			return parseInt(el.id) === parseInt(this.props.selected.id);
		});
		let currentText = currentType !== undefined ? formatTitle(currentType.name) : this.props.startText;


		if(types.length){
			typesFilter = (
				<div className={"filter-element input-popup type-checkbox " + this.props.className} data-type="checkbox" id={this.props.id} ref={node => this.node = node} >
					<h4 className="filter-heading">
						{this.props.heading}
					</h4>
					<div className="input-wrap" onClick={this.togglePopup}>
						<div className="chosen-value" data-empty-text="Alle typer">
							{currentText}
						</div>
					</div>
					<div className={`input-popup-content ` + (this.state.popupOpen ? 'open' : 'closed') + (this.state.edge === true ? ' edge' : '')} ref={node => this.popupContent = node}>
						{typesMarkup}
					</div>
				</div>
			)
		}
		return(
			<React.Fragment>
				{typesFilter}
			</React.Fragment>
		)
	}

}

export default CheckboxSelect;


