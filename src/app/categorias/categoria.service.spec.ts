import { TestBed } from '@angular/core/testing';
import { CategoriaService } from './categoria.service';
import { HttpClientTestingModule, HttpTestingController  } from '@angular/common/http/testing';
import { Categoria } from './categoria';



describe('CategoriaService', () => {
  let service: CategoriaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // ✅ aqui resolve!
      providers: [CategoriaService]
    });
    service = TestBed.inject(CategoriaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica se não ficaram requisições pendentes
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save a category by POST', () => {
    const categoriaMock:Categoria = {nome: 'Teste', descricao: 'Teste descricao'};
    service.salvar(categoriaMock).subscribe((res) =>{
      expect(res).toEqual(categoriaMock);
    });
     // Espera uma requisição POST para a URL correta
     const req = httpMock.expectOne('http://localhost:3000/categorias');
     expect(req.request.method).toBe('POST');
     expect(req.request.body).toEqual(categoriaMock);
     //simula resposta do backend
     req.flush(categoriaMock);
  });

  it('should list all categorias via GET', () => {
    const listCategorias: Categoria[] = [
      {nome: 'Teste1', descricao: 'Descricao 1'},
      {nome: 'Teste2', descricao: 'Descricao 2'}
    ];
    service.listarTodas().subscribe((res) =>{
      expect(res.length).toBe(2);
      expect(res).toEqual(listCategorias);
    });

    // Espera uma requisição GET para a URL correta
    const req = httpMock.expectOne('http://localhost:3000/categorias');
    expect(req.request.method).toBe('GET');
    // Simula resposta do backend
    req.flush(listCategorias);
  });
});
