import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post, PostDto } from '../post.model';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  enteredContent = '';
  enteredTitle = '';
  isLoading = false;
  formGroup: FormGroup;
  imagePreview: string;

  public postId: string;
  public edit = false;
  public post: Post;

  constructor(private postsService: PostsService, private route: ActivatedRoute, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      'title': ['', [Validators.required, Validators.minLength(3)]],
      'content': ['', [Validators.required]],
      'image': [null, {validators: [Validators.required], asyncValidators: [mimeType] }]
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id') && params.get('id')) {
        this.edit = !!params.get('id');
        this.postId = params.get('id');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData: PostDto) => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.isLoading = false;
          this.formGroup.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.edit = false;
        this.postId = null;
      }
    });
  }

  onSavePost() {
    const postForm = this.formGroup;
    if (postForm.invalid) {
      return;
    }

    if (this.edit) {
      this.postsService.updatePost(this.postId, postForm.value.title, postForm.value.content, postForm.value.image);
    } else {
      this.postsService.addPost(postForm.value);
    }
    this.formGroup.reset();
  }

  onImagePicked(event: Event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.formGroup.patchValue({ 'image': file });
    this.formGroup.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

    console.log(file, this.formGroup);
  }

}
