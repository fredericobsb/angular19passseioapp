import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthgoogleService } from './authgoogle.service';
import { Profile } from './landingpage/profile.model';



export const authGuard: CanActivateFn = (route, state) => {

    const authgoogleService: AuthgoogleService = inject(AuthgoogleService);
    const router: Router = inject(Router);
    const loggedProfile: Profile = authgoogleService.getLoggedProfile();

    if(loggedProfile){
      return true;
    }
    router.navigate(['']);
    return false;
};
