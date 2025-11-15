import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WikiArticleComponent } from './components/wiki-article/wiki-article.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'wiki/:articleName',
    component: WikiArticleComponent
  }
];
