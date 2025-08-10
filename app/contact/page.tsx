import { getBusinessInfo } from '@/lib/data/business-info';
import { ContactPageClient } from '@/components/contact/contact-page-client';
import { geocodeAddress } from '@/lib/actions/geocode';

export default async function ContactPage() {
  const businessInfo = await getBusinessInfo();

  if (!businessInfo) {
    return <div>Laddar företagsinformation...</div>;
  }

  // Geocode the address to get coordinates
  const coordinates = await geocodeAddress(businessInfo.address);

  return <ContactPageClient info={businessInfo} coordinates={coordinates} />;
}


