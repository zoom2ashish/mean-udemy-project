import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  enteredContent = '';
  enteredTitle = '';

  constructor(private postsService: PostsService) { }

  ngOnInit() {
  }

  onAddPost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }

    this.postsService.addPost(postForm.value);
    postForm.resetForm();
  }

}
