import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

const mockServices = [
  {
    name: 'Skärmsbyte',
    description: 'Högkvalitativ skärmsbyte för alla huvudsmartphone-märken. Snabb och pålitlig service.',
    price: 89.99,
    category: 'Screen Repair',
  },
  {
    name: 'Batterireparation',
    description: 'Förläng din telefonens liv med ett nytt batteri. Originaldelar garanteras.',
    price: 59.99,
    category: 'Battery',
  },
  {
    name: 'Laddningsportreparation',
    description: 'Fixa problem med laddning eller anslutning av din enhet. Vi rengör eller ersätter defekta portar.',
    price: 49.99,
    category: 'Component Repair',
  },
  {
    name: 'Vattenskadereparation',
    description: 'Kompletta diagnostik och reparation för vattenskadade enheter. Framgång är inte garanterad men vi gör vårt bästa!',
    price: 129.99,
    category: 'Diagnostics',
  },
  {
    name: 'Programvarufelhantering',
    description: 'Lös programvarufel, ta bort virus och optimera din telefonens prestanda.',
    price: 39.99,
    category: 'Software',
  },
  {
    name: 'Kamerareparation',
    description: 'Reparera eller ersätt frontal- och bakre kameror för att få dig tillbaka till att ta kristallklara bilder.',
    price: 79.99,
    category: 'Component Repair',
  },
];

export default function ServicesPage() {
  return (
    <div className="container py-12">
      <div className="text-center">
<h1 className="text-4xl font-bold tracking-tight">Våra Tjänster</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
  Vi erbjuder en bred serie av professionella reparationstjänster för din mobilenheter.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {mockServices.map((service) => (
          <Card key={service.name}>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{service.category}</p>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{service.description}</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(service.price)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
