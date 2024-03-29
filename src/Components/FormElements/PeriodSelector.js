import React, {Component} from 'react';
import DatePicker, {registerLocale} from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import initialFilter from "../../Data/initialFilter";

const monthsBG = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
const daysBG = ['man', 'tir', 'ons', 'tor', 'fre', 'lør', 'søn'];

registerLocale('da', {
    localize: {
        month: n => monthsBG[n],
        day: n => daysBG[n]
    },
    formatLong:{}
});

class PeriodSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: (this.props.selected || {}),
            showPopup: false,
            date: false,
            endDate: false,
            edge: false,
        };
        this.node = React.createRef();
        this.popupContent = React.createRef();
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
        } else if(periodSet){
            if(this.props.updateParentState){
                this.props.updateParentState(
                    'selectedPeriod',
                    {
                        period: this.state.selected,
                        startDate: false,
                        endDate: false,
                    }
                )
            } else{
                this.props.onUpdate({
                    period: this.state.selected,
                    startDate: this.state.date,
                    endDate: this.state.endDate,
                })
            }

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
        if(this.state.showPopup !== true){
            this.onOpen();
        }
        this.setState({
            showPopup: !this.state.showPopup,
        });
    };

    handleDateChange = (date) => {
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

    onOpen = () => {
        let box = this.popupContent;
        let bound = box.getBoundingClientRect();
        if(bound.right > (window.innerWidth || document.documentElement.clientWidth)){
            this.setState({
                edge: true,
            })
        }
    }

    isUsed = () => {
        let arr1 = initialFilter.selectedPeriod;
        let arr2 = this.state.selected;

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

    render(){
        let periodsMarkup = '';
        let comp = this;
        if(this.props.periods){
            periodsMarkup = this.props.periods.map((period) => {
                return(
                    <label key={period.id} htmlFor={"office_period"+period.id}>
                        <input type={"radio"} name={"office_period"} value={period.id} id={"office_period"+period.id} onChange={comp.handleRadioUpdate} checked={parseInt(comp.props.selected.period.id) === parseInt(period.id)} data-label={period.name}/>
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
            <div className={`filter-element period-select input-popup type-radio ${this.isUsed()} ${this.props.className}`} data-type="radio" ref={node => this.node = node}>
                <h4 className="filter-heading">
                    Periode
                </h4>
                <div className="input-wrap" onClick={this.toggleShowPopup}>
                    <div className="chosen-value" data-empty-text="Vælg periode">
                        {comp.props.selected.period !== false && this.state.date !== false ?
                            this.state.selected.name + " Fra " + this.formattedDate(this.state.date) : "Vælg periode"
                        }
                    </div>
                </div>
                <div className={`input-popup-content ` + (this.state.showPopup ? 'open' : 'closed')+ (this.state.edge === true ? ' edge' : '')} ref={node => this.popupContent = node}>
                    <div className={"periods"}>
                        {periodsMarkup}
                    </div>
                    <hr className={"divider"}/>
                    <DatePicker
                        inline
                        selected={this.props.selected.startDate}
                        onChange={this.handleDateChange}
                        filterDate={this.filterDates}
                        minDate={nextMonthFirst}
                        startDate={this.props.selected.startDate}
                        endDate={this.props.selected.endDate}
                        dayClassName={this.addBookedDatesClass}
                        locale={"da"}
                        dateFormat={"YYYY-MM-DD HH:MM:SS"}

                        />
                </div>
            </div>
        );
    }

}

export default PeriodSelector;


