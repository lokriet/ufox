export interface ArticleType {
  id: string;
  sortingOrder: number;
  name: string;
  defaultTagIds: string[];
  articleFieldNameIds: string[];
}

export function createArticleType(params: Partial<ArticleType>) {
  return {

  } as ArticleType;
}
