export interface Post {
  id: string;
  title: string;
  content: string;
  image?: File;
  imagePath: string;
}

export interface PostDto {
  _id: string;
  title: string;
  content: string;
  imagePath: string;
}

export interface QueryParams {
  postsPerPage: number;
  currentPage: number;
}
