import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MentorComponent } from './component/mentor/mentor.component';
import { ActionComponent } from './component/action/action.component';
import { ProjectComponent } from './component/project/project.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mentor',
    pathMatch: 'full'
  },
  {
    path: 'mentor',
    component: MentorComponent,
  },
  {
    path: 'action',
    component: ActionComponent,
  },
  {
    path: 'project/:id',
    component: ProjectComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
