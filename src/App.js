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
import {withRouter} from 'react-router-dom';
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

            // type filter
            officeTypes: [],
            chosenType: 'all',
            chosenTypeText: 'Alle typer',
            showOfficeType: false,

            // capacity filter
            capacity: 1,

            // Facilities filter
            officeFacilities: [],
            chosenFacilities: [],
            chosenFacilitiesText: 'Vælg faciliteter',
            chosenFacilitiesDefaultText: 'Vælg faciliteter',
            showOfficeFacilities: false,


            // Cowork filter
            coworkChecked: false,


            // Price slider
            minPrice: 0,
            maxPrice: 10000,
            minPriceDisplay: 0,
            maxPriceDisplay: 0,
            priceChanged: false,
            showOfficePrice: false,

            // Orderby
            orderbyKey: 'price_asc',
            orderbyTitle: 'Pris lav til høj',
            showOrderby: false,

            // Cities
            cities: [],

            // Period
            selectedPeriod: false,

            // Industries
            officeIndustries: [],
            selectedIndustry: {id: 0},

            // Locations
            officeLocations: [],
            selectedLocations: [],

            // test redirect from outside react
            redirect: false,
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

        }
        this.fetchController = new AbortController();
        this.signal = this.fetchController.signal;

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
        //this.getMunicipalities();
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

    redirectToArchive = () => {
      this.setState({redirect: true})
    }


    getMunicipalities = () => {

            fetch(`https://dawa.aws.dk/kommuner?udenforkommuneinddeling=false`)
                .then((response) => {
                    return response.json()
                })
                .then(data => {
                    let filtered = data.map((key) => {
                        return {
                            name: key.navn,
                            regioncode: key.regionskode,
                            cities: [],
                            code: key.kode,
                        };
                    })

                    return this.setState({
                        municipalities: filtered,
                    });

                }).then( data => {
                    this.getCities();
                })
                .catch(error => {
                    console.error("Error when fetching: ", error);
                })
    };
    getCities = () => {
        fetch(`https://dawa.aws.dk/supplerendebynavne2`)
            .then((response) => {
                return response.json()
            })
            .then(data => {
                let filtered = data.map( (key) => {
                    return {
                        name: key.navn,
                        municipalitycode: key.kommune.kode,
                        postcode: key.postnumre[0].nr,
                    }
                });
                let grouped = groupBy(filtered, "municipalitycode");
                let municipalities = this.state.municipalities;
                municipalities.forEach( (val, i) => {
                    let munCode = val.code;
                    if(grouped[munCode] !== undefined){
                        municipalities[i].cities = grouped[munCode];
                    }
                });

                this.setState({
                    municipalities: municipalities
                });
            })

            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    };


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
        console.log(`${this.API_URL}wp/v2/office_location?per_page=99`);
        return fetch(`${this.API_URL}wp/v2/office_location?per_page=99`)
            .then((response) => {
                this.checkStatus(response);
                return response.json()
            })
            .then(data => {
                this.setState({
                    officeLocations: data
                });
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    };

    getOfficeFacilities(){
        console.log(`${this.API_URL}wp/v2/office_facilities?per_page=99`);
        return fetch(`${this.API_URL}wp/v2/office_facilities?per_page=99`)
            .then((response) => {
                this.checkStatus(response);
                return response.json()
            })
            .then(data => {
                this.setState({
                    officeFacilities: data
                });
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    };
    getOfficeTypes(){
        return fetch(`${this.API_URL}wp/v2/office_type?per_page=99`)
            .then((response) => {
                    this.checkStatus(response);
                    return response.json()
                }
            )
            .then(data => {
                this.setState({
                    officeTypes: data
                });
            })
            .catch(error => {
                console.error("Error when fetching: ", error);
            })
    };

    getOfficeIndustries = () => {
        return fetch(`${this.API_URL}wp/v2/office_industry?per_page=99`)
            .then((response) => {
                    this.checkStatus(response);
                    return response.json()
                }
            )
            .then(data => {
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
        })
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


            console.log('fetching post from getPostBySlug - slug: '+slug)
          fetch(`${this.API_URL}officely/v2/office/${slug}`)
              .then((response) => {
                      return response.json()
                  }
              )
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

        if(this.state.selectedIndustry !== false && 'id' in this.state.selectedIndustry){
            queryParts.push('office_industry='+this.state.selectedIndustry.id);
        }

        if(this.state.selectedPeriod !== false){
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
            })
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
          console.log('updateFilterValue - trigger getOffices', obj)
          /*let newOptions = this.state.chosenFilter;
          for (const [key, value] of Object.entries(obj)) {
              newOptions[key] = value;
          }*/
          // TODO: create a single object in state to run filters on. Use key value to set query parameters in fetch.

          this.setState(
              obj, () => {
              this.getOffices();
          });
      }


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
        // TODO: move all "loading" logik to PostList so entire component does not reMount when filter is changed.
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

              <Route exact path={this.OFFICE_URL} render={() =>
                <React.Fragment>
                    <FilterForm
                        // methods
                        updateFilterValue={this.updateFilterValue}
                        updateParentState={this.updateParentState}

                        // post data
                        postsLoading={this.state.postsLoading}
                        postCount={this.state.postCount}
                        filterDataLoaded={this.state.filterDataLoaded}

                        // types
                        officeTypes={this.state.officeTypes}
                        chosenType={this.state.chosenType}
                        chosenTypeText={this.state.chosenTypeText}
                        showOfficeType={this.state.showOfficeType}

                        // capacity
                        capacity={this.state.capacity}

                        // facilities
                        officeFacilities={this.state.officeFacilities}
                        chosenFacilities={this.state.chosenFacilities}
                        chosenFacilitiesText={this.state.chosenFacilitiesText}
                        chosenFacilitiesDefaultText={this.state.chosenFacilitiesDefaultText}
                        showOfficeFacilities={this.state.showOfficeFacilities}

                        // cowork
                        coworkChecked={this.state.coworkChecked}

                        // price
                        minPrice={this.state.minPrice}
                        maxPrice={this.state.maxPrice}
                        showOfficePrice={this.state.showOfficePrice}

                        // orderby
                        orderbyKey={this.state.orderbyKey}
                        orderbyTitle={this.state.orderbyTitle}
                        showOrderby={this.state.showOrderby}

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
                    <div className="container-fluid">
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
