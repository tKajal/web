import { Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
import { Socket } from 'socket.io-client';

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	constructor(private socket: Socket) { }

	// emit event
	fetchMovies() {
		this.socket.emit('fetchMovies');
	}

	addMovie(movie: any) {
		this.socket.emit('addMovie', movie);
	}

	updateMovie(movie: any) {
		this.socket.emit('updateMovie', movie);
	}

	deleteMovie(id: Number) {
		this.socket.emit('deleteMovie', id);
	}

	// listen event
	onFetchMovies() {
		//return this.socket.fromEvent('fetchMovies');
	}
}