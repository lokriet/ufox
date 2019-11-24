export interface Article {
  id: string;
  type: string;
  name: string;
  text: string;
  additionalFieldValueIds: string[];
  tagIds: string[];
}

export function createArticle(params: Partial<Article>) {
  return {

  } as Article;
}
