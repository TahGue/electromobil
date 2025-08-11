# 🇸🇪 Komplett installation för Sverige

## Steg 1: Uppdatera din .env-fil

Öppna din `.env`-fil och lägg till dessa rader (eller uppdatera befintliga):

```env
# Zettle (iZettle) POS Integration - Sweden Configuration
ZETTLE_CLIENT_ID="din_client_id_från_developer_zettle_com"
ZETTLE_CLIENT_SECRET="din_client_secret_från_developer_zettle_com"
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

# Swedish Tax Settings
DEFAULT_VAT_RATE="25"
REDUCED_VAT_RATE_1="12"
REDUCED_VAT_RATE_2="6"
```

## Steg 2: Installera nödvändiga paket

Kör dessa kommandon i din terminal:

```bash
# Installera alla beroenden
npm install

# Installera svenska datum/tid-bibliotek (om inte redan installerat)
npm install date-fns

# Installera internationalisering (för svensk formatering)
npm install react-intl
```

## Steg 3: Skaffa Zettle API-nycklar

1. **Gå till Zettle Developer Portal**:
   - Besök: https://developer.zettle.com
   - Logga in med ditt svenska Zettle-konto

2. **Skapa en app**:
   - Klicka "Create App"
   - Namn: "Mobilreparation POS"
   - Beskrivning: "Integration för mobilreparationsbutik"
   - Redirect URI: `http://localhost:3000/api/zettle/callback`
   - **Viktigt**: Välj marknaden **Sverige (SE)**

3. **Kopiera API-nycklar**:
   - Client ID: Kopiera och klistra in i din `.env`
   - Client Secret: Kopiera och klistra in i din `.env`

## Steg 4: Starta applikationen

```bash
# Starta utvecklingsservern
npm run dev
```

## Steg 5: Testa POS-integrationen

1. Öppna: http://localhost:3000/admin
2. Klicka på "POS-system" i menyn
3. Logga in med dina Zettle-uppgifter
4. Testa synkronisering av produkter

## 🎯 Vad du får med svensk konfiguration:

✅ **SEK-valuta** - Alla priser i svenska kronor
✅ **Svensk lokalisering** - Hela gränssnittet på svenska
✅ **Öre-konvertering** - Automatisk hantering av svenska öre
✅ **Svensk moms** - 25%, 12%, 6% momssatser
✅ **Stockholms tidszon** - Korrekt tid för Sverige
✅ **Svenska datum** - DD/MM/YYYY format
✅ **Zettle Sverige** - Optimerat för svensk marknad

## 🚨 Viktiga säkerhetsnoteringar:

- **Dela ALDRIG** din Client Secret
- **Använd sandbox** för testning först
- **Säkerhetskopiera** din `.env`-fil säkert
- **Använd HTTPS** i produktion

## 📞 Support:

- Zettle Sverige: https://zettle.com/se/support
- Developer Portal: https://developer.zettle.com
- Teknisk support: Ring Zettle kundtjänst

---

**🎉 Lycka till!** Din svenska mobilreparationsbutik är nu redo för professionell POS-integration!
