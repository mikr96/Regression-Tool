var testCasesSimilarity

const unique = (str) => {
    return new Promise(resolve => {
        var result = '';
        for(var i = 0; i < str.length; i++) {
          if(result.indexOf(str[i]) < 0) {
            result += str[i];
          }
        }
        if(i==str.length) {
            resolve(result.length)
        }
    })
}

const filterSameChar = (a, b) => {
    return new Promise(resolve => {
        var result = '';
        for(var i = 0; i < b.length; i++) {
          if(a.indexOf(b[i]) >= 0) {
            result += b[i];
          }
        }
        if(i==b.length) {
            resolve(result.length)
        }
    })
}

const assignTC = (array) => {
    return new Promise(resolve => {
        let TCArray = array.map(e => {
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
        })
        if(TCArray) {
            resolve(TCArray)
        }
    })
}

const removeTC = (array) => {
    return new Promise(resolve => {
        let TCArray = array.map(e => {
            return parseInt(e.replaceAll('TC',''))
        })
        if(TCArray) {
            resolve(TCArray)
        }
    })
}

const enhanceJaroWinkler = (s1, s2) => {
    return new Promise(async (resolve) => {
        if ( s1.length === 0 || s2.length === 0 ) {
            resolve(0);
        }
        if ( s1 === s2 ) {
            resolve(1);
        }
    
        const union = await unique(s1.concat(s2))
        const intersect = await filterSameChar(s1, s2)
    
        var weight = ((intersect / s1.length) + (intersect / s2.length) + ((intersect - (union - intersect))/2)/intersect) / 3,
        l      = 0.1,
        p      = 2;
    
        let finalCalc = weight + l * p * (1 - weight)

        if(finalCalc) {
            resolve(finalCalc)
        }
    })
}

const averageSimilarity = (arrayOfSimilarities) => {
    return new Promise(resolve => {
        let total = 0, i = 0
        for (i=0; i<arrayOfSimilarities.length; i++) {
            total+=arrayOfSimilarities[i]
        }
        if(i == arrayOfSimilarities.length) {
            resolve(total/arrayOfSimilarities.length)
        }
    })
}

const prioritizeSimilarity = (arrayOfSimilarities) => {
    return new Promise(resolve => {
        let prioritizedSimilarities = []
        let indices = [...Array(arrayOfSimilarities.length).keys()]
        prioritizedSimilarities = indices.sort((a, b) => { 
                                    return arrayOfSimilarities[a] < arrayOfSimilarities[b] ? -1 : arrayOfSimilarities[a] > arrayOfSimilarities[b] ? 1 : 0; 
                                });
        if(prioritizedSimilarities) {
            resolve(prioritizedSimilarities)
        }
    })
}

const getSimilarities = (strings) => {
    return new Promise(async resolve => {
        let allSimilarity = []
        strings.forEach(async (elementParent, indexParent, arrayOriginal) => {
            let firstSimilarity = [], i
            for(i=0; i<arrayOriginal.length; i++) {
                let tempSimilarity = await enhanceJaroWinkler(elementParent, arrayOriginal[i])
                firstSimilarity.push(tempSimilarity)
            }
            if(i === arrayOriginal.length) {
                let average = await averageSimilarity(firstSimilarity)
                allSimilarity.push(average)
            }
            if(i === arrayOriginal.length && indexParent === arrayOriginal.length -1) {
                resolve(allSimilarity)
            }
        })
    })
}

const calcSimilarity = async () => {
    testCasesSimilarity = []
    radioValue = $("input[name='exampleRadios']:checked").val();
    values = $("#previous").val();
    const dataString = await trim(values.split("\n"))
    // dataString.length = 50
    const allSimilarity = await getSimilarities(dataString)

    if(allSimilarity) {
        const prioritizedSimilarity = await prioritizeSimilarity(allSimilarity)
        testCasesSimilarity = await assignTC(prioritizedSimilarity)
        Swal.fire(
            'Successful!',
            'You may now download the prioritized test cases !',
            'success'
            ).then(result => {
                if(result.value) {
                    $("#myModal").modal('hide');
                    $('#download').prop('disabled', false);
                }
            })
    }
}

const getSimilarityTP = async () => {
    return new Promise(async (resolve) => {
        testCasesSimilarity = []
        values = TCTCAS;
        const dataString = await trim(values.split("\n"))
        const allSimilarity = await getSimilarities(dataString)
    
        if(allSimilarity) {
            const prioritizedSimilarity = await prioritizeSimilarity(allSimilarity)
            testCasesSimilarity = await assignTC(prioritizedSimilarity)  
            console.log(testCasesSimilarity)
            if(testCasesSimilarity) {
                resolve(testCasesSimilarity)
            }      
        }
    })
}

const calcSimilarityAPFD = async () => {
    const removedTCSimilarity = await removeTC(testCasesSimilarity) 
    const APFD = await calcAPFD(removedTCSimilarity) 
    if(APFD) {
        console.log(APFD)
    }
}

const calcAPFD = async (testPlan) => {
    return new Promise (async (resolve) => {
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
            for (let loop = index + 1; loop < index + sizeUnittest; loop++) {
                // 
                let data = strings[loop].substring(5);
    
                if (data == '1') {
                    let indexVersion = parseInt(strings[loop].substring(2, 4))
                    fault_version[indexVersion][unitest] = parseInt(unitest);
                }
            }
        }
    
        // Remove empty array
        fault_version.forEach((arr, index) => {
            fault_version[index] = arr.filter((a) => a);
        })
    
        // Calculate total faults
        const total_tl = await testcase_faults(fault_version, testPlan)
        console.log(total_tl)
        // Loop and calculate apfd for each set
        let n = 1603,
            m = 35
        const apfd = (total_tl / (n * m)) + (1 / (2 * n))
        if(apfd) {
            resolve(apfd)
        }
    })

}

const testcase_faults = async(faults, testPlan) => {
    return new Promise((resolve) => {
        let totalT1 = 0, proceed = false,
            fault_detection = [],
            pass = true
        faults.forEach((element, index, arrayFault) => {
            if(element != [] && element != '' && element != undefined) {
                for(let i=0;i<element.length;i++) {
                    let a = testPlan.indexOf(element[i])
                    if (a > 0 && pass) {
                        fault_detection.push((i+1) * a)
                        pass = false
                    }
                }
                pass = true
            }
            if (index === (arrayFault.length - 1)) {
                totalT1 = 0
                for (const e of fault_detection) {
                    totalT1 += e
                }
                proceed = true
            }
        })

        if (proceed) {
            resolve(totalT1)
        }
    })
}