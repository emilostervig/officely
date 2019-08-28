import React, {Component} from 'react';

class RadioSelect extends Component {
    API_URL = process.env.REACT_APP_API_URL;


    constructor(props) {
        super(props);

        this.state = {
            popupOpen: false,
            selected: this.props.defaultSelected ? {id: this.props.defaultSelected} : false,
        };
        this.node = React.createRef();
        this.handleClick = this.handleClick.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
    }
    componentDidMount() {
        document.addEventListener("mousedown", this.handleClick, false);


    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }
    togglePopup(e){
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

    render() {
        let comp = this;
        let types = this.props.options || [];

        if(this.props.enableAll && !types.find((el) => {return el.id === 0})){
            this.props.options.unshift({
                id: 0,
                name: this.props.allText,
            })
        }

        let typesFilter;
        let typesMarkup = types.map(function(type){
            return(
                <label key={type.id}>
                    <input type={"radio"} name={comp.props.name} value={type.id} id={comp.props.name+type.id} onChange={comp.handleRadioChange} checked={parseInt(comp.state.selected.id) === type.id} data-label={type.name}/>
                    <span className="checkmark"/>
                    <span className="input-title">
                        {unescape(type.name)} {'count' in type && comp.props.count === true && <span className="count">({type.count})</span>}
                    </span>
                </label>
            )
        });
        let currentType = types.find((el) => {
            return el.id === parseInt(this.props.chosenType);
        });
        let currentText = currentType !== undefined ? currentType.name : this.props.startText;
        if(types.length){
            typesFilter = (
                <div className="filter-element input-popup type-radio" data-type="radio" id={this.props.id} ref={node => this.node = node}>
                    <h4 className="filter-heading">
                        {this.props.heading}
                    </h4>
                    <div className="input-wrap" onClick={this.togglePopup}>
                        <div className="chosen-value" data-empty-text="Alle typer">
                            {currentText}
                        </div>
                    </div>
                    <div className={`input-popup-content ` + (this.state.popupOpen ? 'open' : 'closed')}>

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


