import { z } from "zod";

const currentYear = new Date().getFullYear();

export const mentorshipOpportunitySchema = z.object({
  title: z.string().trim().min(3).max(120),
  opportunityType: z.enum([
    "mentorship",
    "internship",
    "coffee_chat",
    "job_shadow",
    "project",
    "career_advice",
  ]),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  locationType: z
    .enum(["remote", "hybrid", "in_person"])
    .optional()
    .or(z.literal("")),
  industry: z.string().trim().max(120).optional().or(z.literal("")),
  description: z.string().trim().min(20).max(5000),
  responsibilities: z.string().trim().max(5000).optional().or(z.literal("")),
  requirements: z.string().trim().max(5000).optional().or(z.literal("")),
  preferredMajor: z.string().trim().max(120).optional().or(z.literal("")),
  preferredYears: z.string().trim().max(120).optional().or(z.literal("")),
  preferredSkills: z.string().trim().max(1000).optional().or(z.literal("")),
  applicationInstructions: z.string().trim().max(2000).optional().or(z.literal("")),
  contactMethod: z.string().trim().max(80).optional().or(z.literal("")),
  isPaid: z.boolean().default(false),
  compensation: z.string().trim().max(120).optional().or(z.literal("")),
  isPublic: z.boolean().default(true),
  expiresAt: z.string().optional().or(z.literal("")),
});

export const mentorshipOpportunityApplicationSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  bondNumber: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  graduationYear: z.coerce.number().int().min(2000).max(currentYear + 10),
  major: z.string().trim().min(1).max(120),
  linkedinUrl: z.string().trim().url().max(250).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(3000),
  whyInterested: z.string().trim().min(10).max(3000),
  experienceSummary: z.string().trim().max(3000).optional().or(z.literal("")),
  preferredContactMethod: z.string().trim().max(80).optional().or(z.literal("")),
});

export type MentorshipOpportunityInput = z.infer<typeof mentorshipOpportunitySchema>;
export type MentorshipOpportunityApplicationInput = z.infer<
  typeof mentorshipOpportunityApplicationSchema
>;

export function slugifyOpportunityTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}