import { Component, AfterViewInit, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ViewDialogComponent } from '../dialog/view-dialog/view-dialog.component';
import { UpdateDialogComponent } from '../dialog/update-dialog/update-dialog.component';
import { DeleteDialogComponent } from '../dialog/delete-dialog/delete-dialog.component';
import { UserService } from '../services/user.service';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { User, UserListRequest } from '../interfaces/user.interface';
import { FormsModule } from '@angular/forms';
import { AgePipe } from '../pipes/age.pipe';
import { FullnamePipe } from '../pipes/fullname.pipe';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule,
    AgePipe,
    FullnamePipe
  ],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements AfterViewInit, OnDestroy, OnInit {
  displayedColumns: string[] = ['name', 'email', 'age', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  filter = '';
  filterSubject = new Subject<string>();

  length = 0;

  subscription: Subscription | undefined;
  subscriptionFilterSubject: Subscription | undefined;
  subscriptionDialogUpdate: Subscription | undefined;
  subscriptionDialogDelete: Subscription | undefined;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, private userService: UserService) {}

  ngOnInit() {
    this.subscriptionFilterSubject = this.filterSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(res => {
        this.requestUser({
          email: res,
          take: this.paginator.pageSize,
          current_page: this.paginator.pageIndex + 1,
          cache: true
        });
      });
  }

  ngAfterViewInit() {
    this.requestUser({
      email: '',
      take: this.paginator.pageSize,
      current_page: this.paginator.pageIndex + 1,
      cache: true
    });
  }

  onPage(event: any) {
    this.requestUser({ email: this.filter, take: event.pageSize, current_page: event.pageIndex + 1, cache: true });
  }

  requestUser(request: UserListRequest) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.userService.getUserList(request).subscribe(res => {
      this.dataSource.data = res.data;
      this.paginator.length = res.total;
    });
  }

  openViewDialog(element: User) {
    this.dialog.open(ViewDialogComponent, { data: { ...element } });
  }

  openUpdateDialog(element: User) {
    const dialogRef = this.dialog.open(UpdateDialogComponent, { data: { ...element } });
    if (this.subscriptionDialogUpdate) {
      this.subscriptionDialogUpdate.unsubscribe();
    }
    this.subscriptionDialogUpdate = dialogRef.afterClosed().subscribe(result => {
      this.requestUser({
        email: this.filter,
        take: this.paginator.pageSize,
        current_page: this.paginator.pageIndex + 1,
        cache: false
      });
    });
  }

  openDeleteDialog(element: User) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: { ...element } });

    if (this.subscriptionDialogDelete) {
      this.subscriptionDialogDelete.unsubscribe();
    }

    this.subscriptionDialogDelete = dialogRef.afterClosed().subscribe(result => {
      this.requestUser({
        email: this.filter,
        take: this.paginator.pageSize,
        current_page: this.paginator.pageIndex + 1,
        cache: false
      });
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.subscriptionFilterSubject?.unsubscribe();
    this.subscriptionDialogUpdate?.unsubscribe();
    this.subscriptionDialogDelete?.unsubscribe();
  }
}
