import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { token } from 'src/app/core/interfaces/uniminuto.interface';
import { LoginService } from 'src/app/core/services/login.service';
import { UniminutoService } from 'src/app/core/services/uniminuto.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css']
})
export class ProfileMenuComponent {
  public isMenuOpen = false;
  @Input() usuario!: token;
  foto!: string;
  nombre: string = '';
  correo: string = '';
  idBanner: string = '';
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private _login: LoginService
  ) {
    this.renderer.listen('window', 'click', (event: Event) => {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.isMenuOpen = false;
      }
    });
  }

  ngOnInit() {
    this.foto = 'https://fotografias.uniminuto.edu/basicImages/' + parseInt(this.usuario.idBanner!, 10);
    this.nombre = this.usuario.nombres;
    this.correo = this.usuario.mail;
    this.idBanner = this.usuario.idBanner;
  }

  cerrarSesion() {
    this._login.logout();
  }
  actualizarFoto() {
    // window.location.href = 'https://fotografias.uniminuto.edu/uploads/' + this.usuario.Cn! + '?correo=' + this.correo;
    window.open('https://fotografias.uniminuto.edu/uploads/' + this.idBanner + '?correo=' + this.correo, '_blank');
  }

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
