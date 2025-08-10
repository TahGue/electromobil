'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { contactFormSchema, ContactFormValues } from '@/lib/validations/contact';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/components/contact/map'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-muted-foreground">Laddar karta...</div>
});
import { BusinessInfo } from '@prisma/client';

interface ContactPageClientProps {
  info: BusinessInfo;
  coordinates: { lat: number; lng: number } | null;
}

export function ContactPageClient({ info, coordinates }: ContactPageClientProps) {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const center = coordinates || {
    lat: 59.3293, // Stockholm as a fallback
    lng: 18.0686,
  };

  const onSubmit = async (data: ContactFormValues) => {
    // Here you would typically send the form data to your API
    console.log(data);
    toast({
      title: 'Meddelande skickat!',
      description: 'Tack för att du kontaktade oss. Vi återkommer till dig snart.',
    });
    form.reset();
  };

  return (
    <div className="container py-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Kontakta oss</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Har du en fråga eller behöver kontakta oss? Fyll i formuläret nedan.
        </p>
      </div>

      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold">Kontakta oss</h3>
            <p className="mt-2 text-muted-foreground">
              Vårt team är här för att hjälpa med alla frågor du kan ha.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-primary" />
              <span>{info.email}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="h-6 w-6 text-primary" />
              <span>{info.phone}</span>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="h-6 w-6 text-primary" />
              <span>{info.address}</span>
            </div>
          </div>
          <div className="h-64 bg-muted rounded-lg overflow-hidden">
            <Map lat={center.lat} lng={center.lng} popupText={info.name} />
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namn</FormLabel>
                  <FormControl>
                    <Input placeholder="Ditt namn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input placeholder="ditt.e-post@exempel.se" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ämne</FormLabel>
                  <FormControl>
                    <Input placeholder="Fråga om..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meddelande</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ditt meddelande..."
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Skicka meddelande
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
