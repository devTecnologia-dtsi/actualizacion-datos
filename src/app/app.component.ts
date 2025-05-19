import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { ResponsiveComponent } from './shared/responsive/responsive.component';

@Component({
  standalone: true, 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterModule, ResponsiveComponent], 
})
export class AppComponent {
  title = 'Actualización de datos Uniminuto';
  constructor(public themeService: ThemeService) { }
}