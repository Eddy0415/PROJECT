export interface IEditResp {
  // PATCH /user response (no token)                                  // why: swagger returns user only
  id: number; // user id                                                                          // why: backend field
  email: string; // email                                                                          // why: backend field
  firstName: string; // first name                                                                 // why: backend field
  lastName: string; // last name                                                                   // why: backend field
  username: string; // username                                                                    // why: backend field
  dateOfBirth: Date; // dob                                                                        // why: backend field (may arrive as string)
  imageUrl: string; // profile image                                                               // why: backend field
  role: string; // role                                                                            // why: backend field (frontend may ignore)
  createdAt: Date; // created                                                                      // why: backend field
  updatedAt: Date; // updated                                                                      // why: backend field
}
