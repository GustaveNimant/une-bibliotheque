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
    
    onBack() {
	this.router.navigate(['/books']);
    }
    
    onRemoveBook() {
	console.log ('Entering in onRemoveBook with book', this.book);
	this.booksService.removeBook (this.book);
    }

    onRemoveBookById(id: number) {
	this.booksService.removeBookById (id);
    }
}
