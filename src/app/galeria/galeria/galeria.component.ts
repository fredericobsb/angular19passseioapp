import { Component, OnInit } from '@angular/core';
import { Lugar } from '../../lugares/lugar';
import { Categoria } from '../../categorias/categoria';
import { LugarService } from '../../lugares/lugar.service';
import { CategoriaService } from '../../categorias/categoria.service';
import { FotoService } from '../../template/foto.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-galeria',
  standalone: false,
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.scss'
})
export class GaleriaComponent implements OnInit{

  lugares: Lugar[] = [];
  categoriasFiltro: Categoria[] = [];
  lugaresComFotos: any[] = [];
  //variaveis para pesquisa - inicio
  nomeFiltro:string = '';
  categoriaFiltro:string = '';
  //variaveis para pesquisa - fim

  constructor( private lugarService: LugarService,
               private categoriaService: CategoriaService,
               private fotoService: FotoService){}

  ngOnInit(): void {
    this.categoriaService.listarTodas().subscribe({
      next: resultado => {
        this.categoriasFiltro = resultado
      },
      error: erro => console.log('--------deu erro ao buscar categorias', erro)
    });

    this.lugarService.listarTodos().pipe(
    switchMap(lugares => {
      const requisicoes = lugares.map(lugar => {
        if (lugar.fotoId) {
          return this.fotoService.getFotoById(lugar.fotoId).pipe(
            map(foto => ({
              ...lugar,
              fotoBase64: foto.base64
            })),
            // Em caso de erro, ainda adiciona o lugar sem foto
            // com fotoBase64 null.
            // catchError pode ser usado, ou fallback simples:
            // Exemplo básico:
            // catchError(() => of({ ...lugar, fotoBase64: null }))
          );
        } else {
          // Não tem foto associada
          return of({
            ...lugar,
            fotoBase64: null
          });
        }
      });
      return forkJoin(requisicoes);
    })
    ).subscribe({
      next: lugaresComFotos => {
        this.lugaresComFotos = lugaresComFotos;
        console.log('Lugares com fotos ==========>', this.lugaresComFotos);
      },
      error: erro => console.log('Erro ao buscar lugares ou fotos', erro)
    });
  }

  getTotalEstrelas(lugar: Lugar) : string {
    return '&#9733;'.repeat(lugar.avaliacao || 0) + '&#9734;'.repeat(5 - (lugar.avaliacao || 0) );
  }

  filtrar(){
    this.lugarService.filtar(this.nomeFiltro, this.categoriaFiltro).pipe(
    switchMap(lugares => {
      const requisicoes = lugares.map(lugar => {
        if (lugar.fotoId) {
          return this.fotoService.getFotoById(lugar.fotoId).pipe(
            map(foto => ({
              ...lugar,
              fotoBase64: foto.base64
            })),
            // Se a foto falhar, ainda inclui o lugar
            // catchError pode ser usado aqui, se quiser
          );
        } else {
          return of({
            ...lugar,
            fotoBase64: null
          });
        }
      });
      this.lugaresComFotos = requisicoes;
      return forkJoin(requisicoes);
    })
  ).subscribe({
    next: lugaresComFotos => {
      this.lugaresComFotos = lugaresComFotos;
      console.log('------- resultado do filtro com fotos =>', this.lugaresComFotos);
    },
    error: erro => {
      this.lugaresComFotos = [];
      console.log('------- deu pau no filtro ==>', erro);
      // Aqui pode usar MatSnackBar se quiser
    }
  });
  }

}
