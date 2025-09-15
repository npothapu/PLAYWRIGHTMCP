export interface PetitionTestCase {
  description: string;
  fields: {
    firstName: string;
    lastName: string;
    email: string;
    zipCode: string;
    updatesOptIn?: boolean;
  };
  expectSuccess?: boolean;
  expectDuplicate?: boolean;
  expectErrors?: string[];
}

export const petitionTestCases: PetitionTestCase[] = [
  {
    description: 'All fields empty',
    fields: {
      firstName: '',
      lastName: '',
      email: '',
      zipCode: '',
      updatesOptIn: false,
    },
    expectSuccess: false,
    expectErrors: ['Please fill out the form.'],
  },
  {
    description: 'Valid submission',
    fields: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      zipCode: '60601',
      updatesOptIn: true,
    },
    expectSuccess: true,
  },
  {
    description: 'Duplicate submission',
    fields: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      zipCode: '60601',
      updatesOptIn: true,
    },
    expectDuplicate: true,
  },
  {
    description: 'Invalid email',
    fields: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'invalid-email',
      zipCode: '60601',
      updatesOptIn: false,
    },
    expectSuccess: false,
    expectErrors: ['Please fill out the form.'],
  },
  {
    description: 'Invalid zip code',
    fields: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      zipCode: 'abcde',
      updatesOptIn: false,
    },
    expectSuccess: false,
    expectErrors: ['Please fill out the form.'],
  },
  {
    description: 'Missing first name',
    fields: {
      firstName: '',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      zipCode: '60601',
      updatesOptIn: false,
    },
    expectSuccess: false,
    expectErrors: ['Please fill out the form.'],
  },
  {
    description: 'Missing last name',
    fields: {
      firstName: 'Jane',
      lastName: '',
      email: 'jane.smith@example.com',
      zipCode: '60601',
      updatesOptIn: false,
    },
    expectSuccess: false,
    expectErrors: ['Please fill out the form.'],
  },
];
