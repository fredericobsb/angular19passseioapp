import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { CategoriaService } from '../../categorias/categoria.service';
import { Categoria } from '../../categorias/categoria';
import { throwError } from 'rxjs';
import { FotoService } from '../../template/foto.service';
import { LugarService } from '../lugar.service';



@Component({
  selector: 'app-lugar',
  standalone: false,
  templateUrl: './lugar.component.html',
  styleUrl: './lugar.component.scss'
})
export class LugarComponent{
  camposForm: FormGroup;
  listaCategorias:Categoria[] = [];
  selectedFile: File | null = null;
  fotoPreview: string | null = null;
  fotoError: string | null = null;

  constructor(private categoriaService: CategoriaService,
              private fotoService: FotoService,
              private lugarService: LugarService){
     this.camposForm = new FormGroup({
      nome: new FormControl('', Validators.required),
      categoria: new FormControl('', Validators.required),
      localizacao: new FormControl('', Validators.required),
      avaliacao: new FormControl('', Validators.required)
    });
  }

  ngOnInit(){
      this.categoriaService.listarTodas()
        .subscribe({
          next: resultado => this.listaCategorias = resultado,
          error: erro => console.error(throwError('Deu erro ao listar as categorias - ', erro))
        });
  }

  onFileSelected(event: Event) {
    this.fotoError = null;
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

    // Validação tipo
    if (!file.type.startsWith('image/')) {
      this.fotoError = 'Apenas arquivos de imagem são permitidos.';
      this.limparFoto();
      return;
    }

    // Validação tamanho (exemplo: 2MB)
    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      this.fotoError = `O arquivo deve ter até ${maxSizeMB}MB.`;
      this.limparFoto();
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.fotoPreview = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
    }
  }

  private limparFoto() {
    this.selectedFile = null;
    this.fotoPreview = null;
  }

  onSubmit(){
    if (!this.selectedFile) {
    console.error('Nenhum arquivo selecionado!');
    return;
  }
  this.salvarComFoto(this.selectedFile);
  }

  salvarComFoto(file: File) {
    this.fotoService.uploadFoto(file).subscribe({
      next: (fotoSalva) => {
        const fotoId = fotoSalva.id;

        const lugar = {
          nome: this.camposForm.get('nome')?.value,
          categoria: this.camposForm.get('categoria')?.value,
          localizacao: this.camposForm.get('localizacao')?.value,
          fotoId: fotoId,
          avaliacao: this.camposForm.get('avaliacao')?.value
        };
        
        this.lugarService.salvar(lugar)
          .subscribe({
            next: resultado => {
              console.log('--salvo com sucesso', lugar);
              this.camposForm.reset();    
            },
            error: erro => console.log('--- deu pau ao salvar o lugar ==> ', erro)
          })
      },
      error: err => console.error('Erro ao salvar foto:', err)
    });
  }

  isInvalidField(nomeCampo:string): boolean{
    const campo = this.camposForm.get(nomeCampo);
    return campo?.invalid && campo?.touched && campo?.errors?.['required'];
  }

  removerFoto(){
    this.limparFoto();
    // Também limpa o input file para permitir reescolher o mesmo arquivo, se quiser
    const input = document.getElementById('foto') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
}
