import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-email-config',
  templateUrl: './email-config.component.html',
  styleUrls: ['./email-config.component.scss']
})
export class EmailConfigComponent implements OnInit {
  userId:string;
  code:string;

  constructor(private route: ActivatedRoute,private authService:AuthService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((data) => {
      this.userId = data["userId"];
      this.code = data["code"];
      if(this.userId && this.code) {
        this.authService.confirmEmail({userId:this.userId,code:this.code}).subscribe((data) => {});
      }
    });
  }
}
