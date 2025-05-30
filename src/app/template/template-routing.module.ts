import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
     {path: '', component: LayoutComponent,
      children: [
        {path:'categorias', 
          loadChildren: () => import('../categorias/categorias.module')
            .then(m => m.CategoriasModule),
          pathMatch:'full',
          data: {titulo: 'Categorias', subtitulo: 'Cadastro de novas categorias'}
        },
        {
          path:'lugares', 
          loadChildren: () => import('../lugares/lugares.module')
            .then(l => l.LugaresModule),
          pathMatch:'full',
          data: {titulo: 'Eventos', subtitulo: 'Cadastro de novos eventos'}
        },
        {
          path:'galeria', 
          loadChildren: () => import('../galeria/galeria.module')
            .then(g => g.GaleriaModule),
          pathMatch:'full',
           data: {titulo: 'Listagem dos eventos', subtitulo: 'Não que eu vá, mas hoje é onde?'}
        }
      ]
     },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }