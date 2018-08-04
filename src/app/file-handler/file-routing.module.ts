import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FileComponent } from './file/file.component';

const routes: Routes = [
  { path: '', component: FileComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileRoutingModule {
}

