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

    saveToFirebaseBooks() {
	console.log('Entering in saveToFirebaseBooks with books ', this.books);
	firebase.database().ref('/books') /* accès au node /books */
		.set(this.books);         /* semblable à put : remplace */
    }

    getBooks() { /* Only two properties title and author are copied */
	console.log ('Entering in getBooks');
	firebase.database().ref('/books')
		.on('value', /* réaction synchrone
				à chaque événement (value) de la DB
				le callback est exécuté
				à chaque modification de la DB */
		    (a_data: DataSnapshot) => /* fonction de réaction */
			{
			    const the_books = a_data.val() ? a_data.val() : [];
			    console.log('In getBooks the_books',the_books);
			    console.log('In getBooks typeof the_books',(typeof the_books));
			    this.books = the_books.map(book => new Book(book.title, book.author));
			    console.log('In getBooks this.books',this.books);
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
	console.log('Entering in createNewBook newBook ',newBook);
	this.books.push(newBook);
	this.saveToFirebaseBooks();
	this.emitBooks();
    }

    indexOfBook (book: Book) {
	const bookIndex = this.books.findIndex(
	    (a_book) => {
		return a_book.isEqual2 (book)}
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
	if (book.image){
	    const storageRef = firebase.storage().refFromURL(book.image);
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
	    this.saveToFirebaseBooks();
	    this.emitBooks();
	}
    }

    removeBookById(id: number) {
	console.log('Entering in removeBookById withid ',id);
	this.books.splice(id, 1);
	this.saveToFirebaseBooks();
	this.emitBooks();
    }

    updateBook(book: Book) {
	console.log('Entering in updateBook with book ',book);
	this.saveToFirebaseBooks();
	this.emitBooks();
    }

    uploadFile(file: File) {
	console.log('Entering in uploadFile with file ', file);
	return new Promise(  /* asynchrone */
			     (resolve, reject) => {
		const almostUniqueFileName = Date.now().toString();
		const upload = firebase.storage().ref()
				       .child('images/' + almostUniqueFileName + file.name)
				       .put(file);                  /* écrase le fichier */
		console.log('uploadFile : upload ', upload);
		upload.on(firebase.storage.TaskEvent.STATE_CHANGED, /* On réagit à chaque changement d'état */
			  () => { /* on suit le chargement */
			      console.log('uploadFile : Chargement du fichier ', file.name);
			  },
			  (error) => { /* en cas d'erreur on rejète */
			      console.log('uploadFile : Erreur de chargement ! : ', error);
			      reject();
			  },
			  () => { /* si tout se passe bien URL directe affichée dans book-single.component */
			      // resolve(upload.snapshot.downloadURL);
			      resolve(upload.snapshot.ref.getDownloadURL());
			  }
		);
	    }
	);
    }
}
