import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {fuseAnimations} from '../../../../@fuse/animations';
import {UtilsService} from '../../../../@fuse/services/utils.service';
import {MyErrorStateMatcher} from '../../pages/profile/change-password/change-password.component';
import {ApiService} from '../../../../@fuse/api/api.service';
import {FuseProgressBarService} from '../../../../@fuse/components/progress-bar/progress-bar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class RegisterComponent implements OnInit {
    memberUid: string = null;
    companyUid: string = null;
    userRole: string = null;
    registerForm: FormGroup;
    user: any = {};
    submitted: boolean;
    errorMessage: string = null;
    matcher = new MyErrorStateMatcher();
    constructor(
        private api: ApiService,
        private router: Router,
        private route: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private utilsService: UtilsService,
        private progressService: FuseProgressBarService,
    ) {
        // this.memberUid = this.route.snapshot.params['memberUid'];
        // this.companyUid = this.route.snapshot.params['companyUid'];
        this.userRole = this.route.snapshot.params['user-role'];
    }

    ngOnInit(): void {
        this.route.queryParamMap.subscribe((map) => {
                this.memberUid = map['params']['uid'];
                if (this.userRole === 'member') {
                    this.companyUid = map['params']['token'];
                }
            }
        );
        this.submitted = false;
        this.registerForm = this._formBuilder.group({
            user_name   : ['', [Validators.required]],
            initials   : ['', [Validators.required]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            pin: ['', [
                Validators.required,
                Validators.maxLength(6),
                Validators.pattern('^[0-9]*$'),
            ]],
            confirmPin: ['', Validators.required],
        }, {validator: [this.checkPasswords, this.checkPins]});
    }
    
    checkPasswords(group: FormGroup): any {
      const pass = group.get('password').value;
      const confirmPass = group.get('confirmPassword').value;
      return pass === confirmPass ? null : { passwordNotSame: true };
    }

    checkPins(group: FormGroup): any {
        const pin = group.get('pin').value;
        const confirmPin = group.get('confirmPin').value;
        return pin === confirmPin ? null : { pinNotSame: true };
    }
    
    submit(): void {
        this.errorMessage = null;
        this.user = this.registerForm.value;
        this.submitted = true;
        this.progressService.show();
        this.api.me.signUpInvitedUser({...this.user, memberUid: this.memberUid, companyUid: this.companyUid,
            user_role: this.userRole}).promise().then(() => {
                this.progressService.hide();
                this.submitted = false;
                this.router.navigate(['/auth/login']);
        })
        .catch((resp) => {
            this.progressService.hide();
            this.errorMessage = this.utilsService.parseError(resp);
            this.submitted = false;
        });
    }

}

