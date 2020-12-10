(function () {
  EnhancedJaroWrinker  = function (s1, s2) {
  var m = [], all = [], sama=0;

  //console.log(s1, s2)
  // Exit early if either are empty.
  if ( s1.length === 0 || s2.length === 0 ) {
      return 0;
  }

  // Exit early if they're an exact match.
  if ( s1 === s2 ) {
      return 1;
    }

    var s1Matches = new Array(s1.length),                                               // initialize 
        s2Matches = new Array(s2.length);

for ( i = 0; i < s1.length; i++ ) {
    var low  = 0,
        high = (s1.length <= s2.length) ? (s1.length - 1) : (s2.length - 1);

    for ( j = low; j <= high; j++ ) {            
        // nak trace bilangan alphabet sama
        if ( s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j] ) {
            if(s1[i] != " " && s2[j] != " ") {
                m.push(s2[j]);
            }
            s1Matches[i] = s2Matches[j] = true;                    
            break;
        }
    }
}
    var union = [];
    for ( i = 0; i < s1.length; i++ ) {
        if(s1[i] != " ") {
            union.push(s1[i])            
        }
    }

    for ( i = 0; i < s2.length; i++ ) {
        if(!(union.indexOf(s2[i]) > -1) && s2[i] != " ") {
            union.push(s2[i])            
        }
    }
    
    var transpose = union.filter(f => !m.includes(f))

  // Exit early if no matches were found.
    if ( m.length === 0 ) {
        return 0;
    }

    var weight = ((m.length / s1.length) + (m.length / s2.length) + Math.abs((m.length - transpose.length / 2 + 1) / m.length)) / 3,
        l      = 0.1,
        p      = 2;

    weight = weight + l * p * (1 - weight);
    return weight;
}
})();