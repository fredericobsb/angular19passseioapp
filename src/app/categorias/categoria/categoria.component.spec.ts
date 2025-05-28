import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaComponent } from './categoria.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('CategoriaComponent', () => {
  let component: CategoriaComponent;
  let fixture: ComponentFixture<CategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriaComponent],
      imports:[ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all fields as touched and not log when form is invalid', () => {
    // Espionando o console.log
    const consoleSpy = spyOn(console, 'log');
    component.salvar();
    // Todos os campos devem estar marcados como tocados
    expect(component.camposForm.touched).toBeTrue();
    expect(component.camposForm.get('nome')?.touched).toBeTrue();
    expect(component.camposForm.get('descricao')?.touched).toBeTrue();
    // Não deve logar nada pois form é inválido
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched and log values when form is valid', () => {
    const consoleSpy = spyOn(console, 'log');

    // Preenchendo o formulário com valores válidos
    component.camposForm.setValue({
      nome: 'Categoria Teste',
      descricao: 'Descrição Teste'
    });

    component.salvar();

    // Deve marcar todos como tocados
    expect(component.camposForm.touched).toBeTrue();
    expect(component.camposForm.get('nome')?.touched).toBeTrue();
    expect(component.camposForm.get('descricao')?.touched).toBeTrue();

    // Deve logar os valores do formulário
    expect(consoleSpy).toHaveBeenCalledWith('--- valores digitados ==', {
      nome: 'Categoria Teste',
      descricao: 'Descrição Teste'
    });
  });
});
