// The token of your Telegram bot
var TOKEN = "<< Your bot token >>";

// Name of the Telegram channel which bot is added into
var CHANNEL = "@<< Your Channel >>";

// Name of the Gmail Label which need to search for
var LABEL = "<< Your Label >>"

function processEmails() {
  
  // Search unread emails with specified label
  var search = "label:" + LABEL + " is:unread";
  Logger.log('Search: ' + search);
  var threads = GmailApp.search(search, 0, 10);
  
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    Logger.log('Number of emails found: ' + messages.length);

    for (var j = 0; j < messages.length; j++) {
      var m = messages[j];
      if (!m.isInTrash() && m.isUnread()) {
        if (m.getAttachments().length > 0) {
          
          // Get the first attachment (image jpeg file)
          // and send to telegram bot
          sendPhoto(m.getAttachments()[0].copyBlob());
        }
        m.markRead();
      }
    }
  }
}

function sendPhoto(photo) {
  var payload = {
    'chat_id': CHANNEL,
    'photo': photo
  };
  var options = {
    'method': 'post',
    'payload': payload
  };
  UrlFetchApp.fetch("https://api.telegram.org/bot" + TOKEN + "/sendPhoto", options);
}

