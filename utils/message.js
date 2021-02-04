const moment= require('moment')
exports.formatMessage = (user,text)=>{
 return{
     user,
     text,
     time:moment().format('LT')

 }
}