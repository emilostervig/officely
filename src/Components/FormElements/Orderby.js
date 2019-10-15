import React, {Component} from 'react';


class Orderby extends Component {
    API_URL = process.env.REACT_APP_API_URL;


    constructor(props) {
        super(props);

        this.state = {
            showPopup: false,
            value: 0,
        };
        this.handleClick = this.handleClick.bind(this);
    }


    componentWillMount() {
        document.addEventListener("mousedown", this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }
    togglePopup = (e) =>{
        this.setState({
            showPopup: !this.state.showPopup
        });
    };
    handleClick(e){
        if(this.node.contains(e.target)){
            // clicked inside
            return;
        }
        if(this.state.showPopup === true){
            this.togglePopup();
        }
    }

    render(){
        const orderOptions = [
            {
                title: "Pris lav til høj",
                key: 'price_asc',
            },
            {
                title: "Pris høj til lav",
                key: 'price_desc'
            },
            {
                title: "Alfabetisk (A-Z)",
                key: 'title_asc',
            },
            {
                title: "Alfabetisk (Z-A)",
                key: 'title_desc',
            },
            {
                title: "Nyeste",
                key: 'date_desc'
            }
        ];
        let comp = this;
        let handleOrderChange = this.props.handleOrderChange;
        return (
            <div className="filter-element input-popup type-radio close-after-change" data-type="radio" id="office_orderby_filter" ref={node => this.node = node}>
                <h4 className="filter-heading">
                    Sorter efter
                </h4>
                <div className="input-wrap" onClick={this.togglePopup}>
                    <div className="chosen-value" >
                        {this.props.orderbyTitle}
                    </div>
                </div>
                <div className={`input-popup-content ` + (this.state.showPopup ? 'open' : 'closed')}>

                    {orderOptions.map(function(el){
                        return (
                            <label key={el.key} className={"order-option "+el.key}>
                                <input type={"radio"} name={"office_orderby"} value={el.key} checked={comp.props.orderbyKey === el.key} data-key={el.key} data-title={el.title} onChange={handleOrderChange}/>
                                <span className="checkmark"/>
                                <span className="input-title">{el.title}</span>
                            </label>
                        )
                    })}
                </div>
            </div>
        );
    }

}

export default Orderby;


