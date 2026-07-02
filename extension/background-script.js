console.clear()
console.log("INIT");
console.log();

browser.runtime.onMessage.addListener(notify);
var godThread = []
var dummyThread = []
let amountOfMessages = 0;

let newThreadsState = "init";

function setItem() {
  return;
}

function executeCase(item) {
  return item;
}

browser.storage.local.set({ newThreadsState }).then(setItem);
async function notify(message){
  switch(amountOfMessages){
    case 0:
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

	case 1:
	  for(let i = 0; i < message.length; i++){
		dummyThread[i].nReplies = message[i];
	  }
	  amountOfMessages++
	break;
	case 2:
      let threadUpdate;
      await browser.storage.local.get("newThreadsState").then(function(item) {
		  item.newThreadsState == message.length ? threadUpdate = false : threadUpdate = true
	  });

	  if(threadUpdate){
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
	break;
	default:
	break;
  }
}

function fetchTotalReplies(fetchContent){
 let noCalc = fetchContent.slice(fetchContent.search("commentCount") + 23, (fetchContent.search("commentCount") + 28))
		var start_pos = noCalc.indexOf(`"`) + 1;
		var end_pos = noCalc.indexOf(`"`, start_pos);
		return noCalc.substring(start_pos,(end_pos - 2)); 
}
function fetchHour(fetchContent){
 let hourMade = fetchContent.slice(fetchContent.search("datePublished") + 28, (fetchContent.search("datePublished") + 36))
		return hourMade;
}

var htmlSyms = ["&gt;", "&lt;", "&amp;", "&quot;", "&apos;", "&#039;"];
function srchSymHTML(searchStr, str) {
    	let startIndex = 0, index, current_instances = 0, bloat = 0, instances = 0;

		for(let i = 0; i < searchStr.length; i++){
    		let searchStrLen = searchStr[i].length;
    		while ((index = str.indexOf(searchStr[i], startIndex)) > -1) {
				current_instances++;
        		startIndex = index + searchStrLen;
    		}
			bloat += searchStr[i].length * current_instances;
			instances += current_instances;
			current_instances = 0;
			startIndex = 0;
		}
    	return bloat - instances;
}

function fetchTitle(fetchContent){
 let noCalc = fetchContent.slice(fetchContent.search('itemprop="headline">') + 20, fetchContent.indexOf('</span> <span class="nameBlock"'))

	if (noCalc.search("<head><meta charset") > -1) return "";

	if (noCalc.length - srchSymHTML(htmlSyms, noCalc) > 24){
		return `${noCalc.slice(0, 20).replace(/\s+$/, '')}...`
	}
	else {
    	return noCalc;
	}
}

function fetchPostContent(fetchContent){
	let postInnText = fetchContent.slice(fetchContent.search("articleBody") + 13, (fetchContent.indexOf("</blockquote>") - 15))
	postInnText = postInnText.replace(`<span class="quote">`, '').replace(`</span>`, ''); 

	let str_break = null;
	if (postInnText.indexOf("<br>") != -1) {
		str_break = postInnText.indexOf("<br>");
	}

	let fixedText;
	str_break ? fixedText = postInnText.substring(0, str_break) : fixedText = postInnText; 

	// detect what is the last word in the string to guide handling of the string

	if ((fixedText.length - srchSymHTML(htmlSyms, fixedText)) > 68){
		return `${fixedText.slice(0, 66)}...`
	} else { return fixedText }
}

function fetchImage(fetchContent){
  let fileTextIndex = fetchContent.slice(fetchContent.search("fileText") + 12, (fetchContent.indexOf("KB,") - 6)) 
  var start_pos = fileTextIndex.indexOf(`href=`) + 8;
  var end_pos = fileTextIndex.indexOf(`"`, start_pos);

  return fileTextIndex.substring(start_pos, end_pos)
}
