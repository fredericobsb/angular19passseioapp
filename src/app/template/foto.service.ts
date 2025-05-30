import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FotoService {

     private readonly apiUrl = 'http://localhost:3000/fotos';

  constructor(private http: HttpClient) {}

   /**
   * Converte um arquivo em Base64.
   * @param file Arquivo de imagem.
   * @returns Observable<string> com a string Base64.
   */

   private fileToBase64(file: File): Observable<string> {
    const reader = new FileReader();
    return new Observable<string>((observer) => {
      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.onerror = (error) => {
        observer.error(error);
      };
      reader.readAsDataURL(file);  // → Converte para Base64.
    });
  }

  /**
   * Converte a imagem para Base64 e envia para o json-server.
   * @param file Arquivo de imagem.
   * @returns Observable<any> com o resultado da inserção.
   */

  uploadFoto(file: File): Observable<any> {
        return this.fileToBase64(file).pipe(
            map(base64 => ({
                nome: file.name,
                base64: base64
            })),
            switchMap(fotoObj => 
                this.http.post<any>(this.apiUrl, fotoObj)
            )
        );
  }
}
