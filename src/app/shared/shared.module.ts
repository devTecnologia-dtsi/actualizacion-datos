import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveComponent } from './responsive/responsive.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule, ResponsiveComponent, 
  ],
  exports: [
    ResponsiveComponent
  ]
})
export class SharedModule { }
