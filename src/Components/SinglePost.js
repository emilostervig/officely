// external
import React, {Component} from 'react';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

// components
import ReadMore from './ReadMore';
import Loader from './Loader';
import Accordion from './Accordion'
import NumberSelector from "./FormElements/NumberSelector";
import PeriodSelector from "./FormElements/PeriodSelector";

// functions
import formatNumber from "./functions/formatNumber";
import OfficePostList from "./OfficePostList";

class SinglePost extends Component {
    API_URL = process.env.REACT_APP_API_URL;


    constructor(props) {
        super(props);

        this.state = {
            testImage: 'http://lorempixel.com/output/cats-q-c-640-480-1.jpg',
            owner: false,
            selectedPeople: 1,
            selectedPeriod: false,
        };
        // ref
        this.postRef = React.createRef();
        this.bookingBox = React.createRef();

        // methods
        this.scrollToPost = this.scrollToPost.bind(this);
        this.getUserData =  this.getUserData.bind(this);
        this.handleUpdatePeople = this.handleUpdatePeople.bind(this);
        this.handleUpdatePeriod = this.handleUpdatePeriod.bind(this);
    }

    componentWillMount() {
        console.log('componentWillMount')

    }

    componentWillUnmount(){
        console.log('componentWillUnmount');
        document.removeEventListener('scroll', this.stickyOnScroll)
        /*
        if(this.props.slug !== this.props.post.post_name){
            this.props.clearSingleOffice();
        }

         */
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdate')

        let eventClick = new Event('singleofficemount');
        //window.dispatchEvent(eventClick);

        /*
        if(this.props.slug !== this.props.post.post_name && this.props.post.post_name !== undefined){
            //this.props.clearSingleOffice();
            this.props.getPostBySlug(this.props.slug);
            this.scrollToPost();
        }

         */
    }

