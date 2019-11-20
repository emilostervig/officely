import React, {Component} from 'react';
import debounce from '../../functions/debounce';
import initialFilter from "../../Data/initialFilter";

class NumberSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            val: this.props.startVal || 0,
        };
        this.minVal = this.props.minVal || 0;
        this.maxVal = this.props.maxVal || 999;
        this.handleQuantityClick = this.handleQuantityClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.inputRef = React.createRef();
        this.debounceEvent = debounce(this.triggerUpdate, 150);
    }

    validateValue = (val) => {
        if(val <= this.minVal){
            val = this.minVal;
        }
        if(val >= this.maxVal){
            val = this.maxVal;
        }
        return val;
    }
    handleQuantityClick(e){
        e.preventDefault();
        let el = e.target;
        let val = parseInt(el.dataset.val);
        let currentVal = parseInt(this.state.val);
        val = val+currentVal;
        val = this.validateValue(val);
        this.setState({
            val: val
        }, this.debounceEvent());

    }
    triggerUpdate = () => {
        if(this.props.onUpdate){
            this.props.onUpdate(this.state.val)
        }
    }
    handleInputChange(){
        let val = this.inputRef.value;
        val = this.validateValue(val);
        this.setState({
            val: val
        }, this.debounceEvent());
    }
    isUsed = () => {
        let val1 = initialFilter.capacity;
        let val2 = this.state.val;
        let same = true;
        if(parseInt(val1) < parseInt(val2)) {
            same = false
        }
        return (same) ? 'not-used' : 'used';
    }
    render(){
        let disabledMin = (this.state.val <= this.minVal) ? 'disabled' : '';
        let disabledMax = (this.state.val >= this.maxVal) ? 'disabled' : '';
        return (
            <div className={"filter-element " + this.isUsed()} id="office_capacity_filter" >
                <h4 className="filter-heading">
                    Personer
                </h4>
                <div className="input-wrap number-input">
                    <span className={"minus quantity-btn " + disabledMin} data-val="-1" onClick={this.handleQuantityClick}>–</span>
                    <input className="quantity-input" type="number" inputMode="numeric" name="office_capacity"
                           id="office_capacity" value={this.state.val} onChange={this.handleInputChange} ref={(node) => this.inputRef = node} min={this.minVal} max={this.maxVal}/>
                    <span className={"plus quantity-btn " + disabledMax} data-val="1" onClick={this.handleQuantityClick}>+</span>
                </div>
            </div>
        );
    }

}

export default NumberSelector;


