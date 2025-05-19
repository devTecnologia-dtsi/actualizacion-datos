import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  selector: 'app-responsive',
  templateUrl: './responsive.component.html',
  styleUrls: ['./responsive.component.css'],
  imports: [
    CommonModule 
  ]
})
export class ResponsiveComponent {
  env = environment;
}