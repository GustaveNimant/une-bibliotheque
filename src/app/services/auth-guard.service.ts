import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

@Injectable() /* Asynchrone */

export class AuthGuardService implements CanActivate {

    constructor(private router: Router) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
	return new Promise(
	    (resolve, reject) => {
		firebase.auth().onAuthStateChanged(
		    (a_user) => {
			if(a_user) {
			    resolve(true); /* laisser passer */
			} else {/* redirigé vers /auth/signin */
			    this.router.navigate(['/auth', 'signin']);
			    resolve(false);
			}
		    }
		);
	    }
	);
    }
}
