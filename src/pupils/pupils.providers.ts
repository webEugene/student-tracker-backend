import { Pupil } from './pupils.model';

export const pupilsProviders = [
  {
    provide: 'PUPIL_REPOSITORY',
    useValue: Pupil,
  },
];
