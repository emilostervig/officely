// external
import React, {Component} from 'react';
import {Link} from "react-router-dom";

//  functions
import formatNumber from "./functions/formatNumber";

class OfficePostListItem extends Component {


    constructor(props) {
        super(props);

        this.state = {
            favourited: ('favourited' in this.props.post) ? this.props.post.favourited : false,
        };

        this.handleLinkClick = this.handleLinkClick.bind(this);
    }


    handleLinkClick(e){
        this.props.postClicked();
    }

    toggleFavoutite = () => {
        this.setState({
            favourited: !this.state.favourited,
        })
    }

    newSplash = (postDate) => {

        let date = new Date(postDate);
        let now = new Date();
        let timeDiff = now.getTime()- date.getTime();
        let daysDiff = timeDiff / (1000 * 3600 * 24);
        if(daysDiff < 40){
            return (<span className={"office-new-splash"}>Nyhed</span> )
        } else{
            return null;
        }
    }

    favouriteBtn = (favourited) => {
        return (
            <div className={"favourite-post "+(favourited ? 'active' : '')} onClick={this.toggleFavoutite}>
                <span className={"icon icomoon icon-hjerte-"+ (favourited ? "aktiv" : "border")}  />
            </div>
        )
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
                        {this.newSplash(post.post_date)}
                        {this.favouriteBtn(this.state.favourited)}
                        <Link to={`/office/${post.slug}`} onClick={this.handleLinkClick}>
                            <div className="image" style={{backgroundImage: post.thumbnail ? 'url('+post.thumbnail+')':'none'}} />
                        </Link>
                    </div>
                    <div className={"content-wrap"}>
                        <div className="office-area">
                            <span className="area">Storkøbenhavn</span><span className="city">Nørrebro</span>
                        </div>
                        <div className="office-title">
                            <Link to={`/office/${post.slug}`} onClick={this.handleLinkClick}>
                                <h2 className="post-title">{post.post_title}</h2>
                            </Link>
                        </div>
                        <div className="office-meta">
                            <div className="icons">
                                <div className="calendar office-icon" key={"calendar"}>
                                    <span className="icomoon icon-kalender" >
                                    </span>
                                    <span className="icons-title">
                                        Min. 6 mdr.
                                    </span>
                                </div>
                                <div className="capacity office-icon" key={"capacity"}>
                                    <span className="icomoon icon-profil2" >
                                    </span>
                                    <span className="icons-title">
                                        {post.office_capacity}
                                    </span>
                                </div>
                                <div className="business office-icon" key={"business"}>
                                    <span className="icomoon icon-taske" >
                                    </span>
                                    <span className="icons-title">
                                        branche
                                    </span>
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
