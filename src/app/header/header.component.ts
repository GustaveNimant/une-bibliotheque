import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

    isAuth: boolean;

    constructor(private authService: AuthService) { }

    ngOnInit() {
	console.log ('Entering in ngOnInit');
	firebase.auth().onAuthStateChanged( 
	    (a_user) => { /* a_user: Observable */
		if(a_user) {
		    this.isAuth = true;
		} else {
		    this.isAuth = false;
		}
	    }
	);
    }

    onSignOut() {
	this.authService.signOutUser();
    }

}
