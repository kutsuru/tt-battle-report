import { Component, Input, OnInit, Inject} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatButtonModule} from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KeyValuePipe, NgFor } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DamageDealers } from '../tt-services/tt-typedef';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'tt-battle-card-popup',
  templateUrl: './tt-battle-card-popup.html',
  styleUrls: ['./tt-battle-card-popup.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    NgFor,
    KeyValuePipe,
    MatIconModule,
    MatGridListModule,
  ],
})
export class TtBattleCardPopup implements OnInit {
  damage_dealers: DamageDealers | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DamageDealers) {
    this.damage_dealers = data;
  }

  ngOnInit(): void {
    // Based on input value following
  }
} 