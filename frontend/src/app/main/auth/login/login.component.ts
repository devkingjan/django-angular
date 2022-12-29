import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../../@fuse/services/auth.service';
import {AuthGuardService} from '../../../../@fuse/services/auth-guard.service';
import {FuseProgressBarService} from '../../../../@fuse/components/progress-bar/progress-bar.service';
import {fuseAnimations} from '../../../../@fuse/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    user: any = {};
    submitted: boolean;
    errorMessage: null;
    constructor(
        private auth: AuthService,
        private progressService: FuseProgressBarService,
        private authGuard: AuthGuardService,
        private  router: Router,
        private _formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.submitted = false;
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
        this.loginForm.valueChanges.subscribe(change => {
           this.errorMessage = null;
        });
    }
    submit(): void {
        this.progressService.show();
        this.errorMessage = null;
        this.user = this.loginForm.value;
        this.submitted = true;
        this.auth.login(this.user)
        .then((resp) => {
          this.progressService.hide();
          this.submitted = false;
          const failedUrl = this.authGuard.consumeFailedUrl();
          if (failedUrl === null) {
                this.router.navigate(['/pages/dashboard']);
          } else {
            this.router.navigate([failedUrl]);
          }
        })
        .catch((resp) => {
            this.progressService.hide();
            this.errorMessage = resp.error['non_field_errors'][0];
            console.log(this.errorMessage);
            this.submitted = false;
        });
    }

}
