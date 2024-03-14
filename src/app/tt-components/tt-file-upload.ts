import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from "@angular/common";
import { HttpClient, HttpEventType, HttpHeaders } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Subscription, finalize, throwError } from "rxjs";
import { TTRRFDataService } from "../tt-services/tt-rrf-data-service";


@Component({
  selector: 'tt-file-upload',
  templateUrl: "tt-file-upload.html",
  styleUrls: ["tt-file-upload.scss"],
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
  allow_retry: Boolean = true;
  allow_cancel: Boolean = true;
  upload_progress: number = 0;
  selected_file: File | null = null;
  upload_subscription: Subscription | null = null;
  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status

  /** Name used in form which will be sent in HTTP request. */
  @Input() param = "file";
  /** Target URL for file uploading. */
  @Input() target = "http://127.0.0.1:8000/ttapi/uploadrrf";
  /** File extension that accepted, same as 'accept' of <input type="file" />. By the default, it's set to '.rff'. */
  @Input() accept = ".rrf";

  constructor(
    private _http: HttpClient,
    private _dataService: TTRRFDataService) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.selected_file = file;
      console.log(this.selected_file.name)
      this.onUpload();
    }
  }

  onRetry() {
    this.onUpload();
  }

  onClick() {
    const file_upload = document.getElementById("file_upload") as HTMLInputElement;
    file_upload.click();
  }

  onUpload() {
    // Reset upload status
    this.upload_progress = 0;
    this.status = 'uploading';
    this._dataService.clear_data();

    if (this.selected_file) {
      const form_data = new FormData();

      form_data.append('file', this.selected_file, this.selected_file.name);
      const upload$ = this._http.post(this.target, form_data, {
        reportProgress: true,
        observe: 'events'
      });

      this.upload_subscription = upload$.subscribe(
        event => {
          if (event['type'] === HttpEventType.UploadProgress) {
            if (event.total)
              this.upload_progress = Math.round((event.loaded * 100) / event.total);
          }
          else if (event['type'] === HttpEventType.Response) {
            this.status = 'success';
            this._dataService.update_data(event['body']);
          }
        },
        error => {
          this.status = 'fail';
        });
    }
  }

  onCancel() {
    if (this.upload_subscription)
      this.upload_subscription.unsubscribe();
    this.selected_file = null;
  }
}
