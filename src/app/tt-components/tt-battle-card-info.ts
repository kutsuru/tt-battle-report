import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TTPopupService } from '../tt-services/tt-popup-service';
import { DamageDealers } from '../tt-services/tt-typedef';

@Component({
  selector: 'tt-battle-card-info',
  templateUrl: './tt-battle-card-info.html',
  styleUrls: ['./tt-battle-card-info.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
  ],
  providers: [
    TTPopupService,
  ]
})
export class TtBattleCardInfo implements OnInit {
  constructor(
    private _cardPopup: TTPopupService) {}
  
  mvp_job: string = '';
  mvp_player: string = '';
  mvp_damage: number = 0;
  mvp_skill_spam: number = 0;
  
  @Input() mob_id: number = 1002;
  @Input() mob_name: string = 'Poring';
  @Input() damage_received: number = 0;
  @Input() damage_dealers: DamageDealers = {};

  ngOnInit(): void {
    // Based on input value following
    for (const [name, battle_info] of Object.entries(this.damage_dealers)) {
      if (battle_info['damage'] > this.mvp_damage) {
        this.mvp_player = name;
        this.mvp_job = battle_info['job'];
        this.mvp_damage = battle_info['damage']
        this.mvp_skill_spam = battle_info['skill_spam']
      }
    }
  }

  onClick(): void {
    this._cardPopup.open(this.damage_dealers);
  }
} 