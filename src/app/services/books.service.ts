import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Book } from '../models/book.model';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable()

export class BooksService {

    //    books: Book[] = [];
    books = [new Book ('', '')];
    booksSubject = new Subject<Book[]>();

    constructor() {
	this.getBooks();
	console.log('In constructor books ', this.books);
    }

    emitBooks() {
	this.booksSubject.next(this.books);
    }

    saveBooks() {
	firebase.database().ref('/books') /* accès au node /books */
		.set(this.books);         /* semblable à put : remplace */
    }

    getBooks() {
	console.log ('Entering in getBooks');
	firebase.database().ref('/books')
		.on('value', /* réaction synchrone
				à chaque événement (value) de la DB
				le callback est exécuté
				à chaque modification de la DB */
		    (a_data: DataSnapshot) => /* fonction de réaction */
			{
			   // this.books = a_data.val() ? data.val() : [];
			    this.books = a_data.val() ? a_data.val().map(book => new Book(book.title, book.author)) : [];
			    this.emitBooks(); /* émission du Subject*/
			}
		);
    }

    getSingleBook(id: number) {
	console.log('Entering in getSingleBook id', id);
	return new Promise(  /* réaction asynchrone */
			     (resolve, reject) => {
				 firebase.database().ref('/books/' + id)
					 .once('value') /* une fois suffit */
					 .then(
					     (data: DataSnapshot) => {
						 resolve(data.val()); /* valeur issue de DB */
					     }, (error) => {
						 reject(error);
					     }
					 );
			     }
	);
    }

    createNewBook(newBook: Book) {
	this.books.push(newBook);
	this.saveBooks();
	this.emitBooks();
    }

    areEqualBooks4 (book: Book, other: Book) {
	console.log('Entering in areEqualBooks book ',book);
	console.log('other for ',other);
	(other) => {
	    if ( (other.author == book.author) &&
		 (other.title == book.title) &&
		 (other.synopsis == book.synopsis)
	    ) {
		if (book.photo){
		    if (other.photo == book.photo) {
			return true;
		    }
		}
		else {
		    return true;
		}
	    }
	}
    }

    indexOfBook (book: Book) {
	const bookIndex = this.books.findIndex(
	    (a_book) => {
//		const the_book = new Book(a_book.title, a_book.author); 
		return a_book.isEqual3 (book)}
	);
	console.log('indexOfBook book ',book);
	console.log('indexOfBook index ',bookIndex);
	return bookIndex;
    }

    removeBook(book: Book) {
	console.log('Entering in removeBook for ',book);
	console.log('Array books is ',this.books);
	const bookType : string = typeof book;
	console.log('Type of book is ',bookType);
	if (book.photo){
	    const storageRef = firebase.storage().refFromURL(book.photo);
	    /* delete est asynchrone */
	    storageRef.delete ()
		      .then (
			  () => {
			      console.log('removeBook : Photo supprimée !');
			  })
		      .catch (
			  (error) => {
			      console.log('removeBook : Fichier non trouvé : ', error);
			  }
		      )
	}

	const bookIndexToRemove = this.indexOfBook (book);
	console.log('bookIndexToRemove ',bookIndexToRemove);
	
	if (bookIndexToRemove === -1) {
	    console.log('Error Skipped bookIndexToRemove ',bookIndexToRemove);
	    this.getBooks();

	}
	else {
	    // const bookIndex = this.books.findIndex (a_book => this.Book.isEqual(book));

	    this.books.splice(bookIndexToRemove, 1);
	    this.saveBooks();
	    this.emitBooks();
	}
	
    }

    removeBookById(id: number) {
	console.log('Entering in removeBookById withid ',id);
	this.books.splice(id, 1);
	this.saveBooks();
	this.emitBooks();
    }

    uploadFile(file: File) {
	return new Promise(
	    (resolve, reject) => {
		const almostUniqueFileName = Date.now().toString();
		const upload = firebase.storage().ref()
				       .child('images/' + almostUniqueFileName + file.name).put(file);
		console.log('uploadFile : upload ', upload);
		upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
			  () => { /* on suit le chargement */
			      console.log('uploadFile : Chargement du fichier ', file.name);
			  },
			  (error) => { /* en cas d'erreur on rejète */
			      console.log('uploadFile : Erreur de chargement ! : ', error);
			      reject();
			  },
			  () => { /* si tout se passe bien URL directe affichée dans single-book.component */
			      //resolve(upload.snapshot.downloadURL);
			      resolve(upload.snapshot.ref.getDownloadURL());
			  }
		);
	    }
	);
    }
}
