import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../../services/books.service';

@Component({
    selector: 'app-single-book',
    templateUrl: './single-book.component.html',
    styleUrls: ['./single-book.component.scss']
})

export class SingleBookComponent implements OnInit {

    book: Book;

    constructor(private route: ActivatedRoute,
		private booksService: BooksService,
		private router: Router) {}

    ngOnInit() {
	console.log ('Entering in ngOnInit');
	this.book = new Book('', ''); /* book vide temporaire */
	const id = this.route.snapshot.params['id'];/* récupération de l'id depuis l'URL*/
	this.booksService.getSingleBook(+id)
	    .then(  /* dès que le book est disponible */
		(book: Book) => {
		    this.book = book;
		}
	    );
    }
    
    onBack() {
	this.router.navigate(['/books']);
    }
    
    onRemoveBook() {
	this.booksService.removeBook (this.book);
    }
}
