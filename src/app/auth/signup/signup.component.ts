import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public  isLoading = false;

  constructor() { }

  ngOnInit() {
  }

  onSignUp(form: NgForm) {
    console.log(form.value);
  }

}
