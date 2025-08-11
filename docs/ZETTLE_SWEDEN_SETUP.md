# 🇸🇪 Zettle POS Integration - Sverige Setup

Denna guide hjälper dig att integrera ditt Zettle (tidigare iZettle) POS-system med din mobilreparations-webapp för den svenska marknaden.

## 📋 Förutsättningar

1. **Aktivt Zettle-konto**: Du behöver ett fungerande Zettle företagskonto registrerat i Sverige
2. **API-åtkomst**: Registrera dig för Zettle Developer-åtkomst
3. **Miljöinställningar**: Node.js och din webapp körs

## 🔧 Steg 1: Registrera för Zettle Developer-åtkomst

1. **Besök Zettle Developer Portal**:
   - Gå till [developer.zettle.com](https://developer.zettle.com)
   - Logga in med ditt svenska Zettle företagskonto

2. **Skapa en ny applikation**:
   - Klicka "Create App" eller "New Application"
   - Fyll i dina appdetaljer:
     - **App Name**: "Mobilreparation Integration"
     - **Description**: "POS-integration för mobilreparationstjänster"
     - **Redirect URI**: `http://localhost:3000/api/zettle/callback` (för utveckling)
     - **Market**: Välj **Sverige (SE)**

3. **Hämta dina API-uppgifter**:
   - Efter att ha skapat appen får du:
     - **Client ID** (offentlig identifierare)
     - **Client Secret** (håll denna säker!)

## 🔐 Steg 2: Konfigurera miljövariabler för Sverige

1. **Kopiera exempel-miljöfilen**:
   ```bash
   cp .env.example .env
   ```

2. **Lägg till dina svenska Zettle-uppgifter i `.env`**:
   ```env
   # Zettle (iZettle) POS Integration - Sweden Configuration
   ZETTLE_CLIENT_ID="din_faktiska_client_id_här"
   ZETTLE_CLIENT_SECRET="din_faktiska_client_secret_här"
   ZETTLE_API_URL="https://oauth.zettle.com"
   ZETTLE_ENVIRONMENT="sandbox"
   ZETTLE_CURRENCY="SEK"
   ZETTLE_COUNTRY="SE"
   ZETTLE_LOCALE="sv-SE"

   # Swedish Business Settings
   BUSINESS_CURRENCY="SEK"
   BUSINESS_COUNTRY="SE"
   BUSINESS_LOCALE="sv-SE"
   BUSINESS_TIMEZONE="Europe/Stockholm"
   ```

3. **För produktion** (när du är redo):
   ```env
   ZETTLE_ENVIRONMENT="production"
   ```

## 🇸🇪 Svenska marknadsspecifika inställningar

### Valuta och prissättning:
- **SEK (Svenska kronor)** är standardvalutan
- Priser hanteras i **öre** (1 SEK = 100 öre) i API:et
- Automatisk konvertering mellan kronor och öre

### Moms och skatter:
- Standard svensk moms (25%) kan konfigureras per produkt
- Stöd för reducerad moms (12%, 6%) för vissa tjänster
- Automatisk momsberäkning i transaktioner

### Språk och lokalisering:
- Svenskt språk (`sv-SE`) i hela gränssnittet
- Svenska datum- och tidsformat
- Svensk valutaformatering (123 456,78 kr)

## 🚀 Steg 3: Testa integrationen

1. **Starta din utvecklingsserver**:
   ```bash
   npm run dev
   ```

2. **Öppna POS-hantering**:
   - Gå till din adminpanel: `http://localhost:3000/admin`
   - Klicka på **"POS-system"** i navigationen
   - Du ser Zettle-inloggningsgränssnittet

3. **Autentisera med Zettle**:
   - Ange dina svenska Zettle-kontouppgifter (e-post/lösenord)
   - Klicka "Anslut till Zettle"
   - Vid framgång ser du din POS-instrumentpanel

## 📊 Tillgängliga funktioner för svenska företag

### ✅ Implementerade funktioner

1. **Autentisering**:
   - Säker OAuth 2.0-inloggning med svenska Zettle
   - Token-hantering och uppdatering

2. **Produkthantering**:
   - Visa alla produkter från ditt svenska Zettle-lager
   - Synkronisera lokala tjänster med Zettle-produkter
   - Automatisk produktskapande och uppdateringar
   - SEK-prissättning och öre-konvertering

3. **Transaktionshistorik**:
   - Visa senaste transaktioner (senaste 30 dagarna)
   - Transaktionsdetaljer och status
   - Omsättningsberäkningar i SEK

4. **Instrumentpanel**:
   - Totalt antal produkter
   - Sammanfattning av senaste transaktioner
   - Omsättningsöversikt i svenska kronor
   - Senaste synkroniseringstidsstämpel

### 🔄 Synkroniseringsfunktioner

- **Envägssynkronisering**: Lokala tjänster → Zettle-produkter
- **Automatisk mappning**: Använder tjänste-ID som extern referens
- **Priskonvertering**: Hanterar SEK-valutakonvertering (kronor ↔ öre)
- **Batch-operationer**: Effektiva bulkuppdateringar

## 🛠️ API-endpoints för svenska marknaden

Din webapp inkluderar nu dessa Zettle API-endpoints:

- `POST /api/zettle/auth` - Autentisera med svenska Zettle
- `GET /api/zettle/products` - Hämta produkter från Zettle
- `POST /api/zettle/products` - Synkronisera lokala tjänster till Zettle
- `GET /api/zettle/transactions` - Hämta transaktionshistorik

## 💰 Svensk valutahantering

### SEK-prissättning:
```javascript
// Priser lagras i öre (1 SEK = 100 öre)
const priceInSEK = 299.50;  // 299,50 kr
const priceInOre = 29950;   // Lagras som 29950 öre i Zettle

// Automatisk formatering
formatCurrency(29950, 'SEK'); // "299,50 kr"
```

### Momshantering:
- Standard moms: 25%
- Reducerad moms: 12% (vissa reparationstjänster)
- Reducerad moms: 6% (böcker, tidningar)

## 🐛 Felsökning för svenska användare

### Vanliga problem:

1. **"Autentisering misslyckades"**:
   - Kontrollera dina svenska Zettle-uppgifter
   - Verifiera att Client ID och Secret är korrekta
   - Se till att ditt Zettle-konto har API-åtkomst för Sverige

2. **"API-förfrågan misslyckades"**:
   - Kontrollera internetanslutning
   - Verifiera att API-URL är korrekt för svenska marknaden
   - Kontrollera om Zettle-tjänsten är operativ

3. **"Produkter synkroniseras inte"**:
   - Se till att du har aktiva tjänster i din webapp
   - Kontrollera att tjänsterna har giltiga namn och priser i SEK
   - Verifiera att Zettle-kontot har produkthanteringsrättigheter

### Felsökningssteg:

1. **Kontrollera miljövariabler**:
   ```bash
   # I din terminal
   echo $ZETTLE_CLIENT_ID
   echo $ZETTLE_CURRENCY
   echo $ZETTLE_COUNTRY
   ```

2. **Kontrollera serverloggar**:
   - Leta efter felmeddelanden i din utvecklingskonsol
   - API-fel loggas med detaljerad information

## 📞 Support för svenska användare

Om du stöter på problem:

1. **Kontrollera Zettle Sverige Support**: [zettle.com/se/support](https://zettle.com/se/support)
2. **Zettle Developer Documentation**: [developer.zettle.com](https://developer.zettle.com)
3. **Svensk kundtjänst**: Ring Zettle Sverige för API-specifika frågor

## 🎯 Användningstips för svenska företag

1. **Regelbunden synkronisering**: Synkronisera produkter regelbundet för uppdaterat lager
2. **Övervaka transaktioner**: Kontrollera transaktionshistorik för betalningsavstämning
3. **Säkerhetskopiera data**: Håll lokala säkerhetskopior av viktiga affärsdata
4. **Testa först**: Testa alltid i sandbox-miljö innan produktion
5. **Momsrapportering**: Använd transaktionsdata för svensk momsrapportering

## 🏪 Svenska företagsfördelar

- **Professionell POS-integration** med ledande svensk betalningsleverantör
- **Automatisk lagersynkronisering** - ingen manuell produktinmatning
- **Realtidsspårning av försäljning** för bättre affärsinsikter
- **Strömlinjeformade operationer** mellan webapp och POS-system
- **SEK-valutastöd** med korrekt svensk formatering
- **Svensk lokalisering** i hela gränssnittet

---

**🎉 Grattis!** Din mobilreparationsbutik har nu professionell POS-integration med Zettle, optimerad för den svenska marknaden. Du kan hantera produkter, spåra försäljning och synkronisera dina tjänster sömlöst.
