import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-file-storage-settings',
  templateUrl: './file-storage-settings.component.html',
  styleUrls: ['./file-storage-settings.component.scss']
})
export class FileStorageSettingsComponent implements OnInit {
  fileStorage: FormGroup;
  settings:any;

  constructor(private fb: FormBuilder,
    private settingsService:SettingsService,
    private loderService: LoaderService,
    private toaster: ToastrService,) { }

  initForm() {
    this.fileStorage = this.fb.group(
    {
      id: [
        this.settings?.id || '',
      ],
      storageType: [
        this.settings?.storageType || null,
      ],
    });
  }

  getFileStorageSettings() {
    this.loderService.setIsLoading = true;
    this.settingsService.getFileStorageSettings().subscribe((data) => {
      this.settings = data.result;
      this.initForm();
      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

  submit() {
    this.loderService.setIsLoading = true;
    this.settingsService.updateFileStorageSettings(
      {
        id: this.fileStorage.controls.id.value,
        storageType: this.fileStorage.controls.storageType.value
      }).subscribe((data) => {
      this.toaster.success(data.result);
      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.getFileStorageSettings();
  }

}
