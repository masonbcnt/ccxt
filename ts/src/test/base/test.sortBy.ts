
// AUTO_TRANSPILE_ENABLED

import ccxt from '../../../ccxt.js';
import testSharedMethods from '../Exchange/base/test.sharedMethods.js';

function testSortBy () {
    // todo: other argument checks

    const exchange = new ccxt.Exchange ({
        'id': 'sampleexchange',
    });

    const arr = [ { 'x': 5 }, { 'x': 2 }, { 'x': 4 }, { 'x': 0 }, { 'x': 1 }, { 'x': 3 } ];
    const newArray = exchange.sortBy (arr, 'x');

    testSharedMethods.assertDeepEqual (exchange, undefined, 'sortBy', newArray, [
        { 'x': 0 },
        { 'x': 1 },
        { 'x': 2 },
        { 'x': 3 },
        { 'x': 4 },
        { 'x': 5 },
    ]);

    const newArrayDescending = exchange.sortBy (arr, 'x', true);
    testSharedMethods.assertDeepEqual (exchange, undefined, 'sortBy', newArrayDescending, [
        { 'x': 5 },
        { 'x': 4 },
        { 'x': 3 },
        { 'x': 2 },
        { 'x': 1 },
        { 'x': 0 },
    ]);

    const emptyArray = exchange.sortBy ([], 'x');
    testSharedMethods.assertDeepEqual (exchange, undefined, 'sortBy', emptyArray, []);
}

export default testSortBy;
