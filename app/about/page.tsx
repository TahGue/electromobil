import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, ShieldCheck } from 'lucide-react';

const mockBusinessInfo = {
  name: 'Electromobil',
  founded: 2023,
    mission: 'Att erbjuda pålitliga, prisvärda och högkvalitativa mobilreparations tjänster till vår gemenskap.',
  values: [
      'Kundnöjdhet',
      'Ärlighet och Integritet',
      'Kvalitetsarbete',
      'Kontinuerlig förbättring',
  ],
};

export default function AboutPage() {
  const currentYear = new Date().getFullYear();
  const yearsInService = currentYear - mockBusinessInfo.founded;

  return (
    <div className="container py-12">
      <div className="text-center">
  Om {mockBusinessInfo.name}
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
  Lär dig mer om vårt företag, vår mission och de värden som driver oss.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
  Vår historia
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
  Startade år {mockBusinessInfo.founded}, {mockBusinessInfo.name} växte fram ur en passion för teknologi och en önskan att hjälpa folk att hålla sig anslutna.
            </p>
            <p>
              Our team of certified technicians has the expertise to handle everything from simple screen replacements to complex motherboard repairs. We believe in transparent pricing and quick turnaround times.
            </p>
          </CardContent>
        </Card>
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Target className="h-8 w-8 text-primary" />
  Vår mission
            </CardHeader>
            <CardContent>
              <p>{mockBusinessInfo.mission}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
  Våra värden
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {mockBusinessInfo.values.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
