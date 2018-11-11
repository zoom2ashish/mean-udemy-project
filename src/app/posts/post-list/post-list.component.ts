import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  private _postsSubscription = new Subscription();

  public isLoading = false;
  public totalPosts = 10;
  public postsPerPage = 2;
  public currentPage = 1;
  public pageSizeOptions = [1, 2, 5, 10];

  @Input()
  posts: Post[] = [];

  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this._postsSubscription.add(
      this.postsService.posts.subscribe((postsData) => {
        this.isLoading = false;
        this.totalPosts = postsData.totalPosts;
        this.posts = postsData.posts;
      }));

    this.isLoading = true;
    this.postsService.loadPosts({
      currentPage: 1,
      postsPerPage: this.postsPerPage
    });
  }

  ngOnDestroy() {
    this._postsSubscription.unsubscribe();
  }


  onDelete(id: string) {
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.loadPosts({
        currentPage: 1,
        postsPerPage: this.postsPerPage
      });
    });
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.isLoading = true;
    this.postsService.loadPosts({
      currentPage: this.currentPage,
      postsPerPage: this.postsPerPage
    });
  }
}
