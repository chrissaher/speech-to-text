// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('uuid');
var fs = require('fs');

AWS.config.update({region:'us-east-2'});

// Read the audio file from folder
var audioFile = fs.createReadStream('./Google_Gnome.wav');

// Create unique bucket name
// Make sure this bucket is already
var myBucketName = 'chrissaher-aws'

// Create name for uploaded object key
var keyName = 'myfile.wav';

// Create a promise on S3 service object
var myBucketPromise = new AWS.S3({apiVersion: '2006-03-01'}).headBucket({Bucket: myBucketName}).promise();

myBucketPromise.then(
  function(data){
    console.log("Bucket exists.")
    var objectParams = {Bucket: myBucketName, Key: keyName, Body: audioFile};
    var uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise();
    uploadPromise.then(
      function(data) {
        console.log("Successfully uploaded data to " + myBucketName + "/" + keyName);
      });
    console.log('finish: ', data)
  }, function(err){
    console.log('Bucket not found.')
    console.log('Error: ', err)
  }).catch(
  function(err) {
    console.error(err, err.stack);
});

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
var transcribePromise = transcribeService.startTranscriptionJob(params).promise();

transcribePromise.then(
  function(data){
    console.log('correct!!!')
    console.log('data: ', data)
  }
).catch(function(err){
  console.error(err, err.stack)
})



// Create cont for debugging
var calls = 0
// Create a promise for checking status
var checkStatus = new Promise(() => {
  var status = setInterval(function(){
    console.log("Calling function #", calls);
    // Create promise for getting transcription job
    var jobStatusPromise = transcribeService.getTranscriptionJob({TranscriptionJobName:transcribejob}).promise();
    jobStatusPromise.then(function(data){
      if (data != null) {
        var currentStatus = data.TranscriptionJob["TranscriptionJobStatus"];
        console.log("status for call ", calls, ": ", currentStatus)
        if (currentStatus == 'COMPLETED') {
          clearInterval(status)
          console.log("response: ", data)
          return
        }
      }
    }).catch(
      function(err){
        console.error(err, err.stack);
    });
    calls += 1;
  }, 15000) // 5 seconds
}).then(()=>{
  return;
}).catch(
  function(err){
    console.error(err, err.stack)
  }
);
