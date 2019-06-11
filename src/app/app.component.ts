import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    constructor() {
	console.log ('Entering in constructor');
	const config = {
	    apiKey: "AIzaSyC7orofw52i-LUF0vbxhNTgjk3Hcr0d5OQ",
	    authDomain: "ma-bibliotheque-angular-58e80.firebaseapp.com",
	    databaseURL: "https://ma-bibliotheque-angular-58e80.firebaseio.com",
	    projectId: "ma-bibliotheque-angular-58e80",
	    storageBucket: "ma-bibliotheque-angular-58e80.appspot.com",
	    messagingSenderId: "924683141089"
	};
	firebase.initializeApp(config);
    }
}
