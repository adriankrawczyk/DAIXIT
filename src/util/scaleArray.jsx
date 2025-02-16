export default function scaleArray(array, scale) {
    let newArray = array
    for (let i = 0; i < array.length; ++i ){
        newArray[i] = newArray[i]*scale
    }
    return newArray;
}
  