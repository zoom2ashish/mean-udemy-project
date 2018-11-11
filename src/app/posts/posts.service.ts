import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post, PostDto, QueryParams } from './post.model';

const POSTS_URL = 'http://localhost:3000/api/posts';

interface PostsListResult {
  message: string;
  posts: any[];
  totalPosts: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private _posts: Post[] = [];
  private _postsUpdated$ = new Subject<{totalPosts: number, posts: Post[]}>();

  get posts() {
    return this._postsUpdated$.asObservable();
  }

  constructor(private http: HttpClient, private router: Router) { }

  getPost(postId: string) {
    return this.http.get<PostDto>(`${POSTS_URL}/${postId}`);
  }

  addPost(post: Post) {
    // const newPost = { id: null, ...post, };
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image, post.title);
    this.http.post<{message: string, post: Post}>(POSTS_URL, postData).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    // const updatedPost = { id, title, content, imagePath: null };
    this.http.put<{message: string, post: any}>(`${POSTS_URL}/${id}`, postData).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }

  loadPosts(queryParams: QueryParams) {
    const querystring = `?page=${queryParams.currentPage}&pagesize=${queryParams.postsPerPage}`;
    this.http.get<PostsListResult>(POSTS_URL + querystring)
      .pipe(map((response: PostsListResult) => {
        return {
          totalPosts: response.totalPosts,
          posts: response.posts.map<Post>((post) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath
            };
          })
        };
      }))
      .subscribe((transformedPostData) => {
        this._posts = transformedPostData.posts;
        this._postsUpdated$.next({ totalPosts: transformedPostData.totalPosts, posts: [...this._posts] });
    });
  }

  deletePost(id: string) {
    return this.http.delete(`${POSTS_URL}/${id}`);
  }
}
