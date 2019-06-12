import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    constructor() {
	console.log ('Entrée dans constructor. Liaison à firebase');
	const config = {
	    apiKey: "AIzaSyBRvorDmAKFK9vneHnRsom9mDW398uUxEg",
	    authDomain: "une-bibliotheque-90c91.firebaseapp.com",
	    databaseURL: "https://une-bibliotheque-90c91.firebaseio.com",
	    projectId: "une-bibliotheque-90c91",
	    storageBucket: "une-bibliotheque-90c91.appspot.com",
	    messagingSenderId: "1012969104430",
	    appId: "1:1012969104430:web:815509d2f2949a33"
	};
	firebase.initializeApp(config);
    }
}
