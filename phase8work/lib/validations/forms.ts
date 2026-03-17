import { z } from 'zod';

const nonEmptyString = (message: string) => z.string().trim().min(1, message);

export const newsletterSchema = z.object({
  firstName: nonEmptyString('First name is required'),
  lastName: nonEmptyString('Last name is required'),
  email: z.email('Enter a valid email address'),
  graduationYear: z.string().trim().optional(),
  subscriberType: nonEmptyString('Please choose a subscriber type'),
  consent: z.boolean().refine((value) => value, 'You must consent to receive emails')
});

export const contactSchema = z.object({
  name: nonEmptyString('Name is required'),
  email: z.email('Enter a valid email address'),
  topic: nonEmptyString('Please choose a topic'),
  message: nonEmptyString('Message is required').min(10, 'Message should be at least 10 characters')
});

export const mentorSchema = z.object({
  name: nonEmptyString('Name is required'),
  graduationYear: nonEmptyString('Graduation year is required'),
  companyTitle: nonEmptyString('Company and title are required'),
  industry: nonEmptyString('Industry is required'),
  mentoringAreas: nonEmptyString('Please describe mentoring areas'),
  availability: nonEmptyString('Availability is required'),
  email: z.email('Enter a valid email address')
});

export const menteeSchema = z.object({
  name: nonEmptyString('Name is required'),
  classYear: nonEmptyString('Class year is required'),
  careerInterests: nonEmptyString('Career interests are required'),
  goals: nonEmptyString('Please share your goals'),
  linkedInOrResume: z.string().trim().optional(),
  preferredBackground: z.string().trim().optional(),
  email: z.email('Enter a valid email address')
});

export const rsvpSchema = z.object({
  fullName: nonEmptyString('Name is required'),
  email: z.email('Enter a valid email address'),
  graduationYear: z.string().trim().optional(),
  guestCount: z.coerce.number().int().min(0).max(10),
  notes: z.string().trim().optional(),
  eventSlug: nonEmptyString('Event is required')
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type MentorInput = z.infer<typeof mentorSchema>;
export type MenteeInput = z.infer<typeof menteeSchema>;
export type RSVPInput = z.infer<typeof rsvpSchema>;
