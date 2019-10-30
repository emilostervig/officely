// external
import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
// Components
import OfficePostListItem from '../Components/OfficePostListItem';
import Loader from '../Components/Loader';

// functions
import throttle from '../Components/functions/throttle';

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
		};
	}

	componentDidMount() {

		let lazyLoadScroll = new Event('scroll');
		window.dispatchEvent(lazyLoadScroll);
		let ids = this.props.ids;

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
				this.setState(stateObj)
			}
		})
		.catch(error => {
			console.error("Error when fetching: ", error);
		})
	}
	postClicked = (e) => {
		console.log(e.target.getAttribute("href"));
		let clickEvt = new MouseEvent('click', {
			bulles: true,
			cancelable: true,
			view: window
		});
		e.target.dispatchEvent(clickEvt);
	}
	render(){
		const offices = this.state.offices || [];

		return (
			<React.Fragment>
			<Router>
				<div id={"office-list"} >
					{offices.map((post) =>
						<OfficePostListItem
							key={post.ID}
							post={post}
							user={this.state.user}
							postClicked={this.postClicked}
						/>

					)}
				</div>
			</Router>
			</React.Fragment>

		);
	}

}

export default OfficePostListMock;
