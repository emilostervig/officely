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
import ShareBtn from "./ShareBtn";

// functions
import formatNumber from "../functions/formatNumber";
import OfficePostList from "./OfficePostList";
import throttle from "../functions/throttle";


class SinglePost extends Component {
    API_URL = process.env.REACT_APP_API_URL;
    IMAGES = process.env.REACT_APP_IMAGE_FOLDER;

    constructor(props) {
        super(props);

        this.state = {
            owner: false,
            selectedPeople: 1,
            //selectedPeriod: false,
            selectedPeriod: {
                period: false,
                startDate: false,
                endDate: false
            },
            favourited: false,
            startDate: false,
            endDate: false,
            bookedDates: false,
            relatedOffices:[],
            numberInvalid: false,
            periodInvalid: false,
            confirmationBoxOpen: false,
            errorBoxOpen: false,
            conversation: false,
        };
        // ref
        this.bookingBox = React.createRef();
        this.galleryBox = React.createRef();
        this.bookingRow = React.createRef();

        // methods
        this.scrollToPost = this.scrollToPost.bind(this);
        this.getUserData =  this.getUserData.bind(this);
        this.handleUpdatePeople = this.handleUpdatePeople.bind(this);
        this.handleUpdatePeriod = this.handleUpdatePeriod.bind(this);
        this.throttleScroll = throttle(this.stickyOnScroll, 100);
    }

    componentWillMount() {

    }

    componentWillUnmount(){
        document.removeEventListener('scroll', this.throttleScroll)
        this.props.clearSingleOffice();
    }

