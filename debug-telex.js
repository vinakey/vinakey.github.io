// Quick debug script to understand TELEX issues
import { TelexInputMethod } from './src/engine/methods/telex.js';
import { isVietnameseVowel } from './src/engine/maps/vietnamese-chars.js';

const telex = new TelexInputMethod();

console.log('Debug TELEX Issues:');
console.log('==================');

// Test 1: Can ă accept tone?
console.log('1. isVietnameseVowel("ă"):', isVietnameseVowel('ă'));
console.log('2. telex.process("ă", "s"):', telex.process('ă', 's'));
console.log('   Expected: ắ');

// Test 2: Sequential processing  
console.log('\n3. processWord("vieetj"):');
let result = '';
for (const char of 'vieetj') {
  const oldResult = result;
  result = telex.processCharacter ? telex.processCharacter(result, char) : result + char;
  console.log(`   "${oldResult}" + "${char}" → "${result}"`);
}
console.log('   Expected: việt');

// Test 3: Complex word
console.log('\n4. processWord("truowfng"):');
result = '';
for (const char of 'truowfng') {
  const oldResult = result;
  result = telex.processCharacter ? telex.processCharacter(result, char) : result + char;
  console.log(`   "${oldResult}" + "${char}" → "${result}"`);
}
console.log('   Expected: trường');