    componentDidMount() {
        let comp = this;
        this.props.getPostBySlug(this.props.slug)
        const scrollEvent = document.addEventListener('scroll', this.stickyOnScroll)

        this.ownerInterval = setInterval(function(){
            comp.getUserData(comp.props.post.post_author);
        }, 2000)

        let eventClick = new Event('singleofficemount');
        //window.dispatchEvent(eventClick);
        this.scrollToPost();
    }
    stickyOnScroll = (e) => {
        let ref = this.bookingBox
        let refTop = this.top;

        var currentScroll = window.pageYOffset; // get current position

        if (currentScroll >= refTop) {           // apply position: fixed if you
            ref.style.position = "fixed";
            ref.style.top = '0';
            ref.style.left = '0';

        } else {                                   // apply position: static
            ref.style.position = 'static';
        }

    }
    getUserData(id){
        if(!id){
            return;
        }
        fetch(`${this.API_URL}officely/v2/officeowner/${id}`)
            .then((response) => {
                    return response.json()
                }
            )
            .then(data => {
                if(data != false){
                    this.setState({
                        owner: data,
                    })
                    clearInterval(this.ownerInterval);
                }
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    }

    scrollToPost() {
        // let ele = this.postRef.current;
        // let eleOffset = ele.offsetTop;
        window.scrollTo(0, 0);
    }

    handleUpdatePeople(val){
        console.log(val);
        this.setState({
            selectedPeople: val,
        });
    }

    handleUpdatePeriod(selected){
        console.log(selected);
        this.setState({
            selectedPeriod: selected,
        });

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

    handleBookingRequest = () => {
        alert("new booking request \n \n Personer: " + this.state.selectedPeople + "\n\n Periode: "+this.state.selectedPeriod.name)
    };

    random_elems = (arr, count) => {
        let len = arr.length;
        let lookup = {};
        let tmp = [];

        if (count > len)
            count = len;

        for (let i = 0; i < count; i++) {
            let index;
            do {
                index = ~~(Math.random() * len);
            } while (index in lookup);
            lookup[index] = null;
            tmp.push(arr[index]);
        }

        return tmp;
    }



    render(){
        console.log('first line in render()');
        let post = this.props.post;
        let owner = this.state.owner;
        let comp = this;
        let renderPost = null;

        console.log('before gallery');
        console.log('before gallery');


        let gallery = null;
        if('gallery' in this.props.post && this.props.post.gallery !== false && this.props.post.gallery !== null && typeof this.props.post.gallery !== "undefined" ){
            console.log("GALLERY", this.props.post.gallery)
            gallery = this.props.post.gallery.map((img, i) => {
                let style = {
                    backgroundImage: 'url('+img+')',
                };
                return (<div key={this.props.post.ID+"+slide-no-"+i} className={"slide"}><div className={"image-slide"} style={style}/></div>)
            })


        } else{
            let style = {
                backgroundImage: 'url(https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)',
            };
            gallery =  <div key={"+slide-placeholder"} className={"slide"}> <div className={"image-slide"} style={style}/></div>
        }
        let relatedSection = null;
        if(this.props.offices.length > 0){
            let availableOffices = this.props.offices.filter( (off) => {
                return off.ID !== post.ID;
            });
            availableOffices = this.random_elems(availableOffices, 4);
            relatedSection = (
                <div className="related-offices">

                    <div className="grid-container">
                        <div className="heading-box">
                            <h2 className={"heading"}>Andre populære emner der matcher din søgning</h2>
                        </div>
                        <OfficePostList
                            loadingMore={this.state.loadingMore}
                            offices={availableOffices}
                            listScrolled={this.state.listScrolled}
                            trackScrolling={this.trackScrolling}
                            scrollReached={this.scrollReached}
                            setListScrollPosition={this.setListScrollPosition}
                        />

                    </div>

                </div>
            )
        }
        let newGallery = null;
        const handleOnDragStart = e => e.preventDefault()
        if('gallery' in this.props.post && this.props.post.gallery !== false && this.props.post.gallery !== null && typeof this.props.post.gallery !== "undefined" ){
            newGallery = (
                <React.Fragment>
                    <Carousel
                        infinite
                        dots
                        offset={0}
                        arrowLeft={<span className="slide-arrow slide-prev icon icomoon icon-arrow-left" />}
                        arrowRight={<span className="slide-arrow slide-next icon icomoon icon-arrow-right" />}
                        addArrowClickHandler
                    >
                        {post.gallery.map( (el) => {
                            return (
                                <div className={"slide"} style={{backgroundImage: "url("+el+")"}} onDragStart={handleOnDragStart}/>
                            )
                        })}
                        </Carousel>
                </React.Fragment>
                )
        } else{
            newGallery = <div className={"placeholder-gallery"} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)' }}/>;
        }

        if('ID' in post){
            renderPost = (
                <div id={"post-"+post.ID} className={"single-office"} >
                    <div className="flex-row booking">
                        <div className="gallery">
                            <div className="image-wrap" >
                                {newGallery}
                            </div>

                        </div>
                        <div className="booking-content" ref={(node) => {
                            this.bookingBox = node;
                            if(node !== null){
                                let bound =  node.getBoundingClientRect()
                                this.top = bound.top;
                            }

                        }}>
                            <div className="inside-booking-content">
                                {this.newSplash(post.post_date)}
                                <h1 className="post-title">{post.post_title}</h1>

                                <NumberSelector
                                    onUpdate={this.handleUpdatePeople}
                                    minVal={1}
                                    startVal={1}
                                    maxVal={10}
                                    />


                                <PeriodSelector
                                    periods={this.props.periods}
                                    onUpdate={this.handleUpdatePeriod}
                                />


                                <div className="office-price">

                                    <span className="price-val">
                                        {formatNumber(post.office_price, 0)},-
                                    </span>
                                    <span className="price-text">
                                         / pr. mdr.
                                    </span>
                                </div>
                            </div>
                            <div className="booking-btn">
                                <button className={"btn yellow"} onClick={this.handleBookingRequest}>
                                    Send anmodning
                                    <span className="icon icomoon icon-right"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="grid-container office-sections section-box">
                        <div className="row">
                            <div className="col-sm-12 col-md-8">

                                <div className="post-location">
                                    <div className="location">

                                        <div className="municipality">
                                            Storkøbenhavn
                                        </div>
                                        <div className="city">
                                            Amager
                                        </div>

                                    </div>

                                </div>

                                {post.office_facilities.length > 0 &&
                                    <div className="facilities office-section section-box">
                                        <h2 className="facilities-title section-title">
                                            Faciliteter
                                        </h2>
                                        <div className="facilities-wrap">
                                            {post.office_facilities.map((fac) => {
                                                return (<div className={"single-facility"} key={fac.term_id}> <div className="checkmark icomoon icon-checkmark"/> <span className="title">{fac.name}</span> </div> );
                                            })}
                                        </div>
                                    </div>
                                }

                                <div className="about office-section section-box">
                                    <h2 className="about-title section-title">
                                        Om lejemålet
                                    </h2>
                                    <table className={"simple-data"}>
                                        <tbody>
                                        {('office_types' in post && post.office_types.length) ?
                                            <tr className={"type"}>
                                                <td className={"name"}>Kontortype:</td>
                                                <td className="value">{post.office_types[0].name}</td>
                                            </tr>
                                        : null}


                                            <tr className="area">
                                                <td className="name">Areal:</td>
                                                <td className="value">12kvm (placeholder, mangler data)</td>
                                            </tr>
                                            <tr className="location">
                                                <td className="name">Beliggenhed:</td>
                                                <td className="value">Amagerfælledvej, København (placeholder, mangler data)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h2 className="office-title">
                                        {post.post_title}
                                    </h2>
                                    <ReadMore
                                        maxHeight={'65px'}
                                        openText={"Skjul"}
                                        closedText={"Læs videre"}
                                    >

                                        <div dangerouslySetInnerHTML={{__html: post.post_content}}/>
                                    </ReadMore>


                                    <div className="map">
                                        HER MANGLER KORT
                                        <div className="nb-text">
                                            NB. Du får den præcise adresse ved gensidig aftale om leje
                                        </div>
                                    </div>
                                </div>

                                <div className="office-rules office-section section-box">


                                    {post.office_rules.map((el) => {
                                        return <Accordion
                                            label={el.name}
                                            key={el.name}
                                            >
                                            {el.value}
                                        </Accordion>
                                    })}

                                </div>

                                <div className="security-notice office-section">
                                    <div className="flex-row">
                                        <div className="icon">
                                            <span className="icomoon icon-sikkerhed"/>
                                        </div>
                                        <div className="message">
                                            <h3 className="heading">
                                                Vigtigt!
                                            </h3>
                                            <div className="security-content">
                                                <p>
                                                    <strong>Kommuniker <u>altid</u> kun via Officely.</strong> For at vi kan beskytte dig skal du aldrig overføre penge eller kommunikere uden for officely-webstedet. Officely er din sikkerhed.
                                                </p>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                                <div className="owner-info office-section section-box">
                                    {owner !== false ? (

                                        <React.Fragment>
                                            <h2 className="owner-info-title section-title">
                                                Udlejer information
                                            </h2>
                                            <div dangerouslySetInnerHTML={{__html: this.state.owner}}/>
                                        </React.Fragment>
                                    ) : (
                                        <Loader/>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )
        } else{
            renderPost = (
                <Loader/>
            )
        };




        return (
            <React.Fragment>
               {renderPost}
                {relatedSection}
            </React.Fragment>

        );
    }

}

export default SinglePost;
