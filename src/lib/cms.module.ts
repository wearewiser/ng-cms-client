import { NgModule, ModuleWithProviders } from '@angular/core';
import { DownloaderService } from './downloader.service';
import { CmsService } from './cms.service';

@NgModule({
  declarations: [],
  imports: [
  ],
  exports: []
})
export class CmsModule {
  static forRoot(
    registrations: any,
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
