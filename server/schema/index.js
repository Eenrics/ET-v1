const typeDefs = `

  enum DurationUnit {
    months
    years
    none
  }

  enum Role {
    projectManager
    translator
  }

  enum Status {
    not_started
    in_progress
    completed
    failed
    paused
    canceled
  }

  enum Language {
    amharic
    english
    arabic
    tigrigna
    other
  }

  enum Level {
    none
    beginner
    intermediate
    advanced
    fluent
  }

  enum EmploymentStatus {
    employed
    unemployed
  }

  enum JobType {
    full_time
    part_time
    freelance
    contract
    other
  }

  enum SalaryType {
    per_month
    per_job
    per_contract
    per_word
  }

  enum EducationLevel {
    none
    highschool
    certificate
    diploma
    degree
    masters
    phd
  }

  enum Gender {
    male
    female
  }

  enum PaymentStatus {
    not_paid
    completed
  }

  enum PaymentMethod {
    cash
    check
    credit_card
    debit_card
    paypal
    bank_transfer
  }

  type Exprience {
    title: String!
    description: String!
    durationValue: Int!
    durationUnit: DurationUnit!
  }

  type BankAccount {
    bankName: String!
    accountNumber: String!
  }

  type Employmentifno {
    employmentStatus: EmploymentStatus
    tinNumber: String
    jobType: JobType
    salary: Salary
  }

  type Salary {
    amount: Int
    currency: String
    type: SalaryType
  }

  type Address {
    country: String
    city: String
    subCity: String
    woreda: String
    kebele: String
    houseNumber: String
  }

  type Education {
    level: EducationLevel!
    name: String!
    type: String!
    completedAt: String!
  }

  type Languages {
    language: Language!
    level: Level!
  }

  type LanguagePair {
    sourceLanguage: Language!
    targetLanguage: Language!
    level: Level!
  }

  type BasicInfo {
    gender: Gender!
    emergencyContact: EmergencyContact
    basicAssessmentExam: Boolean
    bio: String
    birthDate: String
    cv: String
    resume: String
    profilePicture: String
  }

  type EmergencyContact {
    name: String
    phoneNumber: String
  }

  type User {
    firstName: String!
    fatherName: String!
    grandFatherName: String
    email: String!
    password: String!
    resetPasswordCode: String
    resetPasswordCodeExpiration: String
    phoneNumber: String
    isEmailVerified: Boolean
    verificationToken: String
    verificationTokenExpiration: String
    role: Int
    userProfile: UserProfile
  }

  type UserProfile {
    user: User
    basicInfo: BasicInfo
    exprience: [Exprience!]
    education: [Education!]
    languagePair: [LanguagePair!]
    languages: [Languages!]
    bankAccount: BankAccount
    address: Address
    employmentifno: Employmentifno
  }

  type Base {
    name: String
    description: String
    startDate: String
    deadLine: String
    status: Status
    budget: Int
  }

  type Team {
    user: User
    role: Role
  }

  type Task {
    name: String
    description: String
    startDate: String
    deadLine: String
    status: String
    budget: Int
    documents: [String!]
    team: [Team]
    project: Project
  }

  type Project {
    name: String
    description: String
    startDate: String
    deadLine: String
    status: String
    budget: Int
    client: String
    tasks: [Task!]
    projectManagers: [User!]
    payment: Payment
  }

  type Payment {
    paymentStatus: PaymentStatus
    paymentAmount: Int
    paymentDate: String
    paymentMethod: PaymentMethod
  }

`

export default typeDefs