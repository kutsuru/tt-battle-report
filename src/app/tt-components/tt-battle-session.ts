import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { BattleData } from '../tt-services/tt-typedef';
import { TTRRFDataService } from '../tt-services/tt-rrf-data-service';
import { KeyValuePipe, NgFor } from '@angular/common';
import { TtBattleCardInfo } from './tt-battle-card-info';

@Component({
  selector: 'tt-battle-session',
  templateUrl: './tt-battle-session.html',
  styleUrls: ['./tt-battle-session.css'],
  standalone: true,
  imports: [
    NgFor,
    KeyValuePipe,
    TtBattleCardInfo,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TTBattleSession implements OnInit {
  constructor(private _dataService: TTRRFDataService) {}
  
  battle_data: Signal<BattleData> = this._dataService.get_data();
  count = this._dataService.get_counter();

  ngOnInit(): void {

  }

} 