import { Injector, Injectable, Inject } from '@angular/core';
import {
  PageDownloader,
  SinglePageRepositoryRegistration,
  MultiPageRepositoryRegistration,
} from '@wiser/cms-pattern';

@Injectable()
export class DownloaderService extends PageDownloader<object, unknown> {

  protected readonly registrations = [];

  constructor(
    @Inject('registrations')
    protected readonly reg: {
      singlepage: SinglePageRepositoryRegistration<any, any>[],
      multipage: MultiPageRepositoryRegistration<any, any>[],
    },
    private readonly injector: Injector,
  ) {
    super();
    this.factory = (x) => this.injector.get(x);
    this.registrations.push(
      ...this.reg.singlepage.map(
        registration => new SinglePageRepositoryRegistration<unknown, unknown>(
          registration.Data, registration.Repository,
        ),
      ),
      ...this.reg.multipage.map(
        registration => new MultiPageRepositoryRegistration<unknown, unknown>(
          registration.Data, registration.Repository,
        ),
      ),
    );
  }
}
