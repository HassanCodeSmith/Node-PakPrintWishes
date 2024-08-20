const FCM = require("fcm-node");

const serverKey = require("../pak-printwishes-firebase-adminsdk-99xy6-571d0dcbb8.json");

const fcm = new FCM(serverKey);
const sendNotification = (message) => {
  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};

// const message = {
//   to: "cw_b3pJFRQqm-SjzrzRCXl:APA91bEZPUUPncvA-LIyTp8-U81pWq5i05ULDVeFS0KRYk-i5XyHNhXjnpMV91eQyH6p7nwf5Y4g7iJesUmA4lZlpEJwnX6t4hfacuf6_DqQnUTU7L5RfQotvouBIz6fuWvy845JkNgt",
//   //   collapse_key: "your_collapse_key",

//   notification: {
//     title,
//     body,
//   },
// };

module.exports = sendNotification;
