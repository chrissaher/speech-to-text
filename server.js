// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('uuid');
var fs = require('fs');

AWS.config.update({region:'us-east-2'});

// Read the audio file from folder
var audioFile = fs.createReadStream('./Google_Gnome.wav');

// Create unique bucket name
var myBucketName = 'aws-trans'

// Create name for uploaded object key
var keyName = 'myfile.wav';

// Create a promise on S3 service object
var myBucketPromise = new AWS.S3({apiVersion: '2006-03-01'}).headBucket({Bucket: myBucketName}).promise();

myBucketPromise.then(
  function(data){
    console.log("Bucket exists.")
    var objectParams = {Bucket: myBucketName, Key: 'keyName', Body: audioFile};
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
var transcribejob = 'transcribe job for wav'

// Define params for promise
var params = {
  LanguageCode: 'en-US', /* required */
  Media: { /* required */
    MediaFileUri: 'https://s3.us-east-2.amazonaws.com/aws-trans/Google_Gnome.wav'
  },
  MediaFormat: 'wav', /* required */
  TranscriptionJobName: 'Job_1', /* required */
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

// Create promise for getting transcription job
var jobStatusPromise = transcribeService.getTranscriptionJob({TranscriptionJobName:'Job_1'}).promise();

jobStatusPromise.then(function(data){
  console.log('correct!!!')
  console.log('data: ', data)
}).catch(
  function(err){
    console.error(err, err.stack);
  });
