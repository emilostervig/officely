import React, {Component} from 'react';

// Components
import SinglePost from './Components/SinglePost';
import FilterForm from './Components/FilterForm';
import Loader from './Components/Loader';
import NoPosts from './Components/NoPosts';
import OfficePostList from './Components/OfficePostList';

// Packages
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import {Switch} from "react-router-dom";

// functions
import groupBy from './Components/functions/groupBy';

// Assets
//import './wpstyle.css'
const AbortController = window.AbortController;

class App extends Component {
    API_URL = process.env.REACT_APP_API_URL;
    OFFICE_URL = process.env.REACT_APP_OFFICE_URL;

    constructor(props) {
        super(props);
        this.initialFilter = {
            // type filter
            chosenType: 'all',
            chosenTypeText: 'Alle typer',

            // capacity filter
            capacity: 1,

            // Cowork filter
            coworkChecked: false,

            // Price slider
            priceChanged: false,

            // Orderby
            orderbyKey: 'price_asc',
            orderbyTitle: 'Pris lav til høj',

            // Period
            selectedPeriod: {
                period: false,
                startDate: false,
                endDate: false
            },

            // Industries
            selectedIndustry: [],

            // Locations
            selectedLocations: [],

            // Facilities filter
            chosenFacilities: [],
            chosenFacilitiesText: 'Vælg faciliteter',
            chosenFacilitiesDefaultText: 'Vælg faciliteter',


        };
        this.state = {
            filterDataLoaded: false,
            // User
            user: {
                loggedIn : window.wpApiSettings.loggedIn,
                id: window.wpApiSettings.id
            },

            // Single post view
            post: {},

            // Post list data
            offices: [],
            noOffices: false,
            listScrolled: 0,
            postsLoading: true,
            loadingMore: false,
            loadedAll: false,
            postCount: 0,

            // Facilities filter
            officeFacilities: [],

            // type filter
            officeTypes: [],

            // Locations
            officeLocations: [],

            // Industries
            officeIndustries: [],

            // Price slider
            minPrice: 0,
            maxPrice: 10000,
            minPriceDefault: 0,
            maxPriceDefault: 10000,
            // minPriceDisplay: 0,
            // maxPriceDisplay: 0,

            // test redirect from outside react
            redirect: false,
            ...this.initialFilter
        };
        this.periods = [
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
        if(AbortController){
            this.fetchController = new AbortController();
            this.signal = this.fetchController.signal;
        }

        this.getOffices = this.getOffices.bind(this);
        this.getData = this.getData.bind(this);
        this.getOfficeFacilities = this.getOfficeFacilities.bind(this);
        this.getOfficeTypes = this.getOfficeTypes.bind(this);
        this.getOfficeLocations = this.getOfficeLocations.bind(this);
        this.getPostBySlug = this.getPostBySlug.bind(this);
        this.updateFilterValue = this.updateFilterValue.bind(this);
        this.updateParentState = this.updateParentState.bind(this);
        this.scrollReached = this.scrollReached.bind(this);
        this.setListScrollPosition = this.setListScrollPosition.bind(this);
        this.clearSingleOffice = this.clearSingleOffice.bind(this);
        this.checkLocalStorageInit = this.checkLocalStorageInit.bind(this);


    }

    componentWillMount() {
        this.checkLocalStorageInit()
    }

    componentDidMount() {
        this.getData();
    }


    componentWillUnmount() {

    }
    componentDidUpdate () {
        if (this.state.redirect) {
            this.setState({
                redirect: false
            })
        }
    }
    getTaxonomyLocalstorage = (key) => {
        let storageLocations = window.localStorage.getItem(key);
        if(storageLocations){
            storageLocations = JSON.parse(storageLocations);
            let date = storageLocations.time;
            let now = new Date().getTime();
            let diff = now - date;
            diff = Math.floor(diff/1000/60/60/24); // get diff in days
            if(diff <= 1){ // if data not a too old
                console.log('got '+key+' from localstorage');
                this.setState({
                    [key]: storageLocations.data
                });
                return true;
            }
        } else{
            return false;
        }
    }
    setTaxonomyLocalstorage = (key, data) => {
        let storageObj = {
            time: new Date().getTime(),
            data: data
        };
        window.localStorage.setItem(key, JSON.stringify(storageObj));
    }

    redirectToArchive = () => {
      this.setState({redirect: true})
    }


    checkLocalStorageInit() {
        let storage = JSON.parse(sessionStorage.getItem('officeFilter'));

        if(storage){
            let changes = {};
            if(storage.capacity){
                changes.capacity = storage.capacity;
            }
            if(storage.type){
                changes.chosenType = storage.type;
            }
            if(storage.cowork){
                changes.coworkChecked = true;
            }
            sessionStorage.removeItem('officeFilter');
            return this.setState(changes);
        }
        return false;
    }

    checkStatus = (response) => {
        if (response.ok) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    }

    getData(){
        Promise.all([
            this.getOfficeLocations(),
            this.getOfficeTypes(),
            this.getOfficeFacilities(),
            this.getOfficeIndustries(),
            this.getOffices(),
        ]).then(() => {
            this.setState({
                filterDataLoaded: true,
            })
        }).catch((err) => {
            console.log(err);
        });


    }

    getOfficeLocations(){
        let getFromStorage = this.getTaxonomyLocalstorage('officeLocations');
        if(getFromStorage){
            return getFromStorage;
        }
        console.log(`${this.API_URL}wp/v2/office_location?per_page=99`);
        return fetch(`${this.API_URL}wp/v2/office_location?per_page=99`)
            .then((response) => {
                this.checkStatus(response);
                return response.json()
            })
            .then(data => {
                this.setTaxonomyLocalstorage('officeLocations', data);
                this.setState({
                    officeLocations: data
                });
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    };

    getOfficeFacilities(){
        let getFromStorage = this.getTaxonomyLocalstorage('officeFacilities');
        if(getFromStorage){
            return getFromStorage;
        }
        console.log(`${this.API_URL}wp/v2/office_facilities?per_page=99`);
        return fetch(`${this.API_URL}wp/v2/office_facilities?per_page=99`)
            .then((response) => {
                this.checkStatus(response);
                return response.json()
            })
            .then(data => {
                this.setTaxonomyLocalstorage('officeFacilities', data);
                this.setState({
                    officeFacilities: data
                });
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    };
    getOfficeTypes(){
        let getFromStorage = this.getTaxonomyLocalstorage('officeTypes');
        if(getFromStorage){
            return getFromStorage;
        }
        return fetch(`${this.API_URL}wp/v2/office_type?per_page=99`)
            .then((response) => {
                    this.checkStatus(response);
                    return response.json()
                }
            )
            .then(data => {
                this.setTaxonomyLocalstorage('officeTypes', data);
                this.setState({
                    officeTypes: data
                });
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    };

    getOfficeIndustries = () => {
        let getFromStorage = this.getTaxonomyLocalstorage('officeIndustries');
        if(getFromStorage){
            return getFromStorage;
        }
        return fetch(`${this.API_URL}wp/v2/office_industry?per_page=99`)
            .then((response) => {
                    this.checkStatus(response);
                    return response.json()
                }
            )
            .then(data => {
                this.setTaxonomyLocalstorage('officeIndustries', data);
                this.setState({
                    officeIndustries: data
                });
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    };


    getPostBySlug(slug){
        this.setState({
            post: {},
        });
          // check if post is already in our state
        let maybePost = this.state.offices.find(function(el){
          return el.post_name === slug;
        });
        if(maybePost){
            console.log('found post in state', maybePost);
            this.setState({
                post: maybePost,
            });
        }

        console.log('fetching post from getPostBySlug - slug: '+slug);
        fetch(`${this.API_URL}officely/v2/office/${slug}`)
              .then((response) => {
                      return response.json()
              })
              .then(data => {
                  if(data){
                      this.setState({
                          post: data,
                          noOffices: !data.length
                      });
                  }
              })
              .catch(error => {
                  console.error("Error when fetching: ", error);
              });
    }

    getOffices(more = false){
        this.fetchController.abort();
        this.fetchController = new AbortController();
        this.signal = this.fetchController.signal;
        this.setState({
            postsLoading: !more,
            loadingMore: more
        });

        let queryBase = 'officely/v2/offices?';
        let queryParts = [];
        if(more === true){
            queryParts.push('offset='+this.state.offices.length);
        }
        if(this.state.chosenType !== 'all'){
            queryParts.push('office_type='+this.state.chosenType);
        }
        if(this.state.chosenFacilities.length){
            queryParts.push('office_facilities='+this.state.chosenFacilities);
        }
        if(this.state.coworkChecked === true){
            queryParts.push('cowork='+this.state.coworkChecked);
        }

        if(this.state.priceChanged === true){
            queryParts.push('minprice='+this.state.minPrice);
            queryParts.push('maxprice='+this.state.maxPrice);
        }
        if(this.state.capacity !== 1){
            queryParts.push('capacity='+this.state.capacity);
        }

        if(this.state.selectedIndustry !== false && this.state.selectedIndustry !== 0 && this.state.selectedIndustry.length){
            queryParts.push('office_industry='+this.state.selectedIndustry);
        }

        if(this.state.selectedPeriod !== false && this.state.selectedPeriod.startDate !== false){
            let period = this.state.selectedPeriod.period.id;
            let start = this.state.selectedPeriod.startDate.toISOString();
            let end = this.state.selectedPeriod.endDate.toISOString();
            queryParts.push(`period=${period}&start_date=${start}&end_date=${end}`);
        }

        if(this.state.selectedLocations.length > 0){
            let locations = this.state.selectedLocations.join(',');
            queryParts.push(`office_location=${locations}`)
        }
        // add order
        queryParts.push('officeorder='+this.state.orderbyKey);

        let query = queryBase + queryParts.join('&');
        console.log(`route: ${this.API_URL}${query}`);
        return fetch(`${this.API_URL}${query}`,
            {
                    signal: this.signal,
                }
            )
            .then((response) => {
                    this.checkStatus(response);
                    return response.json()
                }
            )
            .then(data => {
                console.log(data);
                if(!data.posts.length){
                    let stateObj = {
                        postsLoading: false,
                        loadedAll: true,
                        loadingMore: false,
                    };
                    if(more === false) {
                        stateObj = {
                            ...stateObj,
                            noOffices: true,
                            offices: data.posts,
                            postCount: data.foundPosts,

                        }
                    }
                    this.setState(stateObj)
                } else{
                    let stateObj = {
                        noOffices: !data.posts.length,
                        postsLoading: false,
                        offices: data.posts,
                        loadedAll: false,
                        loadingMore: false,
                        postCount: data.foundPosts,
                    };
                    if(more === true){
                        stateObj = {
                            ...stateObj,
                            offices: this.state.offices.concat(data.posts),
                            noOffices: false,
                        };
                    }
                    this.setState(stateObj);
                }
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    };


    updateParentState(key, val){
        this.setState({
            [key]: val,
        });
    }

    updateFilterValue(obj){
        console.log(this.initialFilter.chosenFacilities);
        console.log('updateFilterValue - trigger getOffices', obj)
        console.log(this.initialFilter.chosenFacilities);
        /*let newOptions = this.state.chosenFilter;
        for (const [key, value] of Object.entries(obj)) {
        newOptions[key] = value;
        }*/
        // TODO: create a single object in state to run filters on. Use key value to set query parameters in fetch.

        this.setState(
            obj, () => {
                this.getOffices();
            }
        );
    }
    clearFilter = () => {
        console.log('running clearFilter');
        console.log(this.initialFilter.chosenFacilities);
        this.setState(
            this.initialFilter, () => {
                this.getOffices();
            }
        )
    };

    scrollReached(el, buffer) {
        if(!el){
            return;
        }
        let reached = (el.getBoundingClientRect().bottom - buffer) <= window.innerHeight;

        return reached;
    }


    trackScrolling = (el) => {
        //const wrappedElement = document.getElementById('post-list');
        if (this.scrollReached(el, 1500 ) && this.state.loadingMore === false && this.state.loadedAll === false) {
            this.getOffices(true)
            //document.removeEventListener('scroll', this.trackScrolling);
        }
    };
    setListScrollPosition(len){
        this.setState({
            listScrolled: len,
        });
    }

    clearSingleOffice() {
        this.setState({
            post: {},
        });
    }
    render(){
        if(this.state.filterDataLoaded === false){
            return <Loader/>
        }
        let officeList;
        if(this.state.postsLoading === true){
            officeList = ( <Loader />);
        } else if(this.state.offices.length){
            // TODO: move all "loading" logic to PostList so entire component does not reMount when filter is changed.
            officeList = (
                <React.Fragment>
                    <OfficePostList
                        loadingMore={this.state.loadingMore}
                        offices={this.state.offices}
                        listScrolled={this.state.listScrolled}
                        trackScrolling={this.trackScrolling}
                        scrollReached={this.scrollReached}
                        setListScrollPosition={this.setListScrollPosition}
                        user={this.state.user}
                    />

                </React.Fragment>
        )
        } else {
            officeList = ( <NoPosts/>);
        };

        return (
            <div className={"app bbh-inner-section "+ (this.state.filterDataLoaded === true ? 'all-loaded' : '')} id={"office-app"}>
                <Router>
                    {this.state.redirect &&
                        <Redirect to={"/office"} to={{
                            pathname: '/office',
                            state: {redirect: false}
                        }}/>
                    }
                    <Switch>

                        <Route exact path={[this.OFFICE_URL, `${this.OFFICE_URL}page/2/`]} render={() =>
                            <React.Fragment>
                                <FilterForm
                                    // methods
                                    updateFilterValue={this.updateFilterValue}
                                    updateParentState={this.updateParentState}
                                    clearFilter={this.clearFilter}

                                    // post data
                                    postsLoading={this.state.postsLoading}
                                    postCount={this.state.postCount}
                                    filterDataLoaded={this.state.filterDataLoaded}

                                    // types
                                    officeTypes={this.state.officeTypes}
                                    chosenType={this.state.chosenType}
                                    chosenTypeText={this.state.chosenTypeText}

                                    // capacity
                                    capacity={this.state.capacity}

                                    // facilities
                                    officeFacilities={this.state.officeFacilities}
                                    chosenFacilities={this.state.chosenFacilities}
                                    chosenFacilitiesText={this.state.chosenFacilitiesText}
                                    chosenFacilitiesDefaultText={this.state.chosenFacilitiesDefaultText}

                                    // cowork
                                    coworkChecked={this.state.coworkChecked}

                                    // price
                                    minPrice={this.state.minPrice}
                                    maxPrice={this.state.maxPrice}
                                    minPriceDefault={this.state.minPriceDefault}
                                    maxPriceDefault={this.state.maxPriceDefault}
                                    priceChanged={this.state.priceChanged}

                                    // orderby
                                    orderbyKey={this.state.orderbyKey}
                                    orderbyTitle={this.state.orderbyTitle}

                                    // Periods
                                    periods={this.periods}
                                    selectedPeriod={this.state.selectedPeriod}

                                    // Industries
                                    industries={this.state.officeIndustries}
                                    selectedIndustry={this.state.selectedIndustry}

                                    // locations
                                    officeLocations={this.state.officeLocations}
                                    selectedLocations={this.state.selectedLocations}



                                />
                                <div className="container-fluid retina-max">
                                    {officeList}
                                </div>
                            </React.Fragment>

                        }/>

                        <Route exact path={`${this.OFFICE_URL}:slug`}  render={(props) =>
                            <SinglePost
                                key={props.match.params.slug}
                                slug={props.match.params.slug}
                                post={this.state.post}
                                getPostBySlug={this.getPostBySlug}
                                clearSingleOffice={this.clearSingleOffice}
                                offices={this.state.offices}
                                // Periods
                                periods={this.periods}
                                user={this.state.user}
                            />
                        }/>



                    </Switch>


                </Router>
            </div>
        );
    }

}

export default App;
