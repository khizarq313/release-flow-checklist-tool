import { gql } from '@apollo/client';

export const GET_RELEASES = gql`
  query GetReleases {
    releases {
      id
      name
      date
      status
      steps
    }
  }
`;

export const GET_RELEASE_DETAIL = gql`
  query GetReleaseDetail($id: ID!) {
    release(id: $id) {
      id
      name
      date
      status
      additionalInfo
      steps
      createdAt
      updatedAt
    }
  }
`;
