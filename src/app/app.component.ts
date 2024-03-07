import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router} from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataSharedService } from './core/services/data-shared.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { LocalStorageService } from './core/services/local-storage.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Azalio';
  showHeader: boolean;
  showCustomHeader: boolean;
  showFooter: boolean;

  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];
  message: string;
  connectionStatus: string;
  pathChanged: boolean = false;
  error:boolean=true;
  isCommunicationEnabled: boolean;
  showLoaderAnimation: boolean = true
  logo: any;

  constructor(
    private storageService: LocalStorageService, 
    private dataService: DataSharedService, 
    private router: Router) { 

    window.location.href.includes('access-mobile-scheduler') || (window.location.href.includes('mobile')) ? this.showLoaderAnimation = false : this.showLoaderAnimation = true;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      event.url.includes('access-mobile-scheduler') || (this.router.url.includes('mobile')) ? this.showLoaderAnimation = false : this.showLoaderAnimation = true;
      if (event.url !== '/' && !event.url.includes('askq') && !event.url.includes('admin') && !event.url.includes('setup') && !event.url.includes('privacy-policy') && !event.url.includes('home') && !event.url.includes('mobile-scheduler') && !event.url.includes('store-app-scheduler') && !event.url.includes('access-point')) {
        this.showCustomHeader = false;
        this.setChatConfig();
      }
      if (event.url.includes('askq') || event.url.includes('admin') || event.url.includes('home') || (event.url.includes('privacy-policy') || event.url === '/') || (event.url.includes('store-app-scheduler/404')) ||(event.url.includes('store-app-scheduler') ) || (event.url.includes('access-point')) || (event.url.includes('mobile'))) {
        this.showHeader = false;
      } else {
        this.pathChanged = !this.pathChanged
        this.showHeader = true;
      }
      if (event.url.includes('admin') || this.storageService?.companyId || event.url.includes('/communication') || event.url.includes('/404') || event.url.includes('/401')) {
        this.showFooter = false;
      } else {
        this.showFooter = true;
      }
      if(event.url.includes('store-app-scheduler/404' || 'mobile-scheduler/404')){
        this.error=false;
      }
    });
  }
  options: AnimationOptions = {
		path: 'https://assets4.lottiefiles.com/packages/lf20_eb5cde4g.json'
	  };
    onAnimate(animationItem: AnimationItem): void {
      }
  setChatConfig() {
    this.dataService
    .getConfigurations(false)
    .then((config) => {
     this.isCommunicationEnabled = config.company.is_communication === 1;
     this.logo = config.company.theme?.logo;
    })
    .finally(() => {
      if (this.logo) {
        this.showCustomHeader = true;
      }
    });
  }

  ngOnInit() {

    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      this.message = 'You are now connected to the internet.';
      this.connectionStatus = 'online';
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      this.message = 'You are not connected to the internet.';
      this.connectionStatus = 'offline';
    }));
  }


  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(subscription => subscription?.unsubscribe());
  }
}


