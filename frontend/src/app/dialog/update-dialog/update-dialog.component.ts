import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

interface Sex {
  value: string;
  viewValue: string;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-update-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class UpdateDialogComponent implements OnInit, OnDestroy {
  sexList: Sex[] = [
    { value: 'm', viewValue: 'Male' },
    { value: 'f', viewValue: 'Female' }
  ];

  subscription: Subscription | undefined;

  updateForm = new FormGroup({
    first_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    last_name: new FormControl('', { nonNullable: true }),
    sex: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    date_of_birth: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    address: new FormControl('', { nonNullable: true })
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService,
    private dialogRef: MatDialogRef<UpdateDialogComponent>
  ) {}

  ngOnInit() {
    this.updateForm.patchValue(this.data);
  }

  updateUser() {
    if (!this.updateForm.valid) {
      return;
    }
    this.subscription = this.userService.updateUser(this.data.id!, this.updateForm.getRawValue()).subscribe(res => {
      if (res) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
