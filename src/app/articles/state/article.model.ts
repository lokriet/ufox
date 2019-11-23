export interface Article {
  id: string;
  type: string;
  name: string;
  text: string;
  additionalFieldValues: string[];
  tags: string[];
}

export function createArticle(params: Partial<Article>) {
  return {

  } as Article;
}
