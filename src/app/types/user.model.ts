import { Post } from "./post.model";

export interface User {
  id: number;
  name: string;
  email: string;
  website: string;
  phone: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  posts: Post[];
}