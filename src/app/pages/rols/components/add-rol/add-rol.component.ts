import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { RolsService } from '../../rols.service';

@Component({
  selector: 'app-add-rol',
  templateUrl: './add-rol.component.html',
  styleUrls: ['./add-rol.component.scss']
})
export class AddRolComponent implements OnInit {
  addRol: FormGroup;
  rols:any;
  changeProfileImage:File;
  rolId:string;
  rolData:any;
  permessions = [];

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private rolsService:RolsService,
    private loderService: LoaderService,
    private toaster: ToastrService,
    private router: Router,) { }

  getRolById() {
    this.loderService.setIsLoading = true;
    this.rolsService.getRolById({id:this.rolId}).subscribe((data) => {
      this.rolData = data.result;
      this.initForm();
      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

  getPermessions() {
    this.rolsService.getPermessions().subscribe((data) => {
      this.permessions = data.result?.permissions[0]?.permissions;
    },(error) => {});
  }

  initForm() {
    this.addRol = this.fb.group(
    {
      name: [
        this.rolData?.name || '',
      ],
      permessions: [
        this.rolData?.selectedPermissions?.map(item => item.id) || [],
      ],
      isDefault: [
        this.rolData?.isDefault || false,
      ],
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe((data) => {
      this.rolId = data.id;
    });
    if(this.rolId) {
      this.getRolById();
    }
    this.getPermessions();
  }

  selectAll(event, id) {
    let group = this.permessions.find(item => item.id === id);
    if(event.checked) {
      let newItems = [];
      group.permissions.map((item) => {
        if(!this.addRol.controls.permessions.value.includes(item.id)) {
          newItems.push(item.id);
        }
      });
      this.addRol.get('permessions').setValue(this.addRol.controls.permessions.value.concat(newItems));
    }
    else {
      let removeItems = this.addRol.controls.permessions.value;
      group.permissions.map((item) => {
        if(removeItems.includes(item.id)) {
          removeItems.splice(removeItems.indexOf(item.id), 1);
        }
      });
      this.addRol.get('permessions').setValue([].concat(removeItems));
    }
  }

  checkIfSelectedAll(id) {
    let group = this.permessions.find(item => item.id === id);
    let flag = true;
    group.permissions?.map((item) => {
      if(!this.addRol.controls.permessions.value.includes(item.id)) {
        flag = false;
      }
    });
    return flag;
  }

  submit() {
    this.loderService.setIsLoading = true;
    let formData:any = {
      name: this.addRol.controls.name.value,
      isDefault: this.addRol.controls.isDefault.value,
      selectedPermissionIds: this.addRol.controls.permessions.value
    }
    if(this.rolId) {
      formData.id = this.rolId;
      this.rolsService.updateRol(formData).subscribe((data) => {
        this.toaster.success(data.result);
        this.loderService.setIsLoading = false;
        this.router.navigate(['/rols']);
      },(error) => {
        this.loderService.setIsLoading = false;
      });
    }
    else {
      this.rolsService.createRole(formData).subscribe((data) => {
        this.toaster.success(data.result.successMessage);
        this.loderService.setIsLoading = false;
        this.router.navigate(['/rols']);
      },(error) => {
        this.loderService.setIsLoading = false;
      });
    }
  }
}
