import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from "@angular/common";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { throwError } from "rxjs";
import { TTRRFDataService } from "../tt-services/tt-rrf-data-service";


@Component({
    selector: 'tt-file-upload',
    templateUrl: "tt-file-upload.html",
    styleUrls: ["tt-file-upload.css"],
    standalone: true,
    imports: [
        NgIf,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        MatIconModule,
        MatProgressBarModule,
    ]
  })
export class TtFileUpload {
    status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
    selected_file: File | null = null;
    upload_progress: number = 0 ;
    //upload_subscription: Subscription;

    constructor(
        private _http: HttpClient,
        private _dataService: TTRRFDataService) {}

    onFileSelected(event: any) {
        const file:File = event.target.files[0];
      
        if (file) {
            this.status =  "initial";
            this.selected_file = file;
            console.log(this.selected_file.name)
        }
    }

    onUpload() {
        if (this.selected_file) {
          const formData = new FormData();
      
          formData.append('file', this.selected_file, this.selected_file.name);
          const upload$ = this._http.post("http://127.0.0.1:8000/ttapi/uploadrrf", formData);
          this.status = 'uploading';
      
          upload$.subscribe({
            next: (response) => {
              this.status = 'success';
              this._dataService.update_data(response);
            },
            error: (error: any) => {
              this.status = 'fail';
              return throwError(() => error);
            },
          });
        }
      }

  cancelUpload() {
    //this.upload_subscription.unsubscribe();
    this.reset();
  }

  reset() {
    this.upload_progress = 0;
    //this.upload_subscription = null;
  }
}
