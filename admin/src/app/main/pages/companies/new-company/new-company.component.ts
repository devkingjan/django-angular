import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Company} from '../../../../models/company';
import {MyErrorStateMatcher} from '../../../../../@fuse/utils/error-state-matcher';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UtilsService} from '../../../../../@fuse/services/utils.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-company.component.html',
  styleUrls: ['./new-company.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class NewCompanyComponent implements OnInit {
    company: Company = new Company();
    baseForm: FormGroup;
    matcher = new MyErrorStateMatcher();
    constructor(
        private api: ApiService,
        private _snackBar: MatSnackBar,
        private utilsService: UtilsService,
        private _formBuilder: FormBuilder,
        private router: Router
    ) { }
    
    ngOnInit(): void {
        this.initializeBaseForm();
    }
    initializeBaseForm(): void {
        this.baseForm = this._formBuilder.group({
            first_name   : [this.company.first_name, [Validators.required]],
            last_name   : [this.company.last_name, [Validators.required]],
            institution   : [this.company.institution, [Validators.required]],
            email   : [this.company.email, [Validators.required, Validators.email]],
            confirm_email   : ['', [Validators.required, Validators.email]],
            db_name   : [this.company.db_name, [Validators.required]],
            confirm_db_name   : ['', [Validators.required]]
        }, {validator: [this.checkEmail, this.checkDb]});
    }
    checkEmail(group: FormGroup): any {
      const email = group.get('email').value;
      const confirmEmail = group.get('confirm_email').value;
      return email === confirmEmail ? null : { notSameEmail: true };
    }
    checkDb(group: FormGroup): any {
      const db = group.get('db_name').value;
      const confirmDb = group.get('confirm_db_name').value;
      return db === confirmDb ? null : { notSameDB: true };
    }
   
    submitBaseForm(): void {
        this.api.company.create(this.baseForm.value).promise().then(resp => {
           this._snackBar.open('Created Company Successfully', 'Notice', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
           });
           this.router.navigate(['admin/companies']);
        }).catch(error => {
            const message = this.utilsService.parseError(error);
            this._snackBar.open(message, 'Failed', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
           });
        
        });
    
    }

}
