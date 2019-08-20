// external
import React, {Component} from 'react';
import {Link} from "react-router-dom";

//  functions
import formatNumber from "./functions/formatNumber";

class OfficePostListItem extends Component {


    constructor(props) {
        super(props);

        this.state = {

        };

        this.handleLinkClick = this.handleLinkClick.bind(this);
    }


    handleLinkClick(e){
        this.props.postClicked();
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
        const post = this.props.post;
        let thumbnail;

        return (
            <React.Fragment>
                <article key={post.ID} id={"office-"+post.ID} className="single-post single-office">
                    <div className="post-images">
                        <Link to={`/office/${post.slug}`} onClick={this.handleLinkClick}>
                            <div className="image" style={{backgroundImage: post.thumbnail ? 'url('+post.thumbnail+')':'none'}} />
                        </Link>
                    </div>
                    <div className={"content-wrap"}>
                        <div className="office-area">
                            Her kommer lokation
                        </div>
                        <div className="office-title">
                            <Link to={`/office/${post.slug}`} onClick={this.handleLinkClick}>
                                <h2 className="post-title">{post.post_title}</h2>
                            </Link>
                        </div>
                        <div className="office-meta">
                            <div className="icons">
                                <div className="calendar office-icon" key={"calendar"}>
                                </div>
                                <div className="capacity office-icon" key={"capacity"}>
                                    {post.office_capacity}
                                </div>
                                <div className="business office-icon" key={"business"}>
                                    branche
                                </div>
                            </div>
                            {post.office_price !== false ? (
                                <div className="office-price">
                                    <span className="price-prefix" key={"price-prefix"}>
                                        Pris fra: </span>
                                    <span className="price-text" key={"price-text"}>
                                        {formatNumber(post.office_price)},- pr. mdr. pr. person
                                    </span>
                                </div>
                            ): ''}
                        </div>
                    </div>
                    {coworkBanner(post.office_cowork)}
                </article>

            </React.Fragment>

        );
    }

}

export default OfficePostListItem;
