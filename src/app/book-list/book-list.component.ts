import { Component, OnDestroy, OnInit } from '@angular/core';
import { BooksService } from '../services/books.service';
import { Book } from '../models/book.model';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
    selector: 'app-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.scss']
})

export class BookListComponent implements OnInit, OnDestroy {

    books = [new Book ('', '')];
    //    books: Book[]; /* new Book ? */
    booksSubscription: Subscription;

    constructor(private booksService: BooksService,
		private router: Router) {}

    ngOnInit() {
	console.log ('Entering in ngOnInit');
	this.booksSubscription = this.booksService.booksSubject.subscribe(
	    (books_a: Book[]) => {
		this.books = books_a;
		console.log('In ngOnInit typeof books_a ', (typeof books_a));

	    }
	);
	this.booksService.getBooks();
	console.log('In ngOnInit books ', this.books);
	console.log('In ngOnInit typeof books ', (typeof this.books));
	this.booksService.emitBooks();
    }

    onNewBook() {
	this.router.navigate(['/books', 'new']); /* /books/new */
    }

    onDeleteBook(book: Book) {
	this.booksService.removeBook(book);
    }

    onDeleteBookById(id: number) {
	this.booksService.removeBookById(id);
    }

    onViewBook(id: number) {
	this.router.navigate(['/books', 'view', id]); /* /books/view/id */
    }
    
    ngOnDestroy() {
	this.booksSubscription.unsubscribe();
    }
}
