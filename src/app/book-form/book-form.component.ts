import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../models/book.model';
import { BooksService } from '../services/books.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-book-form',
    templateUrl: './book-form.component.html',
    styleUrls: ['./book-form.component.scss']
})

export class BookFormComponent implements OnInit {

    bookForm: FormGroup;
    fileIsUploading = false;
    fileUrl: string;
    fileUploaded = false;
    
    constructor(private formBuilder: FormBuilder,
		private booksService: BooksService,
		private router: Router) { }
    
    ngOnInit() {
	console.log ('Entering in ngOnInit');
	this.initForm();
    }
    
    initForm() {
	this.bookForm = this.formBuilder.group({
	    title: ['', Validators.required],
	    author: ['', Validators.required],
	    synopsis: '',
	    image: ''
	});
    }
    
    onSaveBook() {
	console.log ('Entering in onSaveBook');
	const title = this.bookForm.get('title').value;
	const author = this.bookForm.get('author').value;
	const synopsis = this.bookForm.get('synopsis').value;
	const newBook = new Book(title, author);
	newBook.synopsis = synopsis;
	/* si un fichier a été chargé : il existe une URL */
 	if (this.fileUrl && this.fileUrl !== '') {
 	    newBook.image = this.fileUrl;
	    console.log ('In onSaveBook image ', this.fileUrl);
 	}
	this.booksService.createNewBook(newBook);
	this.router.navigate(['/books']);
    }

    onUploadFile (a_file: File) {
	console.log ('Entering in onUploadFile');
	this.fileIsUploading = true;
	/* on déclenche, en asynchrone (then), le service pour le fichier en argument */
	this.booksService.uploadFile(a_file)
	    .then ( /* asynchrone */
		(url: string) => {
		    /* si le chargement réussi on récupère l'URL en réponse */
		    /* pour enregistrer l'URL */
		    this.fileUrl = url;
		    this.fileIsUploading = false;
		    this.fileUploaded = true;
		}
	)
    }

    detectFiles (event) { /* event provient du DOM, déclenche onUploadFile */
	/* limité à un seul fichier dans le template */
	const a_file = event.target.files[0];
	console.log ('Entering in detectFiles : event.target.file ', a_file);
	this.onUploadFile(a_file);
    }
}
