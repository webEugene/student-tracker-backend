import { Teacher } from './teachers.model';

export const teachersProviders = [
  {
    provide: 'TEACHER_REPOSITORY',
    useValue: Teacher,
  },
];
