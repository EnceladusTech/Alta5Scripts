
for (let symbol in $stocks) {

    var stock = $stocks[symbol];

    // $log('running symbol "' + symbol + '"', stock);
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
    var sigState = {
        //   '1min': {
        //        'lastBar': stock.p1min.bars.length - 1 > -1 ? stock.p1min.bars[stock.p1min.bars.length - 1] : undefined,
        //       'signal': false,
        //       'stopLoss': 0
        //   },
        '5min': {
            'lastBar': stock.p5min.bars.length - 1 > -1 ? stock.p5min.bars[stock.p5min.bars.length - 1] : undefined,
            'signal': false,
            'stopLoss': 0
        },
        '10min': {
            'lastBar': stock.p10min.bars.length - 1 > -1 ? stock.p10min.bars[stock.p10min.bars.length - 1] : undefined,
            'signal': false,
            'stopLoss': 0
        },
        '15min': {
            'lastBar': stock.p15min.bars.length - 1 > -1 ? stock.p15min.bars[stock.p15min.bars.length - 1] : undefined,
            'signal': false,
            'stopLoss': 0
        },
        '30min': {
            'lastBar': stock.p30min.bars.length - 1 > -1 ? stock.p30min.bars[stock.p30min.bars.length - 1] : undefined,
            'signal': false,
            'stopLoss': 0
        }
    };
    var decisionBars = [];

    var nowHours = $now.getHours();
    var nowMins = $now.getMinutes();
    for (var intvl in sigState) {
        if (!!sigState[intvl].lastBar) {
            // check if last bar is the proper bar, 
            // ie if that last bar has been fully resolved and is available
            // ie if its 12:31 and the last bar for the 30min interval is 10:30 we don't won't to use this interval at this time
            var lbDateHours = sigState[intvl].lastBar.date.getHours();
            var lbDateMins = sigState[intvl].lastBar.date.getMinutes();
            switch (intvl) {
                case '30min':
                    var dmRatio = lbDateMins / 30;
                    var nmRatio = nowMins / 30;
                    var diff = nmRatio - dmRatio;
                    if (nowHours !== lbDateHours || diff > 1) {
                        continue;
                    }
                    break;
                case '15min':
                    var dmRatio = lbDateMins / 15;
                    var nmRatio = nowMins / 15;
                    var diff = nmRatio - dmRatio;
                    if (nowHours !== lbDateHours || diff > 1) {
                        continue;
                    }
                    break;
                case '10min':
                    var dmRatio = lbDateMins / 10;
                    var nmRatio = nowMins / 10;
                    var diff = nmRatio - dmRatio;
                    if (nowHours !== lbDateHours || diff > 1) {
                        continue;
                    }
                    break;
                case '5min':
                    var dmRatio = lbDateMins / 5;
                    var nmRatio = nowMins / 5;
                    var diff = nmRatio - dmRatio;
                    if (nowHours !== lbDateHours || diff > 1) {
                        continue;
                    }
                    break;
                //  case '1min':
                //      var dmRatio = lbDateMins / 1;
                //      var nmRatio = nowMins / 1;
                //      var diff = nmRatio - dmRatio;
                //      if (nowHours !== lbDateHours || diff > 1) {
                //          continue;
                //      }
                //      break;
                default:
                    $bot.log('Unknown interval "' + intvl + '"');
                    break;
            }

            var setLvl = sigState[intvl].lastBar.high - (sigState[intvl].lastBar.high - sigState[intvl].lastBar.low) / $multiplier;
            if (sigState[intvl].lastBar.open > setLvl && sigState[intvl].lastBar.close > setLvl) {
                // now we have prev bar setup properly
                // check if current price has broke out
                if (currPrice > sigState[intvl].lastBar.high) {
                    sigState[intvl].signal = true;
                    sigState[intvl].stopLoss = sigState[intvl].lastBar.low;
                    $log(sigState[intvl].lastBar);
                    decisionBars.push(sigState[intvl].lastBar);
                }
            }
        }
    }

    // now we've calculated the signal for each interval lets check if we need to open a position
    var sigCount = 0;
    var stopLossVal = 0;
    var stopLossIntvl = '';

    var msg = [];
    //  $log(sigState);
    for (var intvl in sigState) {
        if (sigState[intvl].signal === true) {
            $log(intvl + ' @ ' + sigState[intvl].lastBar.date.text('M-D-YY hh:mm:ss A'));
            msg.push(intvl + ' @ ' + sigState[intvl].lastBar.date.text('M-D-YY hh:mm:ss A'));
            sigCount++;
            // ??? do we take the stop loss of the smallest interval or largest interval ???
            stopLossVal = sigState[intvl].stopLoss;
            sigState[intvl].lastBar.intvl = intvl; // put the interval into the last bar so we can use it on the reporting side
            stopLossIntvl = intvl;
        }
    }

    if (sigCount > 1) {
        for (let idx = 0; idx < decisionBars.length; idx++) {
            var setLvl = decisionBars[idx].high - (decisionBars[idx].high - decisionBars[idx].low) / $multiplier;
            decisionBars[idx].setLvl = setLvl;
        }

        var request = {
            url: 'https://joejordan-abcd.firebaseio.com/opportunities/open.json',
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
