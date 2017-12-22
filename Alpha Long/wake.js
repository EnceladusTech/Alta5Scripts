//start date needs to be the same such that any of the outer intervals
// will not be resolved prematurely in case the start dates are selected
// differently by the system



$maxGained = 0;
$maxPosValue = {};
$pctOffMax = {};

$stocks = {};
var stockCount = 10;
var completedCount = 0;

$log('Initializing stock variables...');
$bot.log('Initializing stock variables...');

// SETUP STOCK VARIABLE ==================================
if (!!$stock1) {
    stockCount++;
    $stocks[$stock1.symbol] = {};
}

if (!!$stock2) {
    stockCount++;
    $stocks[$stock2.symbol] = {};
}

if (!!$stock3) {
    stockCount++;
    $stocks[$stock3.symbol] = {};
}
if (!!$stock4) {
    stockCount++;
    $stocks[$stock4.symbol] = {};
}
if (!!$stock5) {
    stockCount++;
    $stocks[$stock5.symbol] = {};
}
if (!!$stock6) {
    stockCount++;
    $stocks[$stock6.symbol] = {};
}
if (!!$stock7) {
    stockCount++;
    $stocks[$stock7.symbol] = {};
}
if (!!$stock8) {
    stockCount++;
    $stocks[$stock8.symbol] = {};
}
if (!!$stock9) {
    stockCount++;
    $stocks[$stock9.symbol] = {};
}
if (!!$stock10) {
    stockCount++;
    $stocks[$stock10.symbol] = {};
}
// =======================================================
$log(stockCount + ' stock variables initialized...');
$bot.log(stockCount + ' stock variables initialized...');

function getData(thisStock) {
    $log('Retrieving data for ' + thisStock.symbol + '...');
    $data
        .chart({
            symbol: thisStock,
            interval: '1d',
            period: '1d',
            minBars: 1
        })
        .chart({
            symbol: thisStock,
            interval: '1h',
            period: '1d',
            minBars: 1
        })
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
        .then(function (_1d, _1h, _30m, _15m, _10m, _5m) {
            // $log(
            //       _30m
            //       _15m.bars[_15m.bars.length - 1],
            //       _10m.bars[_10m.bars.length - 1],
            //      _5m.bars[_5m.bars.length - 1],
            //       _1m.bars[_1m.bars.length - 1]
            //   );
            $stocks[thisStock.symbol].p1d = _1d;
            $stocks[thisStock.symbol].p1h = _1h;
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