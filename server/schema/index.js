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

  input ExprienceInput {
    title: String!
    description: String!
    durationValue: Int!
    durationUnit: String!
  }

  type BankAccount {
    bankName: String!
    accountNumber: String!
  }

  input BankAccountInput {
    bankName: String!
    accountNumber: String!
  }

  type Employmentifno {
    employmentStatus: EmploymentStatus
    tinNumber: String
    jobType: JobType
    salary: Salary
  }

  input EmploymentifnoInput {
    employmentStatus: String!
    tinNumber: String!
    jobType: String!
    salary: SalaryInput!
  }

  type Salary {
    amount: Int
    currency: String
    type: SalaryType
  }

  input SalaryInput {
    amount: Int!
    currency: String!
    type: String!
  }

  type Address {
    country: String
    city: String
    subCity: String
    woreda: String
    kebele: String
    houseNumber: String
  }

  input AddressInput {
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

  input EducationInput {
    level: String!
    name: String!
    type: String!
    completedAt: String!
  }

  type Languages {
    language: Language!
    level: Level!
  }

  input LanguagesInput {
    language: String!
    level: String!
  }

  type LanguagePair {
    sourceLanguage: Language!
    targetLanguage: Language!
    level: Level!
  }

  input LanguagePairInput {
    sourceLanguage: String!
    targetLanguage: String!
    level: String!
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

  input BasicInfoInput {
    gender: String!
    emergencyContact: EmergencyContactInput
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

  input EmergencyContactInput {
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

  input UserInput {
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

  input UserProfileInput {
    user: UserInput
    basicInfo: BasicInfoInput
    exprience: [ExprienceInput!]
    education: [EducationInput!]
    languagePair: [LanguagePairInput!]
    languages: [LanguagesInput!]
    bankAccount: BankAccountInput
    address: AddressInput
    employmentifno: EmploymentifnoInput
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

  input TeamInput {
    user: UserInput
    role: String
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

  input TaskInput {
    name: String
    description: String
    startDate: String
    deadLine: String
    status: String
    budget: Int
    documents: [String!]
    team: [TeamInput]
    projectId: String
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

  input ProjectInput {
    name: String
    description: String
    startDate: String
    deadLine: String
    status: String
    budget: Int
    client: String
    projectManagers: [UserInput!]
    payment: String
  }

  type Payment {
    paymentStatus: PaymentStatus
    paymentAmount: Int
    paymentDate: String
    paymentMethod: PaymentMethod
  }

  type Profile {
    success: Boolean!
    email: String
    phoneNumber: String
    userProfile: UserProfile
  }

  type ProjectReturn {
    success: Boolean!
    project: Project
  }

  type ProjectsReturn {
    success: Boolean!
    projects: [Project!]
  }

  type TaskReturn {
    success: Boolean!
    task: Task
  }

  type TasksReturn {
    success: Boolean!
    count: Int!
    tasks: [Task!]
  }

  type Query {
    getProfile: Profile!
    fullProfile(userProfileData: UserProfileInput!): UserProfile!
    getProject(id: ID!): ProjectReturn
    getAllProject(name: String!, status: String!): ProjectsReturn
    getTask(id: ID!): TaskReturn
    getAllTask(name: String!, project: ProjectInput!): TasksReturn
  }

  type RegisterReturn {
    success: Boolean!
    user: User
    message: String!
  }

  type VerifyReturn {
    success: Boolean!
    message: String!
  }

  type TokenReturn {
    success: Boolean!
    message: String!
    token: String!
  }

  type Mutation {
    register(email: String!, password: String!, phoneNumber: String!): RegisterReturn!
    verifyEmail: VerifyReturn!
    login(identifier: String!, password: String!): TokenReturn!
    logout: String!
    forgotPassword(email: String!): VerifyReturn!
    VerifyReturn(email: String!, code: String!, newPassword: String!): VerifyReturn!
    setProfile(userData: UserInput!): User!
    createProject(newProject: ProjectInput!): ProjectReturn!
    createTask(newTask: TaskInput!): TaskReturn!
  }

`

export default typeDefs