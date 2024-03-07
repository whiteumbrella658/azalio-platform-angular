import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from './firestore.service';
import * as FileSaver from 'file-saver';
import { differenceInDays } from 'date-fns';
import { oneDayInMs } from 'src/constants';

const weekdays = ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat'];
@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  external_token: string;
  weekStartDay: any;
  windowChatListRef: any;
  userCount = new BehaviorSubject<number>(null);

  public desktopView: boolean = document.body.clientWidth < 1000 && /Mobi|iPad|Android/i.test(navigator.userAgent) ? false : true;
  // added touchend condition to fix bug on safari iPad (AZAL-4243)
  public touchEnabledDevices: boolean = /Mobi|iPad|iOs|iPhone|Macintosh|tablet|Android/i.test(navigator.userAgent) && 'ontouchend' in document ? true : false;
  public deviceWidthEqualOrGreater: boolean = (document.body.clientWidth >= document.body.clientHeight) ? true : false;
  public isRespMode: boolean = document.body.clientWidth < 931 && /Mobi|iPad|Android/i.test(navigator.userAgent) ? true : false;
  
  constructor(private toastrService: NbToastrService, private analytics: FirestoreService) {
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    import('xlsx/dist/xlsx.mini.min').then(xlsx => {
      const worksheet: import('xlsx').WorkSheet = xlsx.utils.aoa_to_sheet(json);
      const workbook: import('xlsx').WorkBook = { Sheets: { Report: worksheet }, SheetNames: ['Report'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const date = new Date();
    FileSaver.saveAs(data, fileName + ' ' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear() + EXCEL_EXTENSION);
  }

  saveAsPdf(blob, fileName): void {
    // // const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    // // const EXCEL_EXTENSION = '.xlsx';
    // const data: Blob = new Blob([buffer], { type: 'application/pdf' });
    // const date = new Date();
    // FileSaver.saveAs(data, fileName + ' ' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear() + '.pdf');
    FileSaver.saveAs(blob, fileName);
  }

  isWidthLarge() {
    return document.body.clientWidth > 999 ? true : false;
  }

  isDesktopView() {
    return document.body.clientWidth < 1000 && /Mobi|iPad|tablet|Android/i.test(navigator.userAgent) ? false : true;
  }

  convertToLocalDateString(date) {
    if (!date) {
      return;
    }
    let todayUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    return todayUTC.toISOString().slice(0, 10).replace(/-/g, '-');
  }

  getDayDifference(date1, date2) {
    const time1 = new Date(date1) as any;
    const time2 = new Date(date2) as any;
    time1.setHours(0, 0, 0, 0);
    time2.setHours(0, 0, 0, 0);
    return Math.floor((time2.getTime() - time1.getTime()) / oneDayInMs);
  }

  getWeeksArray(startday = 0) {
    let result = [];
    result = [...weekdays.slice(startday), ...weekdays.slice(0, startday)];
    return result;
  }

  getWeek(selectedDate, dayOfWeek = 0) {
    let date = selectedDate;
    const firstdate = new Date(date.setDate(date.getDate() + (dayOfWeek - 7 - date.getDay()) % 7)); // first day is dependent on the day of week config
    const lastdate = this.getNextDate(firstdate, 6); // Adding six days to the firstday
    return { start: firstdate, end: lastdate };
  }

  getWeekDates(startDate) {
    let datesArr = [startDate];
    for (let i = 0; i < 6; i++) {
      datesArr.push(this.getNextDate(datesArr[i]));
    }
    return datesArr;
  }

  getNextDate(date, step = 1) {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + step);
    return nextDate;
  }

  getPrevDate(date, step = 1) {
    const prevDate = new Date(date);
    prevDate.setDate(date.getDate() - step);
    return prevDate;
  }

  // daysBetween(start: Date, end: Date): number {
  //   console.log(start, end);
  //   const timeInMilisec = end.getTime() - start.getTime();
  //   return Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
  // }

  daysBetweenInclusive(start: Date, end: Date): number {
    return differenceInDays(end, start) + 1;
  }

  getDateFromTimestamp(timestamp) {
    if (timestamp) {
      return new Date(timestamp * 1000);
    }
    return null;
  }

  changeTimezone(date, ianatz) {
    var invdate = new Date(date.toLocaleString('en-US', {
      timeZone: ianatz
    }));
  
    var diff = date.getTime() - invdate.getTime();
      return new Date(date.getTime() - diff); 
  }

  removeArrayItem(originalArray, key, value) {
    originalArray.splice(originalArray.findIndex(item => item[key] === value), 1);
  }

  transformNestedData(data) { //This function is used to clean data for API
    data.forEach(node => {
      if (node.children.length > 0) {
        node.children = node.children.map(child => { return { name: child.name, id: child.id } });
      } else if (node.selected) {
        node = { name: node.name, id: node.id, selected: node.selected, children: node.children }
      }
    });
    return data;
  }

  filterSelectedNestedItems(data) { //This function is used to clean data for display
    const result = [];
    data.forEach(node => {
      if (node.children.length > 0) {
        node.children = node.children.filter(child => child.selected);
        if (node.children.length > 0) {
          result.push(node);
        }
      } else if (node.selected) {
        result.push(node);
      }
    });
    return result;
  }

  showToastSuccess(message = 'Operation successful') {
    const config = { status: 'success', duration: 5000, preventDuplicates: true, destroyByClick: true, limit: 3 };
    this.showToast(message, 'Success', config);
  }

  showToastError(message = 'Operation failed') {
    const config = { status: 'danger', duration: 5000, preventDuplicates: true, destroyByClick: true, limit: 3 };
    this.showToast(message, 'Error', config);
  }

  showToastWarning(message = '', errorHeading = 'Invalid action',  delay = 1) {
    const config = { status: 'warning', duration: 5000 * delay, preventDuplicates: true, destroyByClick: true, limit: 3 };
    this.showToast(message, errorHeading, config);
  }

  showToast(message, title, config) {
    this.toastrService.show(message, title, config);
  }

  onMasterCheckboxToggle(isSelectAll, dataSource, selectionModel, key = null) {
    key = key ? key : 'id';
    if (dataSource.data) {
      if (isSelectAll) {
        dataSource.data.forEach(row => {
          selectionModel.select(row[key]); //only selects unique Ids
        });
      } else {
        dataSource.data.forEach(row => {
          selectionModel.deselect(row[key]);
        });
      }
    } else {
      if (isSelectAll) {
        dataSource.forEach(row => {
          selectionModel.select(row[key]); //only selects unique Ids
        });
      } else {
        dataSource.forEach(row => {
          selectionModel.deselect(row[key]);
        });
      }
    }

  }

  updateMasterCheckbox(data, selected, key = null) {
    const id = key ? key : 'id';
    if (data.length > 0) {
      let bool = true;
      data.forEach(row => {
        if (!this.idExists(selected, row[id], id)) {
          bool = false;
          return bool;
        }
      });
      return bool;
    }
  }

  idExists(arr: any[], id: any, key = null) {
    key = key ? key : 'id';
    return arr.some(el => el === id);
  }

  hideSplashScreen() {
    const loadingContainer: HTMLElement = document.getElementsByClassName('loader_wrapper').item(0) as HTMLElement;
    if (loadingContainer) {
      loadingContainer.style.display = 'none';
    }
  }

  showBackDrop(flag = false) {
    const backdrop: HTMLElement = document.getElementsByClassName('backdrop').item(0) as HTMLElement;
    if (backdrop) {
      if (flag) {
        backdrop.style.display = 'block';
      } else {
        backdrop.style.display = 'none';
      }
    }
  }


  filterData(data: any, key = 'created_on') {
    let result = {}

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);

    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);

    const parseToLocalDate = (dateString: string): Date => new Date(dateString);

    const todayData = data.filter((item) => parseToLocalDate(item.created_on) >= today);
    const yesterdayData = data.filter((item) => parseToLocalDate(item.created_on) >= yesterday && parseToLocalDate(item.created_on) < today);
    const last7DaysData = data.filter((item) => parseToLocalDate(item.created_on) >= last7Days && parseToLocalDate(item.created_on) < yesterday);
    const last30DaysData = data.filter((item) => parseToLocalDate(item.created_on) >= last30Days && parseToLocalDate(item.created_on) < last7Days);

    if (todayData.length > 0) {
      Object.assign(result, { today: {data: todayData, label: 'Today'} });
      console.log(result);
    }
    if (yesterdayData.length > 0) {
      Object.assign(result, { yesterday: {data: yesterdayData, label: 'Yesterday'} });
      console.log(result);
    }
    if (last7DaysData.length > 0) {
      Object.assign(result, { prev7: {data: last7DaysData, label: 'Previous 7 days'} });
      console.log(result);
    }
    if (last30DaysData.length > 0) {
      Object.assign(result, { prev30: {data: last30DaysData, label: 'Previous 30 days' }});
      console.log(result);
    }
    return result;
  }


  newTab(url) {
    this.analytics.logEvents("privacy_policy");
    window.open(url, "_blank");
  }
  aboutAzalio(url) {
    this.analytics.logEvents("azalio_logo");
    window.open(url, "_self");
  }

  setExternalToken(token: string) {
    this.external_token = token;
  }
  getExternalToken() {
    return this.external_token ? 'Bearer ' + this.external_token : null;
  }
  setWeekStartDay(startDay) {
    this.weekStartDay = startDay;
  }
  getWeekStartDay() {
    return this.weekStartDay;
  }
  setUsersCount(data) {
    this.userCount?.next(data);
  }

  logEvents(eventName: string) {
    this.analytics.logEvents(eventName)
  }

  // convertToKFormat(input) {
  //   // Check if the input is a valid number
  //   const number = parseFloat(input);
  //   if (isNaN(number)) {
  //     return input;
  //   }
  //   // Convert to thousand (k) format
  //   const absNumber = Math.abs(number);
  //   const formattedNumber = absNumber >= 1e3 ? `${(absNumber / 1e3).toFixed(1)}k` : absNumber;
  
  //   // Add sign for negative numbers
  //   return number < 0 ? `-${formattedNumber}` : formattedNumber;
  // }

  
  scrollToBottom(id) {
    setTimeout(() => {
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollTop = elem.scrollHeight;
      }
    }, 10);

  }

  // showLoginImage(){

  //   let width= document.body.clientWidth;

  //   let height=document.body.clientHeight;

  //   //  console.log(width,"width", height,"height");

  //   return (width>=height)?true:false;

  //  }

}
