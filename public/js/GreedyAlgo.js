(function () {
  greedyKnapsack  = function (weights, values, totalItems, capacity) {
  //set some default values
  var curKnapsackWeight = 0,
      sackValue = 0;
  
  //iterate through the collection
  for(var i = 0; i < totalItems && curKnapsackWeight <= capacity; i++) {
      /*
          if the current weight is less than or equal to what we can 
          add to the knapsack, then we add it. else it will be too 
          heavy
      */
      if(weights[i] <= (capacity - curKnapsackWeight)) {
          //increase the current sack wight and value
          curKnapsackWeight += weights[i];
          sackValue += values[i];
      } else {
          //find the remainder
          var remainder = capacity - curKnapsackWeight;
          //add to sack
          curKnapsackWeight =+ remainder;        
          //find percentage weight remaining
          var pWeight = remainder / itemWeights[i];
          //find the value amount
          var vAmount = pWeight * values[i];
          //add this value to the current sack value and return
          sackValue += vAmount;
          
          //return the value
          return sackValue; 
      }
  }
}
})();