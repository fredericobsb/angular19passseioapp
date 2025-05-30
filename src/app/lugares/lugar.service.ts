import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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

  filtar(nome: string, categoria: string): Observable<Lugar[]>{
    let parametros = new HttpParams();

    if(nome){
      parametros = parametros.set('nome_like', nome);
    }
    if(categoria){
      parametros = parametros.set('categoria', categoria);
    }
    
    if(!nome && categoria && categoria === '-1'){
      return this.httpClient.get<Lugar[]>('http://localhost:3000/lugares');
    }

    if(nome && categoria && categoria === '-1'){
        parametros = new HttpParams();
        parametros = parametros.set('nome_like', nome);
        return this.httpClient.get<Lugar[]>('http://localhost:3000/lugares', {
        params: parametros
      });
    }
   
    return this.httpClient.get<Lugar[]>('http://localhost:3000/lugares', {
      params: parametros
    })
  }
}