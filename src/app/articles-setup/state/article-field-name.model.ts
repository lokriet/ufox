import { ID } from '@datorama/akita';

export interface ArticleFieldName {
  id: ID;
  orderNo: number;
  name: string;
}

export function createArticleFieldName(params: Partial<ArticleFieldName>) {
  return {

  } as ArticleFieldName;
}
