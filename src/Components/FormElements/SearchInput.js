import React, {Component} from 'react';

class SearchInput extends Component {


    constructor(props) {
        super(props);

        this.state = {
            searchString: '',
        };

    }
    componentDidMount() {


    }

    componentWillUnmount() {

    }

    handleOnUpdate = (val) =>{
        if(this.props.onUpdate){
            this.props.onUpdate(val)
        }
    };
    handleOnClear = () =>{
        if(this.props.onClear){
            this.props.onClear()
        }
    };

    clearSearch = () => {
        this.setState({
            searchString: "",
        }, () => {
                this.handleOnUpdate();
                this.handleOnClear();
            }
        )
    };

    handleInputChange = (e) => {
        let val = e.target.value;
        this.setState({
            searchString: val,
        }, () => {
                this.handleOnUpdate(val)
            }
        )
    };


    render() {
        let comp = this;
        let placeholder = (this.props.placeholder) ? this.props.placeholder : "";
        return(
            <React.Fragment>
                <div className="search-wrapper search-input">
                    <span className="search-icon icomoon icon icon-search"/>
                    <input type={"text"} className="search-text" onChange={this.handleInputChange} value={this.state.searchString} placeholder={placeholder}/>
                    {this.state.searchString.length > 0 &&
                        <span className="close-icon icomoon icon icon-luk" onClick={this.clearSearch} />
                    }
                </div>
            </React.Fragment>
        )
    }

}

export default SearchInput;


