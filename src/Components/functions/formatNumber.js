const formatNumber = ( num, fixed ) => {
    var decimalPart;

    var array = Math.floor(num).toString().split('');
    var index = -3;
    while ( array.length + index > 0 ) {
        array.splice( index, 0, '.' );
        index -= 4;
    }

    if(fixed > 0){
        decimalPart = num.toFixed(fixed).split(".")[1];
        return array.join('') + "," + decimalPart;
    }
    return array.join('');
};

export default formatNumber;