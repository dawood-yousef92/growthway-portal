import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../modules/auth/_services/auth.service';
import { BehaviorSubject } from 'rxjs';
import KTLayoutHeaderTopbar from '../../../../../assets/js/layout/base/header-topbar';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  // user:any;
  user = new BehaviorSubject<any>(null);
  companyData:any;
  constructor(private auth: AuthService, private loderService: LoaderService,) {}

  getUserByToken() {
    this.auth.getUserByToken().subscribe(data => {
      this.auth.currentUserDetails =  data.result;
    });
  }

  getCompanyLogoAndName() {
    this.loderService.setIsLoading = true;
    this.auth.getCompanyLogoAndName().subscribe((data) => {
      this.companyData = data.result;
      localStorage.setItem('businessType', data?.result?.businessType);
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    });
  }

  ngOnInit() {
    this.getUserByToken();
    this.auth.userD.subscribe((data) => {
      this.user.next(data);
    });
    // Init Header Topbar For Mobile Mode
    KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle');
    this.getCompanyLogoAndName();
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
