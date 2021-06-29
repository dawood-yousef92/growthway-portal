import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPasswordValidator } from 'src/app/modules/auth';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  errorImageSize:boolean = false;
  selectedImageUrl:any = null;
  defaultImage = './assets/media/users/blank.png';
  selectedImageName:string;
  addUser: FormGroup;
  rols:any;
  changeProfileImage:File;
  userId:string;
  userData:any;
  isPermissions:boolean = false;
  permissions:any[] = [];
  selectedPermissions:any[] = [];


  constructor( 
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private usersService:UsersService,
    private loderService: LoaderService,
    private toaster: ToastrService,
    private router: Router,) { }

  getUserById() {
    this.usersService.getUserById({id:this.userId}).subscribe((data) => {
      this.userData = data.result;
      if(data.result.avatarUri) {
        this.selectedImageUrl = data.result.avatarUri;
      }
      this.initForm();
    });
  }

  getUserPermissions() {
    this.loderService.setIsLoading = true;
    this.usersService.getUserPermissions({userId: this.userId, isEagerLoaded: true}).subscribe((data) => {
      this.permissions = data.result?.allPermissions[0]?.permissions;
      this.selectedPermissions = data.result.selectedPermissions?.map(item => item.id);
      this.initForm();
      this.getUserById();
      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

  selectAll(event, id) {
    let group = this.permissions.find(item => item.id === id);
    if(event.checked) {
      let newItems = [];
      group.permissions.map((item) => {
        if(!this.addUser.controls.permissions.value.includes(item.id)) {
          newItems.push(item.id);
        }
      });
      this.addUser.get('permissions').setValue(this.addUser.controls.permissions.value.concat(newItems));
    }
    else {
      let removeItems = this.addUser.controls.permissions.value;
      group.permissions.map((item) => {
        if(removeItems.includes(item.id)) {
          removeItems.splice(removeItems.indexOf(item.id), 1);
        }
      });
      this.addUser.get('permissions').setValue([].concat(removeItems));
    }
  }

  checkIfSelectedAll(id) {
    let group = this.permissions.find(item => item.id === id);
    let flag = true;
    group.permissions?.map((item) => {
      if(!this.addUser.controls?.permissions?.value.includes(item.id)) {
        flag = false;
      }
    });
    return flag;
  }

  initForm() {
    this.addUser = this.fb.group(
    {
      name: [
        this.userData?.name || '',
      ],
      surname: [
        this.userData?.surname || '',
      ],
      email: [
        this.userData?.email || '',
        Validators.compose([
          Validators.email,
        ]),
      ],
      phoneNumber: [
        this.userData?.phoneNumber || '',
        Validators.compose([
          Validators.pattern("[0-9]+"),
          Validators.maxLength(11),
        ]),
      ],
      setRandomPassword: [
        false,
      ],
      password: [
        '',
      ],
      cPassword: [
        '',
      ],
      mustSendActivationEmail: [
        false,
      ],
      isActive: [
        this.userData?.isActive || false,
      ],
      assignedRolesIds: [
        this.userData?.assignedRoles?.map(item => {return item.id}) || null,
      ],
      permissions: [
        this.selectedPermissions || [],
      ],
    },
    {
      validator: ConfirmPasswordValidator.MatchPassword,
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe((data) => {
      if(this.route.snapshot.routeConfig.path.includes('edit-user-permissions'))
      {
        this.isPermissions = true;
      }
      this.userId = data.id;
      if(this.userId && !this.isPermissions) {
        this.getUserById();
      }
      else if(this.userId && this.isPermissions) {
        this.getUserPermissions();
      }
    });
    this.getRols();
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

  getRols() {
    this.usersService.getRols({rowsPerPage: -1}).subscribe((data) => {
      this.rols = data.result.roles.items;
    });
  }

  submit() {
    this.loderService.setIsLoading = true;
    var formData: FormData = new FormData();
    formData.append('name', this.addUser.controls.name.value);
    formData.append('surname', this.addUser.controls.surname.value);
    formData.append('email', this.addUser.controls.email.value);
    formData.append('phoneNumber', this.addUser.controls.phoneNumber.value);
    formData.append('setRandomPassword', this.addUser.controls.setRandomPassword.value);
    if(this.changeProfileImage) {
      formData.append('avatar', this.changeProfileImage as any, this.changeProfileImage['name']);
      formData.append('isAvatarAdded', 'true');
    }
    else {
      formData.append('isAvatarAdded', 'false');
    }
    if(this.addUser.controls.password.value) {
      formData.append('password', this.addUser.controls.password.value);
    }
    if(this.addUser.controls.cPassword.value) {
      formData.append('confirmPassword', this.addUser.controls.cPassword.value);
    }
    formData.append('mustSendActivationEmail', this.addUser.controls.mustSendActivationEmail.value);
    formData.append('isActive', this.addUser.controls.isActive.value);
    if(this.addUser.controls.assignedRolesIds.value) {
      for (var i = 0; i < this.addUser.controls.assignedRolesIds.value.length; i++) {
        formData.append('AssignedRoleIds[]', this.addUser.controls.assignedRolesIds.value[i]);
      }
    }

    if(this.userId && !this.isPermissions) {
      formData.append('id', this.userId);
      if(this.selectedImageUrl && !this.changeProfileImage) {
        formData.append('avatarUri', this.selectedImageUrl);
      }
      this.usersService.updateUser(formData).subscribe((data) => {
        this.toaster.success(data.result);
        this.loderService.setIsLoading = false;
        this.router.navigate(['/users']);
      },(error) => {
        this.loderService.setIsLoading = false;
      });
    }
    else if(this.userId && this.isPermissions) {
      this.usersService.grantOrRevokePermissions({userId: this.userId, selectedPermissionIds: this.addUser.controls?.permissions?.value}).subscribe((data) => {
        this.toaster.success(data.result);
        this.loderService.setIsLoading = false;
        this.router.navigate(['/users']);
      },(error) => {
        this.loderService.setIsLoading = false;
      });
    }
    else {
      this.usersService.createUser(formData).subscribe((data) => {
        this.toaster.success(data.result.successMessage);
        this.loderService.setIsLoading = false;
        this.router.navigate(['/users']);
      },(error) => {
        this.loderService.setIsLoading = false;
      });
    }
  }
}
