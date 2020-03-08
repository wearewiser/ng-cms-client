# @wiser/ng-cms-client

This is a library implementation of the package [@wiser/cms-pattern](https://www.npmjs.com/package/@wiser/cms-pattern).

This package provies an abstraction library for managing CMS page downloads and state in Angular applications.

## Quick Start

### Installation

```bash
npm install --save @wiser/ng-cms-client
```

### Usage

First define your page model. Be sure to make sure it is defined at a **class**. This is your contract that should be implemented in the view template. We will ensure that our home page repository always maintains this contract.

```TypeScript
export class HomePage {
  public title!: string;
  public subtitle!: string;
  public body!: string;
}
```

Then implement [SinglePageRepository](#SinglePageRepository) as an `@Injectable` service to resolve the `HomePage` class.

```TypeScript
import { SinglePageRepository } from '@wiser/ng-cms-client';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../models/pages/home-page';

@Injectable({
  providedIn: 'root'
})
export class DemoHomePageRepository implements SinglePageRepository<HomePage, undefined> {

  constructor(
    private readonly http: HttpClient,
  ) { }

  public async read(): Promise<ContactPageData> {
    const data = await this.http.get<any>('/assets/data/home.json').toPromise();
    const page = new HomePage();
    page.title = page_data.title;
    page.subtitle = page_data.subtitle;
    page.body = page_data.body;
    return page;
  }
}
```

> **Note**
>
> We can also have implemented [MultiPageRepository](#MultiPageRepository) to resolve a set of pages that are instantiations of the same class.

Import the [CmsModule](#CmsModule) into the `AppModule` and provide all single page and multip page repository registrations using the static `forRoot` method using an object implementing [CmsConfig](#CmsConfig) interface.

```TypeScript
import { NgModule } from '@angular/core';
import { CmsModule } from '@wiser/ng-cms-client';

import { HomePage } from './models/pages/home-page';
import { DemoHomePageRepository } from './repositories/demo-homep-page-repository';

@NgModule({
  declarations: [ ... ],
  imports: [
    CmsModule.forRoot({
      singlepage: [
        ...
        {
          Data: HomePage,
          Repository: DemoHomePageRepository,
        }
        ...
      ],
      multipage: [
        ...
      ],
    }),
  ],
  providers: [ ... ],
  bootstrap: [ ... ]
})
export class AppModule { }
```

Now we need to tell the [DownloaderService](#DownloaderService) when to download a specific page. Let's create a `Resolver` to do this.

```TypeScript
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { DownloaderService } from '@wiser/ng-cms-client';
import { HomePage } from '../models/pages/home-page';

@Injectable({
  providedIn: 'root'
})
export class HomePageResolver {

  constructor(
    private readonly downloader: DownloaderService,
    private readonly router: Router,
  ) { }

  public async resolve(route: ActivatedRouteSnapshot): Promise<void> {
    this.downloader.downloadPage(HomePage, null).catch(e => {
      console.error(e);
      this.router.navigate(['/', 'error']);
    });
  }
}
```

And, of course, the resolver must be registered to a route.

```TypeScript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactPageResolver } from './resolvers/home-page-resolver';

const routes: Routes = [
  ...
  {
    path: '',
    component: HomeComponent,
    resolve: {
      _body: HomePageResolver,
    },
  }
  ...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

Finally, we can use the [CmsService](#CmsService) class to retreive the data by simply subscribing to the observable on the `page(...)` method.

```TypeScript
import { Component, OnInit } from '@angular/core';
import { CmsService } from '@wiser/ng-cms-client';
import { HomePage } from '../../models/pages/home-page';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class HomeComponent implements OnInit {

  public page: HomePage;

  constructor(
    private cms: CmsService,
  ) { }

  public ngOnInit(): void {
    this.cms.page(HomePage).subscribe(
      page => this.page = page,
    );
  }

}
```

## Public Exports

### SinglePageRepository

*\<\<interface\>\>* **SinglePageRepository<T, S>**

A subset of `ReadonlyRepository<T, S>` omiting list. Data of type `T` can be accessed by id of type `S`.

Implement this interface with the logic for accessing data and resolving an instantiation of the target model when there exists a single upstream instance of the model.

### MultiPageRepository

*\<\<interface\>\>* **MultiPageRepository<T, S>**

A mirror of `ReadonlyRepository<T, S>`. Data of type `T` can be accessed by id of type `S`.

Implement this interface with the logic for accessing data and resolving an instantiation of the target model when there exists multiple upstream instances of the model.

### CmsPageFilter

*\<\<type\>\>* **CmsPageFilter<T, S>**

A filter to be applied on an instance of type T, where a key of T is provided and value of unknown type must be matched.

### CmsConfig

*\<\<interface\>\>* **CmsConfig**

Provides the registrations required by the CmsModule to match a [SinglePageRepository](#SinglePageRepository) or [MultiPageRepository](#MultiPageRepository) to a data model class.

### CmsModule

*@NgModule* **CmsModule**

Encapsulation of the library. Provides two services: [CmsService](#CmsService) and [DownloaderService](#DownloaderService).

### CmsService

*@Injectable* **CmsModule**

Provides access to CMS state through `Observables` to specific page instantiations resolved by calling [DownloaderService](#DownloaderService). The `page` and `streamPage` methods can take optional [CmsPageFilters](#CmsPageFilter).

### DownloaderService

*@Injectable* **CmsModule**

Exposes two methods: `downloadPage` and `downloadPages`.

The `downloadPage` method is used for downloading a single matching page instance from either the registered [SinglePageRepository](#SinglePageRepository) or possibly from a matching registered [MultiPageRepository](#MultiPageRepository).

The `downloadPages` method will download a set of page partials where the instance matches the registered [MultiPageRepository](#MultiPageRepository).
