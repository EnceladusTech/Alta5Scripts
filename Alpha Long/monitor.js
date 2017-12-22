for (let idx = 0; idx < $bot.opps.length; idx++) {
    var opp = $bot.opps[idx];
    if (!opp) {
        $bot.log('opp is undefined!', $bot);
        $log('opp is undefined!', $bot);
        continue;
    }

    if (!$maxPosValue[opp.id] || opp.value > $maxPosValue[opp.id]) {
        $maxPosValue[opp.id] = opp.value;
        $log('max position value changed for ' + opp.so.symbol + ' to ' + $maxPosValue[opp.id], $maxPosValue[opp.id]);
        $bot.log('max position value changed for ' + opp.so.symbol + ' to ' + $maxPosValue[opp.id], $maxPosValue[opp.id]);
    }


    if (!$pctOffMax[opp.id]) {
        $pctOffMax[opp.id] = 100 * (opp.value - $maxPosValue[opp.id]) / $maxPosValue[opp.id];
    }
    var currPctOffMax = Math.round(10000 * (opp.value - $maxPosValue[opp.id]) / $maxPosValue[opp.id]) / 100;
    var prevPctOffMax = $pctOffMax[opp.id];

    if (prevPctOffMax !== currPctOffMax) {
        $pctOffMax[opp.id] = currPctOffMax;
        $bot.log('$pctOffMax changed for ' + opp.so.symbol + ' ' + $pctOffMax[opp.id] + '%', $pctOffMax[opp.id]);
    }
    // check stop loss
    $log('opp.data ' + opp.data, opp.data);
    var last = 0;
    var lastDateTime = $now;
    switch (opp.so.symbol) {
        case $stock1.symbol:
            last = $stock1.last;
            break;
        case $stock2.symbol:
            last = $stock2.last;
            break;
        case $stock3.symbol:
            last = $stock3.last;
            break;
        case $stock4.symbol:
            last = $stock4.last;
            break;
        case $stock5.symbol:
            last = $stock5.last;
            break;
        case $stock6.symbol:
            last = $stock6.last;
            break;
        case $stock7.symbol:
            last = $stock7.last;
            break;
        case $stock8.symbol:
            last = $stock8.last;
            break;
        case $stock9.symbol:
            last = $stock9.last;
            break;
        case $stock10.symbol:
            last = $stock10.last;
            break;
        default:
            $log('stock symbol not found!', opp.so.symbol);
            $bot.log('stock symbol not found!', opp.so.symbol);
            break;
    }
    // check trailing stop
    if (currPctOffMax < 0 && currPctOffMax < (-1 * $trailingStop)) {
        opp.data.data.closeReason = 'Trailing Stop';
        opp.data.data.trailingStop = $trailingStop;
        opp.data.data.pctOffMax = $currPctOffMax;
        opp.data.data.maxPosValue = $maxPosValue[opp.id];
        opp.data.data.endingPosValue = opp.value;
        opp.data.data.lastPrice = last;
        opp.data.data.lastDateTime = lastDateTime;
        opp.data.data.opp = opp;
        opp.close('Closed ' + opp.so.symbol + ' due to trailing stop of ' + $trailingStop +
            '\nMax Pos Value: $' + $maxPosValue[opp.id] +
            '\nPct Off Max: ' + $pctOffMax[opp.id] + '%');
        return;
    }


    if (last <= opp.data.data.stopLoss) {
        opp.data.data.closeReason = 'Stop Loss';
        opp.data.data.pctOffMax = $currPctOffMax;
        opp.data.data.maxPosValue = $maxPosValue[opp.id];
        opp.data.data.endingPosValue = opp.value;
        opp.data.data.lastPrice = last;
        opp.data.data.lastDateTime = lastDateTime;
        opp.data.data.opp = opp;
        opp.close('Closed ' + opp.so.symbol + ' due to stop loss of $' + opp.data.data.stopLoss +
            '\nMax Pos Value: $' + $maxPosValue[opp.id] +
            '\nPct Off Max: ' + $pctOffMax[opp.id] + '%');
    }
}