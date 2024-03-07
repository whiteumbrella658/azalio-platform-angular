import { Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: ApiService) { }


}
