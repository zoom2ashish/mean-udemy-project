import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private _posts: Post[] = [];
  private _postsUpdated$ = new BehaviorSubject<Post[]>([]);

  get posts() {
    return this._postsUpdated$.asObservable();
  }

  constructor() { }

  addPost(post: Post) {
    const newPost = { ...post };
    this._posts.push(newPost);
    this._postsUpdated$.next([...this._posts]);
  }
}
