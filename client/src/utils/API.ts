import axios from 'axios';

// Make a search to the Google Books API
// Example: https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = async (query: string) => {
  try {
    return await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
  } catch (error) {
    // Return dummy data if Google Books rate limit is exceeded
    return {
      data: {
        items: [
          {
            id: 'asdfasdflkj',
            volumeInfo: {
              authors: ['Michael Crichton'],
              title: 'Jurassic Park',
              description: 'Amazing story of dinosaurs being resurrected from the past',
              imageLinks: {
                thumbnail: 'https://wallpaperdelight.com/wp-content/uploads/2023/06/dinosaur-thumbnail.webp',
              },
            },
          },
          {
            id: 'oqoieuroqwiure',
            volumeInfo: {
              authors: ['Michael Crichton'],
              title: 'Jurassic Park 2',
              description: 'Amazing story of dinosaurs being resurrected from the past again',
              imageLinks: {
                thumbnail: 'https://wallpaperdelight.com/wp-content/uploads/2023/06/dinosaur-thumbnail.webp',
              },
            },
          },
        ],
      },
    };
  }
};