    componentDidMount() {
        let comp = this;
        if(!this.props.post || ('ID' in this.props.post) === false || ( this.props.slug !== this.props.post.post_name ) ){
            this.props.clearSingleOffice();
            this.props.getPostBySlug(this.props.slug)
            this.getBookedDates(this.props.post.ID);

        }
        const scrollEvent = document.addEventListener('scroll', this.throttleScroll)

        this.ownerInterval = setInterval(function(){
            comp.getUserData(comp.props.post.post_author);
        }, 2000)

        this.scrollToPost();

        let availableOffices = this.props.offices.filter( (off) => {
            return off.ID !== this.props.post.ID;
        });
        availableOffices = this.random_elems(availableOffices, 4);
        this.setState({
            relatedOffices: availableOffices,
        });
    }
    componentWillReceiveProps(nextProps) {

        if(nextProps.offices.length > 0 && this.state.relatedOffices.length === 0){
            let availableOffices = nextProps.offices.filter( (off) => {
                return off.ID !== this.props.post.ID;
            });
            availableOffices = this.random_elems(availableOffices, 4);
            this.setState({
                relatedOffices: availableOffices,
            });
        }

    }
    toggleFavoutite = () => {
        this.setState({
            favourited: !this.state.favourited,
        })
    }
    getBookedDates = (id) => {
        let nonce = window.wpApiSettings.nonce;
        if(!id){
            return;
        }
        fetch(`${this.API_URL}officely/v2/officebookings/${id}`,
            {
                headers: {
                    'X-WP-Nonce': nonce,
                    'content-type': 'application/json'
                },
            })
            .then((response) => {
                    if(response.ok === true){
                        return response.json();
                    } else{
                        console.log(response.url+": "+response.status+" - "+response.statusText)
                        return false;
                    }
                }
            )
            .then(data => {
                console.log(data);
                if(data !== false){
                    this.setState({
                        bookedDatestest: data,
                    })
                }
                return data;
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    }
    stickyOnScroll = (e) => {
        let ref = this.bookingBox;
        let refTop = this.bookingRowTop;
        let left = this.bookingBoxLeft;
        let w = ref.clientWidth;
        let h = ref.clientHeight;
        let gal = this.galleryBox;

        if(this.bookingRow !== null){
            refTop = this.bookingRow.getBoundingClientRect().top;
            left = this.bookingRow.clientWidth + this.bookingRow.getBoundingClientRect().left - w;
        }


        let postBot = this.postBottom;

        let currentScroll = window.pageYOffset; // get current position

        if((postBot - h) <= currentScroll) { // scrolled further than bottom
            ref.style.position = "absolute";
            ref.style.top = (postBot - h)+'px';
            gal.style.height = h+'px';
            ref.classList.add('fixed');

        } else if (refTop <= 0) {           // apply position: fixed
            ref.style.position = "fixed";
            ref.style.top = '0';
            //ref.style.left = left+'px';
            //ref.style.width = w+'px';
            ref.style.height = h+'px';
            ref.classList.add('fixed');
            gal.style.height = h+'px';


        } else {                                   // apply position: relative
            ref.style.position = 'relative';
            //ref.style.left = '0';
            //ref.style.width = '';
            ref.style.height = '';
            gal.style.height = 'auto';
            ref.classList.remove('fixed');
        }

    };
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
                if(data != false ){
                    if(this.props.post.post_author === id){
                        this.setState({
                            owner: data,
                        })
                    }
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
        this.setState({
            selectedPeople: val,
            numberInvalid: false,
        });
    }

    handleUpdatePeriod(selected){
        console.log(selected);
        let newState = {
            selectedPeriod: {
                period: selected.period,
                startDate: selected.startDate,
                endDate: selected.endDate,
            },
        };
        if(selected.startDate !== false && selected.endDate !== false){
            newState.periodInvalid = false;
        }
        this.setState(newState);

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

    handleSubmitBooking = () => {

        if(!window.wpApiSettings.loggedIn){
            let loginModal = new Event('showLoginModal',{referer: this.props.slug});
            window.dispatchEvent(loginModal);
        } else{
            let stateChanges = {};
            let errors = false;
            if(this.state.selectedPeriod.startDate === false || this.state.selectedPeriod.endDate === false){
                stateChanges.periodInvalid = true;
                errors = true;
            }
            if(this.state.selectedPeople < 1 || this.state.selectedPeople === false) {
                stateChanges.numberInvalid = true;
                errors = true;
            }

            if(errors === false){
               /*this.setState({
                   confirmationBoxOpen: true,
               })*/
               this.handleBookingRequest();
            } else{
                stateChanges.errorBoxOpen = true;
                // submit had errors
                this.setState(stateChanges);
            }
        }
    }

    handleBookingRequest = () => {
        let nonce = window.wpApiSettings.nonce;
        let people = this.state.selectedPeople;
        let period = this.state.selectedPeriod.period.id;
        let startDate = this.state.selectedPeriod.startDate;
        let endDate = this.state.selectedPeriod.endDate;
        console.log(people, period, startDate, endDate);
        if(people === undefined || people == null){
            return false;
        }
        if(period === undefined || period === null){
            return false;
        }
        if(startDate === undefined || startDate === null || startDate === false){
            return false;
        }
        if(endDate === undefined || endDate === null || endDate === false){
            return false;
        }
        let data = {
            people: people,
            period: period,
            startDate: startDate,
            endDate: endDate
        }
        fetch(`${this.API_URL}officely/v2/submitbooking/${this.props.post.ID}`,
            {
                method: "POST",
                headers: {
                    //'Accept': 'application/json',
                    'X-WP-Nonce': nonce,
                    //'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(data.success){
                    this.setState({
                        confirmationBoxOpen: true,
                        conversation: data.conversation_id,

                    })
                } else{
                    this.setState({
                        errorBoxOpen: true,
                    })
                }


            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })



        //alert("new booking request \n \n Personer: " + this.state.selectedPeople + "\n\n Periode: "+this.state.selectedPeriod.name+"\n\n Start: "+this.state.startDate+"\n\n Slut: "+this.state.endDate)
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

    isOwnPost = () => {
        if(window.wpApiSettings.loggedIn !== true){
            return false;

        }

        let user = parseInt(window.wpApiSettings.id);
        let author = parseInt(this.props.post.post_author);
        return author === user;
    };
    errorBox = (open) => {
        let closeBox = () => {
            this.setState({
                errorBoxOpen: false,
            })
        }
        return(
            <React.Fragment>
                <div className={`booking-error-modal-overlay ${open ? 'open' : ''}` } onClick={closeBox}/>
                <div className={`booking-error-modal ${open ? 'open' : ''}`}>
                    <h3 className="modal-heading" > Ups! </h3>
                    <div className="inside-padding">

                        <span className="close-btn" onClick={closeBox}/>
                        <div className="content">
                            <p>Der var en fejl med din anmodning.
                                <br/>
                                Tjek venligst din indtastning og prøv igen.
                            </p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
    confirmationBox = (open, data) => {
        let closeBox = () => {
            this.setState({
                confirmationBoxOpen: false,
            })
        }
        let formattedDate = (date) => {
            if(!date){
                return false;
            }
            const monthNames = [
                "Januar", "Februar", "Marts",
                "April", "Maj", "Juni",
                "Juli", "August", "September",
                "Oktober", "November", "December"
            ];
            date = new Date(date);
            let year = date.getFullYear();
            let monthNum = date.getMonth();
            let month = monthNames[monthNum].substr(0, 3);
            let day = date.getDate();
            return `${day}. ${month}. ${year}`;
        };
        return(
            <React.Fragment>
                <div className={`booking-confirmation-modal-overlay ${open ? 'open' : ''}` } onClick={closeBox}/>
                <div className={`booking-confirmation-modal ${open ? 'open' : ''}`}>
                    <h3 className="modal-heading" dangerouslySetInnerHTML={{__html: window.wpApiSettings.bookingboxHeading}} />
                    <div className="inside-padding">

                        <span className="close-btn" onClick={closeBox}/>
                        <div className="content">

                            <div className={"before-content"} dangerouslySetInnerHTML={{__html: window.wpApiSettings.bookingboxContent}} />
                            <div className="data-row">
                                {this.props.post.thumbnail &&
                                    <div className="left-col">
                                        <img src={this.props.post.thumbnail}/>
                                    </div>
                                }

                                <div className="right-col">
                                    <h3 className="office-title">
                                        {data.post.post_title}
                                    </h3>
                                    <div className="data">
                                        <p><strong>Antal personer</strong>: {data.people}</p>
                                        <p><strong>Ønsket periode</strong>: {data.period.name}</p>
                                        <p><strong>Startdato</strong>: {formattedDate(data.startDate)}</p>
                                    </div>
                                </div>

                            </div>

                            <div className={"after-content"} dangerouslySetInnerHTML={{__html: window.wpApiSettings.bookingboxContentAfter}} />

                            {this.state.conversation &&
                                <a href={`${window.wpApiSettings.messagesLink}?conversation_id=${this.state.conversation}`} className="bbh-btn btn yellow has-icon">Skriv til udlejeren <span className="icon icomoon icon-right"/></a>
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    render(){
        let post = this.props.post;
        let owner = this.state.owner;
        let comp = this;
        let renderPost = null;
        let numberClass = this.state.numberInvalid ? 'invalid' : '';
        let periodClass = this.state.periodInvalid ? 'invalid' : '';


        let gallery = null;
        if('gallery' in this.props.post && this.props.post.gallery !== false && this.props.post.gallery !== null && typeof this.props.post.gallery !== "undefined" ){
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
        if(this.state.relatedOffices.length > 0){

            relatedSection = (
                <div className="related-offices">

                    <div className="container-fluid">
                        <div className="heading-box">
                            <h2 className={"heading"}>Andre populære emner der matcher din søgning</h2>
                        </div>
                        <OfficePostList
                            loadingMore={this.state.loadingMore}
                            offices={this.state.relatedOffices}
                            listScrolled={this.state.listScrolled}
                            trackScrolling={this.trackScrolling}
                            scrollReached={this.scrollReached}
                            setListScrollPosition={this.setListScrollPosition}
                            user={this.props.user}
                        />

                    </div>

                </div>
            )
        }
        let newGallery = null;
        const handleOnDragStart = e => e.preventDefault()
        if('gallery' in this.props.post &&
            this.props.post.gallery !== false &&
            this.props.post.gallery !== null &&
            typeof this.props.post.gallery !== "undefined" &&
            this.props.post.gallery.length > 1
        ){
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
                        {post.gallery.map( (el,i) => {
                            return (
                                <div key={`${post.ID}_${i}`} className={"slide lazyload"} data-bgset={el} style={{backgroundImage: "url("+el+")"}} onDragStart={handleOnDragStart}/>
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
                <React.Fragment>
                    {this.confirmationBox(this.state.confirmationBoxOpen, {
                        period: this.state.selectedPeriod.period,
                        startDate: this.state.selectedPeriod.startDate,
                        people: this.state.selectedPeople,
                        post: post
                    })}
                    {this.errorBox(this.state.errorBoxOpen)}

                    <div id={"post-"+post.ID} className={"single-office"} ref={(node) => {
                        if(node !== null){
                            let bound = node.getBoundingClientRect();
                            this.postBottom = node.clientHeight;
                        }

                    }}>

                        <div className="flex-row booking" ref={(node) => {
                            if(node !== null){
                                this.bookingRow = node;
                                let bound =  node.getBoundingClientRect()
                                this.bookingRowTop = bound.top;
                                this.bookingRowLeft = bound.left;
                            }
                        }}>
                            <div className="gallery" ref={(node) => {
                                this.galleryBox = node;
                            }}>
                                {/*!!window.wpApiSettings.loggedIn &&
                                    <div className={"favourite-post " + (this.state.favourited ? 'active' : '')} onClick={this.toggleFavoutite}>
                                        <span className={"icon icomoon icon-hjerte-aktiv"}  />
                                    </div>
                                */}
                                <div className="image-wrap" >
                                    {newGallery}
                                </div>

                            </div>
                            <div className="booking-content" ref={(node) => {
                                this.bookingBox = node;
                                if(node !== null){
                                    let bound =  node.getBoundingClientRect()
                                    this.bookingBoxTop = bound.top;
                                    this.bookingBoxLeft = bound.left;
                                }

                            }}>
                                <div className="inside-booking-content">
                                    {this.newSplash(post.post_date)}
                                    <h1 className="post-title">{post.post_title}</h1>

                                    <NumberSelector
                                        onUpdate={this.handleUpdatePeople}
                                        minVal={1}
                                        startVal={1}
                                        maxVal={post.office_capacity}
                                        classname={numberClass}
                                        />


                                    <PeriodSelector
                                        periods={this.props.periods}
                                        onUpdate={this.handleUpdatePeriod}
                                        bookedDates={post.booked_dates}
                                        selected={this.state.selectedPeriod}
                                        className={periodClass}
                                    />


                                    <div className="office-price">

                                        <span className="price-val">
                                            {formatNumber(post.office_price, 0)},-
                                        </span>
                                        <span className="price-text">
                                             / pr. mdr.
                                        </span>
                                    </div>

                                    <div className="safety-notice">
                                        <p>Aftalen er først i hus når i begge har godkendt aftalen. Og bare rolig du betaler ikke før alt er på plads!</p>
                                    </div>
                                </div>
                                {!this.isOwnPost() &&
                                    <div className="booking-btn">
                                        <button className={"btn yellow"} onClick={this.handleSubmitBooking}>
                                            Send anmodning
                                            <span className="icon icomoon icon-right"/>
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="grid-container office-sections section-box">
                            <div className="row">
                                <div className="col-sm-12 col-md-8">

                                    <div className="post-location">
                                        <div className="location">
                                            {post.office_location !== false ? (
                                                post.office_location.map((el) => {
                                                    return <span className="term" key={post.ID+'_'+el.term_id}>{el.name}</span>
                                                })
                                            ): null}

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

                                            {('office_size' in post && post.office_size) ?

                                                <tr className="area">
                                                    <td className="name">Areal:</td>
                                                    <td className="value">{post.office_size}m<sup>2</sup></td>
                                                </tr>

                                            : null}

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
                                            <img src={this.IMAGES+"map.png"}/>
                                            <div className="nb-text">
                                                NB. Du får den præcise adresse ved gensidig aftale om leje
                                            </div>
                                        </div>
                                    </div>

                                    {post.office_rules != null && post.office_rules.length > 0 &&
                                        <div className="office-rules office-section section-box">
                                            <h2 className="section-title">
                                                Kontorregler
                                            </h2>
                                            <div className="accordion-wrap">
                                                {post.office_rules.map((el) => {
                                                    if (el.value === null || el.value.length === 0){
                                                        return null;
                                                    }
                                                    return <Accordion
                                                        label={el.name}
                                                        key={el.name}
                                                    >
                                                        {el.value}
                                                    </Accordion>
                                                })}
                                            </div>
                                        </div>
                                    }

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
                                    <div className="share-btn-section ">
                                        <ShareBtn
                                            icon={"icon-download"}
                                            buttonTitle={"Del"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </React.Fragment>
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
