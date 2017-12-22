// This script is asynchronous. Call the $done() callback
// when all code has completed.

// the opp that triggered the event
var opp = $event.opp;
$bot.log($event);
$data.http(opp.data).then($bot.log);
delete $maxPosValue[opp.id];
delete $pctOffMax[opp.id];

$done();