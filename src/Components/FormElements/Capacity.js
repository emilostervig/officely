import React, {Component} from 'react';
import initialFilter from "../../Data/initialFilter";

class Capacity extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        this.handleQuantityClick = this.handleQuantityClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }



    handleQuantityClick(e){
        e.preventDefault();
        let el = e.target;
        let val = parseInt(el.dataset.val);

        let currentVal = parseInt(this.props.capacity);
        let newVal = val+currentVal;
        if(newVal < 1 ){
            newVal = 1;
        }
        if(newVal !== currentVal){
           // only get posts if new value is different
            this.props.updateFilterValue({
                capacity: newVal,
            })
        }

    }
    handleInputChange(e){
        let val = e.target.value;
        if(val < 1){
            val = 1;
        }
        if(val === this.props.capacity){
            return;
        }
        this.props.updateFilterValue({
            capacity: val,
        })
    }
    isUsed = () => {
        let arr1 = initialFilter.capacity;
        let arr2 = this.props.capacity;
        let same = true;
        if(arr1.length !== arr2.length)
            same = false;
        for(var i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i])
                same = false;
        }

        return (same) ? 'not-used' : 'used';
    }

    render(){
        let disabled = (this.props.capacity < 2) ? 'disabled' : '';
        return (
            <div className={"filter-element " + this.isUsed()} id="office_capacity_filter" >
                <h4 className="filter-heading">
                    Personer
                </h4>
                <div className="input-wrap number-input">
                    <span className={"minus quantity-btn " + disabled} data-val="-1" onClick={this.handleQuantityClick}>–</span>
                    <input className="quantity-input" type="number" inputMode="numeric" name="office_capacity"
                           id="office_capacity" value={this.props.capacity} onChange={this.handleInputChange}/>
                    <span className="plus quantity-btn" data-val="1" onClick={this.handleQuantityClick}>+</span>
                </div>
            </div>
        );
    }

}

export default Capacity;


