import { Component } from '@angular/core';
import { DownloaderService } from './downloads.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  providers: [ DownloaderService ]
})
export class DownloaderComponent {
  contents: string;
  constructor(private downloaderService: DownloaderService) {}

  clear() {
    this.contents = undefined;
  }

  download() {
    this.downloaderService.getTextFile('assets/textfile.txt')
      .subscribe(results => this.contents = results);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/