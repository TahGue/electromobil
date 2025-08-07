import * as z from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Namn måste vara minst 2 tecken.'),
  email: z.string().email('Ogiltig e-postadress.'),
  subject: z.string().min(5, 'Ämne måste vara minst 5 tecken.'),
  message: z.string().min(10, 'Meddelande måste vara minst 10 tecken.')
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;