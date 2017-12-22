//start date needs to be the same such that any of the outer intervals
// will not be resolved prematurely in case the start dates are selected
// differently by the system



$maxGained = 0;
$maxPosValue = {};
$pctOffMax = {};

$stocks = {};
var stockCount = 0;
var completedCount = 0;

$log('Initializing stock variables...');
$bot.log('Initializing stock variables...');

// SETUP STOCK VARIABLE ==================================
if (!!$stock1) {
    stockCount++;
    $stocks[$stock1.symbol] = {
        //   'p1min': null,
        'p5min': null,
        'p10min': null,
        'p15min': null,
        'p30min': null
    };
}

if (!!$stock2) {
    stockCount++;
    $stocks[$stock2.symbol] = {
        //   'p1min': null,
        'p5min': null,
        'p10min': null,
        'p15min': null,
        'p30min': null
    };
}

if (!!$stock3) {
    stockCount++;
    $stocks[$stock3.symbol] = {
        //  'p1min': null,
        'p5min': null,
        'p10min': null,
        'p15min': null,
        'p30min': null
    };
}
if (!!$stock4) {
    stockCount++;
    $stocks[$stock4.symbol] = {
        //  'p1min': null,
        'p5min': null,
        'p10min': null,
        'p15min': null,
        'p30min': null
    };
}
if (!!$stock5) {
    stockCount++;
    $stocks[$stock5.symbol] = {
        //  'p1min': null,
        'p5min': null,
        'p10min': null,
        'p15min': null,
        'p30min': null
    };
}
if (!!$stock6) {
    stockCount++;
    $stocks[$stock6.symbol] = {
        //  'p1min': null,
        'p5min': null,
        'p10min': null,
        'p15min': null,
        'p30min': null
    };
}
if (!!$stock7) {
    stockCount++;
    $stocks[$stock7.symbol] = {
        //  'p1min': null,
        'p5min': null,
        'p10min': null,
        'p15min': null,
        'p30min': null
    };
}
if (!!$stock8) {
    stockCount++;
    $stocks[$stock8.symbol] = {
        //  'p1min': null,
        'p5min': null,
        'p10min': null,
        'p15min': null,
        'p30min': null
    };
}
if (!!$stock9) {
    stockCount++;
    $stocks[$stock9.symbol] = {
        // 'p1min': null,
        'p5min': null,
        'p10min': null,
        'p15min': null,
        'p30min': null

    };
}
if (!!$stock10) {
    stockCount++;
    $stocks[$stock10.symbol] = {
        //'p1min': null,
        'p5min': null,
        'p10min': null,
        'p15min': null,
        'p30min': null
    };
}
// =======================================================
$log(stockCount + ' stock variables initialized...');
$bot.log(stockCount + ' stock variables initialized...');
// Get the data
if (!!$stock1) {
    getData($stock1);
}
if (!!$stock2) {
    getData($stock2);
}
if (!!$stock3) {
    getData($stock3);
}
if (!!$stock4) {
    getData($stock4);
}
if (!!$stock5) {
    getData($stock5);
}
if (!!$stock6) {
    getData($stock6);
}
if (!!$stock7) {
    getData($stock7);
}
if (!!$stock8) {
    getData($stock8);
}
if (!!$stock9) {
    getData($stock9);
}
if (!!$stock10) {
    getData($stock10);
}
//
function getData(thisStock) {
    $log('Retrieving data for ' + thisStock.symbol + '...');
    $data
        .chart({
            symbol: thisStock,
            interval: '30m',
            period: 'intraday',
            minBars: 1
        })
        .chart({
            symbol: thisStock,
            interval: '15m',
            period: 'intraday',
            minBars: 1
        })
        .chart({
            symbol: thisStock,
            interval: '10m',
            period: 'intraday',
            minBars: 1
        })
        .chart({
            symbol: thisStock,
            interval: '5m',
            period: 'intraday',
            minBars: 1
        })
        //  .chart({
        //      symbol: thisStock,
        //      interval: '1m',
        //      period: 'intraday'
        //  })
        .then(function(_30m, _15m, _10m, _5m) {
            // $log(
            //       _30m
            //       _15m.bars[_15m.bars.length - 1],
            //       _10m.bars[_10m.bars.length - 1],
            //      _5m.bars[_5m.bars.length - 1],
            //       _1m.bars[_1m.bars.length - 1]
            //   );

            $stocks[thisStock.symbol].p30min = _30m;
            $stocks[thisStock.symbol].p15min = _15m;
            $stocks[thisStock.symbol].p10min = _10m;
            $stocks[thisStock.symbol].p5min = _5m;
            //  $stocks[thisStock.symbol].p1min = _1m;
            completedCount++;
          //  $log('Data Retrieval complete for ' + thisStock.symbol + '...' + '(' + completedCount + '/' + stockCount + ')');
            if (completedCount === stockCount) {
                $log('All Data Retrieved', $stocks);
                $done();
            }
        });

}