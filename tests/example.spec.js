const { test, expect } = require('@playwright/test');

// Configuration
const CONFIG = {
  url: 'https://www.swifttranslator.com/',
  timeouts: {
    pageLoad: 2000,
    afterClear: 1000,
    translation: 3000,
    betweenTests: 500
  },
  selectors: {
    // Your previous getByRole({ name: 'Input Your Singlish Text Here.' }) can fail because
    // placeholder text is not a "name" in many cases. Placeholder selector is more stable.
    inputPlaceholder: 'Input Your Singlish Text Here.',
    outputContainer: 'div.w-full.h-80.p-3.rounded-lg.ring-1.ring-slate-300.whitespace-pre-wrap'
  }
};

// ✅ TEST DATA (YOUR EXCEL CONTENT)
const TEST_DATA = {
  positive: [
    {
      tcId: 'Pos_Fun_0001',
      name: 'Conditional + time + place + polite request',
      input: 'oyaa heta 8.45 AM ta Colombo office eken enavanam, karuNaakaralaa mata message ekak dhenna.',
      expected: 'ඔයා හෙට 8.45 AM ට Colombo office එකෙන් එනවනම්, කරුණාකරලා මට message එකක් දෙන්න.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0002',
      name: 'Contrast + reason (compound)',
      input: 'mama yanna leasthi, namuth vahina nisaa api passe yamu.',
      expected: 'මම යන්න ලේස්ති, නමුත් වහින නිසා අපි පස්සෙ යමු.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0003',
      name: 'Quoted speech inside sentence',
      input: 'eyaa kiwwa "mata epaa" kiyala, eth mama ahala baeluvaa.',
      expected: 'එයා කිව්වා "මට එපා" කියලා, ඒත් මම අහලා බැලුවා.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0004',
      name: 'Two-sentence instruction + future',
      input: 'karunakara report eka upload karanna. mama heta review karanavaa.',
      expected: 'කරුණාකර report එක upload කරන්න. මම හෙට review කරනවා.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0005',
      name: 'Numbered list formatting',
      input: 'karanna one:\n1) login wenna\n2) report generate karanna\n3) logout wenna',
      expected: 'කරන්න ඕනේ:\n1) login වෙන්න\n2) report generate කරන්න\n3) logout වෙන්න',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0006',
      name: 'Currency + decimals',
      input: 'total eka Rs. 12,450.75; eka adha pay karanna oone.',
      expected: 'total එක Rs. 12,450.75; එක අද pay කරන්න ඕනෙ.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0007',
      name: 'Time range + availability',
      input: 'oyaa 2.30 PM - 3.15 PM athara free nam call ekak dhenna.',
      expected: 'ඔයා 2.30 PM - 3.15 PM අතර free නම් call එකක් දෙන්න.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0008',
      name: 'Mixed date formats',
      input: 'meeting eka 2026-02-10 da? naethnam 10/02/2026 da? confirm karanna.',
      expected: 'meeting එක 2026-02-10 ඩ? නැත්නම් 10/02/2026 ඩ? confirm කරන්න.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0009',
      name: 'Units + dimensions',
      input: 'container eka 12 cm x 8 cm; weight eka 2.5 kg.',
      expected: 'container එක 12 cm x 8 cm; weight එක 2.5 kg.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0010',
      name: 'Abbreviations + multi-sentence',
      input: 'magea NIC copy eka attach karalaa email ekak evanna. OTP eka aawoth mata SMS ekak dhenna.',
      expected: 'මගේ NIC copy එක attach කරලා email එකක් එවන්න. OTP එක ආවොත් මට SMS එකක් දෙන්න.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0011',
      name: 'Email address embedded',
      input: 'details tika sandaruwan@gmail.com walata evanna.',
      expected: 'details ටික sandaruwan@gmail.com වලට එවන්න.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0012',
      name: 'Parentheses + clarification',
      input: 'meeka (final version) update karala mata dhenna.',
      expected: 'මේක (final version) update කරල මට දෙන්න.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0013',
      name: 'Negation + explanation',
      input: 'adha yanna epaa, traffic eka godak thiyanavaa; api heta yamu.',
      expected: 'අද යන්න එපා, traffic එක ගොඩක් තියනවා; අපි හෙට යමු.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0014',
      name: 'Plural pronoun usage',
      input: 'oyaalaa ready nam, apita dan yanna puluvan.',
      expected: 'ඔයාලා ready නම්, අපිට දැන් යන්න පුලුවන්.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0015',
      name: 'If-cannot-come instruction',
      input: 'oyaata enna baeri nam, mata message ekak dhenna; mama plan change karannam.',
      expected: 'ඔයාට එන්න බැරි නම්, මට message එකක් දෙන්න; මම plan change කරන්නම්.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0016',
      name: 'URL inside instruction',
      input: 'oyaata puluvannam me URL eka open karanna: https://example.com, passe mata kiyanna.',
      expected: 'ඔයාට පුලුවන්නම් මෙ URL එක open කරන්න: https://example.com, පස්සෙ මට කියන්න.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0017',
      name: 'Quotes + punctuation',
      input: 'meeka hariyata vaeda karanavaadha? ("OK") kiyala pennanavaa.',
      expected: 'මේක හරියට වැඩ කරනවාද? ("OK") කියල පෙන්නනව.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0018',
      name: 'Paragraph with blank line',
      input: 'aayuboovan!\n\n mama dhaen vaeda karanavaa.\n oyaa enavadha heta',
      expected: 'ආයුබෝවන්!\n\n මම දැන් වැඩ කරනවා.\n ඔයා එනවද හෙට',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0019',
      name: 'Apology + request',
      input: 'oyaata samaavenna puluvandha? mata poddak udhavvak ekak karanna.',
      expected: 'ඔයාට සමාවෙන්න පුලුවන්ද? මට පොඩ්ඩක් උදව්වක් එකක් කරන්න.',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0020',
      name: 'Past → present shift',
      input: 'mama iiyee call ekak dhunnaa, habayi adha venakan prathichaarayak nae',
      expected: 'මම ඊයේ call එකක් දුන්නා, හබයි අද වෙනකන් ප්‍රතිචාරයක් නැ',
      length: 'M'
    },
    {
      tcId: 'Pos_Fun_0021',
      name: 'Simple sentiment',
      input: 'mata bayayi',
      expected: 'මට බයයි',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0022',
      name: 'Short imperative emphasis',
      input: 'dhaenma enna!',
      expected: 'දැන්ම එන්න!',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0023',
      name: 'Greeting + continuation',
      input: 'suba dhavasak! mama enavaa.',
      expected: 'සුබ දවසක්! මම එනවා.',
      length: 'S'
    },
    {
      tcId: 'Pos_Fun_0024',
      name: 'Brand terms + request',
      input: 'Teams meeting ekee link eka WhatsApp karanna puluvandha?',
      expected: 'Teams meeting එකේ link එක WhatsApp කරන්න පුලුවන්ද?',
      length: 'M'
    }
  ],

  negative: [
    {
      tcId: 'Neg_Fun_0001',
      name: 'Joined words (no spaces)',
      input: 'oyaaenavadhamamageharayanavaaheta',
      expected: 'ඔයා එනවද මම ගෙදර යනවා',
      length: 'M'
    },
    {
      tcId: 'Neg_Fun_0002',
      name: 'Random casing + merged',
      input: 'MaMaGedhARaYanNAVAoyAEnnADA?',
      expected: 'මම ගෙදර යනවා ඔයා එනවාද?',
      length: 'M'
    },
    {
      tcId: 'Neg_Fun_0003',
      name: 'No spaces around punctuation',
      input: 'oyaaenavadha?mamaenavaa!issarahatayanna.',
      expected: 'ඔයා එනවද? මම එනවා! ඉස්සරහට යන්න.',
      length: 'M'
    },
    {
      tcId: 'Neg_Fun_0004',
      name: 'Excess symbols',
      input: 'mama ### gedhara yanavaa... ehema hari da?',
      expected: 'මම ගෙදර යනවා... එහෙම හරි ද?',
      length: 'M'
    },
    {
      tcId: 'Neg_Fun_0005',
      name: 'Tabs and irregular whitespace',
      input: 'mama                                      gedhara                                  yanavaa',
      expected: 'මම ගෙදර යනවා.',
      length: 'M'
    },
    {
      tcId: 'Neg_Fun_0006',
      name: 'Emoji breaking token',
      input: 'mama😅yanavaa denma',
      expected: 'මම යනවා දැන්ම',
      length: 'M'
    },
    {
      tcId: 'Neg_Fun_0007',
      name: 'Punctuation spam',
      input: 'oyaa??!!??!! enava??!!',
      expected: 'ඔයා එනවාද?',
      length: 'M'
    },
    {
      tcId: 'Neg_Fun_0008',
      name: 'Severe typos',
      input: 'mta udhavk karna pulwnd? mama hthnne enna bari wei.',
      expected: 'මට උදව්වක් කරන්න පුළුවන්ද? මම හිතන්නේ එන්න බැරි වෙයි.',
      length: 'M'
    },
    {
      tcId: 'Neg_Fun_0009',
      name: 'Numbers/dates glued',
      input: 'USD1,500gevanne25/12/2025wenakan;remindkaranna.',
      expected: 'USD 1,500 ගෙවන්නේ 25/12/2025 වෙනකන්; remind කරන්න.',
      length: 'M'
    },
    {
      tcId: 'Neg_Fun_0010',
      name: 'Heavy mixed-pattern stress with noise characters',
      input:
        'mama gedhara yanavaa!!! <<<>>> ??? mama genna yanavaaa... *** ### ;; -- mama gedara yanavaa. ' +
        'mama gedhara yanavaa!!! <<<>>> ??? mama genna yanavaaa... *** ### ;; -- mama gedara yanavaa. ' +
        'mama gedhara yanavaa!!! <<<>>> ??? mama genna yanavaaa... *** ### ;; -- mama gedara yanavaa. ' +
        'mama gedhara yanavaa!!! <<<>>> ??? mama genna yanavaaa... *** ### ;; -- mama gedara yanavaa. ' +
        'mama gedhara yanavaa!!! <<<>>> ??? mama genna yanavaaa... *** ### ;; -- mama gedara yanavaa. ' +
        'mama gedhara yanavaa!!! <<<>>> ??? mama genna yanavaaa... *** ### ;; -- mama gedara yanavaa.',
      expected:
        'මම ගෙදර යනවා!!! <<<>>> ??? මම ගෙනා යනවා... *** ### ;; -- මම ගෙදර යනවා. ' +
        'මම ගෙදර යනවා!!! <<<>>> ??? මම ගෙනා යනවා... *** ### ;; -- මම ගෙදර යනවා. ' +
        'මම ගෙදර යනවා!!! <<<>>> ??? මම ගෙනා යනවා... *** ### ;; -- මම ගෙදර යනවා. ' +
        'මම ගෙදර යනවා!!! <<<>>> ??? මම ගෙනා යනවා... *** ### ;; -- මම ගෙදර යනවා. ' +
        'මම ගෙදර යනවා!!! <<<>>> ??? මම ගෙනා යනවා... *** ### ;; -- මම ගෙදර යනවා. ' +
        'මම ගෙදර යනවා!!! <<<>>> ??? මම ගෙනා යනවා... *** ### ;; -- මම ගෙදර යනවා.',
      length: 'L'
    }
  ],

  ui: {
    tcId: 'Pos_UI_0001',
    name: 'UI real-time update + formatting preservation + clear/reset handling',
    input: 'aayuboovan!\nmama den office ekee.\noyaa heta 9.00 AM enavada?',
    partialInput: 'aayuboovan!\n',
    expectedFull: '', // Optional: if you want exact Sinhala expected, place it here.
    length: 'M'
  }
};

