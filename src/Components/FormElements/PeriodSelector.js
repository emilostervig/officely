import React, {Component} from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class PeriodSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: (this.props.selected || {}),
            showPopup: false,
            date: false,
            endDate: false,
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
        let dateSet = (this.state.date && this.state.endDate);
        let periodSet = (this.state.selected && 'id' in this.state.selected);

        if(dateSet && periodSet){
            this.props.onUpdate({
                period: this.state.selected,
                startDate: this.state.date,
                endDate: this.state.endDate,
            })
        }
    };

    handleRadioUpdate = (e) => {
        let el = e.target;
        let id = e.target.value;
        let chosen = this.props.periods.find((i) => {
            return parseInt(i.id) === parseInt(id);
        });

        let stateObj = {
            selected: chosen,
        };
        if(this.state.date){
            stateObj.endDate = this.getEndDate(this.state.date, chosen.id);
        }
        this.setState(stateObj, this.handleUpdate)

    };

    toggleShowPopup = () => {
        this.setState({
            showPopup: !this.state.showPopup,
        });
    };

    handleDateChange = (date) => {
        console.log(date);
        let obj = {
            date: date
        };
        if(this.state.selected && 'id' in this.state.selected){
            let endDate = this.getEndDate(date);
            obj.endDate = endDate;
        }
        this.setState(obj, this.handleUpdate)
    };

    getEndDate = (date, period = this.state.selected.id) => {
        if(!this.state.selected && !period){
            return false;
        }
        let date2 = new Date(date);
        date2.setMonth(date.getMonth() + period); // add months
        date2.setDate(1); // set date to first of month
        date2.setHours(-1); // subtract one day to get last day of previous month
        date2.setMinutes(59); // set minutes to 59 to be safe
        date2.setSeconds(59);  // set seconds to 59 to be safe
        return date2;
    };

    filterDates = (date) => {
        let dateMinusOne = new Date(date);
        dateMinusOne.setDate(dateMinusOne.getDate() - 1);
        let isFirstDay = dateMinusOne.getMonth() !== date.getMonth();
        let booked = false;
        if(this.props.bookedDates){
            let dates = this.props.bookedDates;
            for (let i = 0; i < dates.length; i++) {
                let start = new Date(dates[i].start_date);
                let end = new Date(dates[i].end_date);
                if(date > start && date < end){
                    booked = true;
                    break;
                }
            }
        }

        return isFirstDay && !booked;

    };

    formattedDate = (date) => {
        if(!date){
            return false;
        }
        const monthNames = [
            "Januar", "Februar", "Marts",
            "April", "Maj", "Juni",
            "Juli", "August", "September",
            "Oktober", "November", "December"
        ];
        let monthNum = date.getMonth();
        let month = monthNames[monthNum].substr(0, 3);
        let day = date.getDate();
        return `${day}. ${month}.`;
    };

    addBookedDatesClass = (date) => {
        let booked = false;
        if(this.props.bookedDates){
            let dates = this.props.bookedDates;
            for (let i = 0; i < dates.length; i++) {
                let start = new Date(dates[i].start_date);
                let end = new Date(dates[i].end_date);
                if(date > start && date < end){
                    booked = true;
                    break;
                }
            }
        }
        return booked ? 'booked' : undefined;
    };

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
        let nextMonthFirst;
        let now = new Date();
        if (now.getMonth() === 11) {
            nextMonthFirst = new Date(now.getFullYear() + 1, 0, 1);
        } else {
            nextMonthFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        }

        let endDate = null;
        if(this.state.date && 'id' in this.state.selected){
            endDate = new Date(this.state.date);
            endDate.setMonth(endDate.getMonth() + this.state.selected.id); // add months
            endDate.setDate(1); // set date to first of month
            endDate.setHours(-1); // subtract one day to get last day of previous month
        }

        return (
            <div className="filter-element period-select input-popup type-radio" data-type="radio" ref={node => this.node = node}>
                <h4 className="filter-heading">
                    Periode
                </h4>
                <div className="input-wrap" onClick={this.toggleShowPopup}>
                    <div className="chosen-value" data-empty-text="Vælg periode">
                        {'name' in this.state.selected && this.state.date !== false ?
                            this.state.selected.name + " Fra " + this.formattedDate(this.state.date) : "Vælg periode"
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
                        minDate={nextMonthFirst}
                        startDate={this.state.date}
                        endDate={this.state.endDate}
                        dayClassName={this.addBookedDatesClass}
                        locale={"da"}

                        />
                </div>
            </div>
        );
    }

}

export default PeriodSelector;


