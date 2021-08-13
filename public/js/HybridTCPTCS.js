const random = (max) => {
    return Math.round(Math.random() * max)
}
  
const extract = (array) => {
    return new Promise(resolve => {
    let arrayTP = array.map(e => {
    return e
    })
    if(arrayTP) {
        resolve(arrayTP)
    }
})
}
  
const assignWeight = (array, weight) => {
    return new Promise(resolve => {
    let i = 0
    let weightedArray = array.map((e, index, indexLength) => {
    i++
    if(e.length == 3) {
        e = e.slice(0, 2) + '0' + e.slice(2)
    }
    return e + '-' + (indexLength.length+1-i)*weight
    })
    if(weightedArray) {
    resolve(weightedArray)
    }
})
}
  
const similarity = ["TC1", "TC2", "TC3", "TC5", "TC4"]
const fault = ["TC5", "TC3", "TC2", "TC1", "TC4"]
  
const hybrid = async () => {
    const weight = parseInt(document.getElementById('formControlRange').value)
    const similarityTP = await extract(similarity)	
    const faultTP = await extract(fault)
    const weightedSimilarityTP = await assignWeight(similarityTP, weight)
    const weightedFaultTP = await assignWeight(faultTP, 100-weight)

    let mergedTestOrder = []

    for(let i=0; i<weightedSimilarityTP.length;i++) {
        let temp = parseInt(weightedSimilarityTP[i].slice(5)) 	
        let temp2 = parseInt(weightedFaultTP[i].slice(5))
        if(temp > temp2) {
            mergedTestOrder.push(weightedSimilarityTP[i], weightedFaultTP[i])
        } else if (temp2 > temp) {
                    mergedTestOrder.push(weightedFaultTP[i], weightedSimilarityTP[i])
        } else if (temp == temp2) {
                let ran = random(2)
            if(ran) {
            mergedTestOrder.push(weightedFaultTP[i], weightedSimilarityTP[i])
            } else {
            mergedTestOrder.push(weightedSimilarityTP[i], weightedFaultTP[i])
            }
        }
    }
    
    
    let mergedTestOrderSorted = []
    var current, max, currentList, selectedIndex;

    for(let i=0; i<mergedTestOrder.length;i++) {

        if(i == 0){
            currentList = [...mergedTestOrder];
        }

        for (let j = 0; j < currentList.length; j++) {
            current = parseInt(currentList[j].substring(5));
        
            if(j == 0 || current > max){
                max = current;
                selectedIndex = j;
            }
        }
    
        mergedTestOrderSorted.push(currentList[selectedIndex])
        currentList.splice(selectedIndex, 1)
    }
    
    let testcases = mergedTestOrderSorted.map(e => e.substring(4, 0))  
    let mergedTestOrderSortedRemoved = [...mergedTestOrderSorted]
      
    for (let i=0;i<mergedTestOrderSortedRemoved.length;i++) {
        let index = testcases.indexOf(mergedTestOrderSorted[i].substring(4, 0))
        let deleteIndex = testcases.indexOf(mergedTestOrderSorted[i].substring(4, 0), index+1);
        mergedTestOrderSortedRemoved.splice(deleteIndex, 1)
    }
    
    console.log(mergedTestOrderSortedRemoved)
  }

const calcAPFD = () => {
    
}