// Helper Functions
class TranslatorPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToSite() {
    await this.page.goto(CONFIG.url);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(CONFIG.timeouts.pageLoad);
  }

  async getInputField() {
    // More stable
    return this.page.getByPlaceholder(CONFIG.selectors.inputPlaceholder);
  }

  async getOutputField() {
    return this.page
      .locator(CONFIG.selectors.outputContainer)
      .filter({ hasNot: this.page.locator('textarea') })
      .first();
  }

  async clearAndWait() {
    const input = await this.getInputField();
    await input.fill('');
    await this.page.waitForTimeout(CONFIG.timeouts.afterClear);
  }

  async typeInput(text) {
    const input = await this.getInputField();
    await input.fill(text);
  }

  async waitForOutput() {
    await this.page.waitForFunction(
      (selector) => {
        const elements = Array.from(document.querySelectorAll(selector));
        const output = elements.find(el => el && el.textContent && el.textContent.trim().length > 0);
        return output !== undefined;
      },
      CONFIG.selectors.outputContainer,
      { timeout: 10000 }
    );
    await this.page.waitForTimeout(CONFIG.timeouts.translation);
  }

  async getOutputText() {
    const output = await this.getOutputField();
    const text = await output.textContent();
    return (text || '').trim();
  }

  async performTranslation(inputText) {
    await this.clearAndWait();
    await this.typeInput(inputText);
    await this.waitForOutput();
    return await this.getOutputText();
  }
}

