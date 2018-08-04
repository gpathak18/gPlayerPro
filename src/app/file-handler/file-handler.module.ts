import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileComponent } from './file/file.component';
import { FileRoutingModule } from './file-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FileRoutingModule
  ],
  declarations: [FileComponent]
})
export class FileHandlerModule { }
