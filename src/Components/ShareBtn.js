import React, {Component} from 'react';
class ShareBtn extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };

        this.toggleShow = this.toggleShow.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeydown);
    }

    componentWillUnmount() {

    }

    handleKeydown = (e) => {
        if((e.key === 'Escape' || e.keyCode == 27) && this.state.open === true){
            this.toggleShow();
        }
    }
    toggleShow() {
        this.setState({
            open: !this.state.open
        })
    }
    handleClick(e){

    }
    render() {
        let comp = this;
        let style = {
            maxHeight: (this.state.open ? this.state.innerHeight : this.props.maxHeight),
            transition: ".4s ease-out",
            overflow: 'hidden',
        };
        return(
            <React.Fragment>
                <div className={"share-overlay " + (this.state.open ? 'open' : 'closed')} onClick={this.toggleShow}/>

                <div className={"share-modal "+ (this.state.open ? 'open' : 'closed') }>
                    <div className="close-btn" onClick={this.toggleShow}/>
                    <div className="inside-padding">
                        Hvad skal der ske her?
                    </div>
                </div>

                <div className={"share-btn " + (this.state.open ? 'open' : 'closed') } onClick={this.toggleShow}>
                    <span className="btn">
                        <span className="btn-title">
                            {this.props.buttonTitle}
                        </span>
                        <span className={"icomoon icon " + this.props.icon }/>
                    </span>

                </div>
            </React.Fragment>
        )
    }

}

export default ShareBtn;


