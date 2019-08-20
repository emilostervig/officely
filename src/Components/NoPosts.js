import React, {Component} from 'react';

class NoPosts extends Component {
    API_URL = process.env.REACT_APP_API_URL;


    constructor(props) {
        super(props);
    }

    render(){

        return (
            <div id="post-list" className="no-posts">
                <h4>Indsæt et sjov 404-ish billede her?</h4>
            </div>
        );
    }

}

export default NoPosts;


