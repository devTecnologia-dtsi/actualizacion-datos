import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { EgresadosComponent } from './pages/egresados/egresados.component';
import { EstudiantesComponent } from './pages/estudiantes/estudiantes.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { PreguntasComponent } from './pages/preguntas/preguntas.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { 
        path: 'login1',
        loadComponent: () => import('./pages/login1/login1.component').then(m => m.Login1Component)
      },
      { 
        path: 'egresados',
        loadComponent: () => import('./pages/egresados/egresados.component').then(m => m.EgresadosComponent)
      },
      {
        path: 'estudiantes',
        loadComponent: () => import('./pages/estudiantes/estudiantes.component').then(m => m.EstudiantesComponent)
      },
      {
        path: 'preguntas',
        loadComponent: () => import('./pages/preguntas/preguntas.component').then(m => m.PreguntasComponent)
      },
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'login1', pathMatch: 'full' },
      { path: '**', redirectTo: 'login1' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }