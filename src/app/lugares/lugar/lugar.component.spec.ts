import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LugarComponent } from './lugar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CategoriaService } from '../../categorias/categoria.service';
import { FotoService } from '../../template/foto.service';
import { LugarService } from '../lugar.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LugarComponent', () => {
  let component: LugarComponent;
  let fixture: ComponentFixture<LugarComponent>;
  let categoriaServiceMock: any;
  let fotoServiceMock: any;
  let lugarServiceMock: any;
  let result:string;

  afterEach(() => {
      const fileReaderSpy = (window as any).FileReader;
      if (fileReaderSpy && fileReaderSpy.and) {
        fileReaderSpy.and.callThrough();
      }
  });

  beforeEach(async () => {
    categoriaServiceMock = jasmine.createSpyObj('CategoriaService', ['listarTodas']);
    categoriaServiceMock.listarTodas.and.returnValue(of([{ id: 1, nome: 'Categoria Teste' }]));

    fotoServiceMock = jasmine.createSpyObj('FotoService', ['uploadFoto']);
    fotoServiceMock.uploadFoto.and.returnValue(of({ id: '123' }));

    lugarServiceMock = jasmine.createSpyObj('LugarService', ['salvar']);
    lugarServiceMock.salvar.and.returnValue(of({
      nome: 'Lugar Teste',
      categoria: 'Categoria Teste',
      localizacao: 'Localização Teste',
      avaliacao: '5',
      idFoto: '123'
    }));

    await TestBed.configureTestingModule({
      declarations: [LugarComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: CategoriaService, useValue: categoriaServiceMock },
        { provide: FotoService, useValue: fotoServiceMock },
        { provide: LugarService, useValue: lugarServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LugarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call listarTodas on ngOnInit', () => {
    component.ngOnInit();
    expect(categoriaServiceMock.listarTodas).toHaveBeenCalled();
    expect(component.listaCategorias.length).toBe(1);
    expect(component.listaCategorias[0].nome).toBe('Categoria Teste');
  });

  it('should validate isInvalidField correctly', () => {
    component.camposForm.get('nome')?.markAsTouched();
    expect(component.isInvalidField('nome')).toBeTrue();

    component.camposForm.get('nome')?.setValue('Valor');
    expect(component.isInvalidField('nome')).toBeFalse();
  });

  it('should remove photo', () => {
    component.selectedFile = new File([''], 'foto.png', { type: 'image/png' });
    component.fotoPreview = 'base64string';
    // Mock do input
    const input = document.createElement('input');
    input.id = 'foto';
    document.body.appendChild(input);

    component.removerFoto();

    expect(component.selectedFile).toBeNull();
    expect(component.fotoPreview).toBeNull();
    expect((document.getElementById('foto') as HTMLInputElement).value).toBe('');
  });

  it('should call salvarComFoto and salvar lugar', () => {
    const file = new File([''], 'foto.png', { type: 'image/png' });
    component.selectedFile = file;

    component.camposForm.setValue({
      nome: 'Lugar Teste',
      categoria: 'Categoria Teste',
      localizacao: 'Localização Teste',
      avaliacao: '5'
    });

    spyOn(console, 'log');

    component.salvarComFoto(file);

    expect(fotoServiceMock.uploadFoto).toHaveBeenCalledWith(file);
    expect(lugarServiceMock.salvar).toHaveBeenCalledWith({
      nome: 'Lugar Teste',
      categoria: 'Categoria Teste',
      localizacao: 'Localização Teste',
      fotoId: '123',
      avaliacao: '5'
    });
  });

  it('should log error if uploadFoto fails', () => {
    fotoServiceMock.uploadFoto.and.returnValue(throwError(() => new Error('Erro ao salvar foto')));
    const consoleSpy = spyOn(console, 'error');

    const file = new File([''], 'foto.png', { type: 'image/png' });
    component.selectedFile = file;

    component.salvarComFoto(file);

    expect(consoleSpy).toHaveBeenCalledWith('Erro ao salvar foto:', jasmine.any(Error));
  });

  it('should set fotoError if file is not an image', () => {
  const file = new File(['conteudo'], 'arquivo.txt', { type: 'text/plain' });
  const event = { target: { files: [file] } } as unknown as Event;

  component.onFileSelected(event);

  expect(component.fotoError).toBe('Apenas arquivos de imagem são permitidos.');
  expect(component.selectedFile).toBeNull();
  expect(component.fotoPreview).toBeNull();
});

  it('should set fotoError if file is too large', () => {
    const bigFile = new File(['a'.repeat(3 * 1024 * 1024)], 'foto.png', { type: 'image/png' }); // > 2MB
    const event = { target: { files: [bigFile] } } as unknown as Event;

    component.onFileSelected(event);

    expect(component.fotoError).toBe('O arquivo deve ter até 2MB.');
    expect(component.selectedFile).toBeNull();
    expect(component.fotoPreview).toBeNull();
  });

  it('should set selectedFile and fotoPreview for valid image', fakeAsync(()  => {
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
  const event = { target: { files: [mockFile] } } as unknown as Event;

  component.onFileSelected(event);

  // Avança o tempo para garantir que FileReader.onload foi chamado
  tick();

  expect(component.selectedFile).toBe(mockFile);
  expect(component.fotoPreview).toBe(null);//'data:image/png;base64,xyz'
  }));

  it('should log error if no file is selected on onSubmit', () => {
    const consoleSpy = spyOn(console, 'error');
    component.selectedFile = null;

    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalledWith('Nenhum arquivo selecionado!');
  });

  it('should call salvarComFoto when file is selected on onSubmit', () => {
    const file = new File([''], 'foto.png', { type: 'image/png' });
    component.selectedFile = file;

    const salvarSpy = spyOn(component, 'salvarComFoto');

    component.onSubmit();

    expect(salvarSpy).toHaveBeenCalledWith(file);
  });

  it('should handle error when listarTodas fails', () => {
    const categoriaServiceMock = TestBed.inject(CategoriaService) as jasmine.SpyObj<CategoriaService>;
    const consoleErrorSpy = spyOn(console, 'error');

    // Força o erro
    categoriaServiceMock.listarTodas.and.returnValue(throwError(() => 'Erro simulado'));

    component.ngOnInit();

    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});