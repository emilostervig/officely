// external
import React, {Component} from 'react';
// components
import ReadMore from './ReadMore';
import Loader from './Loader';
import Accordion from './Accordion'
import NumberSelector from "./FormElements/NumberSelector";
import PeriodSelector from "./FormElements/PeriodSelector";

// functions
import formatNumber from "./functions/formatNumber";

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

        // methods
        this.scrollToPost = this.scrollToPost.bind(this);
        this.getUserData =  this.getUserData.bind(this);
        this.handleUpdatePeople = this.handleUpdatePeople.bind(this);
        this.handleUpdatePeriod = this.handleUpdatePeriod.bind(this);
    }

    componentWillMount() {
        let comp = this;
        this.props.getPostBySlug(this.props.slug);
        this.ownerInterval = setInterval(function(){
            comp.getUserData(comp.props.post.post_author);
        }, 2000)

    }

    componentWillUnmount(){
        this.props.clearSingleOffice();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let eventClick = new Event('singleofficemount');
        window.dispatchEvent(eventClick);
    }

    componentDidMount() {
        console.log('did mount')
        let eventClick = new Event('singleofficemount');
        window.dispatchEvent(eventClick);
        this.scrollToPost();
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


    handleBookingRequest = () => {
        alert("new booking request \n \n Personer: " + this.state.selectedPeople + "\n\n Periode: "+this.state.selectedPeriod.name)
    };


    render(){
        let post = this.props.post;
        let owner = this.state.owner;
        let comp = this;
        let renderPost;

        const periods = [
            {
                id: 0,
                name: "Ubegrænset"
            },
            {
                id: 1,
                name: "Min. 1 mdr.",
            },
            {
                id: 3,
                name: "Min. 3 mdr."
            },
            {
                id: 6,
                name: "Min. 6 mdr.",
            },
            {
                id: 9,
                name: "Min. 9 mdr.",
            },
            {
                id: 12,
                name: "Min. 12 mdr.",
            }
        ];


        let Gallery;
        if('gallery' in post && post.gallery !== false && typeof post.gallery !== undefined){
            Gallery = post.gallery.map((img) => {
                let style = {
                    backgroundImage: 'url('+img+')',
                };
                return (<div className={"slide"}><div className={"image-slide"} style={style} key={img}/></div> )
            })


        } else{
            let style = {
                backgroundImage: 'url(https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)',
            };
            Gallery =  <div className={"image-slide"} style={style} key={"1"}/>


        }
        console.log(periods);
        if('ID' in post){
            renderPost = (
                <div id={"post-"+post.ID} className={"single-office"} ref={this.postRef}>
                    <div className="flex-row booking">
                        <div className="gallery">

                            <div className="image-wrap" >
                                {Gallery}
                            </div>

                        </div>
                        <div className="booking-content">
                            <div className="inside-booking-content">
                                <h1 className="post-title">{post.post_title}</h1>

                                <NumberSelector
                                    onUpdate={this.handleUpdatePeople}
                                    minVal={1}
                                    startVal={1}
                                    maxVal={10}
                                    />


                                <PeriodSelector
                                    periods={periods}
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
                                <button onClick={this.handleBookingRequest}>
                                    Send anmodning
                                    <span className="icon"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="grid-container office-sections section-box">
                        <div className="row">
                            <div className="col-sm-12 col-md-8">

                                {post.office_facilities.length > 0 &&
                                    <div className="facilities office-section section-box">
                                        <h2 className="facilities-title section-title">
                                            Faciliteter
                                        </h2>
                                        <div className="facilities-wrap">
                                            {post.office_facilities.map((fac) => {
                                                return (<div className={"single-facility"} key={fac.term_id}> <div className="checkmark"/> <span className="title">{fac.name}</span> </div> );
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
                                    <ReadMore
                                        maxHeight={'65px'}
                                        openText={"Skjul"}
                                        closedText={"Læs videre"}
                                    >

                                        {post.post_content}
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
                                    <div className="heading">
                                        Vigtigt!
                                    </div>
                                    <div className="security-content">
                                        <p>
                                            <strong>Kommuniker <u>altid</u> kun via Officely.</strong> For at vi kan beskytte dig skal du aldrig overføre penge eller kommunikere uden for officely-webstedet. Officely er din sikkerhed.
                                        </p>
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
            </React.Fragment>

        );
    }

}

export default SinglePost;
