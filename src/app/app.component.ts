import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatAnchor} from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, MatAnchor, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TourPlannerFE';
}
