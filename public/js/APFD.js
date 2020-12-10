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

    // console.log(faultData)

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

  faultTCS  = async function () {

    // $('#myModal').modal({backdrop: 'static', keyboard: false}) 
    // $("#myModal").modal('show');
    // $('#progBar').attr('aria-valuenow', 0);
    // $('#progBar').css('width', '0%');
    // var element = document.getElementById("progBar");

    var data = $('#faults').val()
    var lines = [];
    $.each(data.split(/\n/), function(i, line){
        if(line){
            lines.push(line);
        } else {
            lines.push("");
        }
    });

    // console.log(lines)

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

        console.log(arrData)
        
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
            }
          }while(count)
        
          let index = lines[i].split('unitest')
          faultData[index[1]] = arr
      }
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

    var arrTC = [];
    console.log(pt)
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

    var nm = 41*faultData.length

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

  APFDTCS = async function () {
    
    var sum = 0, tf = new Array(41);

    let update = false

    // console.log(faultData[0])
    for (let j = 0; j < faultData.length; j++){
      for (let k = 0; k < faultData[j].length; k++){
        for (let l = 0; l < 42; l++) {

          if(l == 0) {
            tf[0] = 0
          }

          if(faultData[j][k] == l && !(tf[l])){
            tf[l] = j+1
            // update = true
            break;
          }
        }
        // if(update){
        //   update = false
        //   break;
        // }
      }
    }

    tf.shift()
    console.log(tf)
    tf = tf.filter(function (el) {
      return el != null;
    });
    
    console.log(tf)
    var temp = tf, testOrder = []

    var uniq = temp.reduce(function(a,b){
      if (a.indexOf(b) < 0 ) a.push(b);
      return a;
    },[]);

    testOrder = uniq.map(e => {
      return `T${e}`
    })

    console.log(testOrder)

    var arrTC = [1,2,3,4,5,5,6,6,7,8,9,1,10,11,12,13,13,14,15,16,9,15,15,16,16,17,18,8,16,12,18,19,12,4];
    // for(let m=0; m < tf.length; m++){
    //   let temp = testOrder.findIndex((testOrder) => {
    //               return testOrder == `T${tf[m]}`
    //             })
    //   if(temp>0){
    //     arrTC.push(temp)
    //   }
    // }

    console.log(arrTC)

    for(let n=0; n<arrTC.length; n++){
      sum += arrTC[n]
    }

    console.log(sum)

    var nm = 41*41

    var apfd = 1 - sum/nm + 1/(2*41)
    // var apfd = "100"

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

  APFDHYBRID = async function () {
    
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
    }

    var arrTC = [], testOrder = ["T1","T30","T15","T5","T557","T151","T878","T7","T65","T213","T3","T10","T437","T201","T146","T25","T208","T471","T19","T165","T711","T605","T708","T709","T820","T502","T723","T817","T893","T738","T503","T504","T809","T673","T869","T786","T674","T571","T854","T830","T767","T716","T846","T528","T600","T501","T733","T616","T682","T803","T508","T762","T722","T719","T712","T868","T161","T641","T745","T272","T780","T136","T906","T668","T669","T651","T894","T784","T731","T675","T119","T154","T824","T760","T187","T595","T383","T667","T800","T172","T671","T150","T611","T24","T265","T680","T702","T549","T425","T886","T759","T36","T763","T612","T811","T891","T875","T705","T454","T390","T840","T286","T880","T732","T464","T741","T50","T441","T798","T822","T884","T806","T845","T363","T117","T794","T721","T145","T530","T832","T790","T835","T699","T234","T771","T679","T874","T793","T532","T531","T866","T614","T421","T788","T645","T75","T829","T111","T626","T885","T683","T870","T690","T585","T575","T842","T168","T843","T588","T633","T619","T766","T769","T565","T810","T6","T797","T140","T474","T195","T514","T764","T736","T638","T307","T71","T338","T836","T507","T465","T812","T687","T630","T570","T147","T345","T220","T388","T606","T851","T823","T750","T742","T566","T256","T710","T426","T621","T300","T853","T658","T799","T353","T691","T828","T726","T327","T754","T310","T543","T541","T639","T864","T511","T789","T516","T898","T3","T748","T553","T768","T743","T439","T103","T821","T23","T887","T550","T665","T367","T586","T96","T116","T686","T662","T863","T587","T274","T472","T775","T198","T755","T831","T183","T858","T816","T572","T518","T262","T264","T303","T219","T283","T787","T807","T46","T407","T696","T747","T701","T888","T892","T7","T770","T695","T142","T224","T551","T814","T694","T773","T890","T230","T882","T386","T60","T302","T109","T410","T250","T552","T902","T467","T717","T186","T567","T214","T730","T568","T873","T544","T293","T640","T603","T791","T728","T782","T856","T706","T589","T849","T18","T48","T493","T361","T477","T216","T556","T74","T203","T72","T275","T596","T41","T377","T251","T826","T617","T537","T653","T185","T676","T189","T901","T534","T660","T368","T371","T609","T487","T159","T825","T26","T704","T855","T579","T400","T623","T434","T124","T414","T91","T646","T718","T510","T590","T729","T470","T847","T131","T271","T519","T905","T33","T573","T153","T31","T279","T876","T781","T850","T463","T594","T299","T629","T900","T804","T777","T872","T348","T597","T113","T837","T248","T615","T577","T163","T632","T227","T591","T192","T417","T563","T445","T106","T273","T652","T700","T576","T697","T526","T520","T210","T2","T77","T715","T862","T321","T604","T315","T440","T815","T455","T475","T560","T714","T608","T871","T896","T666","T162","T225","T752","T599","T66","T735","T102","T11","T245","T178","T380","T401","T123","T449","T335","T779","T459","T190","T14","T539","T457","T284","T20","T578","T624","T233","T857","T167","T481","T217","T239","T121","T677","T399","T379","T542","T877","T523","T627","T827","T473","T288","T358","T53","T903","T749","T433","T602","T182","T171","T360","T559","T774","T497","T29","T54","T839","T222","T101","T649","T776","T269","T8","T174","T443","T727","T206","T340","T569","T525","T753","T818","T720","T562","T460","T865","T13","T656","T746","T838","T34","T202","T419","T402","T397","T21","T144","T378","T678","T574","T80","T584","T580","T509","T744","T672","T212","T42","T844","T319","T197","T610","T276","T228","T148","T370","T648","T545","T536","T424","T226","T314","T758","T88","T316","T155","T149","T40","T157","T427","T889","T129","T270","T813","T607","T90","T247","T879","T105","T628","T480","T259","T643","T207","T120","T81","T385","T349","T166","T352","T703","T329","T444","T841","T373","T122","T634","T661","T344","T852","T76","T438","T642","T87","T193","T761","T420","T49","T622","T292","T177","T483","T396","T342","T772","T685","T405","T137","T403","T478","T546","T339","T73","T593","T312","T322","T223","T598","T535","T492","T115","T240","T581","T133","T540","T95","T347","T213","T47","T394","T538","T393","T294","T64","T188","T637","T138","T692","T416","T554","T86","T179","T232","T330","T205","T451","T491","T215","T395","T238","T184","T110","T644","T362","T583","T861","T655","T97","T112","T309","T867","T343","T263","T833","T468","T684","T707","T895","T152","T354","T647","T139","T757","T99","T436","T301","T229","T452","T16","T698","T92","T79","T486","T366","T285","T522","T792","T547","T485","T376","T469","T114","T783","T266","T63","T65","T601","T447","T313","T883","T82","T785","T372","T881","T364","T734","T409","T191","T435","T196","T94","T654","T27","T176","T70","T737","T17","T462","T369","T296","T57","T291","T243","T756","T663","T199","T56","T765","T55","T796","T387","T404","T51","T499","T899","T78","T118","T253","T392","T664","T290","T333","T59","T688","T246","T529","T423","T84","T408","T68","T429","T517","T127","T650","T83","T85","T805","T351","T489","T897","T355","T277","T548","T237","T365","T332","T134","T305","T430","T512","T384","T108","T323","T341","T802","T564","T689","T795","T635","T458","T156","T631","T521","T200","T194","T681","T513","T325","T808","T58","T494","T326","T778","T28","T555","T725","T406","T22","T93","T461","T98","T618","T450","T104","T304","T132","T382","T244","T374","T211","T904","T38","T268","T62","T164","T356","T350","T280","T67","T175","T484","T381","T506","T278","T659","T318","T527","T670","T592","T411","T261","T143","T221","T337","T357","T582","T100","T432","T4","T32","T391","T413","T336","T533","T428","T287","T61","T257","T859","T9","T128","T498","T801","T819","T848","T52","T466","T308","T170","T35","T254","T334","T180","T418","T739","T43","T320","T160","T482","T45","T141","T431","T297","T107","T488","T218","T181","T479","T558","T625","T231","T834","T295","T476","T740","T39","T448","T267","T317","T204","T255","T453","T415","T713","T236","T260","T412","T44","T495","T561","T12","T515","T524","T173","T505","T398","T442","T724","T125","T69","T169","T693","T346","T657","T359","T281","T328","T242","T241","T446","T751","T289","T311","T636","T860","T158","T375","T496","T389","T282","T324","T500","T249","T209","T126","T37","T89","T490","T258","T613","T252","T298","T135","T331","T130","T10","T456","T235","T306","T422","T620"]
    // var testOrder = ["T711","T605","T708","T709","T820","T502","T723","T817","T893","T738","T503","T504","T809","T673","T869","T786","T674","T571","T854","T830","T767","T716","T846","T528","T600","T501","T733","T616","T682","T803","T508","T762","T722","T719","T712","T868","T161","T641","T745","T272","T780","T136","T906","T668","T669","T651","T894","T784","T731","T675","T119","T154","T824","T760","T187","T595","T383","T667","T800","T172","T671","T150","T15","T611","T24","T265","T680","T702","T549","T425","T886","T759","T36","T763","T612","T811","T891","T875","T705","T454","T390","T840","T286","T880","T732","T464","T741","T50","T441","T798","T822","T884","T806","T845","T363","T117","T794","T721","T145","T530","T832","T790","T835","T699","T234","T771","T679","T874","T793","T532","T531","T866","T614","T421","T788","T645","T75","T829","T111","T626","T885","T683","T870","T690","T585","T575","T842","T168","T843","T588","T633","T619","T766","T769","T565","T810","T6","T797","T140","T474","T195","T514","T764","T736","T638","T307","T71","T878","T338","T836","T507","T465","T471","T812","T687","T630","T570","T147","T345","T220","T388","T606","T851","T823","T750","T742","T566","T256","T710","T426","T621","T300","T853","T658","T799","T353","T691","T828","T726","T327","T754","T310","T543","T541","T639","T864","T511","T789","T516","T898","T3","T748","T553","T768","T743","T439","T103","T821","T23","T887","T550","T665","T367","T586","T96","T116","T686","T201","T662","T863","T587","T274","T472","T775","T198","T755","T831","T183","T858","T816","T572","T518","T262","T264","T303","T219","T283","T787","T807","T46","T407","T696","T747","T701","T888","T892","T7","T770","T695","T142","T224","T551","T814","T694","T773","T890","T230","T882","T386","T60","T302","T109","T410","T250","T552","T902","T467","T30","T717","T186","T567","T214","T730","T568","T873","T544","T293","T640","T603","T791","T728","T782","T856","T706","T589","T849","T18","T48","T493","T361","T477","T216","T556","T74","T203","T72","T275","T596","T41","T377","T251","T826","T617","T537","T653","T185","T676","T189","T901","T534","T660","T368","T371","T609","T487","T159","T825","T26","T704","T855","T579","T400","T623","T434","T124","T414","T91","T646","T718","T510","T590","T19","T729","T470","T847","T131","T271","T519","T905","T33","T573","T153","T31","T279","T876","T781","T850","T463","T594","T299","T629","T900","T804","T777","T872","T348","T597","T113","T837","T248","T615","T577","T557","T163","T632","T227","T591","T192","T417","T563","T445","T106","T273","T652","T700","T576","T697","T526","T520","T210","T2","T77","T715","T862","T321","T604","T315","T440","T815","T455","T475","T560","T714","T608","T871","T896","T666","T162","T225","T752","T599","T66","T735","T102","T11","T245","T178","T380","T401","T123","T449","T335","T779","T459","T190","T14","T539","T457","T284","T20","T578","T624","T233","T857","T167","T481","T217","T239","T121","T677","T399","T379","T542","T877","T523","T627","T827","T473","T288","T358","T53","T903","T749","T433","T602","T182","T171","T360","T559","T774","T25","T497","T29","T54","T839","T222","T101","T649","T776","T269","T8","T174","T443","T727","T206","T340","T569","T525","T753","T818","T720","T562","T460","T865","T13","T656","T746","T838","T34","T202","T419","T402","T397","T21","T144","T378","T678","T574","T80","T584","T580","T509","T744","T672","T212","T42","T844","T319","T197","T610","T276","T228","T148","T370","T648","T545","T536","T424","T226","T314","T758","T88","T316","T155","T149","T40","T157","T427","T889","T129","T270","T813","T607","T90","T247","T879","T105","T628","T480","T151","T259","T643","T207","T120","T81","T385","T349","T166","T352","T703","T329","T444","T841","T373","T122","T634","T661","T344","T852","T76","T438","T642","T87","T193","T761","T420","T49","T622","T292","T177","T483","T396","T342","T772","T685","T405","T137","T403","T478","T546","T339","T73","T593","T312","T322","T223","T598","T535","T492","T115","T240","T581","T133","T540","T95","T347","T213","T47","T394","T538","T393","T294","T64","T188","T637","T138","T692","T416","T554","T86","T179","T232","T330","T205","T451","T491","T215","T395","T238","T184","T110","T644","T362","T583","T861","T655","T97","T112","T309","T867","T343","T263","T833","T468","T684","T707","T895","T152","T354","T647","T139","T757","T99","T1","T436","T301","T229","T452","T16","T698","T92","T79","T486","T366","T285","T522","T792","T547","T485","T376","T469","T114","T783","T266","T63","T65","T601","T447","T313","T883","T82","T785","T372","T881","T364","T734","T409","T191","T435","T196","T94","T654","T27","T176","T70","T737","T17","T462","T369","T296","T57","T291","T243","T756","T663","T199","T56","T765","T55","T796","T387","T404","T51","T437","T499","T899","T78","T118","T253","T392","T664","T290","T333","T59","T688","T246","T529","T423","T84","T408","T68","T429","T517","T127","T650","T83","T85","T805","T351","T489","T897","T355","T277","T548","T237","T365","T332","T134","T305","T430","T512","T384","T108","T323","T341","T802","T564","T689","T795","T635","T458","T156","T631","T521","T5","T200","T194","T681","T513","T325","T808","T58","T494","T326","T778","T28","T555","T725","T406","T22","T93","T461","T98","T618","T450","T104","T304","T132","T165","T382","T244","T374","T211","T904","T38","T268","T62","T164","T356","T350","T280","T67","T175","T484","T381","T506","T278","T659","T318","T527","T670","T592","T411","T208","T261","T143","T221","T337","T357","T582","T100","T432","T4","T32","T391","T413","T336","T533","T428","T287","T61","T257","T859","T9","T128","T498","T801","T819","T848","T52","T466","T308","T170","T35","T254","T334","T180","T418","T739","T43","T320","T160","T482","T45","T141","T431","T297","T107","T488","T218","T181","T479","T558","T625","T231","T834","T295","T476","T740","T39","T448","T267","T317","T204","T255","T453","T415","T713","T236","T260","T412","T44","T495","T561","T12","T515","T524","T173","T505","T398","T442","T724","T125","T69","T169","T693","T346","T657","T359","T281","T328","T242","T241","T446","T751","T289","T311","T636","T860","T158","T375","T496","T389","T282","T324","T500","T249","T209","T126","T37","T89","T490","T258","T613","T252","T298","T135","T331","T130","T146","T10","T456","T235","T306","T422","T620"];
    console.log(testOrder)
    for(let m=0; m < tf.length; m++){
      let temp = testOrder.findIndex((testOrder) => {
                  return testOrder == `T${tf[m]}`
                })
      if(temp>0){
        arrTC.push(temp)
      }
    }

    for(let n=0; n<arrTC.length; n++){
      sum += arrTC[n]
    }

    var nm = 41*faultData.length

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

