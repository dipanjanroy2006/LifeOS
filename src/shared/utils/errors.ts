// Error Parsing Utilities

export const parseAuthError = (err: any): string => {
  if (!err) return 'Authentication failed.';
  if (typeof err === 'string') return err;
  
  // Supabase Auth errors sometimes return empty stringified object '{}' in message
  const msg = err.message || err.error_description;
  if (msg && msg !== '{}') {
    return msg;
  }
  
  // If the error message is empty or '{}', it usually indicates a database trigger failure.
  // E.g., the profiles table is missing the 'email' column, causing on_auth_user_created to crash.
  return 'Database operation failed. Please verify that the "profiles" table has the "email" column added.';
};
