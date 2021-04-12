import { Component, OnInit } from '@angular/core';
import { SubheaderService } from 'src/app/_metronic/partials/layout';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private subheader: SubheaderService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.subheader.setTitle('Manage Your Account');
      this.subheader.setBreadcrumbs([{
        title: 'Manage Your Account',
        linkText: 'profile',
        linkPath: '/account-management/profile'
      }]);
    }, 1);
  }

}
