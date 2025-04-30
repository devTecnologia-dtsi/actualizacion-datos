import { Component, Input } from '@angular/core';
import { token } from 'src/app/core/interfaces/uniminuto.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Input() datos!: token;

  toggleMobileMenu() {
    return
  }

}
