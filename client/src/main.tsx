
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import { StoreProvider } from './store';
import { ApolloClient, InMemoryCache, from, HttpLink, } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { onError } from '@apollo/client/link/error';


const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

export const client = new ApolloClient({
  link: from([errorLink, new HttpLink({ uri: '/graphql' })]),
  cache: new InMemoryCache(),
  credentials: 'include'
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App /> ,
    errorElement: <h1 className="display-2">Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <SearchBooks /> 
      }, {
        path: '/saved',
        element: <SavedBooks /> 
      }
    ],
  }
], {
  future: {
    // Router optional flags to get rid of future update warnings
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(

  <ApolloProvider client={client}>
    <StoreProvider>
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
        }}
      />
    </StoreProvider>
  </ApolloProvider>

);
