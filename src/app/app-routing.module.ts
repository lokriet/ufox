import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, ExtraOptions } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'articles', loadChildren: () => import('./articles/articles.module').then(mod => mod.ArticlesModule)},
  { path: 'articles-setup', loadChildren: () => import('./articles-setup/articles-setup.module').then(mod => mod.ArticlesSetupModule)},
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }

];


const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  onSameUrlNavigation: 'reload',
  preloadingStrategy: PreloadAllModules
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
