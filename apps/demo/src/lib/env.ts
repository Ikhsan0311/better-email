function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export const env = {
  get NUNTLY_API_KEY() {
    return required('NUNTLY_API_KEY');
  },
  get EMAIL_FROM() {
    return required('EMAIL_FROM');
  },
  get BETTER_AUTH_SECRET() {
    return required('BETTER_AUTH_SECRET');
  },
  get BETTER_AUTH_URL() {
    return required('BETTER_AUTH_URL');
  },
  get ENABLE_MAGIC_LINK() {
    return process.env.ENABLE_MAGIC_LINK === 'true';
  },
  get ENABLE_EMAIL_OTP() {
    return process.env.ENABLE_EMAIL_OTP === 'true';
  },
};
