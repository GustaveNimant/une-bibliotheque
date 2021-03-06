import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { BooksService } from './services/books.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { BookListComponent } from './book-list/book-list.component';
import { SingleBookComponent } from './book-single/book-single.component';
import { BookFormComponent } from './book-form/book-form.component';
import { HeaderComponent } from './header/header.component';
import { ImageComponent } from './image/image.component';

const appRoutes: Routes = [
    { path: 'auth/signup', component: SignupComponent },
    { path: 'auth/signin', component: SigninComponent },
    { path: 'books', canActivate: [AuthGuardService], component: BookListComponent },
    { path: 'books/new', canActivate: [AuthGuardService], component: BookFormComponent },
    { path: 'books/view/:id', canActivate: [AuthGuardService], component: SingleBookComponent },
    { path: '', redirectTo: 'books', pathMatch: 'full' }, /* si path vide */
    { path: '**', redirectTo: 'books' } /* any path */
];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    BookListComponent,
    SingleBookComponent,
    BookFormComponent,
    HeaderComponent,
    ImageComponent
  ],
  imports: [
      BrowserModule,
      AppRoutingModule,
      ReactiveFormsModule,
      HttpClientModule,
      RouterModule.forRoot(appRoutes)
  ],
    providers: [
	AuthService,
	BooksService,
	AuthGuardService
    ],
    bootstrap: [
	AppComponent
    ]
})
export class AppModule { }
