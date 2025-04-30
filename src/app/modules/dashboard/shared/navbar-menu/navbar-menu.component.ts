import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from 'src/app/core/interfaces/menu.interface';

@Component({
  selector: 'app-navbar-menu',
  templateUrl: './navbar-menu.component.html',
  styleUrls: ['./navbar-menu.component.css']
})
export class NavbarMenuComponent {
  public pagesMenu$: Observable<MenuItem[]> = new Observable<MenuItem[]>();

  menu = "active";

}
