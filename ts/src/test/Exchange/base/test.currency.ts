import { Currency, Exchange } from "../../../../ccxt";
import testSharedMethods from './test.sharedMethods.js';

function testCurrency (exchange: Exchange, skippedProperties: object, method: string, entry: Currency) {
    const format = {
        'id': 'btc', // string literal for referencing within an exchange
        'code': 'BTC', // uppercase string literal of a pair of currencies
    };
    // todo: remove fee from empty
    const emptyAllowedFor = [ 'name', 'fee' ];
    // todo: info key needs to be added in base, when exchange does not have fetchCurrencies
    const isNative = exchange.has['fetchCurrencies'] && exchange.has['fetchCurrencies'] !== 'emulated';
    const currencyType = exchange.safeString (entry, 'type');
    if (isNative) {
        format['info'] = {};
        // todo: 'name': 'Bitcoin', // uppercase string, base currency, 2 or more letters
        format['withdraw'] = true; // withdraw enabled
        format['deposit'] = true; // deposit enabled
        format['precision'] = exchange.parseNumber ('0.0001'); // in case of SIGNIFICANT_DIGITS it will be 4 - number of digits "after the dot"
        format['fee'] = exchange.parseNumber ('0.001');
        format['networks'] = {};
        format['limits'] = {
            'withdraw': {
                'min': exchange.parseNumber ('0.01'),
                'max': exchange.parseNumber ('1000'),
            },
            'deposit': {
                'min': exchange.parseNumber ('0.01'),
                'max': exchange.parseNumber ('1000'),
            },
        };
        format['type'] = 'crypto'; // crypto, fiat, leverage, other
        testSharedMethods.assertInArray (exchange, skippedProperties, method, entry, 'type', [ 'fiat', 'crypto', 'leveraged', 'other', undefined ]); // todo: remove undefined
        // only require "deposit" & "withdraw" values, when currency is not fiat, or when it's fiat, but not skipped
        if (currencyType !== 'crypto' && ('depositForNonCrypto' in skippedProperties)) {
            emptyAllowedFor.push ('deposit');
        }
        if (currencyType !== 'crypto' && ('withdrawForNonCrypto' in skippedProperties)) {
            emptyAllowedFor.push ('withdraw');
        }
        if (currencyType === 'leveraged' || currencyType === 'other') {
            emptyAllowedFor.push ('precision');
        }
    }
    //
    testSharedMethods.assertCurrencyCode (exchange, skippedProperties, method, entry, entry['code']);
    // check if empty networks should be skipped
    const networks = exchange.safeDict (entry, 'networks', {});
    const networkKeys = Object.keys (networks);
    const networkKeysLength = networkKeys.length;
    if (networkKeysLength === 0 && ('skipCurrenciesWithoutNetworks' in skippedProperties)) {
        return;
    }
    //
    testSharedMethods.assertStructure (exchange, skippedProperties, method, entry, format, emptyAllowedFor);
    //
    testSharedMethods.checkPrecisionAccuracy (exchange, skippedProperties, method, entry, 'precision');
    testSharedMethods.assertGreaterOrEqual (exchange, skippedProperties, method, entry, 'fee', '0');
    if (!('limits' in skippedProperties)) {
        const limits = exchange.safeValue (entry, 'limits', {});
        const withdrawLimits = exchange.safeValue (limits, 'withdraw', {});
        const depositLimits = exchange.safeValue (limits, 'deposit', {});
        testSharedMethods.assertGreaterOrEqual (exchange, skippedProperties, method, withdrawLimits, 'min', '0');
        testSharedMethods.assertGreaterOrEqual (exchange, skippedProperties, method, withdrawLimits, 'max', '0');
        testSharedMethods.assertGreaterOrEqual (exchange, skippedProperties, method, depositLimits, 'min', '0');
        testSharedMethods.assertGreaterOrEqual (exchange, skippedProperties, method, depositLimits, 'max', '0');
        // max should be more than min (withdrawal limits)
        const minStringWithdrawal = exchange.safeString (withdrawLimits, 'min');
        if (minStringWithdrawal !== undefined) {
            testSharedMethods.assertGreaterOrEqual (exchange, skippedProperties, method, withdrawLimits, 'max', minStringWithdrawal);
        }
        // max should be more than min (deposit limits)
        const minStringDeposit = exchange.safeString (depositLimits, 'min');
        if (minStringDeposit !== undefined) {
            testSharedMethods.assertGreaterOrEqual (exchange, skippedProperties, method, depositLimits, 'max', minStringDeposit);
        }
        // check valid ID & CODE
        testSharedMethods.assertValidCurrencyIdAndCode (exchange, skippedProperties, method, entry, entry['id'], entry['code']);
        // todo: networks check
    }
}

export default testCurrency;
