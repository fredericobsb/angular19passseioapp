import { TestBed } from '@angular/core/testing';
import { FotoService } from './foto.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('FotoService', () => {
  let service: FotoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FotoService]
    });

    service = TestBed.inject(FotoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert file to base64 and upload photo', (done) => {
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const base64Mock = 'data:image/png;base64,dummybase64';

    spyOn<any>(service, 'fileToBase64').and.returnValue(of(base64Mock));

    service.uploadFoto(mockFile).subscribe((response) => {
      expect(response).toBeDefined();
      expect(response).toEqual({ success: true });
      done();
    });
    // ESPERAMOS a requisição HTTP e damos flush antes do subscribe finalizar
    const req = httpMock.expectOne('http://localhost:3000/fotos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
    nome: mockFile.name,
    base64: base64Mock
  });
  
  req.flush({ success: true });  // <-- flush aqui, antes do subscribe acabar
  });


  it('should convert file to base64 correctly', (done) => {
  const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });

  // Chamando diretamente
  (service as any).fileToBase64(mockFile).subscribe({
    next: (base64: string) => {
      expect(base64.startsWith('data:image/png;base64,')).toBeTrue();
      done();
    },
    error: () => {
      fail('Deveria ter convertido com sucesso');
      done();
    }
  });
});
});
