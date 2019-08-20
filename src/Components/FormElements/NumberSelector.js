import React, {Component} from 'react';

class NumberSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            val: this.props.startVal || 0,
        };
        this.minVal = this.props.minVal || 1;
        this.maxVal = this.props.maxVal || 999;
        this.handleQuantityClick = this.handleQuantityClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }



    handleQuantityClick(e){
        e.preventDefault();
        let el = e.target;
        let val = parseInt(el.dataset.val);

        let currentVal = parseInt(this.state.val);
        let newVal = val+currentVal;
        if(newVal <= this.minVal ){
            newVal = this.minVal;
        }
        if(newVal >= this.maxVal) {
            newVal = this.maxVal;
        }
        if(newVal !== currentVal){
            // only get posts if new value is different
            this.setState({
                val: newVal,
            }, function() {
                if(this.props.onUpdate){
                    this.props.onUpdate(newVal)
                }
            });
        }

    }
    handleInputChange(e){
        let val = e.target.value;
        if(val <= this.minVal){
            val = this.minVal;
        }
        if(val >= this.maxVal){
            val = this.maxVal;
        }
        this.setState({
            val: val
        }, function() {
            if(this.props.onUpdate){
                this.props.onUpdate(val)
            }
        });
    }

    render(){
        let disabledMin = (this.state.val <= this.minVal) ? 'disabled' : '';
        let disabledMax = (this.state.val >= this.maxVal) ? 'disabled' : '';
        return (
            <div className="filter-element" id="office_capacity_filter" >
                <h4 className="filter-heading">
                    Personer
                </h4>
                <div className="input-wrap">
                    <span className={"minus quantity-btn " + disabledMin} data-val="-1" onClick={this.handleQuantityClick}>–</span>
                    <input className="quantity-input" type="number" inputMode="numeric" name="office_capacity"
                           id="office_capacity" value={this.state.val} onChange={this.handleInputChange}/>
                    <span className={"plus quantity-btn " + disabledMax} data-val="1" onClick={this.handleQuantityClick}>+</span>
                </div>
            </div>
        );
    }

}

export default NumberSelector;


