const random = (max) => {
    return Math.round(Math.random() * max)
    }


let faults = [], set = [], i, j, array = [], apfd
let test_case = [[1303,4],[287,1],[1143,1],[158,3],[605,3],[663,3],[650,3],[1030,4],[90,3],[1140,4],[1046,4],[269,1],[1053,4],[56,1],[210,1],[1420,4],[1119,4],[1177,3],[1441,4],[1089,2],[124,1],[1034, 4],[1231,4],[523, 2],[ 1356,4],[1357,4],[811,4],[92,1],[562, 2],[987,2],[1270,4],[1094,1],[150,4],[858,1]]

for(i=0;i<42;i++) {
for(j=0;j<random(50);j++) {
  set.push(random(1605))
}
faults.push(set)
set = []
}

for (let k = 0; k < test_case.length; k++) array.push(test_case[k][0])

const testcase_faults = async () => {
return new Promise((resolve) => {
let fault_detection = [], pass = true
faults.forEach((element, index, arrayFault) => {
    element.forEach((fault, indexFault) => {
        let a = array.indexOf(fault)
        if(a>0 && pass){
          fault_detection.push(indexFault*a)
          pass = false
        }
    })
    pass = true
    if(index === (arrayFault.length-1)) {
        let total = 0 
        for (const e of fault_detection) {
          total+=e
      }
      console.log(fault_detection)          
      console.log(total)
      resolve(total)
    }
     })
})
}

const calcapfd = async () => {
console.log(faults)
let n = array.length, m = 41

let fault_index = await kira()

let apfd = (fault_index/(n*m)) + (1/(2*n))
console.log(apfd)
}

calcapfd()



