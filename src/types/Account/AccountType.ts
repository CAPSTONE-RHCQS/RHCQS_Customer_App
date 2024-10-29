export interface Profile {
    Id: string
    Email: string
    Username: string
    ImageUrl: string
    PhoneNumber: string
    DateOfBirth: any
  }

  export interface UpdateProfile {
    username: string
    imageUrl: string
    email: string
    phoneNumber: string
    dateOfBirth: string
  }
  
  