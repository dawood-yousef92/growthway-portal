import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
    settings:any;
    userSettings:any;
    signinSettings:any;
    passwordSettings:any;
    lockoutSettings:any;
    permissions:any = localStorage.getItem('permissions');

    constructor(private settingsService:SettingsService,
        private loderService: LoaderService,
        private toaster: ToastrService,) { }

    getIdentitySettings() {
            this.loderService.setIsLoading = true;
            this.settingsService.getIdentitySettings().subscribe((data) => {
            this.settings = data.result;
            this.userSettings = data.result.userSettings;
            this.signinSettings = data.result.signInSettings;
            this.passwordSettings = data.result.passwordSettings;
            this.lockoutSettings = data.result.lockoutSettings;
            this.loderService.setIsLoading = false;
        },
        (error) => {
            this.loderService.setIsLoading = false;
        });
    }

    saveSettings(event) {
        if(event.userSettings){
            this.settings.userSettings = event.userSettings;
        }
        else if(event.signinSettings) {
            this.settings.signInSettings = event.signinSettings;
        }
        else if(event.passwordSettings) {
            this.settings.passwordSettings = event.passwordSettings;
        }
        else if(event.lockoutSettings) {
            this.settings.lockoutSettings = event.lockoutSettings;
        }

        this.loderService.setIsLoading = true;
        this.settingsService.updateIdentitySettings(this.settings).subscribe((data) => {
            this.toaster.success(data.result);
            this.loderService.setIsLoading = false;
        },(error) => {
            this.loderService.setIsLoading = false;
        });
    }
  
    ngOnInit() {
        this.getIdentitySettings();
    }
}
