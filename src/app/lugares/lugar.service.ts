import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lugar } from './lugar';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LugarService {

  apiURL: string = environment.apiURL + '/lugares';

  constructor(private httpClient: HttpClient) { }

  salvar(lugar:Lugar): Observable<Lugar>{
      return this.httpClient.post<Lugar>(this.apiURL, lugar);
  }

  listarTodos(): Observable<Lugar[]>{
    return this.httpClient.get<Lugar[]>(this.apiURL);
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
      return this.httpClient.get<Lugar[]>(this.apiURL);
    }

    if(nome && categoria && categoria === '-1'){
        parametros = new HttpParams();
        parametros = parametros.set('nome_like', nome);
        return this.httpClient.get<Lugar[]>(this.apiURL, {
        params: parametros
      });
    }
   
    return this.httpClient.get<Lugar[]>(this.apiURL, {
      params: parametros
    })
  }
}