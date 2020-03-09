import { NgModule, ModuleWithProviders } from '@angular/core';
import { DownloaderService } from './downloader.service';
import { CmsService } from './cms.service';
import { CmsConfig } from './cms-config';

@NgModule({
  declarations: [],
  imports: [
  ],
  exports: []
})
export class CmsModule {
  static forRoot(
    registrations: CmsConfig,
  ): ModuleWithProviders {
    return {
      ngModule: CmsModule,
      providers: [
        CmsService,
        DownloaderService,
        {
          provide: 'registrations',
          useValue: registrations,
        },
      ]
    };
  }
}
