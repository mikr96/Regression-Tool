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
        var result = ''
        for(var i = 0; i < b.length; i++) {
          if(a.indexOf(b[i]) >= 0) {
            result += b[i]
            var re = new RegExp(b[i],"g");
            a = a.replace(re,'')
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

const levenshteinDistance = (s1, s2) => {
    return new Promise (resolve => {
        const track = Array(s2.length + 1).fill(null).map(() =>
        Array(s1.length + 1).fill(null));

        for (let i = 0; i <= s1.length; i += 1) {
           track[0][i] = i;
        }
        for (let j = 0; j <= s2.length; j += 1) {
           track[j][0] = j;
        }

        let i, j
        for (j = 1; j <= s2.length; j += 1) {
           for (i = 1; i <= s1.length; i += 1) {
              const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
              track[j][i] = Math.min(
                 track[j][i - 1] + 1, // deletion
                 track[j - 1][i] + 1, // insertion
                 track[j - 1][i - 1] + indicator, // substitution
              );
           }
        }

        if(j == s2.length + 1 && i == s1.length + 1) {
            if(track[s2.length][s1.length] == Math.max(s1.length, s2.length)) {
                resolve(0)
            } else if (track[s2.length][s1.length] === 0) {
                resolve(1)
            } else {
                resolve(track[s2.length][s1.length] / Math.max(s1.length, s2.length))
            }
        }
    })
}

const JaroWrinker  = (s1, s2) => {
    return new Promise (resolve => {
        var m = 0;
      
        // Exit early if either are empty.
        if ( s1.length === 0 || s2.length === 0 ) {
            resolve(0);
        }
      
        // Exit early if they're an exact match.
        if ( s1 === s2 ) {
            resolve(1);
        }
      
        var range     = (Math.floor(Math.max(s1.length, s2.length) / 2)) - 1,
            s1Matches = new Array(s1.length),
            s2Matches = new Array(s2.length);
      
        for ( i = 0; i < s1.length; i++ ) {
            var low  = (i >= range) ? i - range : 0,
                high = (i + range <= s2.length) ? (i + range) : (s2.length - 1);
      
            for ( j = low; j <= high; j++ ) {
            if ( s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j] ) {
                ++m;
                s1Matches[i] = s2Matches[j] = true;
                break;
            }
            }
        }
      
        // Exit early if no matches were found.
        if ( m === 0 ) {
            resolve(0);
        }
      
        // Count the transpositions.
        var k = n_trans = 0;
      
        for ( i = 0; i < s1.length; i++ ) {
            if ( s1Matches[i] === true ) {
            for ( j = k; j < s2.length; j++ ) {
                if ( s2Matches[j] === true ) {
                k = j + 1;
                break;
                }
            }
      
            if ( s1[i] !== s2[j] ) {
                ++n_trans;
            }
            }
        }
      
        var weight = (m / s1.length + m / s2.length + (m - (n_trans / 2)) / m) / 3,
            l      = 0.1,
            p      = 2

        let finalCalc = weight + l * p * (1 - weight)

        if(finalCalc) {
            resolve(finalCalc)
        }

    })
}

const jaccardIndex = (s1, s2) => {
    return new Promise(async (resolve) => {
        const union = await unique(s1.concat(s2))
        const intersect = await filterSameChar(s1, s2)
        if(intersect) {
            resolve(intersect/union)
        } else {
            resolve(0)
        }
    })
}

const cosineSimilarity = (s1, s2) => {
    return new Promise(resolve => {
        if(s1.length != s2.length) {
            resolve(0)
        }

        var dotproduct = 0, mA = 0, mB = 0 
        for(i = 0; i < s1.length; i++) {
            if(typeof s1[i] == 'string') {
                dotproduct += (s1[i].charCodeAt(0) * s2[i].charCodeAt(0));
                mA += (s1[i].charCodeAt(0)*s1[i].charCodeAt(0));
                mB += (s2[i].charCodeAt(0)*s2[i].charCodeAt(0));
            } else {
                dotproduct += (s1[i] * s2[i]);
                mA += (s1[i]*s1[i]);
                mB += (s2[i]*s2[i]);
            }
        }
        mA = Math.sqrt(mA);
        mB = Math.sqrt(mB);
        const cosSimilarity = (dotproduct)/((mA)*(mB)) // here you needed extra brackets
        if(cosSimilarity) {
            resolve(cosSimilarity)
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
    
        var weight = ((intersect / s1.length) + (intersect / s2.length) + (intersect - (union - intersect))/intersect) / 3,
        l      = 0.1,
        p      = 3;
    
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

const getSimilarities = (strings, usage) => {
    return new Promise(async resolve => {
        let allSimilarity = [], radioValue = $("input[name='exampleRadios']:checked").val(), j
        let firstSimilarity, index, tempSimilarity
        for(j = 0; j < strings.length; j++) {
            firstSimilarity = []
            for(index = 0; index < strings.length; index++) {
                // if(j == 382 && index == 1587) {
                //     debugger;
                // }
                if(usage == 'single') {
                    if(radioValue == 'option1') {
                        tempSimilarity = await levenshteinDistance(strings[j], strings[index])
                    } else if(radioValue == 'option2') {
                        tempSimilarity = await jaccardIndex(strings[j], strings[index])
                    } else if(radioValue == 'option3') {
                        tempSimilarity = await cosineSimilarity(strings[j], strings[index])
                    } else if(radioValue == 'option4') {
                        tempSimilarity = await JaroWrinker(strings[j], strings[index])
                    } else if(radioValue == 'option5') {
                        tempSimilarity = await enhanceJaroWinkler(strings[j], strings[index])
                    }
                    firstSimilarity.push(tempSimilarity)
                } else {
                    tempSimilarity = await enhanceJaroWinkler(strings[j], strings[index])
                    firstSimilarity.push(tempSimilarity)
                }
            }
    
            if(index == strings.length) {
                let average = await averageSimilarity(firstSimilarity)
                allSimilarity.push(average)
            }
        }

        if(j == strings.length && index == strings.length) {
            resolve(allSimilarity)
        }

    })
}

const getMean = (data) => {
    return new Promise ((resolve) => {
        let totalMean = 0
        for (const e of data) {
            totalMean += e
        }
        const mean = (totalMean / data.length).toFixed(3) 
        if(mean) {
            resolve(mean)
        }
    })
}

const calcSimilarity = async () => {
    testCasesSimilarity = []
    values = $("#previous").val()
    const dataString = await trim(values.split("\n"))
    dataString.length = Math.round(parseInt(dataString.length)*100/100)
    console.log(dataString.length)
    const allSimilarity = await getSimilarities(dataString, 'single')
    if(allSimilarity) {
        const meanValue = await getMean(allSimilarity)
        const prioritizedSimilarity = await prioritizeSimilarity(allSimilarity)
        testCasesSimilarity = await assignTC(prioritizedSimilarity)
        console.log(testCasesSimilarity)
        Swal.fire(
            'Successful!',
            'You may now download the prioritized test cases !',
            'success'
            ).then(result => {
                console.log('Mean Value: ', meanValue)
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
        values = TCTCAS
        // values = TCJTCAS
        
        const dataString = await trim(values.split("\n"))
        dataString.length = Math.round(parseInt(dataString.length)*100/100)
        console.log(dataString.length)
        const allSimilarity = await getSimilarities(dataString, 'multiple')
    
        if(allSimilarity) {
            console.log(allSimilarity)
            const prioritizedSimilarity = await prioritizeSimilarity(allSimilarity)
            testCasesSimilarity = await assignTC(prioritizedSimilarity)  
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
        const sizeUnittest = 42
        const strings = data.split(/\r?\n/)
        const fault_version = new Array(42)
    
        // Initialize fault multidimensional array
        for (var i = 0; i < fault_version.length; i++) {
            fault_version[i] = new Array(1608);
        }
    
        // Trace and submit value into array
        for (let index = 0; index < strings.length; index += sizeUnittest) {
            let unitest = strings[index].substring(11, 7)
            for (let loop = index + 1; loop < index + sizeUnittest; loop++) {

                let data = strings[loop].substring(5)

                if (data == '1') {
                    let indexVersion = parseInt(strings[loop].substring(2, 4))
                    fault_version[indexVersion][unitest] = parseInt(unitest)
                }
            }
        }

        // Remove empty array
        fault_version.forEach((arr, index) => {
            fault_version[index] = arr.filter((a) => a)
        })
    
        // Calculate total faults
        const total_tl = await testcase_faults(fault_version, testPlan)
        console.log(total_tl)

        // Loop and calculate apfd for each set
        let n = testPlan.length,
            m = 41
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