// external
import React, {Component} from 'react';
import {Link} from "react-router-dom";

// Components
import OfficePostListItem from './OfficePostListItem';
import Loader from './Loader';

class OfficePostList extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        this.listRef = React.createRef();

        this.handleScrollEvent = this.handleScrollEvent.bind(this);
        this.postClicked = this.postClicked.bind(this);
        this.throttleEvent = this.props.throttle(this.handleScrollEvent, 500);
    }




    // TODO: move scroll events to OfficeList component (create component)
    componentDidMount() {
        document.addEventListener('scroll', this.throttleEvent);
        window.scrollTo(0, this.props.listScrolled);
    }


    componentWillUnmount() {
        document.removeEventListener('scroll', this.throttleEvent);
    }

    handleScrollEvent() {
        this.props.trackScrolling(this.listRef.current);
    }

    postClicked(e){
        let scrolled = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
        this.props.setListScrollPosition(scrolled);
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
                        />

                    )}
                </div>
                {loadingMore}

            </React.Fragment>

        );
    }

}

export default OfficePostList;
