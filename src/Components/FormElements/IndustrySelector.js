import React, {Component} from 'react';

class IndustrySelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popupOpen: false,
            chosen: this.props.startVal || {},
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentWillMount() {
        document.addEventListener("mousedown", this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick = (e) => {
        if(this.node.contains(e.target)){
            // clicked inside
            return;
        }
        if(this.state.popupOpen === true){
            this.toggleShowPopup();
        }
    }
    toggleShowPopup = () => {
        this.setState({
            popupOpen: !this.state.popupOpen,
        });
    };

    handleInputChange(e){
        let target = e.target;
        let optionIndex = target.selectedIndex;
        let selectedOption = target.options[optionIndex];

        let industryCode = target[target.selectedIndex].value;

        let selectedIndustry = this.props.industries.find( (el) => {
            return parseInt(el.code) === parseInt(industryCode);
        });

        if( selectedIndustry){

            this.setState({
                chosen: selectedIndustry
            })
        }

        //let val = e.options[e.selectedIndex].value;
        /*
            if(this.props.onUpdate !== undefined){
                this.props.onUpdate(val);
            }
            */


    }

    render(){

        let selectEl;

        if(this.props.industries === undefined){
            selectEl = null;
        } else{
            selectEl = <React.Fragment>
                <select onChange={this.handleInputChange}>

                    {this.props.industries.map( (ind, i) => {
                        return(
                            <option key={i} value={ind.code}>
                                {ind.name}
                            </option>
                        )
                    })}

                </select>
            </React.Fragment>
        }
        return (
            <React.Fragment>

                <div className="filter-element city-select input-popup type-select" id="office_industry_filter" data-type="select" ref={node => this.node = node}>
                    <h4 className="filter-heading">
                        {this.props.title}
                    </h4>
                    <div className="input-wrap" onClick={this.toggleShowPopup}>
                        <div className="chosen-value" data-empty-text="Branche">
                            {'name' in this.state.chosen ?
                                this.state.chosen.name : "Branche"
                            }
                        </div>
                    </div>
                    <div className={`input-popup-content ` + (this.state.popupOpen ? 'open' : 'closed')}>
                        {selectEl}
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default IndustrySelector;


