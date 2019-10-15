import React, {Component} from 'react';

class OfficeTypes extends Component {
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
    togglePopup = (e) =>{
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

    render() {
        let comp = this;
        let handleRadioChange = this.props.handleRadioChange;
        let types = this.props.officeTypes || [];
        let typesCount = types.reduce((a,b) => a + b.count, 0);
        let typesFilter;
        let typesMarkup = types.map(function(type){
            return(
                <label key={type.id}>
                    <input type={"radio"} name="office_type" value={type.id} id={"office_type"+type.id} onChange={handleRadioChange} checked={parseInt(comp.props.chosenType) === type.id} data-label={type.name}/>
                    <span className="checkmark"/>
                    <span className="input-title">
                        {type.name} <span className="count">({type.count})</span>
                    </span>
                </label>
            )
        });
        let currentType = types.find((el) => {
            return el.id === parseInt(this.props.chosenType);
        });
        let currentText = currentType !== undefined ? currentType.name : "Alle typer";
        if(types.length){
            typesFilter = (
                <div className="filter-element input-popup type-radio" data-type="radio" id="office_types_filter" ref={node => this.node = node}>
                    <h4 className="filter-heading">
                        Kontor type
                    </h4>
                    <div className="input-wrap" onClick={this.togglePopup}>
                        <div className="chosen-value" data-empty-text="Alle typer">
                            {currentText}
                        </div>
                    </div>
                    <div className={`input-popup-content ` + (this.state.showPopup ? 'open' : 'closed')}>
                        <label>
                            <input type="radio" name="office_type" value="all" id="office_type" checked={this.props.chosenType === 'all'} onChange={this.props.handleRadioChange} data-label={"Alle typer"}/>
                            <span className="checkmark"/>
                            <span className="input-title">Alle typer
                                <span className="count"> ({typesCount})</span></span>
                        </label>
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

export default OfficeTypes;


