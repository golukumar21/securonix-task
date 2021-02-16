import { Component } from '@angular/core';
import * as JSZip from 'jszip';
import * as XLSX from 'xlsx';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material.js";

am4core.useTheme(am4themes_material);
am4core.useTheme(am4themes_animated);
am4core.options.commercialLicense = true;
am4core.options.autoSetClassName = true;

type AOA = any[][];

const zipFile: JSZip = new JSZip();
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Securonix';
  data: any = [];
  uploadedFiles: any[] = [];
  constructor() { }

  ngOnInit() {

  }

  uploader(event) {
    // for (let file of event.files) {
    //   this.uploadedFiles.push(file);
    // }
    let srcEle = event.currentTarget;
    const target: DataTransfer = <DataTransfer>(event.target);
    // if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { raw: true }));
      this.render(this.data);
    }
    reader.readAsBinaryString(target.files[0]);
  }

  render(data) {
    var newObjArray = data.map(function (obj) {
      for (var key in obj) {
        if (typeof obj[key] === 'string' && obj[key].includes("DATETIME_")) {
          obj['dateTime'] = obj[key];
          delete obj[key];
          var str = obj.dateTime.split("=");
          obj.dateTime = str[1];
        }
        if (typeof obj[key] === 'string' && obj[key].includes("OBJECTNAME=")) {
          obj['objectName'] = obj[key];
          delete obj[key];
          var str = obj.objectName.split("=");
          obj.objectName = str[1];
        }
        if (typeof obj[key] === 'string' && obj[key].includes("USER_NAME=")) {
          obj['userName'] = obj[key];
          delete obj[key];
          var str = obj.userName.split("=");
          obj.userName = str[1];
        }
      }
      return obj;
    });
    console.log(newObjArray)
  }
}
