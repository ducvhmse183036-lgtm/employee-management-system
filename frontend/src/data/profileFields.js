const field = (name, label, type = 'text', extra = {}) => ({
  name,
  label,
  type,
  ...extra,
})
const status = field('status', 'Status', 'text', {
  required: true,
  help: 'For example: ACTIVE, INACTIVE, or EXPIRED.',
})
const notes = field('notes', 'Notes', 'textarea', { wide: true })
export const profileSections = {
  'personal-info': {
    title: 'Personal Info',
    singular: 'Personal Info',
    single: true,
    fields: [
      field('dateOfBirth', 'Date of birth', 'date'),
      field('placeOfBirth', 'Place of birth'),
      field('nationality', 'Nationality'),
      field('maritalStatus', 'Marital status', 'text', {
        help: 'For example: SINGLE or MARRIED.',
      }),
      field('phoneNumber', 'Phone number', 'tel'),
      field('email', 'Email', 'email'),
      field('permanentAddress', 'Permanent address', 'textarea', {
        wide: true,
      }),
      field('currentAddress', 'Current address', 'textarea', { wide: true }),
    ],
  },
  'labor-contracts': {
    title: 'Labor Contract',
    singular: 'Contract',
    fields: [
      field('contractNumber', 'Contract number', 'text', { required: true }),
      field('contractType', 'Contract type', 'text', {
        required: true,
        help: 'For example: FIXED_TERM or INDEFINITE.',
      }),
      field('signedDate', 'Signed date', 'date'),
      field('startDate', 'Start date', 'date', { required: true }),
      field('endDate', 'End date', 'date'),
      field('basicSalary', 'Basic salary', 'number'),
      status,
      notes,
    ],
  },
  'family-members': {
    title: 'Family Info',
    singular: 'Family member',
    fields: [
      field('fullName', 'Full name', 'text', { required: true }),
      field('relationship', 'Relationship', 'text', {
        required: true,
        help: 'For example: SPOUSE, CHILD, or PARENT.',
      }),
      field('dateOfBirth', 'Date of birth', 'date'),
      field('gender', 'Gender', 'select', {
        options: ['MALE', 'FEMALE', 'OTHER'],
      }),
      field('phoneNumber', 'Phone number', 'tel'),
      field('occupation', 'Occupation'),
      field('dependent', 'Dependent', 'checkbox'),
      notes,
    ],
  },
  allowances: {
    title: 'Allowances',
    singular: 'Allowance',
    fields: [
      field('allowanceType', 'Allowance type', 'text', {
        required: true,
        help: 'For example: TRANSPORT, MEAL, or HOUSING.',
      }),
      field('amount', 'Amount', 'number', { required: true }),
      field('effectiveFrom', 'Effective from', 'date', { required: true }),
      field('effectiveTo', 'Effective to', 'date'),
      status,
      notes,
    ],
  },
}
