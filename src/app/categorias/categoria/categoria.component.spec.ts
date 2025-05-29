import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CategoriaComponent } from './categoria.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CategoriaService } from '../categoria.service';

describe('CategoriaComponent', () => {
  let component: CategoriaComponent;
  let fixture: ComponentFixture<CategoriaComponent>;

  // Mock do serviço
  const categoriaServiceMock = {
    salvar: jasmine.createSpy('salvar').and.returnValue(of({ nome: 'Categoria Teste', descricao: 'Descrição Teste' }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriaComponent],
      imports:[ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: CategoriaService, useValue: categoriaServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    // Limpa os spies antes de cada teste para evitar interferência
    categoriaServiceMock.salvar.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all fields as touched and not log when form is invalid', () => {
    // Espionando o console.log
    const consoleSpy = spyOn(console, 'log');
    component.salvar();
    // Verifica os controles, não o grupo
    expect(component.camposForm.get('nome')?.touched).toBeTrue();
    expect(component.camposForm.get('descricao')?.touched).toBeTrue();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched and log values when form is valid', (done) => {
    const consoleSpy = spyOn(console, 'log');

    // Preenchendo o formulário com valores válidos
    component.camposForm.setValue({
      nome: 'Categoria Teste',
      descricao: 'Descrição Teste'
    });

    component.salvar();

    // Verifica os controles, não o grupo
    expect(component.camposForm.get('nome')?.touched).toBeFalse();
    expect(component.camposForm.get('descricao')?.touched).toBeFalse();

    // Deve logar os valores do formulário
    expect(consoleSpy).toHaveBeenCalledWith('----salvo com sucesso => ', {
      nome: 'Categoria Teste',
      descricao: 'Descrição Teste'
    });
    done();
  });

  it('should call console.error on salvar error', () => {
      //mock para retornar erro
      categoriaServiceMock.salvar.and.returnValue(throwError(() => new Error('Erro no servidor')));
      const consoleErrorSpy = spyOn(console, 'error');
      component.camposForm.setValue({
        nome: 'Categoria teste',
        descricao: 'descricao teste'
      });
      component.salvar();
      expect(consoleErrorSpy).toHaveBeenCalledWith('------- deu pau no salvamento => ', jasmine.any(Error))

  });
});
