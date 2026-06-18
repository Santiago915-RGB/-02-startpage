console.clear()
console.log("INIT");
console.log();

browser.runtime.onMessage.addListener(notify);
var godThread = []
var dummyThread = []
let amountOfMessages = 0;

let newThreadsState = "init";

function setItem() {
  //console.log("SIGNAL A");
  return;
}

function executeCase(item) {
  return item;
}

browser.storage.local.set({ newThreadsState }).then(setItem); // SET
//                                            ^ just a print message after this
/*
browser.storage.local.get("newThreadsState").then(gotPromise, onError);
*/
///





async function notify(message){
  switch(amountOfMessages){
    case 0: console.log("─────────────────────────────────────"); console.log("CASE 0 EXECUTING")
	  for (var i = 0; i < message.length; i++){
		dummyThread.push({
		  title: null,
		  hour: null,
		  replies: null,
		  nReplies: null,
		  board: null,
		  tContent: null,
		  img: null
	    })
	  }
	  for(let i = 0; i < message.length; i++){
	    dummyThread[i].threadLink = `https:${message[i].substring(0, message[i].indexOf("#"))}`;
	  }
      amountOfMessages++;
	break;

	case 1:  console.log("CASE 1 EXECUTING")
	  for(let i = 0; i < message.length; i++){
		dummyThread[i].nReplies = message[i];
	  }
	  amountOfMessages++
	break;
	case 2: console.log("CASE 2 EXECUTING")
      let threadUpdate;
	  console.log(message.length);
      await browser.storage.local.get("newThreadsState").then(function(item) {
		  item.newThreadsState == message.length ? threadUpdate = false : threadUpdate = true
	  });
	  console.log(threadUpdate);

	  if(threadUpdate){
        console.log("SIGNAL B")
	    for(let i = 0; i < message.length; i++){
		  godThread = dummyThread;
		  godThread[i].board = message[i];
	    }
	    for (let i = 0; i < message.length; i++){
		  fetch(godThread[i].threadLink)
		  .then(response => response.text())
 		  .then(text => {
		    godThread[i].replies = fetchTotalReplies(text)
		    godThread[i].hour = fetchHour(text)
		    godThread[i].img = fetchImage(text)
		    godThread[i].tContent = fetchPostContent(text)
		    godThread[i].title = fetchTitle(text)
    	  });
	     }
	  setTimeout(() => {
		  console.log(godThread);
		const jsonBlob = new Blob(["window.tData = " + JSON.stringify(godThread, null, 2)], { type: "text/plain" });
		const url = URL.createObjectURL(jsonBlob);

		let downloading = browser.downloads.download({
		  url,
		  filename: "threads-data.js",
		  saveAs: false,
		  conflictAction: "overwrite" 
	  })}, 4000)
		  dummyThread = [];

	newThreadsState = message.length;  
	browser.storage.local.set({ newThreadsState }).then(setItem);

	amountOfMessages = 0;
  }
		  else {
			dummyThread = [];
			amountOfMessages = 0;
			return
		  }

	console.log("CASE 2 EXITING"); break;
	default:
	  console.log("⚠️ Operation cancelled - " + amountOfMessages)
	break;
  }
}




























// maybe i should add a cascading effect for the whole text array, so when the first value gets taken it keeps the string sliced for the next part and keeps slicing it until the final function

///////////////// fetchingFunctions

function fetchTotalReplies(fetchContent){
 let noCalc = fetchContent.slice(fetchContent.search("commentCount") + 23, (fetchContent.search("commentCount") + 28))
		// ^ these magic numbers are for getting the value `"(number of replies)"`
		var start_pos = noCalc.indexOf(`"`) + 1;
		var end_pos = noCalc.indexOf(`"`, start_pos);
		return noCalc.substring(start_pos,(end_pos - 2)); 
}
function fetchHour(fetchContent){
 let hourMade = fetchContent.slice(fetchContent.search("datePublished") + 28, (fetchContent.search("datePublished") + 36))
		return hourMade;
}
function fetchTitle(fetchContent){
 let noCalc = fetchContent.slice(fetchContent.search("headline") + 5, (fetchContent.search("headline") + 73))
	//                                                             ^ this should be 9 I think

		if(noCalc.indexOf(`content="`) != -1){
		  return ""
		}
		else {
		  var start_pos = noCalc.indexOf(`>`) + 1;
		  var end_pos = noCalc.indexOf("</span>", start_pos);
		  if (noCalc.substring(start_pos,end_pos).length > 23) {
				return `${noCalc.substring(start_pos,end_pos).slice(0, 20).replace(/\s+$/, '')}...`
		  } else {
		  return noCalc.substring(start_pos,end_pos) }
		}
}
function fetchPostContent(fetchContent){
	let postInnText = fetchContent.slice(fetchContent.search("articleBody") + 13, (fetchContent.indexOf("</blockquote>") - 15))
	postInnText = postInnText.replace(`<span class="quote">`, ''); 
	postInnText = postInnText.replace(`</span>`, ''); 

	var regex = /&gt;|&lt;|&quot;|&apos;|&amp;/gi;
	var result;
	var instances = 0;


	let tBreaker = 0;
	if (postInnText.indexOf("<br>") != -1) {
		tBreaker = postInnText.indexOf("<br>");
	}
	else if (postInnText.indexOf("</blockquote>") != -1){
		tBreaker = postInnText.indexOf("</blockquote");
	}
	

	let fixedText = postInnText.substring(0, tBreaker)

	while ( (result = regex.exec(fixedText)) ) {
    	instances++;
	}
	
	if ((fixedText.length - (instances * 3)) > 80){
		return `${fixedText.slice(0, 79).replace(/\s+$/, '')}...`
	} else { return fixedText }

	//return fixedText
}
function fetchImage(fetchContent){
  let fileTextIndex = fetchContent.slice(fetchContent.search("fileText") + 12, (fetchContent.indexOf("KB,") - 6)) 
  var start_pos = fileTextIndex.indexOf(`href=`) + 8;
  var end_pos = fileTextIndex.indexOf(`"`, start_pos);

  return fileTextIndex.substring(start_pos, end_pos)
}

/////////////////

/*fetch('https://boards.4chan.org/g/thread/108911572/holy-shit')
    .then(response => response.text())
    .then(text => {


		return
	//	  console.log(fetchImage(text)); // seems like 4chan uses the Eastern Daylight Time (EDT) so you will have to tweak this value if your time zone is different
    });

// console.log(godThread);


/*for (let allThreads = 0; allThreads < 12; allThreads++){
	//console.log(godThread.threadLink[allThreads])
	fetch("https://boards.4chan.org/g/thread/108868423")
		.then(response => response.text())
 		.then(text => {
			godThread[allThreads].replies = fetchTotalReplies(text)


		return
    });

}*/

// // add greentext stuff - turn each instance of greentext spans into just >'s
// // reformat variable names n stuff in fetchpostcontent
// // now to get an object that has all my values of all my threads and let the magic beginnnn
// save shit
// 80
