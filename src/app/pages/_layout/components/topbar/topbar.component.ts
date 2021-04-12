import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../modules/auth/_services/auth.service';
import { BehaviorSubject } from 'rxjs';
import KTLayoutHeaderTopbar from '../../../../../assets/js/layout/base/header-topbar';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  // user:any;
  user = new BehaviorSubject<any>(null);
  constructor(private auth: AuthService) {}

  getUserByToken() {
    this.auth.getUserByToken().subscribe(data => {
      this.auth.currentUserDetails =  data.result;
    });
  }

  ngOnInit() {
    this.getUserByToken();
    this.auth.userD.subscribe((data) => {
      this.user.next(data);
    });
    // Init Header Topbar For Mobile Mode
    KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle');
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
