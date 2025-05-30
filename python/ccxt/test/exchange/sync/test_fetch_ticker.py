import os
import sys

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
sys.path.append(root)

# ----------------------------------------------------------------------------

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

# ----------------------------------------------------------------------------
# -*- coding: utf-8 -*-

from ccxt.test.exchange.base import test_ticker  # noqa E402

def test_fetch_ticker(exchange, skipped_properties, symbol):
    method = 'fetchTicker'
    ticker = exchange.fetch_ticker(symbol)
    test_ticker(exchange, skipped_properties, method, ticker, symbol)
    return True
