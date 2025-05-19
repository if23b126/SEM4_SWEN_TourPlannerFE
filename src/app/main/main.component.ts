/*import { Component } from '@angular/core';
import {MatGridList} from '@angular/material/grid-list';
import {MatListItem, MatNavList} from '@angular/material/list';
import {RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})*/

import {
  /* . . . */
  NgFor,
  /* . . . */
} from '@angular/common';
import {Component} from '@angular/core';

@Component({
  standalone: true,
  imports: [
    NgFor,
  ],
})

export class MainComponent {
  heroes = [
    { id: 12, name: 'Dr. Nice' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' },
    { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr. IQ' },
    { id: 19, name: 'Magma' },
    { id: 20, name: 'Tornado' }
  ];
}
