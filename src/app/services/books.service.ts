import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Book } from '../models/book.model';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable()

export class BooksService {

    books: Book[] = [];
    booksSubject = new Subject<Book[]>();

    constructor() {
	this.getBooks();
    }
    
    emitBooks() {
	this.booksSubject.next(this.books);
    }

    saveBooks() {
	firebase.database().ref('/books').set(this.books);
    }

    getBooks() {
	firebase.database().ref('/books')
		.on('value', (data: DataSnapshot) => {
		    this.books = data.val() ? data.val() : [];
		    this.emitBooks();
		}
		);
    }

    getSingleBook(id: number) {
	return new Promise(
	    (resolve, reject) => {
		firebase.database().ref('/books/' + id).once('value').then(
		    (data: DataSnapshot) => {
			resolve(data.val());
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

    removeBook(book: Book) {
	console.log('Entering in removeBook');
	if (book.photo){
	    const storageRef = firebase.storage().refFromURL(book.photo);
	    /* delete est asynchrone */
	    storageRef.delete ().then (
		() => {
		    console.log('removeBook : Photo supprimée !');
		}
	    ).catch (
		(error) => {
		    console.log('removeBook : Fichier non trouvé : ', error);
		}
	    )
	}
	const bookIndexToRemove = this.books.findIndex(
	    (a_book) => {
		if(a_book === book) {
		    return true;
		}
	    }
	);
	this.books.splice(bookIndexToRemove, 1);
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
