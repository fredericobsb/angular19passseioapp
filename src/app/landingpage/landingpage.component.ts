import { Component } from '@angular/core';
import { Profile } from './profile.model';
import { Router } from '@angular/router';
import { AuthgoogleService } from '../authgoogle.service';

@Component({
  selector: 'app-landingpage',
  standalone: false,
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {

  profile: Profile | undefined;

  constructor(private router: Router, private authgoogleService: AuthgoogleService){}

  ngOnInit(){
   
  }

  logarComGoogle(){
    this.authgoogleService.login();
  }

  isLoggedIn(){
    const dadosGoogle = this.authgoogleService.getLoggedProfile();
    this.profile = dadosGoogle;
    return !!this.profile; 
  }

  navegar(){
     this.router.navigate(['/paginas/galeria']);
  }

  
}