// Test Suite
test.describe('SwiftTranslator - Singlish to Sinhala Conversion Tests (Your Data)', () => {
  let translator;

  test.beforeEach(async ({ page }) => {
    translator = new TranslatorPage(page);
    await translator.navigateToSite();
  });

  // Positive Functional Tests
  test.describe('Positive Functional Tests', () => {
    for (const testCase of TEST_DATA.positive) {
      test(`${testCase.tcId} - ${testCase.name}`, async () => {
        const actualOutput = await translator.performTranslation(testCase.input);
        expect(actualOutput).toBe(testCase.expected);
        await translator.page.waitForTimeout(CONFIG.timeouts.betweenTests);
      });
    }
  });

  // ✅ Negative Functional Tests (Fail Expected)
  test.describe('Negative Functional Tests (Fail Expected)', () => {
    for (const testCase of TEST_DATA.negative) {
      test(`${testCase.tcId} - ${testCase.name}`, async () => {
        const actualOutput = await translator.performTranslation(testCase.input);

        // IMPORTANT:
        // Negative tests are designed to fail to produce the "ideal" output.
        // Therefore, the test passes when actualOutput != expected.
        expect(actualOutput).not.toBe(testCase.expected);

        await translator.page.waitForTimeout(CONFIG.timeouts.betweenTests);
      });
    }
  });

  // UI Test
  test.describe('UI Functionality Tests', () => {
    test(`${TEST_DATA.ui.tcId} - ${TEST_DATA.ui.name}`, async ({ page }) => {
      const translator = new TranslatorPage(page);
      const input = await translator.getInputField();
      const output = await translator.getOutputField();

      await translator.clearAndWait();

      // 1) Output should clear when input is cleared
      let outputText = (await output.textContent()) || '';
      expect(outputText.trim().length).toBe(0);

      // 2) Type partial input slowly
      await input.pressSequentially(TEST_DATA.ui.partialInput, { delay: 120 });
      await page.waitForTimeout(1200);

      // Verify output starts appearing
      outputText = (await output.textContent()) || '';
      expect(outputText.trim().length).toBeGreaterThan(0);

      // 3) Complete typing
      const remaining = TEST_DATA.ui.input.substring(TEST_DATA.ui.partialInput.length);
      if (remaining.length > 0) {
        await input.pressSequentially(remaining, { delay: 120 });
      }

      await translator.waitForOutput();
      const finalOutput = await translator.getOutputText();

      // Optional check: if expectedFull given, validate it
      if (TEST_DATA.ui.expectedFull && TEST_DATA.ui.expectedFull.trim().length > 0) {
        expect(finalOutput).toBe(TEST_DATA.ui.expectedFull);
      } else {
        // If no exact Sinhala expected given, at least ensure output is not empty
        expect(finalOutput.length).toBeGreaterThan(0);
      }

      // 4) Clear input and confirm output clears
      await translator.clearAndWait();
      outputText = (await output.textContent()) || '';
      expect(outputText.trim().length).toBe(0);

      await page.waitForTimeout(CONFIG.timeouts.betweenTests);
    });
  });
});