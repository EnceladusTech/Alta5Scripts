for (let symbol in $stockIndices) {

    var stockIdxs = $stockIndices[symbol];

    $log('running symbol "' + symbol + '"', stockIdxs);
    // first check if this stock has an open position
    // if it does then skip it as for now we will only have one open position for each stock
    var oppFound = false;
    for (let idx = 0; idx < $bot.opps.length; idx++) {
        if ($bot.opps[idx].symbol === symbol) {
            oppFound = true;
            break;
        }
    }
    if (oppFound === true) {
        continue;
    }

    // Get current price for symbol============
    var currPrice = 0;
    var currPriceDateTime = $now;
    switch (symbol) {
        case $stock1.symbol:
            currPrice = $stock1.last;
            break;
        case $stock2.symbol:
            currPrice = $stock2.last;
            break;
        case $stock3.symbol:
            currPrice = $stock3.last;
            break;
        case $stock4.symbol:
            currPrice = $stock4.last;
            break;
        case $stock5.symbol:
            currPrice = $stock5.last;
            break;
        case $stock6.symbol:
            currPrice = $stock6.last;
            break;
        case $stock7.symbol:
            currPrice = $stock7.last;
            break;
        case $stock8.symbol:
            currPrice = $stock8.last;
            break;
        case $stock9.symbol:
            currPrice = $stock9.last;
            break;
        case $stock10.symbol:
            currPrice = $stock10.last;
            break;
        default:
            $log('stock symbol not found!', symbol);
            $bot.log('stock symbol not found!', symbol);
            break;
    }
    //===============
    var decisionBars = [];
    var nowHours = $now.getHours();
    var nowMins = $now.getMinutes();
    for (var intvl in stockIdxs) {
        // check if last bar is the proper bar, 
        // ie if that last bar has been fully resolved and is available
        // ie if its 12:31 and the last bar for the 30min interval is 10:30 we don't won't to use this interval at this time
        var lngth = $stockArray[stockIdxs[intvl]].bars.length;
        var lastOffset = 1;
        switch (intvl) {
            case 'i1d':
                break;
            case 'i1h':
                break;
            case 'i30m':
                if (lngth < 2) {
                    continue;
                }
                lastOffset = 2;
                break;
            case 'i15m':
                if (lngth < 2) {
                    continue;
                }
                lastOffset = 2;
                break;
            case 'i10m':
                if (lngth < 2) {
                    continue;
                }
                lastOffset = 2;
                break;
            case 'i5m':
                if (lngth < 2) {
                    continue;
                }
                lastOffset = 2;
                break;
        }
        var lastFullBar = $stockArray[stockIdxs[intvl]].bars[lngth - lastOffset];
        var setLvl = lastFullBar.high - (lastFullBar.high - lastFullBar.low) / $multiplier;
        var lastBar = {
            open: lastFullBar.open,
            high: lastFullBar.high,
            low: lastFullBar.low,
            close: lastFullBar.close,
            volume: lastFullBarvolume,
            time: lastFullBar.time,
            date: lastFullBar.date,
            intvl: intvl,
            setLvl: setLvl
        };

                var lbDateMonths = lastBar.date.getMonth();
        var lbDateDays = lastBar.date.getDay();
        var lbDateHours = lastBar.date.getHours();
        var lbDateMins = lastBar.date.getMinutes();
        $log(lastBar);
        switch (intvl) {
            case 'i1d':
                // right now just trust the days
                break;
            case 'i1h':
                if (nowHours !== lbDateHours) {
                    continue;
                }
                break;
            case 'i30m':
                var dmRatio = lbDateMins / 30;
                var nmRatio = nowMins / 30;
                var diff = nmRatio - dmRatio;
                if (nowHours !== lbDateHours || diff > 1) {
                    continue;
                }
                break;
            case 'i15m':
                var dmRatio = lbDateMins / 15;
                var nmRatio = nowMins / 15;
                var diff = nmRatio - dmRatio;
                if (nowHours !== lbDateHours || diff > 1) {
                    continue;
                }
                break;
            case 'i10m':
                var dmRatio = lbDateMins / 10;
                var nmRatio = nowMins / 10;
                var diff = nmRatio - dmRatio;
                if (nowHours !== lbDateHours || diff > 1) {
                    continue;
                }
                break;
            case 'i5min':
                var dmRatio = lbDateMins / 5;
                var nmRatio = nowMins / 5;
                var diff = nmRatio - dmRatio;
                if (nowHours !== lbDateHours || diff > 1) {
                    continue;
                }
                break;
            default:
                $bot.log('Unknown interval "' + intvl + '"');
                break;
        }

        if (lastBar.open > setLvl && lastBar.close > setLvl) {
            // now we have prev bar setup properly
            // check if current price has broke out
            if (currPrice > lastBar.high) {
                decisionBars.push(lastBar);
                if (decisionBars.length > 1) {
                    $bot.log('decision bars:', decisionBars);
                }

            }
        }

    }

    // now we've calculated the signal for each interval lets check if we need to open a position
    var sigCount = 0;
    var stopLossVal = 0;
    var stopLossIntvl = '';

    var msg = [];
    $log('decision bars length', decisionBars.length);
    if (decisionBars.length > 1) {
        for (let idx = 0; idx < decisionBars.length; idx++) {
            $log(decisionBars[idx].intvl + ' @ ' + decisionBars[idx].date.text('M-D-YY hh:mm:ss A'));
            msg.push(decisionBars[idx].intvl + ' @ ' + decisionBars[idx].date.text('M-D-YY hh:mm:ss A'));
            sigCount++;
            // ??? do we take the stop loss of the smallest interval or largest interval ???
            stopLossVal = decisionBars[idx].low;
            stopLossIntvl = intvl;
        }

        var request = {
            url: 'https://joejordan-abcd.firebaseio.com/open.json',
            method: 'post',
            data: {
                'symbol': symbol,
                'barInfo': decisionBars,
                'multiplier': $multiplier,
                'breakOutPrice': currPrice,
                'breakOutTime': currPriceDateTime,
                'stopLoss': stopLossVal
            },
            encoder: 'json'
        };


        $bot.open({
            type: 'equity',
            symbol: symbol,
            data: request,
            memo: 'Opening ' + symbol +
                '\n' + msg.join('\n') +
                '\nStop Loss: $' + stopLossVal +
                '\nStop Loss Intvl: ' + stopLossIntvl
        });

    }
}