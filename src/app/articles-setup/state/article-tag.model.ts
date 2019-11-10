import { ID } from '@datorama/akita';

export interface ArticleTag {
  id: ID;
  name: string;
}

export function createArticleTag(params: Partial<ArticleTag>) {
  return {

  } as ArticleTag;
}
