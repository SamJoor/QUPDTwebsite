import { z } from 'zod';

const nonEmpty = (message: string) => z.string().trim().min(1, message);

export const memberClaimSchema = z.object({
  fullName: nonEmpty('Full name is required'),
  graduationYear: z.coerce.number().int().min(1900).max(2100),
  email: z.email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const memberProfileSchema = z.object({
  fullName: nonEmpty('Full name is required'),
  graduationYear: z.coerce.number().int().min(1900).max(2100),
  major: nonEmpty('Major is required'),
  company: nonEmpty('Company is required'),
  jobTitle: nonEmpty('Job title is required'),
  industry: nonEmpty('Industry is required'),
  location: nonEmpty('Location is required'),
  shortBio: z.string().trim().min(20, 'Bio should be at least 20 characters'),
  linkedinUrl: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  willingToMentor: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  emailVisibility: z.enum(['private', 'members', 'public']).default('members'),
  phoneVisibility: z.enum(['private', 'members', 'public']).default('private'),
  linkedinVisibility: z.enum(['private', 'members', 'public']).default('public')
});

export type MemberClaimInput = z.infer<typeof memberClaimSchema>;
export type MemberProfileInput = z.infer<typeof memberProfileSchema>;
