import { AuthStatus } from '../enum';
import { environment } from 'src/environments/environments';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { CheckTokenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private htpp = inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //Señal computada para que no se pueda modificar
  public currentUser = computed( () => this._currentUser());
  public authStatus = computed( () => this._authStatus());

  constructor() { 
    this.checkAuthStatus().subscribe();
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.htpp.post<LoginResponse>(url, body)
      .pipe(
        map( ({ user, token} )=>   this.setUserAutenticathed(token, user)),

        catchError( (err:HttpErrorResponse) => {

          return throwError(() => err.error.message)
        })
      )
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if(!token) {
      this.logout();
       return of(false)
      };

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.htpp.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map(({token, user}) =>  this.setUserAutenticathed(token, user)),
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false)
        })
      )
  }

  private setUserAutenticathed(token: string, user: User):boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  logout() {
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    localStorage.removeItem('token');
  }
}
