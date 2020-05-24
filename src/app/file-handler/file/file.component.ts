import { Component, OnInit, ViewChild } from '@angular/core';
import { FilehandlingService } from '../../core/services/filehandling.service';
declare const window: any;
const { ipcRenderer } = window.require("electron")
@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  @ViewChild('file2', {static: false}) input;

  constructor(
    private fileHandlingService: FilehandlingService
  ) { }

  ngOnInit() {

    // 
    ipcRenderer.on('OpenFileDialog', (event, arg) => {
      const { dialog } = window.require('electron').remote;
      dialog.showOpenDialog({
        filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'mp4'] }],
        properties: ['openFile', 'openDirectory', 'multiSelections']
      },
        (files) => {
          // ipcRenderer.send('got-files', 'files selected')
          this.fileHandlingService.readMediaTags(files)
        })
    })

  }

}
