export interface ArticleType {
  id: string;
  name: string;
  defaultTags: string[];
  articleFields: string[];
}

export function createArticleType(params: Partial<ArticleType>) {
  return {

  } as ArticleType;
}
