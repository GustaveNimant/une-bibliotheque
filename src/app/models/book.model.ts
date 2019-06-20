export class Book {
    image: string;
    synopsis: string;

    constructor(public title: string, public author: string) {
    }

    isEqual2 (other: Book ): boolean {
	if ( (other.author === this.author) &&
	     (other.title === this.title) 
	) {
	    console.log ('In isEqual2 true');
	    return true;
	    
	}
	console.log ('In isEqual2 false');
    }
    
    isEqual3 (other: Book ): boolean {
	if ((this.isEqual2 (other)) &&
	    (other.synopsis === this.synopsis)
	){
	    console.log ('In isEqual3 true');
	    return true;
	}
	console.log ('In isEqual3 false other.synopsis', other.synopsis,' this.synopsis',this.synopsis);
    }
    
    isEqual4 (other: Book ): boolean {
	if (this.image){
	    if ( (other.image === this.image) &&
		 this.isEqual3 (other) ){
		return true;
	    }
	}
    }

    isEqual (other: Book ): boolean {
	return (this === other);
    }
}
    
