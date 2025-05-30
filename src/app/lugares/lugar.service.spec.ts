import { TestBed } from '@angular/core/testing';
import { LugarService } from './lugar.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Lugar } from './lugar';

describe('LugarService', () => {
  let service: LugarService;
  let httpMock: HttpTestingController;

  const mockLugar: Lugar = {
    nome: 'Praia Bonita',
    categoria: 'Praia',
    localizacao: 'Bahia',
    avaliacao: '5 estrelas',
    idFoto: '123'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LugarService]
    });
    service = TestBed.inject(LugarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save a lugar via POST', () => {
    service.salvar(mockLugar).subscribe((res) => {
      expect(res).toEqual(mockLugar);
    });

    const req = httpMock.expectOne('http://localhost:3000/lugares');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLugar);
    req.flush(mockLugar);
  });

  it('should list all lugares via GET', () => {
    const mockLugares: Lugar[] = [mockLugar, { ...mockLugar, nome: 'Montanha' }];

    service.listarTodos().subscribe((res) => {
      expect(res.length).toBe(2);
      expect(res).toEqual(mockLugares);
    });

    const req = httpMock.expectOne('http://localhost:3000/lugares');
    expect(req.request.method).toBe('GET');
    req.flush(mockLugares);
  });
});
