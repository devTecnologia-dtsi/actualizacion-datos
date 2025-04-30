import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveComponent } from './responsive/responsive.component';



@NgModule({
  declarations: [
    ResponsiveComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ResponsiveComponent
  ]
})
export class SharedModule { }
