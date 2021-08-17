// List Existing Function
// 1. Random(length)
// 2. Get Similarity Test Plan

var mergedTestOrderSortedRemoved, STP, FTP

const trim = (array) => {
    return new Promise(resolve => {
        let arrayTP = array.map(e => {
            return e.replaceAll(' ','')
        })
        if (arrayTP) {
            resolve(arrayTP)
        }
    })
}

const assignWeight = (array, weight, len) => {
    return new Promise(resolve => {
        let i = 0
        let weightedArray = array.map(e => {
            i++
            if (e.length == 3) {
                e = e.slice(0, 2) + '0' + e.slice(2)
            }
            return e + '-' + (len + 1 - i) * weight
        })
        if (weightedArray) {
            resolve(weightedArray)
        }
    })
}

const hybrid = async() => {
    const similarity = ($('#similarityTP').val()).split(",")
    const fault = ($('#faultTP').val()).split(",")
    const similarityTP = await trim(similarity)
    const faultTP = await trim(fault)
    const weight = parseInt(document.getElementById('formControlRange').value)
    const weightedSimilarityTP = await assignWeight(similarityTP, weight, similarityTP.length)
    const weightedFaultTP = await assignWeight(faultTP, 100 - weight, similarityTP.length)
    let mergedTestOrder = []

    for (let i = 0; i < weightedSimilarityTP.length; i++) {
        if(weightedFaultTP[i] == [] || weightedFaultTP[i] == '' || weightedFaultTP[i] == undefined) {
            mergedTestOrder.push(weightedSimilarityTP[i])
        } else {
            let temp = weightedSimilarityTP[i].split('-')
            let temp2 = weightedFaultTP[i].split('-')
            if (parseInt(temp[1]) > parseInt(temp2[1])) {
                mergedTestOrder.push(weightedSimilarityTP[i], weightedFaultTP[i])
            } else if (parseInt(temp2[1]) > parseInt(temp[1])) {
                mergedTestOrder.push(weightedFaultTP[i], weightedSimilarityTP[i])
            } else if (parseInt(temp[1]) == parseInt(temp2[1])) {
                let ran = random(2)
                if (ran) {
                    mergedTestOrder.push(weightedFaultTP[i], weightedSimilarityTP[i])
                } else {
                    mergedTestOrder.push(weightedSimilarityTP[i], weightedFaultTP[i])
                }
            }
        }
    }

    console.log(weightedSimilarityTP)
    console.log(mergedTestOrder)

    let mergedTestOrderSorted = []
    var current, max, currentList, selectedIndex;
    for (let i = 0; i < mergedTestOrder.length; i++) {

        if (i == 0) {
            currentList = [...mergedTestOrder];
        }

        for (let j = 0; j < currentList.length; j++) {
            current = parseInt(currentList[j].substring(7));

            if (j == 0 || current > max) {
                max = current;
                selectedIndex = j;
            }
        }

        mergedTestOrderSorted.push(currentList[selectedIndex])
        currentList.splice(selectedIndex, 1)
    }

    
    
    let testcases = mergedTestOrderSorted.map(e => e.substring(6, 0))
    mergedTestOrderSortedRemoved = []
    mergedTestOrderSortedRemoved = [...mergedTestOrderSorted]

    let z = 0

    for (z = 0; z < mergedTestOrderSortedRemoved.length; z++) {
        let index = testcases.indexOf(mergedTestOrderSorted[z].substring(6, 0))
        let deleteIndex = testcases.indexOf(mergedTestOrderSorted[z].substring(6, 0), index + 1);
        mergedTestOrderSortedRemoved.splice(deleteIndex, 1)
    }

    if (z == mergedTestOrderSortedRemoved.length) {
        Swal.fire(
            'Successful!',
            'Done Generate Test Order!',
            'success'
        ).then(result => {
            console.log(mergedTestOrderSortedRemoved)
            if (result.value) {
                $("#myModal").modal('hide');
                $('#download').prop('disabled', false);
            }
        })
    }
}

const getSimilarityTestPlan = async () => {
    STP = await getSimilarityTP()
    const cleanedTestPlan = await Promise.all(
                                STP
                                .map(e => e.replaceAll('TC',''))
                                .map(e => parseInt(e)))
    console.log(cleanedTestPlan)
    const APFD = await calcAPFD(cleanedTestPlan)
    if(APFD) {
        console.log(APFD)
        document.getElementById("similarityTP").value = STP.join(',')
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

const getFaultTestPlan = async () => {
    await matchFaults()
    await geneticAlgorithm()
    if(FTP) {
        document.getElementById("faultTP").value = FTP.join(',')
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

const APFD_Hybrid = async() => {
    const cleanedTestPlan = await Promise.all(
        mergedTestOrderSortedRemoved
        .map(e => e.replaceAll('TC',''))
        .map(e => {
            let temp = e.split('-')
            return parseInt(temp[0])
        }))
    console.log(cleanedTestPlan)
    const APFD = await calcAPFD(cleanedTestPlan)
    if(APFD) {
        console.log(APFD)
        Swal.fire(
            'Successful!',
            'Done Calculate APFD!',
            'success'
        ).then(result => {
            if (result.value) {
                $("#myModal").modal('hide');
                $('#download').prop('disabled', false);
            }
        })
    }
}