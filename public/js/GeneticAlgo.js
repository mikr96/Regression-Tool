var radioValue, progress = 0, faultData = new Array(1608), arrData = [], iteration = 0, length = 0, result = [], strMatrix = [], values, strMatrix2 = [], sum = 0, pt = [], definedTestCases = []
var testCasesWithWeight1 = [], testCasesWithWeight2 = [], testCasesWithWeight3 = [], testCasesWithWeight4 = [], valueArr = [], isDuplicate = true, pass = false, first = [], second = []
var id, testOrder = [], generation = 0, csvContent, rows = []
const percent = 100

async function matchFaults() {
    var lines = [];
    const formDataset = async () => {
        return new Promise((resolve, reject) => {
            var data = faultTCAS
            try {
                $.each(data.split(/\n/), function(i, line){
                    if(line){
                        lines.push(line);
                    } else {
                        lines.push("");
                    }
                });
            
                for (i = 0; i < lines.length; i++) {
                    // First Iteration
                    if(i==0) {
            
                        // Get all 41 versions faults
                        for(let j=1; j < 42; j++){
                            arrData.push(lines[i+j])
                        }
                        arrData.sort()
            
                        // Restructure string (del -)
                        for(let k=0; k < 41; k++){
                        let val = arrData[k].split('-');
                        arrData[k] = val[val.length-1]
                        }
                        
                        let count = true, arr = []
                        
                        do{
                        let index = findFault(arrData) 
                        if(index<0) {
                            count=false
                        } else {
                            arr.push(index+1)
                            count=false
                        }
                        }while(count)
            
                        faultData[i] = arr
                    } else if(!(i%42)) {        //Any iteration within every 41 versions of faults
                        arrData = []
                        obj = {}
            
                        for(let j=1; j < 42; j++){
                            arrData.push(lines[i+j])
                        }
                        arrData.sort()
            
                        for(let k=0; k < 41; k++){
                            let val = arrData[k].split('-');
                            arrData[k] = val[val.length-1]
                        }
            
                        let count = true, arr = []
                        do{
                            let index = findFault(arrData) 
                            if(index<0) {
                            count=false
                            } else {
                            arr.push(index+1)
                            count = false
                            }
                        }while(count)
                        
                        let index = lines[i].split('unitest')
                        faultData[index[1]] = arr
                    }
                }                
            
                let weightedTestCases = faultData.map((res, index) => {
                                        if(res[0]>0 && res[0]<11) {
                                            return [index, 4]
                                        }
                                        else if(res[0]>10 && res[0]<21) {
                                            return [index, 3]
                                        }
                                        else if(res[0]>20 && res[0]<31) {
                                            return [index, 2]
                                        }
                                        else if(res[0]>30 && res[0]<41) {
                                            return [index, 1]
                                        }
                                        else if(res[0]>40) {
                                            return [index, 0]
                                        }
                                    })
                //1605 - 602 
                let unresolvedA = weightedTestCases.filter(e => e)
                if(unresolvedA) {
                    resolve(weightedTestCases)
                }
            } catch (err) {
                reject(err)
            }
        });
    } 
        
    definedTestCases = await formDataset()
    console.log(definedTestCases)
    if(i==lines.length) {
        Swal.fire(
            'Successful!',
            'Done Cleaning Faults!',
            'success'
        ).then(result => {
            if(result.value) {
            $("#myModal").modal('hide');
            $('#btnAPFD').prop('disabled', false);
            }
        })
    }
}

var dur, start, end, timetaken = true

