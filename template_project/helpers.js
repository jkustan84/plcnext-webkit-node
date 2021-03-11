exports.isObjEmpty = (obj) => {
    for (var key in obj){
        if(obj.hasOwnProperty(key)){
            return false;
        }
    }
    return true;
}

exports.isObjArrayDiff = (array1, array2) => {
    //Check length
    if(array1.length !== array2.length){
        return true;
    }

    //Check names
    for (i = 0; i < array1.length; i++){
        if(array2[i].name !== array1[i].name){
            return true;
        }
    }

    //Check types
    for (i = 0; i < array1.length; i++){
        if(array2[i].type !== array1[i].type){
            return true;
        }
    }

    return false;
}