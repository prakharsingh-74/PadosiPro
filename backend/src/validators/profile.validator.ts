import { z } from 'zod';

// Indian Mobile Number Validator (+91 followed by 10 digits starting with 6-9, or 10 digits starting with 6-9)
const indianMobileRegex = /^(?:\+91)?[6-9]\d{9}$/;

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  mobile_number: z.string().refine(
    (val) => indianMobileRegex.test(val.replace(/\s+/g, '')),
    { message: 'Mobile number must be a valid 10-digit Indian phone number (e.g. +91 9876543210 or 9876543210)' }
  ),
  address: z.string().min(5, 'Address must be at least 5 characters long'),
  business_name: z.string().optional()
});
