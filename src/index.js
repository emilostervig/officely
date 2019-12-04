// compatibility
import 'promise-polyfill/src/polyfill';
import 'unfetch/polyfill';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import * as serviceWorker from './serviceWorker';
import OfficePostListMock from "./Flexibles/OfficePostListMock";

if(document.getElementById('root')){
	ReactDOM.render(<App  />, document.getElementById('root'));
}


let flexibles = document.getElementsByClassName('office-list-flexible');

for (let i = 0; i < flexibles.length; i++) {
	let el = flexibles[i];
	let ids = el.getAttribute('data-office-ids');
	ReactDOM.render(<OfficePostListMock ids={ids}/>, el);
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
