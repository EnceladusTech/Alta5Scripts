$maxGained = 0;
$maxPosValue = {};
$pctOffMax = {};

var stockCount = 10;
var completedCount = 0;

$log('Initializing stock variables...');
$bot.log('Initializing stock variables...');

$stockArray = [];
var idx = 0;
$stockIndices = {};
$stockIndices[$stock1.symbol] = { 'i1d': idx++, 'i1h': idx++, 'i30m': idx++, 'i15m': idx++, 'i10m': idx++, 'i5m': idx++ };
$stockIndices[$stock2.symbol] = { 'i1d': idx++, 'i1h': idx++, 'i30m': idx++, 'i15m': idx++, 'i10m': idx++, 'i5m': idx++ };
$stockIndices[$stock3.symbol] = { 'i1d': idx++, 'i1h': idx++, 'i30m': idx++, 'i15m': idx++, 'i10m': idx++, 'i5m': idx++ };
$stockIndices[$stock4.symbol] = { 'i1d': idx++, 'i1h': idx++, 'i30m': idx++, 'i15m': idx++, 'i10m': idx++, 'i5m': idx++ };
$stockIndices[$stock5.symbol] = { 'i1d': idx++, 'i1h': idx++, 'i30m': idx++, 'i15m': idx++, 'i10m': idx++, 'i5m': idx++ };
$stockIndices[$stock6.symbol] = { 'i1d': idx++, 'i1h': idx++, 'i30m': idx++, 'i15m': idx++, 'i10m': idx++, 'i5m': idx++ };
$stockIndices[$stock7.symbol] = { 'i1d': idx++, 'i1h': idx++, 'i30m': idx++, 'i15m': idx++, 'i10m': idx++, 'i5m': idx++ };
$stockIndices[$stock8.symbol] = { 'i1d': idx++, 'i1h': idx++, 'i30m': idx++, 'i15m': idx++, 'i10m': idx++, 'i5m': idx++ };
$stockIndices[$stock9.symbol] = { 'i1d': idx++, 'i1h': idx++, 'i30m': idx++, 'i15m': idx++, 'i10m': idx++, 'i5m': idx++ };
$stockIndices[$stock10.symbol] = { 'i1d': idx++, 'i1h': idx++, 'i30m': idx++, 'i15m': idx++, 'i10m': idx++, 'i5m': idx++ };

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
        .then(function (_1d, _1h, _30m, _15m, _10m, _5m) {
            //$stockArray.push(_1w);
            $stockArray.push(_1d);
            $stockArray.push(_1h);
            $stockArray.push(_30m);
            $stockArray.push(_15m);
            $stockArray.push(_10m);
            $stockArray.push(_5m);
            completedCount++;
            if (completedCount === stockCount) {
                $log('All Data Retrieved',$stockIndices, $stockArray );
                $done();
            }
        });

}