const hybridEW = async() => {
    const similarity = ($('#similarityEWTP').val()).split(",")
    const fault = ($('#faultTP').val()).split(",")
    const similarityTP = await trim(similarity)
    const faultTP = await trim(fault)
    const weight = parseInt(document.getElementById('formControlRange').value)

    const weightedSimilarityTP = await assignWeight(similarityTP, 100 - weight, similarityTP.length)
    const weightedFaultTP = await assignWeight(faultTP, weight, similarityTP.length)
    let mergedTestOrder = []

    console.log(weightedSimilarityTP.length)

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

    let mergedTestOrderSorted = []
    var current, max, currentList, selectedIndex
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

    console.log(mergedTestOrderSorted)
    
    let testcases = mergedTestOrderSorted.map(e => e.substring(6, 0))
    mergedTestOrderSortedRemoved = []
    mergedTestOrderSortedRemoved = [...mergedTestOrderSorted]

    let z = 0

    for (z = 0; z < mergedTestOrderSortedRemoved.length; z++) {
        let index = testcases.indexOf(mergedTestOrderSorted[z].substring(6, 0))
        let deleteIndex = testcases.indexOf(mergedTestOrderSorted[z].substring(6, 0), index + 1)
        mergedTestOrderSortedRemoved.splice(deleteIndex, 1)
    }

    console.log(mergedTestOrderSortedRemoved)

    if (z == mergedTestOrderSortedRemoved.length) {
        Swal.fire(
            'Successful!',
            'Done Generate Test Order!',
            'success'
        ).then(result => {
            if (result.value) {
                $("#myModal").modal('hide');
                $('#download').prop('disabled', false);
            }
        })
    }
}

const getSimilarityEWTestPlan = async () => {
    STP = await getSimilarityEWTP()
    // const cleanedTestPlan = await Promise.all(
    //                             STP
    //                             .map(e => e.replaceAll('TC',''))
    //                             .map(e => parseInt(e)))
    const removedTCSimilarity = await removeTC(STP) 
    console.log(removedTCSimilarity)
    const APFD = await calcAPFD(removedTCSimilarity, 'hybrid')
    if(APFD) {
        console.log(APFD)
        document.getElementById("similarityEWTP").value = STP.join(',')
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