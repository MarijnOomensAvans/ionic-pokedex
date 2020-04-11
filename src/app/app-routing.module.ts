import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {path: 'detail/:id', loadChildren: './pokemonDetail/pokemonDetail.module#pokemonDetailModule'},
  {
    path: 'catch/:id',
    loadChildren: () => import('./catch/catch.module').then( m => m.CatchPageModule)
  }



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
