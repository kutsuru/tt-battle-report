import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TtBattleCardPopup } from '../tt-components/tt-battle-card-popup'

@Injectable()
export class TTPopupService {

  constructor(private dialog: MatDialog) {}
  open(data: any) {
    return this.dialog.open(TtBattleCardPopup, {data: data, width: '1000px'});
  }
}