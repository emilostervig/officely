// external
import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';


//  functions
import formatNumber from "./functions/formatNumber";
import formatTitle from './functions/formatTitle';

class OfficePostListItem extends Component {


    constructor(props) {
        super(props);

        this.state = {
            favourited: ('favourited' in this.props.post) ? this.props.post.favourited : false,
            currentSlide: 0,
            showCowork: false,
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
        if(!this.props.user.loggedIn){
            return null;
        }
        return (
            <div className={"favourite-post "+(favourited ? 'active' : '')} onClick={this.toggleFavoutite}>
                <span className={"icon icomoon icon-hjerte-aktiv"}  />
            </div>
        )
    }

    toggleShowCowork = () => {
        this.setState({
            showCowork: !this.state.showCowork
        })
    };

    onCarouselChange = value => this.setState({ currentSlide: parseInt(value) });

    render(){
        const offices = this.props.offices || [];

        const coworkBanner = (cowork, text) => {
            if(cowork === true || cowork === "1"){
                return (
                    <div className={"cowork-banner"}>
                        <span className="title">
                            Udlejer er interesseret i <u onMouseEnter={this.toggleShowCowork} onMouseLeave={this.toggleShowCowork}>co-working <span className={"icon icomoon icon-info"}/></u>
                        </span>
                        <div className={`office-cowork-text ` + (this.state.showCowork ? 'open' : 'closed')}>
                            {text}
                        </div>
                    </div>
                )
            }
        };
        const post = this.props.post;
        const handleOnDragStart = e => e.preventDefault();
        let gallery = null;
        if(post.gallery && post.gallery.length > 1){
            gallery = <React.Fragment>
                    <Carousel
                        infinite={true}
                        arrowLeft={<span className="slide-arrow slide-prev icon icomoon icon-arrow-left" />}
                        arrowRight={<span className="slide-arrow slide-next icon icomoon icon-arrow-right" />}
                        addArrowClickHandler
                        offset={0}
                        value={this.state.currentSlide}
                        onChange={this.onCarouselChange}
                        draggable={false}
                    >
                        {post.gallery.slice(0,5).map( (el,i) => {
                            let slide;
                            if(i === 0){
                                slide = <Link to={post.post_link} key={`${post.ID}_${i}`} className={"slide"} style={{backgroundImage: "url("+el+")"}} onDragStart={handleOnDragStart}/>
                            } else{
                                slide = <Link to={post.post_link} key={`${post.ID}_${i}`} className={"slide lazyload"} data-bgset={el} onDragStart={handleOnDragStart}/>
                            }
                            return slide;
                        })}
                    </Carousel>


                </React.Fragment>
        } else{
            gallery = <Link to={post.post_link} className="image" style={{backgroundImage: post.thumbnail ? 'url('+post.thumbnail+')':'none'}} />
        }
        return (
            <React.Fragment>
                <article key={post.ID} id={"office-"+post.ID} className="single-post single-office">
                    <div className="post-images">
                        {this.newSplash(post.post_date)}
                        {this.favouriteBtn(this.state.favourited)}
                            {gallery}
                    </div>
                    <div className={"content-wrap"}>
                        <div className="office-area">
                            <span className="area">Storkøbenhavn</span><span className="city">Nørrebro</span>
                        </div>
                        <div className="office-title">
                            <Link to={post.post_link} onClick={this.handleLinkClick}>
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
                                        {'office_industry' in post && post.office_industry !== false && post.office_industry.length > 0 ? formatTitle(post.office_industry[0].name) : 'branche'}
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
                    {coworkBanner(post.office_cowork, post.office_cowork_text)}
                </article>

            </React.Fragment>

        );
    }

}

export default OfficePostListItem;
