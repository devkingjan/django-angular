import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../../../../@fuse/api/api.service';
import {fuseAnimations} from '../../../../@fuse/animations';
import {Company} from '../../../models/company';
import {MatDialog} from '@angular/material/dialog';
import {SendInvitationComponent} from './send-invitation/send-invitation.component';
import {ConfirmModalComponent} from "../../components/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-users',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CompaniesComponent implements OnInit {
  selectedCompany: Company = null;
  displayedColumns: string[] = ['first_name', 'last_name', 'institution', 'email', 'db_name', 'status', 'buttons'];
  status = {
      0: {
          name: 'Pending',
          color: 'default'
      },
      1: {
          name: 'Invited',
          color: 'warn'
      },
      2: {
          name: 'Accepted',
          color: 'accent'
      }
  };
  dataSource: Company[] = [];
  constructor(
      public dialog: MatDialog,
      private api: ApiService
  ) { }

  ngOnInit(): void {
      this.getCompanies();
  }
  getCompanies(): void {
      this.api.company.get().promise().then(resp => {
          this.dataSource = resp;
      });
  }
  sendInvitation(val): void {
    this.selectedCompany = val;
    const dialogRef = this.dialog.open(SendInvitationComponent, {
      data: {company: val}
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result && result.sent) {
            this.selectedCompany.status = 1;
        }
    });
  }
  delete(val): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {description: `You are going to remove Company ${val.email}. Our service will block all access from that company.`}
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result && result.accept) {
            val.status = 3;
            this.api.company.update(val).promise().then(resp => {
               this.dataSource = this.dataSource.filter(d => d.id !== val.id);
            });
        }
    });
  }

}
