// external
import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
// Components
import OfficePostListItem from '../Components/OfficePostListItem';
import Loader from '../Components/Loader';

// functions
import throttle from '../functions/throttle';
import Carousel, { Dots } from "@brainhubeu/react-carousel";

class OfficePostListMock extends Component {
	API_URL = process.env.REACT_APP_API_URL;
	OFFICE_URL = process.env.REACT_APP_OFFICE_URL;
	constructor(props) {
		super(props);

		this.state = {
			offices: [],
			user: {
				loggedIn : window.wpApiSettings.loggedIn,
				id: window.wpApiSettings.id
			},
			currentSlide: 0,
		};
	}

	componentDidMount() {

		let lazyLoadScroll = new Event('scroll');
		window.dispatchEvent(lazyLoadScroll);
		let ids = this.props.ids;
		let storageString = 'flex_offices_'+ids;
		let storageItem = JSON.parse(window.localStorage.getItem(storageString));
		let now = new Date().getTime();
		if(storageItem){
			let date = storageItem.time;
			let diff = now - date;
			diff = Math.floor(diff/1000/60/60/24); // get diff in days
			if(diff < 1){
				console.log('getting flex offices from localstorage - '+storageString);
				this.setState({
					offices: storageItem.posts
				});
			} else{
				window.localStorage.removeItem(storageString);
			}
			return true;
		}
		fetch(`${this.API_URL}officely/v2/offices?ids=${ids}`)
		.then((response) => {
				return response.json()
			}
		)
		.then(data => {
			console.log(data);
			if(data.posts.length){
				let stateObj = {
					offices: data.posts,
				};
				this.setState(stateObj);
				let storageObject = {
					time: now,
					posts: data.posts
				};

				window.localStorage.setItem(storageString, JSON.stringify(storageObject));
			}
		})
		.catch(error => {
			console.error("Error when fetching: ", error);
		})
	}
	postClicked = (e) => {
		//e.stopImmediatePropagation();
		e.preventDefault();
		console.log(e.currentTarget);
		window.location.href=e.currentTarget.getAttribute('href');

	}
	onCarouselChange = value => this.setState({ currentSlide: parseInt(value) });
	leftArrow = (slides, perPage) => {
		if(slides > perPage){
			return <span className="slide-arrow slide-prev icon icomoon icon-arrow-left" />
		} else{
			return '';
		}
	};
	rightArrow = (slides, perPage) => {
		if(slides > perPage){
			return <span className="slide-arrow slide-next icon icomoon icon-arrow-right" />
		} else{
			return '';
		}
	};
	render(){
		const offices = this.state.offices || [];

		return (
			<React.Fragment>
			<Router>
				<div className={"office-list"} >
					<Carousel
						infinite={false}
						//arrowLeft={this.leftArrow(offices.length, 4)}
						//arrowRight={this.rightArrow(offices.length, 4)}
						addArrowClickHandler
						value={this.state.currentSlide}
						onChange={this.onCarouselChange}
						draggable={offices.length > 4}
						slidesPerPage={4}
						slidesPerScroll={4}
						breakpoints={{
							1367:{
								infinite: offices.length > 3,
								slidesPerPage: 3,
								//arrowLeft: this.leftArrow(offices.length, 3),
								//arrowRight: this.rightArrow(offices.length, 3),
								//centered: (offices.length > 3),
								draggable: true
							},
							441:{
								slidesPerPage: 1.5,
								centered: true
							}
						}}

					>
						{offices.map((post) =>
							<OfficePostListItem
								noLink={true}
								key={post.ID}
								post={post}
								user={this.state.user}
								postClicked={this.postClicked}
							/>

						)}

					</Carousel>

				</div>
			</Router>
			</React.Fragment>

		);
	}

}

export default OfficePostListMock;
