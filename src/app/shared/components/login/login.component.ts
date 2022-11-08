import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private pageLoaderSvc: PageLoaderService,private router: Router,) { }

  ngOnInit() {
    this.pageLoaderSvc.hide();
  }

  login(){
    this.router.navigate(['dashboard']);
  }

}
