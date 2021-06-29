import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { ManageAccountServise } from '../../../account-management.service';

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.component.html',
  styleUrls: ['./profile-data.component.scss']
})
export class ProfileDataComponent implements OnInit {
  errorImageSize:boolean = false;
  selectedImageUrl:any = null;
  defaultImage = './assets/media/users/blank.png';
  selectedImageName:string;
  changeProfileImage:File;
  oldAvatarUri:string = null;

  userData: any;
  userForm: FormGroup;

  constructor( private auth: AuthService,
    private fb: FormBuilder, 
    private manageAccountServise:ManageAccountServise,
    private loderService: LoaderService,
    private toaster: ToastrService,) { }

    initForm() {
      this.userForm = this.fb.group(
      {
        email: [
          this.userData?.email || '',
        ],
        name: [
          this.userData?.name || '',
        ],
        surname: [
          this.userData?.surname || '',
        ],
        phoneNumber: [
          this.userData?.phoneNumber || '',
          Validators.compose([
            Validators.pattern("[0-9]+"),
            Validators.maxLength(11),
          ]),
        ],
      });
    }
  
  
  changePhoto() {
    document.getElementById('photoInput').click();
  }

  removePhoto() {
    this.selectedImageName = '';
    this.selectedImageUrl = null;
    (document.getElementById('photoInput') as HTMLInputElement).value = null;
    this.changeProfileImage = null;
  }

  readURL(e) {
    this.loderService.setIsLoading = true;
    let inputTarget = e.target;
    if (inputTarget.files && inputTarget.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
          if(inputTarget.files[0].size > 2000000) {
            this.errorImageSize = true;
            this.selectedImageUrl = null;
            this.selectedImageName = '';
            this.changeProfileImage = null;
            (document.getElementById('photoInput') as HTMLInputElement).value = null;
          }
          else {
            this.errorImageSize = false;
            this.selectedImageUrl = e.target.result;
            this.selectedImageName = inputTarget.files[0].name;
            this.changeProfileImage = inputTarget.files[0];
          }
          this.loderService.setIsLoading = false;
        }
        reader.readAsDataURL(inputTarget.files[0]);
    }
    this.loderService.setIsLoading = false;
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.loderService.setIsLoading = true;
    this.auth.getUserByToken().subscribe((data) => {
      this.userData = data.result;
      this.changeProfileImage = null;
      if(data.result.avatarUri) {
        this.selectedImageUrl = data.result.avatarUri;
        if(data.result.avatarUri) {
          this.oldAvatarUri = data.result.avatarUri;
        }
      }
      this.initForm();
      this.loderService.setIsLoading = false;
    }, () => {
      this.loderService.setIsLoading = false;
    });
  }

  submit() {
    this.loderService.setIsLoading = true;
    var formData: FormData = new FormData();
    formData.append('name', this.userForm.controls.name.value);
    formData.append('surname', this.userForm.controls.surname.value);
    formData.append('phoneNumber', this.userForm.controls.phoneNumber.value);
    if(this.changeProfileImage) {
      formData.append('avatar', this.changeProfileImage as any, this.changeProfileImage['name']);
    }
    else {
      formData.append('avatar', null);
    }
    formData.append('avatarUri', this.oldAvatarUri);
    this.manageAccountServise.updateUserProfile(formData).subscribe((data) => {
      this.auth.getUserByToken().subscribe(data => {
        this.auth.currentUserDetails =  data.result;
      });
      this.getUser();
      this.loderService.setIsLoading = false;
      this.toaster.success(data.result);
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }
}
