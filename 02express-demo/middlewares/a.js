// function func1() {
//     console.log('aaa')
//  }
//  function func2() {
//     console.log('bbb')
//  }
// // module.exports = func1
// // module.exports = func2  出错！！下面的覆盖了上面的module.exports


// exports.a = function () {
//     console.log('a')
// }

// module.exports = { a: 2 }
// exports.a = 1 


exports.a = function () {
    console.log('a')
}
exports.a = 1        //相同的賦值會被覆盖掉