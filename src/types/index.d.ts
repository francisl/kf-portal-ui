type SqonFilters = {
  op: string;
  content: { field: string; value: string[] };
};

export type Sqon = {
  op: string;
  content: SqonFilters[];
};

export type LoggedInUser = {
  _id: string;
  roles: Array<string>;
  egoId: string;
  email: string;
  acceptedDatasetSubscriptionKfOptIn: boolean;
  acceptedKfOptIn: boolean;
  acceptedNihOptIn: boolean;
  acceptedTerms: boolean;
  addressLine1?: string;
  addressLine2?: string;
  bio?: string;
  city?: string;
  country?: string;
  department?: string;
  eraCommonsID?: string;
  facebook?: string;
  firstName?: string;
  github?: string;
  googleScholarId?: string;
  hashedEmail?: string;
  institution?: string;
  institutionalEmail?: string;
  interests?: Array<string>;
  isActive?: boolean;
  isPublic?: boolean;
  jobTitle?: string;
  lastName?: string;
  linkedin?: string;
  orchid?: string;
  phone?: string;
  sets?: Array<string>;
  state?: string;
  story?: string;
  title?: string;
  twitter?: string;
  website?: string;
  zip?: string;
};
