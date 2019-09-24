// external
import React, {Component} from 'react';
import {Link} from "react-router-dom";

// Components
import OfficePostListItem from './OfficePostListItem';
import Loader from './Loader';

// functions
import throttle from './functions/throttle';

class OfficePostList extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        this.listRef = React.createRef();

        this.handleScrollEvent = this.handleScrollEvent.bind(this);
        this.postClicked = this.postClicked.bind(this);
        this.throttleEvent = throttle(this.handleScrollEvent, 500);
    }

    // TODO: move scroll events to OfficeList component (create component)
    componentDidMount() {
        console.log('componentDidMount')
        document.addEventListener('scroll', this.throttleEvent);
        window.scrollTo(0, this.props.listScrolled);

        let lazyLoadScroll = new Event('scroll');
        window.dispatchEvent(lazyLoadScroll);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.throttleEvent);
    }

    handleScrollEvent() {
        if(this.props.trackScrolling){
            this.props.trackScrolling(this.listRef.current);
        }
    }

    postClicked(e){
        let scrolled = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
        if(this.props.setListScrollPosition){
            this.props.setListScrollPosition(scrolled);

        }
    }


    render(){
        const offices = this.props.offices || [];

        const coworkBanner = (cowork) => {
            if(cowork === true || cowork === "1"){
                return (
                    <div className={"cowork-banner"}>
                        <span className="title">
                            Udlejer er interesseret i <u>co-working</u>
                        </span>
                    </div>
                )
            }
        };
        let loadingMore;
        if(this.props.loadingMore === true ){
            loadingMore = <Loader/>
        }

        return (
            <React.Fragment>

                <div id={"office-list"} ref={this.listRef}>
                    {offices.map((post) =>
                        <OfficePostListItem
                            key={post.ID}
                            post={post}
                            postClicked={this.postClicked}
                            user={this.props.user}
                        />

                    )}
                </div>
                {loadingMore}
            </React.Fragment>

        );
    }

}

export default OfficePostList;
