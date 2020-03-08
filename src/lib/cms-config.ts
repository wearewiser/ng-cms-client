import {
  SinglePageRepositoryRegistration,
  MultiPageRepositoryRegistration,
} from '@wiser/cms-pattern';

export interface CmsConfig {
  singlepage: SinglePageRepositoryRegistration<unknown, unknown>[];
  multipage: MultiPageRepositoryRegistration<unknown, unknown>[];
}
