import { Route } from '@angular/router';
import { MainComponent } from './main.component';
import { ManageComponent } from '../manage/manage.component';
import { ChangepasswordComponent } from '../changepassword/changepassword.component';

export default [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: ManageComponent
      },
      {
        path: 'change-password',
        component: ChangepasswordComponent
      }
    ]
  }
] as Route[];
