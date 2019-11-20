import React, {Component} from 'react';

import formatTitle from '../../functions/formatTitle';
import initialFilter from "../../Data/initialFilter";

class RadioSelect extends Component {
    API_URL = process.env.REACT_APP_API_URL;


    constructor(props) {
        super(props);

        this.state = {
            popupOpen: false,
            selected: this.props.defaultSelected != null ? this.props.defaultSelected : false,
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

    handleRadioChange = (e) => {

        let textElement = Array.prototype.filter.call(e.target.parentNode.children, function(child){
            return child !== e.target && child.classList.contains('input-title');
        });
        if(textElement){
            let selected = {
                id: e.target.value,
                name: e.target.dataset.label
            };
            this.setState({
                selected: selected,
            }, this.props.onChange(selected));
        }
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


    isUsed = () => {
        let arr1 = this.props.initialValue;
        let arr2 = this.state.selected;
        if(arr2 === false){
            return 'not used';
        }

        let aProps = Object.getOwnPropertyNames(arr1);
        let bProps = Object.getOwnPropertyNames(arr2);
        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length !== bProps.length) {
            return 'used';
        }

        for (let i = 0; i < aProps.length; i++) {
            const propName = aProps[i];
            // If values of same property are not equal,
            // objects are not equivalent
            if (arr1[propName] != arr2[propName]) {
                return 'used';
            }
        }
        return 'not-used';
    }


    render() {
        let comp = this;
        let types = this.props.options || [];
        types = types.slice(0); // clone array so we don't make changes
        if(this.props.enableAll && !types.find((el) => {return el.id === 0})){
            types.unshift({
                id: 0,
                name: this.props.allText,
            })
        }

        let typesFilter;
        let typesMarkup = types.map(function(type){
            return(
                <label key={type.id}>
                    <input  type={"radio"}
                            name={comp.props.name}
                            value={type.id}
                            id={comp.props.name+type.id}
                            onChange={comp.handleRadioChange}
                            checked={parseInt(comp.props.defaultSelected.id) === parseInt(type.id)}
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
            return parseInt(el.id) === parseInt(this.props.defaultSelected.id);
        });
        let currentText = currentType !== undefined ? formatTitle(currentType.name) : this.props.startText;
        if(this.props.enableAll && currentType.id === 0){
            currentText = this.props.startText;
        }

        if(types.length){
            typesFilter = (
                <div className={`filter-element input-popup type-radio ${this.props.className ? this.props.className : ''} ${this.isUsed()}`} data-type="radio" id={this.props.id} ref={node => this.node = node} >
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

export default RadioSelect;


