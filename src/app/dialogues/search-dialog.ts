import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {Tour} from '../tour';
import {Log} from '../log';

@Component({
  selector: 'app-search-tour-log-dialog',
  standalone: true,
  imports: [CommonModule, MatButton],
  templateUrl: './search-dialog.html',
})
export class SearchTourLogDialog {

  tourLogs: {log: Log[], tour: Tour[]} | undefined = undefined;

  constructor(
    public dialogRef: MatDialogRef<SearchTourLogDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.searchTourLogResult) {
      this.tourLogs = data.searchTourLogResult;
      console.log('Tourdaten im Dialog:', this.tourLogs);
    }
  }

  close(tourId?: number[]) {
    this.dialogRef.close(tourId);
  }
}
