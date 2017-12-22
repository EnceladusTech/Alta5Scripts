$maxGained = 0;
$maxPosValue = {};
$pctOffMax = {};

$stocks = {};
var stockCount = 10;
var completedCount = 0;

$log('Initializing stock variables...');
$bot.log('Initializing stock variables...');

// SETUP STOCK VARIABLE ==================================
$stockArray = [];
$stocks[$stock1.symbol] = {};
$stocks[$stock2.symbol] = {};
$stocks[$stock3.symbol] = {};
$stocks[$stock4.symbol] = {};
$stocks[$stock5.symbol] = {};
$stocks[$stock6.symbol] = {};
$stocks[$stock7.symbol] = {};
$stocks[$stock8.symbol] = {};
$stocks[$stock9.symbol] = {};
$stocks[$stock10.symbol] = {};


getData($stock1);
getData($stock2);
getData($stock3);
getData($stock4);
getData($stock5);
getData($stock6);
getData($stock7);
getData($stock8);
getData($stock9);
getData($stock10);


function getData(thisStock) {
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
        .then(function(_1d, _1h, _30m, _15m, _10m, _5m) {

            $stockArray.push(_1d);
            $stockArray.push(_1h);
            $stockArray.push(_30m);
            $stockArray.push(_15m);
            $stockArray.push(_10m);
            $stockArray.push(_5m);

            $stocks[thisStock.symbol].p1d = _1d;
            $stocks[thisStock.symbol].p1h = _1h;
            $stocks[thisStock.symbol].p30min = _30m;
            $stocks[thisStock.symbol].p15min = _15m;
            $stocks[thisStock.symbol].p10min = _10m;
            $stocks[thisStock.symbol].p5min = _5m;
            completedCount++;
            if (completedCount === stockCount) {
                $log($stockArray);
                $log('All Data Retrieved', $stocks);
                $done();
            }
        });

}