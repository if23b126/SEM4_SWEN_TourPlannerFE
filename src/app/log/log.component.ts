import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {MatCard, MatCardContent, MatCardSmImage} from '@angular/material/card';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LayoutModule} from '@angular/cdk/layout';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatButton} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-log',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    LayoutModule,
    MatDialogModule
  ],
  templateUrl: './log.component.html',
  styleUrl: './log.component.css'
})
export class LogComponent {
  comment: string = "";
  difficulty: number = 0;
  distance: number = 0;
  rating: number = 0;
  time: string = "";
  timeEnd: Date = new Date;
  timeStart: Date = new Date;
}
