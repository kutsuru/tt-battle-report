import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TtBattleCardInfo } from './tt-components/tt-battle-card-info';
import { TtFileUpload } from './tt-components/tt-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { TTBattleSession } from './tt-components/tt-battle-session';
import { TTRRFDataService } from './tt-services/tt-rrf-data-service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSlideToggleModule,
    TtBattleCardInfo,
    TTBattleSession,
    TtFileUpload,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[
    TTRRFDataService,
  ]
})
export class AppComponent {
  title = 'tt-battle-report';

  constructor(private _dataService: TTRRFDataService) {}
}
