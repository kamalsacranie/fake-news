import { Article } from "../../models/articles";
import { SeedComment } from "../data/development-data/comments";

export const convertTimestampToDate = ({
  created_at,
  ...otherProperties
}: Partial<SeedComment>) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

export const createRef = (
  arr: any[],
  // this is temporary i didn't want to modify any functionality while convertint to ts
  key: "title" | "name" = "title",
  value: "article_id" | "title" = "article_id"
) => {
  return arr.reduce(
    (ref: { [key: string]: Article["article_id"] }, element) => {
      ref[element[key]] = element[value];
      return ref;
    },
    {}
  );
};

// this needs lots of fucking work
export const formatComments = (
  comments: Partial<SeedComment>[],
  idLookup: { [key: string]: Article["article_id"] }
) => {
  return comments.map(({ author, article_id, ...restOfComment }) => {
    // const article_id = idLookup[belongs_to];
    return {
      article_id,
      author, //: created_by,
      // ...this.convertTimestampToDate(restOfComment),
      ...convertTimestampToDate(restOfComment),
    } as SeedComment;
  });
};
