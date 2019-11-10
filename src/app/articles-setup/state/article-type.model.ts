import { ID } from '@datorama/akita';

export interface ArticleType {
  id: ID;
  name: string;
  defaultTags: ID[];
  articleFields: ID[];
}

export function createArticleType(params: Partial<ArticleType>) {
  return {

  } as ArticleType;
}
