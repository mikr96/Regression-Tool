(function () {

  var count = 0, position = 0, obj = {}, faultData = new Array(1608), arrData = [], i 

  faults  = async function () {

    $('#myModal').modal({backdrop: 'static', keyboard: false}) 
    $("#myModal").modal('show');
    $('#progBar').attr('aria-valuenow', 0);
    $('#progBar').css('width', '0%');
    var element = document.getElementById("progBar");

    var data = $('#faults').val()
    var lines = [];
    $.each(data.split(/\n/), function(i, line){
        if(line){
            lines.push(line);
        } else {
            lines.push("");
        }
    });

    for (i = 0; i < lines.length; i++) {
      if(i==0) {
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
          }
        }while(count)

        faultData[i] = arr
        
      } else if(!(i%42)) {
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
            }
          }while(count)
        
          let index = lines[i].split('unitest')
          faultData[index[1]] = arr
      }
      element.style.width = (i+1)/lines.length*100 + '%';
    }

    console.log(faultData)

    if(i==lines.length){
      Swal.fire(
        'Successful!',
        'Done Sorting!',
        'success'
      ).then(result => {
        if(result.value) {
          $("#myModal").modal('hide');
          $('#btnAPFD').prop('disabled', false);
        }
      })
    }
}

  findFault = function (arrData) {
    let index = arrData.findIndex((arrData) => {
                  return arrData == 1
                })
    delete arrData[index]
    return index
  }

  checkFault = function (arrData) {
    return arrData == 1
  }

  APFD = async function () {

    $('#myModal').modal({backdrop: 'static', keyboard: false}) 
    $("#myModal").modal('show');
    $('#progBar').attr('aria-valuenow', 0);
    $('#progBar').css('width', '0%');
    var element = document.getElementById("progBar");
    
    var sum = 0, tf = new Array(41);

    let update = false
    for (let j = 0; j < faultData.length; j++){
      for (let k = 0; k < faultData[j].length; k++){
        for (let l = 0; l < 42; l++) {

          if(l == 0) {
            tf[0] = 0
          }

          if(faultData[j][k] == l && !(tf[l])){
            tf[l] = j+1
            update = true
            break;
          }
        }
        if(update){
          update = false
          break;
        }
      }
      element.style.width = (j+1)/faultData.length*100 + '%';
    }
    console.log(tf)

    var pt = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'T13', 'T14', 'T15', 'T16'], arrTC = [];
    for(let m=0; m < tf.length; m++){
      let temp = pt.findIndex((pt) => {
                  return pt == `T${tf[m]}`
                })
      if(temp>0){
        arrTC.push(temp)
      }
    }

    for(let n=0; n<arrTC.length; n++){
      sum += arrTC[n]
    }

    console.log(arrTC)

    var nm = 41*faultData.length

    console.log(sum)

    console.log(nm)

    var apfd = 1 - sum/nm + 1/(2*faultData.length)

    Swal.fire(
      'Successful!',
      `APFD = ${apfd}`,
      'success'
    ).then(result => {
      if(result.value) {
        $("#myModal").modal('hide');
      }
    })
  }
})();