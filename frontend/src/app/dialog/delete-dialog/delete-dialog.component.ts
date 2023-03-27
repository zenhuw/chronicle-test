import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {
  subscription: Subscription | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService,
    private dialogRef: MatDialogRef<DeleteDialogComponent>
  ) {}

  deleteUser() {
    this.subscription = this.userService.deleteUser(this.data.id!).subscribe(res => {
      if (res) {
        this.dialogRef.close();
      }
    });
  }
}
