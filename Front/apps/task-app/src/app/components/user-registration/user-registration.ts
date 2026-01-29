import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrentUserService, CurrentUser } from '@task-app/core/service/current-user.service';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-registration.html',
  styleUrls: ['./user-registration.scss']
})
export class UserRegistrationComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  nom: string = '';
  prenom: string = '';
  email: string = '';
  showModal: boolean = false;

  constructor(public userService: CurrentUserService) {}

  ngOnInit(): void {
    // Afficher le modal seulement si pas d'utilisateur
    if (!this.userService.hasUser()) {
      this.showModal = true;
    }
  }

  onSubmit(): void {
    if (this.nom.trim() && this.prenom.trim() && this.email.trim()) {
      const user: CurrentUser = {
        nom: this.nom,
        prenom: this.prenom,
        email: this.email
      };
      this.userService.setUser(user);
      this.showModal = false;
      this.close.emit();
    }
  }

  onChangeUser(): void {
    this.showModal = true;
  }
}
