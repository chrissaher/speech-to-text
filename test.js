// var interval = 5 * 1000;
// var calls = 0;
// var luckyNumber = 4;
//
// var doSomething = new Promise(() => {
//   var isLucky = setInterval(function(){
//     console.log("Calling function #", calls);
//
//     // do your stuff here
//     var myNumber = Math.floor(Math.random() * 8);
//     if (myNumber == luckyNumber) {
//       console.log("#", calls, " IS LUCKY")
//       clearInterval(isLucky)
//       return true
//     }
//     calls += 1;
//     return false
//   }, interval)
// }).then(()=>{
//   return;
// }).catch(
//   function(err){
//     console.error(err, err.stack)
//   }
// );
//
//
// doSomething;

// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('uuid');
var fs = require('fs');

AWS.config.update({region:'us-east-2'});

// Create a name for transcribejob
var transcribejob = 'job_3'

// Define params for promise
var params = {
  LanguageCode: 'en-US', /* required */
  Media: { /* required */
    MediaFileUri: 'https://s3.us-east-2.amazonaws.com/aws-trans/Google_Gnome.wav'
  },
  MediaFormat: 'wav', /* required */
  TranscriptionJobName: transcribejob, /* required */
};

// Create a transcirbe service
var transcribeService = new AWS.TranscribeService();

// Create a promise for Transcribe service object
// var transcribePromise = transcribeService.startTranscriptionJob(params).promise();

// console.log("Creating job");
//
// transcribePromise.then(
//   function(data){
//     console.log('correct!!!')
//     console.log('data: ', data)
//   }
// ).catch(function(err){
//   console.error(err, err.stack)
// })

console.log("Checking status");
// Create promise for getting transcription job
var jobStatusPromise = transcribeService.getTranscriptionJob({TranscriptionJobName:transcribejob}).promise();

jobStatusPromise.then(function(data){
  console.log('correct!!!')
  console.log('data: ', data.TranscriptionJob["TranscriptionJobStatus"])
}).catch(
  function(err){
    console.error(err, err.stack);
});
