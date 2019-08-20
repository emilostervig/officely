import React, {Component} from 'react';
import throttle from './functions/throttle';
import debounce from './functions/debounce';
class ReadMore extends Component {


    constructor(props) {
        super(props);

        this.state = {
            open: false,
            innerHeight: 0,
            height: this.props.maxHeight,
        };
        this.innerText = React.createRef();
        this.outerText = React.createRef();
        this.toggleShow = this.toggleShow.bind(this);

        this.handleClick = this.handleClick.bind(this);
        this.calculateHeight = this.calculateHeight.bind(this);
        //this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        this.setState({
            innerHeight: this.calculateHeight(),
            height: this.outerText.clientHeight,
        });

        window.addEventListener('resize', this.handleResize);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize = debounce(() => {
        console.log('debounce')
        this.setState({
            innerHeight: this.calculateHeight(),
        })
    }, 200);

    toggleShow() {
        let open = this.state.open;

        if(open){
            this.setState({
                height: this.outerText.clientHeight,
                open: !this.state.open
            })
        } else{
            this.setState({
                height: this.state.innerHeight,
                open: !this.state.open
            })
        }
    }
    calculateHeight() {
        let height = this.innerText.clientHeight;
        return height;
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
                <div className={"read-more " + (this.state.open ? 'open' : 'closed')}>

                    <div className={"full-text"} style={style} ref={(node) => this.outerText = node}>
                        <div className="inner-text" ref={(node) => this.innerText = node}>
                            {this.props.children}
                        </div>
                    </div>
                    {(this.state.innerHeight > parseInt(this.props.maxHeight)) &&
                        <button onClick={this.toggleShow}>
                            {this.state.open ? this.props.openText : this.props.closedText}
                        </button>
                    }

                </div>
            </React.Fragment>
        )
    }

}

export default ReadMore;


