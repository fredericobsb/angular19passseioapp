import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Categoria } from './categoria';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private httpClient: HttpClient) { }

  salvar(categoria:Categoria): Observable<Categoria>{
      return this.httpClient.post<Categoria>('http://localhost:3000/categorias', categoria);
  }

  listarTodas(): Observable<Categoria[]>{
    return this.httpClient.get<Categoria[]>('http://localhost:3000/categorias');
  }
}
