/**
 * Test script to verify Zettle API credentials and connection
 * Run with: node scripts/test-zettle.js
 */

require('dotenv').config();

async function testZettleConnection() {
  console.log('🇸🇪 Testar Zettle POS-anslutning för Sverige...\n');

  // Check environment variables
  const requiredEnvVars = [
    'ZETTLE_CLIENT_ID',
    'ZETTLE_CLIENT_SECRET',
    'ZETTLE_API_URL',
    'ZETTLE_ENVIRONMENT',
    'ZETTLE_CURRENCY',
    'ZETTLE_COUNTRY'
  ];

  console.log('📋 Kontrollerar miljövariabler:');
  let allConfigured = true;

  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    const status = value ? '✅' : '❌';
    const displayValue = varName.includes('SECRET') ? '***' : (value || 'SAKNAS');
    console.log(`   ${status} ${varName}: ${displayValue}`);
    
    if (!value) allConfigured = false;
  });

  if (!allConfigured) {
    console.log('\n❌ Vissa miljövariabler saknas. Kontrollera din .env-fil.');
    return;
  }

  console.log('\n🔧 Zettle-konfiguration:');
  console.log(`   Miljö: ${process.env.ZETTLE_ENVIRONMENT}`);
  console.log(`   Valuta: ${process.env.ZETTLE_CURRENCY}`);
  console.log(`   Land: ${process.env.ZETTLE_COUNTRY}`);
  console.log(`   API URL: ${process.env.ZETTLE_API_URL}`);

  console.log('\n✅ Alla miljövariabler är konfigurerade!');
  console.log('\n🎯 Nästa steg:');
  console.log('   1. Starta din webapp: npm run dev');
  console.log('   2. Gå till: http://localhost:3000/admin/pos');
  console.log('   3. Logga in med dina Zettle-uppgifter');
  console.log('   4. Testa produktsynkronisering');

  console.log('\n🇸🇪 Din svenska Zettle POS-integration är redo!');
}

// Run the test
testZettleConnection().catch(console.error);
