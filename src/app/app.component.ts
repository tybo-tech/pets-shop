import { DOCUMENT } from '@angular/common';
import { Inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Item } from 'src/models/item.model';
import { CompanyService } from 'src/services/company.service';
import { ItemService } from 'src/services/item.service';
import { COMPANY, COMPANY_Name as COMPANY_NAME, ITEM_TYPES } from 'src/shared/constants';
declare var gtag;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  webTitle: Item;

  readonly VAPID_PUBLIC_KEY =
    {
      publicKey: "BHZEk4ExK7fDSgBTHwnFymbxBFOn0qgRShUYEHVoEvpxC-ZKKkjYZ8ZtKqiY5y_Ei5RTTBLoc0nXIyMH2f_wIeg",
      privateKey: "SFsZkWDHVDCfpeT8ojXim0m477br-w9T0bEs0YUCsLI"
    }

  constructor(
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private itemService: ItemService,
    private companyService: CompanyService,
    private router: Router,
    private titleService: Title) {

  }
  ngOnInit(): void {
    if (environment.production) {
      if (location.protocol === 'http:') {
        window.location.href = location.href.replace('http', 'https');
      }
    }
    // this.subscribeToNotifications();
    this.itemService.loadItems(COMPANY, ITEM_TYPES.SETTINGS.Name);
    this.itemService.ItemListObservable.subscribe(data => {
      if (data && data.length) {
        this.webTitle = data.find(x => x.ItemType === ITEM_TYPES.TITLE.Name);
        if (this.webTitle)
          this.titleService.setTitle(this.webTitle.Description);
        var favicon = this._document.getElementById('favicon');
        if (favicon)
          favicon.setAttribute('href', this.webTitle.ImageUrl);

        const googleAnalytics = data.find(x => x.ItemType === ITEM_TYPES.GOOGLE_ANALYTICS.Name);
        if (environment.production && googleAnalytics && googleAnalytics.Name)
          this.doGoogleAnalytics(googleAnalytics.Name)
      }
    });

    this.companyService.getCompanyById(COMPANY).subscribe(data => {
      if (data && data.CompanyId) {
        this.companyService.updateCompanyState(data);
      }
    })
  }
  doGoogleAnalytics(code) {
    this.updateClientapp();
    const navigationEndEvents = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );

    navigationEndEvents.subscribe((event: NavigationEnd) => {
      gtag('config', code, {
        'page_path': event.urlAfterRedirects
      });

    });
  }
  subscribeToNotifications() {

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY.publicKey
    })
      .then(sub => {
        console.log(sub);
      })
      .catch(err => console.error("Could not subscribe to notifications", err));
  }

  updateClientapp() {
    if (!this.swUpdate.isEnabled) {
      console.log('Sw updated not enabled');
      return;
    }

    this.swUpdate.available.subscribe(data => {
      console.log('New update available.', data);
      if (confirm('There is a new app update, please confirm to allow the update right now')) {
        this.swUpdate.activateUpdate().then(() => location.reload());
      }
    });


    this.swUpdate.activated.subscribe(data => {
      console.log('New update activated.', data);

    });
  }
}
