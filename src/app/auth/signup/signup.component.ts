import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

    signupForm: FormGroup; /* <form [formGroup]="signupForm" */
    errorMessage: string;

    constructor(private formBuilder: FormBuilder, /* création du formulaire */
		private authService: AuthService, /* Authentification */
		private router: Router) { }

    ngOnInit() {
	this.initForm();
    }

    initForm() {
	this.signupForm = this.formBuilder.group({
	    email: ['', [Validators.required, Validators.email]], /* 2 Validators */
	    password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]] /* 6 charactères alpha-numériques */
	});
    }

    onSubmit() {
	const email = this.signupForm.get('email').value;
	const password = this.signupForm.get('password').value;
	
	this.authService.createNewUser(email, password).then(
	    () => {
		this.router.navigate(['/books']);
	    },
	    (an_error) => {/* affichage dans {{ errorMessage }} du template */
		this.errorMessage = an_error;
	    }
	);
    }
}
