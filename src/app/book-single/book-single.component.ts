import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../services/books.service';

@Component({
    selector: 'app-book-single',
    templateUrl: './book-single.component.html',
    styleUrls: ['./book-single.component.scss']
})

export class SingleBookComponent implements OnInit {

    book: Book;
    fileIsUploading = false;
    fileUrl: string;
    fileUploaded = false;

    constructor(private route: ActivatedRoute,      /* récuperer URL */
		private booksService: BooksService,
		private router: Router) {}

    ngOnInit() {
	console.log ('Entering in ngOnInit');
	this.book = new Book('', '');                /* création d'un book vide temporaire */
	const id = this.route.snapshot.params['id']; /* récupération de l'id depuis l'URL*/
	console.log ('ngOnInit : clicked book id', id);
	this.booksService.getSingleBook(+id)
	    .then( /* dès que le book est disponible */
		   (book: Book) => {
		       this.book = book;
		   }
	    );
    }

    onBackToBookList() {
	this.router.navigate(['/books']);
    }

    onRemoveBook() {
	console.log ('Entering in onRemoveBook with book', this.book);
	this.booksService.removeBook (this.book);
    }

    onSaveImage() {
	console.log ('Entering in onSaveImage with book', this.book);

	if (this.fileUrl && this.fileUrl !== '') {
 	    this.book.image = this.fileUrl;
 	}
	this.booksService.updateBook(this.book);
	this.router.navigate(['/books']);
    }

    onRemoveBookById(id: number) {
	this.booksService.removeBookById (id);
    }

    onUploadFile (file: File) {
	console.log ('Entering in onUploadFile');
	this.fileIsUploading = true;
	/* on déclenche, en asynchrone (then), le service pour le fichier en argument */
	this.booksService.uploadFile(file)
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
