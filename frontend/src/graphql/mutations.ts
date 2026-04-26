import { gql } from '@apollo/client';

export const CREATE_RELEASE = gql`
  mutation CreateRelease($name: String!, $date: String!, $additionalInfo: String) {
    createRelease(name: $name, date: $date, additionalInfo: $additionalInfo) {
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

export const UPDATE_STEPS = gql`
  mutation UpdateSteps($id: ID!, $steps: [Boolean!]!) {
    updateSteps(id: $id, steps: $steps) {
      id
      status
      steps
      updatedAt
    }
  }
`;

export const UPDATE_ADDITIONAL_INFO = gql`
  mutation UpdateAdditionalInfo($id: ID!, $additionalInfo: String!) {
    updateAdditionalInfo(id: $id, additionalInfo: $additionalInfo) {
      id
      additionalInfo
      updatedAt
    }
  }
`;

export const DELETE_RELEASE = gql`
  mutation DeleteRelease($id: ID!) {
    deleteRelease(id: $id)
  }
`;
