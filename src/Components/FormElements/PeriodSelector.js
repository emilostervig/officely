import React, {Component} from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class PeriodSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: (this.props.selected || {}),
            showPopup: false,
        };
        this.node = React.createRef();
        this.handleClick = this.handleClick.bind(this);
    }


    componentWillMount() {
        document.addEventListener("mousedown", this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick(e){
        if(this.node.contains(e.target)){
            // clicked inside
            return;
        }
        if(this.state.showPopup === true){
            this.toggleShowPopup();
        }
    }


    handleUpdate = () => {
        this.props.onUpdate(this.state.selected)
    };

    handleRadioUpdate = (e) => {
        let el = e.target;
        let id = e.target.value;
        let chosen = this.props.periods.find((i) => {
            return parseInt(i.id) === parseInt(id);
        });

        this.setState({
            selected: chosen,
        }, this.handleUpdate)

    };

    toggleShowPopup = () => {
        this.setState({
            showPopup: !this.state.showPopup,
        });
    };

    handleDateChange = (date) => {
        this.setState({
            date: date,
        })
    }


    filterDates = (date) => {
        let dateMinusOne = new Date(date);
        dateMinusOne.setDate(dateMinusOne.getDate() - 1);
        let isFirstDay = dateMinusOne.getMonth() !== date.getMonth();
        return isFirstDay;
    }



    render(){
        let periodsMarkup = '';
        let comp = this;
        if(this.props.periods){
            periodsMarkup = this.props.periods.map((period) => {
                return(
                    <label key={period.id} htmlFor={"office_period"+period.id}>
                        <input type={"radio"} name={"office_period"} value={period.id} id={"office_period"+period.id} onChange={comp.handleRadioUpdate} checked={parseInt(comp.state.selected.id) === parseInt(period.id)} data-label={period.name}/>
                        <span className="checkmark"/>
                        <span className="input-title">
                            {period.name}
                        </span>
                    </label>
                )
            })
        }
        let current;
        let now = new Date();
        if (now.getMonth() === 11) {
            current = new Date(now.getFullYear() + 1, 0, 1);
        } else {
            current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        }

        return (
            <div className="filter-element period-select input-popup type-radio" data-type="radio" ref={node => this.node = node}>
                <h4 className="filter-heading">
                    Periode
                </h4>
                <div className="input-wrap" onClick={this.toggleShowPopup}>
                    <div className="chosen-value" data-empty-text="Vælg periode">
                        {'name' in this.state.selected ?
                            this.state.selected.name : "Vælg periode"
                        }
                    </div>
                </div>
                <div className={`input-popup-content ` + (this.state.showPopup ? 'open' : 'closed')}>
                    {periodsMarkup}
                    <DatePicker
                        inline
                        selected={this.state.date}
                        onChange={this.handleDateChange}
                        filterDate={this.filterDates}
                        minDate={current}
                        />
                </div>
            </div>
        );
    }

}

export default PeriodSelector;


