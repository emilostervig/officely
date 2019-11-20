import React, {Component} from 'react';

class OfficeFacilities extends Component {
    API_URL = process.env.REACT_APP_API_URL;


    constructor(props) {
        super(props);

        this.state = {
            showPopup: false,
        };
        this.node = React.createRef();
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        document.addEventListener("mousedown", this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }
    togglePopup = (e) => {
        this.setState({
            showPopup: !this.state.showPopup,
        })
    };
    handleClick(e){
        if(this.node.current === null || this.node.contains(e.target)){
            // clicked inside
            return;
        }
        if(this.state.showPopup === true){
            this.togglePopup();
        }
    }

    isUsed = () => {
        let chosen = this.props.chosenFacilities.length;

        if(chosen > 0){
            return 'used';
        }
        return 'not-used';
    }

    render() {
        const handleCheckboxChange = this.props.handleCheckboxChange;
        let facilities = this.props.officeFacilities;
        let chosenFacilities = this.props.chosenFacilities;
        let facilitiesFilter;
        let facilitiesMarkup = facilities.map(function(facility){
            return(
                <label key={facility.id}>
                    <input
                        type={"checkbox"}
                        name="office_type"
                        value={facility.id}
                        id={"office_type"+facility.id}
                        onChange={handleCheckboxChange}
                        checked={chosenFacilities.includes(parseInt(facility.id))}
                        data-label={facility.name}/>
                    <span className="checkmark"/>
                    <span className="input-title">
                        {facility.name} <span className="count">({facility.count})</span>
                    </span>
                </label>
            )
        });

        if(facilities.length){
            facilitiesFilter = (
                <div className={`filter-element input-popup type-checkbox ${this.isUsed()}`} data-type="checkbox" id="office_facilities_filter" ref={(node) => this.node = node}>
                    <h4 className="filter-heading">
                        Kontor faciliteter
                    </h4>
                    <div className="input-wrap" onClick={this.togglePopup}>
                        <div className="chosen-value" data-empty-text="Alle typer">
                            {this.props.chosenFacilitiesText}
                        </div>
                    </div>
                    <div className={`input-popup-content ` + (this.state.showPopup ? 'open' : 'closed')}>
                        {facilitiesMarkup}
                    </div>
                </div>
            )
        }
        return(
            <React.Fragment>
                {facilitiesFilter}
            </React.Fragment>
        )
    }

}

export default OfficeFacilities;


