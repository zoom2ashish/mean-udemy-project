import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts = [
  //   { title: 'First Post', content: 'This is first post content' },
  //   { title: 'Second Post', content: 'This is second post content' },
  //   { title: 'Third Post', content: 'This is third post content' }
  // ];
  private _postsSubscription = new Subscription();

  @Input()
  posts: Post[] = [];

  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this._postsSubscription.add(
      this.postsService.posts.subscribe((posts) => {
        this.posts = posts;
      }));
  }

  ngOnDestroy() {
    this._postsSubscription.unsubscribe();
  }

}