async function geneticAlgorithm() {
    if(timetaken) {
        start = new Date().getTime()
        timetaken = false
    }
    const t0 = performance.now()
    const genPopulation = async () => {
        return new Promise (async (resolve, reject) => {
            try {
                // Generate 10 sets of test cases with 601 length
                const testOrder = await generateTestSets(definedTestCases)
                // const currentOrder = deepCopy(testOrder)
            
                // Remove duplicates
                const testOrderNew = await removeDuplicates(testOrder)

                if(testOrderNew) {
                    resolve(testOrderNew)
                }
            } catch (err) { 
                reject(err) 
            }
        })
    }

    const calcFitnessScore = async (testOrderTemp) => {
        return new Promise (async (resolve, reject) => {
            try {
                // Calculate APFD
                // n = number of test cases exposed = 902
                // m = number of faults version = 41 // // 41 

                let data = faultTCAS
                const sizeUnittest = 42;
                const strings = data.split(/\r?\n/);
                const fault_version = new Array(42);

                // Initialize fault multidimensional array
                for (var i = 0; i < fault_version.length; i++) {
                    fault_version[i] = new Array(1608);
                }

                // Trace and submit value into array
                for (let index = 0; index < strings.length; index += sizeUnittest) {
                    let unitest = strings[index].substring(11, 7)
                    for(let loop = index + 1; loop < index + sizeUnittest; loop++){
                        // 
                        let data = strings[loop].substring(5);
                        
                        if(data == '1'){
                            let indexVersion = parseInt(strings[loop].substring(2,4))
                            fault_version[indexVersion][unitest] = parseInt(unitest);
                        }
                    }
                }

                // Remove empty array
                fault_version.forEach((arr, index) => {
                    fault_version[index] = arr.filter((a) => a);
                })


                // Calculate total faults
                const total_tl = await testcase_faults(fault_version, testOrderTemp)

                // Loop and calculate apfd for each set
                // Total test case 1608 tetapi hanya 602 sahaja yang ada faults
                let apfd_all = [], n = 602, m = 41
                for(let p = 0; p < total_tl.length; p++) {
                    let apfd = (total_tl[p]/(n*m)) + (1/(2*n))
                    apfd_all.push(apfd)
                }
                if(apfd_all) {
                    let maxApfd = Math.max(...apfd_all)
                    let maxTotal = apfd_all.findIndex(res => res === maxApfd)
                    resolve(apfd_all)
                }
                
            } catch (err) {
                reject (err)
            }
        })
    }

    const testcase_faults = async (faults, testPlan) => {
        return new Promise((resolve) => {
            let total_all = []
            let total
            let proceed = false
            // console.log(faults)
            testPlan.forEach((array, indexArray, arrayLength) => {
                
                let testArray = []
                for (let k = 0; k < array.length; k++) testArray.push(array[k][0])

                let fault_detection = [], pass = true
                faults.forEach((element, index, arrayFault) => {
                    if(element != [] && element != '' && element != undefined) {
                        for(let i=0; i<element.length; i++) {
                            let a = testArray.indexOf(element[i])
                            if(a>0 && pass){
                              fault_detection.push((i+1)*a)
                              pass = false
                            }
                        }
                    }
                    pass = true
                    if(index === (arrayFault.length-1)) {
                        total = 0 
                        for (const e of fault_detection) {
                          total+=e
                        }
                    }
                })

                total_all.push(total)
                if(indexArray === (arrayLength.length-1)) {
                    proceed = true
                }
            })

            if(proceed) {
                resolve(total_all)
            }
        })
    }

    const crossover = async (apfd_all, testOrderTemp) => {
        return new Promise((resolve, reject) => {
            try {
                // Crossover session
                var max = 0, maxi = 0

                max = Math.max(...apfd_all)
                let temp = removeArray(apfd_all, max)
                maxi = Math.max(...temp)
            
                max = apfd_all.findIndex(res => res === max)    // show index position highest apfd
                maxi = apfd_all.findIndex(res => res === maxi)  // show index position 2nd highest apfd
            
                // Randomly set point for crossover 
            
                let ran = random(testOrderTemp[0].length)
                let a = testOrderTemp[max].slice(0, ran)
                let b = testOrderTemp[max].slice(ran, testOrderTemp[max].length)
                let c = testOrderTemp[maxi].slice(0, ran)
                let d = testOrderTemp[maxi].slice(ran, testOrderTemp[max].length)
            
                if (a && b && c && d) {
                    testOrderTemp[max] = a.concat(d)
                    testOrderTemp[maxi] = c.concat(b)
                    resolve(testOrderTemp)
                }
            } catch (err) {
                reject(err)
            }
        })
    }

    const mutation = async (testOrderTemp) => {
        return new Promise(async (resolve, reject) => {
            try {    
                // Mutation, remove same 
                var pass = false, duplicates = []

                testOrderTemp.forEach((order, indexOrder, array) => {
                    if(order.length > 0  && order != null && order != undefined) {
                        valueArr = [];
                        for (let index = 0; index < order.length; index++) valueArr.push(order[index][0])
            
                        if(checkDuplicate(valueArr) && indexOrder === (array.length-1)){
                            duplicates = findDuplicates(valueArr)
                            duplicates.forEach(element => {
                                let indexDuplicate = valueArr.indexOf(element)
                                testOrderTemp[indexOrder].splice(indexDuplicate, 1, randomTestCase(valueArr))
                            });
                            pass = true
                        } else if(checkDuplicate(valueArr)) {
                            duplicates = findDuplicates(valueArr)
                            duplicates.forEach(element => {
                                let indexDuplicate = valueArr.indexOf(element)
                                testOrderTemp[indexOrder].splice(indexDuplicate, 1, randomTestCase(valueArr))
                            });
                        } else if(indexOrder === (array.length-1)) {
                            pass = true
                        }
                    }
                    if (indexOrder === (array.length-1) && pass) {
                        if(checkDuplicate(testOrderTemp)) {
                            resolve(testOrderTemp)
                        }
                    }
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    let testOrderTrial = await genPopulation()
    let apfd_trial = await calcFitnessScore(testOrderTrial)
    let crossoverResult = await crossover(apfd_trial, testOrderTrial)
    let testOrderFinal = await mutation(crossoverResult)
    let apfd_final = await calcFitnessScore(testOrderFinal)

    let max = Math.max(...apfd_final)

    if(max < 0.95 || max > 1.00) {
        generation++
        let maxi = 0
        let temp = removeArray(apfd_final, max)
        maxi = Math.max(...temp)
        
        if(max >= 0.6) {
            // console.log(apfd_final)
            // console.log(testOrderFinal)
            // console.log(`No. of Generation: ${generation}`)
            rows.push([generation, max])
        }
        max = apfd_final.findIndex(res => res === max)    // show index position highest apfd
        maxi = apfd_final.findIndex(res => res === maxi)  // show index position 2nd highest apfd

        first = testOrderFinal[max]
        second = testOrderFinal[maxi]

        await geneticAlgorithm()
    } else if (max >= 0.95 && max < 1.00) {
        generation++
        rows.push([generation, max])
        const t1 = performance.now()
        console.log((t1 - t0) + " milliseconds")
        end = new Date().getTime();
        var dur = end - start;
        console.log('Duration: ', dur)
        console.log(`No. of Generation: ${generation}`)
        console.log(`Highest APFD: ${max}`)
        max = apfd_final.findIndex(res => res === max)
        console.log('TEST ORDER =>', testOrderFinal[max])
        rows.push(['TEST ORDER =>', testOrderFinal[max]])
        generation = 0
        FTP = await Promise.all(
                    testOrderFinal[max]
                    .map(e => e[0])
                    .map(e => {
                        if((e.toString()).length == 3) {
                            return `TC0${e}`
                        }
                        else if((e.toString()).length == 2) {
                            return `TC00${e}`
                        }
                        else if((e.toString()).length == 1) {
                            return `TC000${e}`
                        }
                        else if((e.toString()).length == 4) {
                            return `TC${e}`
                        }
                    }))
        // Swal.fire(
        //     'Successful!',
        //     'Done Pioritizing Order!',
        //     'success'
        // ).then(result => {
        //     if(result.value) {
        //     $("#myModal").modal('hide');
        //     $('#download').prop('disabled', false);
        // }
        // })
    }
}

const removeUndefined = function (value) {
    return value
}

const random = (max) => {
        return Math.round(Math.random() * max)
}

const removeArray = function (arr, value) {
    return arr.filter((ele) => {
        return ele !=value
    })
}

const checkDuplicate = (item) => {
        return item.some((item, idx) => { 
            return valueArr.indexOf(item) != idx 
        });
}

const findDuplicates = (arr) => {
        const distinct = new Set(arr);        // to improve performance
        const filtered = arr.filter(item => {
            // remove the element from the set on very first encounter
            if (distinct.has(item)) {
                distinct.delete(item);
            }
            // return the element on subsequent encounters
            else {
                return item;
            }
        });
        return [...new Set(filtered)]
}

const removeDuplicates = (array_big) => {
    return new Promise((resolve, reject) => {
        try {
            var pass = false, duplicates = []
                array_big.forEach((order, indexOrder, array) => {
                    if(order.length > 0  && order != null && order != undefined) {
                        valueArr = [];
                        for (let index = 0; index < order.length; index++) valueArr.push(order[index][0])
            
                        if(checkDuplicate(valueArr) && indexOrder === (array.length-1)){
                            duplicates = findDuplicates(valueArr)
                            duplicates.forEach(element => {
                                let indexDuplicate = valueArr.indexOf(element)
                                // console.log(element, indexOrder, indexDuplicate)
                                array_big[indexOrder].splice(indexDuplicate, 1, randomTestCase(valueArr))
                            });
                            pass = true
                        } else if(checkDuplicate(valueArr)) {
                            duplicates = findDuplicates(valueArr)
                            duplicates.forEach(element => {
                                let indexDuplicate = valueArr.indexOf(element)
                                // console.log(element, indexOrder, indexDuplicate)
                                array_big[indexOrder].splice(indexDuplicate, 1, randomTestCase(valueArr))
                            });
                        } else if(indexOrder === (array.length-1)) {
                            pass = true
                        }
                    }
                    if (indexOrder === (array.length-1) && pass) {
                        if(checkDuplicate(array_big)) {
                            resolve(array_big)
                        }
                    }
                })
        } catch (err) {
            reject(err)
        }
    })
}

const generateTestSets = (allTestCases) => {
    return new Promise((resolve, reject) => {
        try {
            let testSet = [], testOrder = [], i = 0, j = 0
            
            // Randomize selection
            if(generation > 0) { 
                testOrder.push(first, second)
                for(i = 0; i<8; i++) {
                    for(j = 0; j<601; j++) {
                        let randomTC = randomTestCase(testOrder)
                        // let index = random(1608)
                        testSet.push(randomTC)
                        if(i===7 && j===600) { 
                            resolve(testOrder) 
                        }
                    }
    
                    testOrder.push(testSet)
                    testSet = []
                }
            } else {
                for(i = 0; i<10; i++) {
                    for(j = 0; j<601; j++) {
                        let randomTC = randomTestCase(testOrder)
                        // let index = random(1608)
                        testSet.push(randomTC)
                        if(i===9 && j===600) { 
                            resolve(testOrder) 
                        }
                    }
    
                    testOrder.push(testSet)
                    testSet = []
                }
            }

            
        } catch (err) {
            reject(err)
        }
    })
}

const randomTestCase = (arr) => {
    let index = random(1608)
    while(definedTestCases[index] === null || definedTestCases[index] === undefined || arr.indexOf(index) >= 0){
        index = random(1608)
    }
    return definedTestCases[index]
}

// set up a function that iterates through a given array
// if one of the elements is an array, call itself with that element
// (Edited)
// if elements of the array is an object, we make sure to take care of that too.
const deepCopy = (arr) => {
    let copy = [];
    arr.forEach(elem => {
      if(Array.isArray(elem)){
        copy.push(deepCopy(elem))
      }else{
        if (typeof elem === 'object') {
          copy.push(deepCopyObject(elem))
      } else {
          copy.push(elem)
        }
      }
    })
    return copy;
}

// Helper function to deal with Objects
const deepCopyObject = (obj) => {
    let tempObj = {};
    for (let [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        tempObj[key] = deepCopy(value);
      } else {
        if (typeof value === 'object') {
          tempObj[key] = deepCopyObject(value);
        } else {
          tempObj[key] = value
        }
      }
    }
    return tempObj;
}

function downloadCSV() {
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}

function download() {
    var ws_data = [['# of Generations' , 'APFD']]
    var wb = XLSX.utils.book_new();
    wb.Props = {
    Title: "TCP with GA",
    Subject: "Prioritized Test Cases",
    Author: "Irsyad Kamil"
    };
    wb.SheetNames.push("Result Sheet");
    rows.forEach((data, index) => {
        ws_data.push(data);  //a row with 2 columns
    })

    var ts = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["Result Sheet"] = ts;
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'TCPGA.xlsx');
}
    
function s2ab(s) { 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
}
 