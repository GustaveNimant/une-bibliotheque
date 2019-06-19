export class Book {
    photo: string;
    synopsis: string;

    constructor(public title: string, public author: string) {
    }

    isEqual2 (other: Book ): boolean {
	if ( (other.author === this.author) &&
	     (other.title === this.title) 
	) {
	    return true;
	}
    }

    isEqual3 (other: Book ): boolean {
	if ( (other.synopsis === this.synopsis) &&
	     (this.isEqual2 (other))){
	    console.log ('In isEqual3 true');
	    return true;
	}
	console.log ('In isEqual3 false');
    }
    
    isEqual4 (other: Book ): boolean {
	if (this.photo){
	    if ( (other.photo === this.photo) &&
		 this.isEqual3 (other) ){
		return true;
	    }
	}
    }

    isEqual (other: Book ): boolean {
	return (this === other);
    }
}
    
