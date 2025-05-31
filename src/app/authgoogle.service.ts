import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import {auth} from './auth.config';

@Injectable({
  providedIn: 'root'
})
export class AuthgoogleService {

  private oauthService: OAuthService = inject(OAuthService);
  private router:Router = inject(Router);
  profile = signal<any>(null);//guardará a autenticacao que virá do google

  constructor() { 
    this.initConfiguration();
  }

  initConfiguration(){
    this.oauthService.configure(auth);
    this.oauthService.setupAutomaticSilentRefresh();//verifica se o usuario ja se logou com google
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() =>{
      if(this.oauthService.hasValidIdToken()){
        this.profile.set(this.oauthService.getIdentityClaims());
      }
    })
  }

  login(){
    this.oauthService.initImplicitFlow();
  }

  logout(){
    this.oauthService.revokeTokenAndLogout();
    this.oauthService.logOut();
    this.profile.set(null);
    this.router.navigate(['']);
  }

  getLoggedProfile(){
    return this.profile();
  }
}
