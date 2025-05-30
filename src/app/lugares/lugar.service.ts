import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lugar } from './lugar';

@Injectable({
  providedIn: 'root'
})
export class LugarService {

  constructor(private httpClient: HttpClient) { }

  salvar(lugar:Lugar): Observable<Lugar>{
      return this.httpClient.post<Lugar>('http://localhost:3000/lugares', lugar);
  }

  listarTodos(): Observable<Lugar[]>{
    return this.httpClient.get<Lugar[]>('http://localhost:3000/lugares');
  }
}