function randomRanges(count, maxValue)
{
    var ranges = [];
    var factor = maxValue/count;
    for (var c = 1; c <= count; c++)
    {
        ranges.push(Math.round(c*factor));
    }
    return ranges;
}
function calcStd(array, mean)
{
    var std = 0;
    array.forEach(element => {
        std += (element - mean)**2;
    })
    return Math.sqrt(std / (array.length-1));
}
function calcMean(array)
{
    var mean = 0;
    array.forEach(element => {
        mean += element;
    })
    return mean / array.length;
}

function selectRandomPoints(layer, number)
{
    var features = layer.getSource().getFeatures();
    var randoms = [];
    var length = features.length;
    var random;
    for (var i=0; i<number; i++)
    {
        var random = Math.floor(Math.random()*length);
        while(randoms.includes(random))
        {
            random = Math.floor(Math.random()*length);
        }
        randoms.push(random);
    }
    var points = [];
    randoms.forEach(random => {
        points.push(features[random])
    })
    return points;
}

export { randomRanges, selectRandomPoints, calcMean, calcStd }