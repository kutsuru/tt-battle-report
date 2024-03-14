import { Component, Input, OnInit, Inject} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatButtonModule} from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DecimalPipe, KeyValuePipe, NgFor } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DamageDealers } from '../tt-services/tt-typedef';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'tt-battle-card-popup',
  templateUrl: './tt-battle-card-popup.html',
  styleUrls: ['./tt-battle-card-popup.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    NgFor,
    KeyValuePipe,
    MatIconModule,
    MatGridListModule,
    DecimalPipe,
  ],
})
export class TtBattleCardPopup implements OnInit {
  mob_name: string = 'Poring';
  damage_dealers: DamageDealers | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string, damage_dealers: DamageDealers }) {
    this.mob_name = data.name;
    this.damage_dealers = data.damage_dealers;
  }

  ngOnInit(): void {
    // Based on input value following
  }
} 