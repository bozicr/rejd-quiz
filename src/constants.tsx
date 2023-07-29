import { QuizTableColumnNames } from './types/ComponentTypes';

export const QUIZ_TABLE_COLUMN_NAMES: QuizTableColumnNames[] = [
  {
    name: 'Id',
    sortable: true,
  },
  {
    name: 'Name',
    sortable: true,
  },
  {
    name: 'Actions',
    sortable: false,
  },
];

export const NUMBER_OF_ITEMS_PER_PAGE_ARRAY: number[] = [5, 10, 15, 20];

export const BASE_URL = 'http://localhost:4000/';
