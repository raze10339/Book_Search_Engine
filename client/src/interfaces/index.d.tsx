export interface Book {
  googleBookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

export interface User {
  _id?: string;
  username?: string;
  email?: string;
  password?: string;
  savedBooks: Book[]
}

export interface FormData {
  username: string;
  email: string;
  password: string;
  errorMessage: string;
}

export interface GoogleAPIVolumeInfo {
  title: string;
  authors: string[];
  description: string;
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
}

export interface GoogleAPIBook {
  id: string;
  volumeInfo: GoogleAPIVolumeInfo;
}

