import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App.tsx'
import './index.css'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';

const client = new ApolloClient({
  uri: apiUrl,
  connectToDevTools: import.meta.env.DEV,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          releases: {
            merge(_existing, incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)
