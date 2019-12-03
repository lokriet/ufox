export interface Article {
  id: string;
  typeId: string;
  name: string;
  text: string;
  additionalFieldValueIds: string[];
  tagIds: string[];
  imageUrl: string;
  sectionId: string;
  isSectionHeader: boolean;
}

export function createArticle(params: Partial<Article>) {
  return {

  } as Article;
}
