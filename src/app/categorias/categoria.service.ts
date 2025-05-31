import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Categoria } from './categoria';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  apiURL:string = environment.apiURL + '/categorias';

  constructor(private httpClient: HttpClient) { }

  salvar(categoria:Categoria): Observable<Categoria>{
      return this.httpClient.post<Categoria>(this.apiURL, categoria);
  }

  listarTodas(): Observable<Categoria[]>{
    return this.httpClient.get<Categoria[]>(this.apiURL);
  }
}
