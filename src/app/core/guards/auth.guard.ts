import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { usuario } from 'src/app/core/interfaces/login.interface';

export const AuthGuard = /*async */() => {
  const router = inject(Router);
  // const http = inject(HttpClient);
  const token = sessionStorage.getItem('auth_token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  //TODO: Implementar el llamado a /login/validate-token para verificar el token y la expiración en el backend


  try {
    const decoded: JwtPayload | usuario | any = jwtDecode(token);
    // Verificamos si el token ha expirado
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem('auth_token'); // Limpia token expirado
      router.navigate(['/login']);
      return false;
    }
    sessionStorage.setItem('mail', String(decoded.mail));
    sessionStorage.setItem('idBanner', String(decoded.idBanner));
    sessionStorage.setItem('nombres', String(decoded.nombres));
    // Token válido y no expirado
    return true;
  } catch (error) {
    // Token mal formado o error en decodificación
    localStorage.removeItem('auth_token');
    router.navigate(['/login']);
    return false;
  }
};
