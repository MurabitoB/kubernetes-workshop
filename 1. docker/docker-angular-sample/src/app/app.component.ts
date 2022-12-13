import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  env: Observable<any> = new Observable<any>();

  constructor(private http: HttpClient) {
    this.env = this.http.get('/assets/env/env.json');
  }
}
