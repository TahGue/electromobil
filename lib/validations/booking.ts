import * as z from 'zod';

export const bookingFormSchema = z.object({
  name: z.string().min(1, 'Namn är obligatoriskt.'),
  email: z.string().email('En giltig e-postadress är obligatorisk.'),
  phone: z.string().min(1, 'Ett giltigt telefonnummer är obligatoriskt.'),
  serviceId: z.string().min(1, 'Vänligen välj en tjänst.'),
  appointmentDate: z.date({
    required_error: 'Ett bokningsdatum är obligatoriskt.',
  }),
  notes: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;