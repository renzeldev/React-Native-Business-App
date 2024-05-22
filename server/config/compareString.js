
const compareString = (data1, data2) => {
  if(data1.length < data2.length) {
    return false;
  } else {
    var j = 0;
    for(var i = 0; i < data1.length; i++) {
      if(data1[i] === data2[j]) {
        j++;
        if(j === data2.length) {
          return true;
        }
      }
    }
    return false;
  }
}



module.exports = compareString;