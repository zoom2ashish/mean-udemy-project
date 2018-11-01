import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

const POSTS_URL = 'http://localhost:3000/api/posts';

interface PostsListResult {
  message: string;
  posts: Post[];
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private _posts: Post[] = [];
  private _postsUpdated$ = new BehaviorSubject<Post[]>([]);

  get posts() {
    return this._postsUpdated$.asObservable();
  }

  constructor(private http: HttpClient) { }

  addPost(post: Post) {
    const newPost = { id: null, ...post };
    this.http.post(POSTS_URL, newPost).subscribe((response) => {
      console.log(response);
      this._posts.push(newPost);
      this._postsUpdated$.next([...this._posts]);
    });
  }

  loadPosts() {
    this.http.get(POSTS_URL).subscribe((response: PostsListResult) => {
      const posts = response.posts;
      this._posts = posts;
      this._postsUpdated$.next([...posts]);
    });
  }
}
