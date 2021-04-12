import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-token-settings',
  templateUrl: './token-settings.component.html',
  styleUrls: ['./token-settings.component.scss']
})
export class TokenSettingsComponent implements OnInit {
  tokenSettings: FormGroup;
  settings:any;

  constructor(private fb: FormBuilder,
    private settingsService:SettingsService,
    private loderService: LoaderService,
    private toaster: ToastrService,) { }

  initForm() {
    this.tokenSettings = this.fb.group(
    {
      id: [
        this.settings?.id || null,
      ],
      accessTokenExpiryTime: [
        this.settings?.accessTokenExpiryTime || null,
      ],
      refreshTokenExpiryTime: [
        this.settings?.refreshTokenExpiryTime || null,
      ],
    });
  }

  getTokenSettings() {
    this.loderService.setIsLoading = true;
    this.settingsService.getTokenSettings().subscribe((data) => {
      this.settings = data.result.tokenSettings;
      this.initForm();
      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

  submit() {
    this.loderService.setIsLoading = true;
    this.settingsService.UpdateTokenSettings(
    {
      tokenSettings: {
        id: this.tokenSettings.controls.id.value,
        accessTokenExpiryTime: this.tokenSettings.controls.accessTokenExpiryTime.value,
        refreshTokenExpiryTime: this.tokenSettings.controls.refreshTokenExpiryTime.value
      }
    }).subscribe((data) => {
      this.toaster.success(data.result);
      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.getTokenSettings();
  }

}
