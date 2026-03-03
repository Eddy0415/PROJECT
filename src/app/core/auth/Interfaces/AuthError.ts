export interface IAuthError {
  // backend error payload (swagger)
  message: string; // main error message
  errors?: string[]; // optional list of validation errors
  error?: string; // optional backend error string
} // end interface
