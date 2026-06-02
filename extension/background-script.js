console.clear()
console.log("INIT");
console.log();

browser.runtime.onMessage.addListener(notify);
var godThread = []
let amountOfMessages = 0;

/// storage testing
function setItem() {
  console.log("OK");
}

function gotKitten(item) {
  console.log(`${item.kitten.name} has ${item.kitten.eyeCount} eyes`);
}

function gotMonster(item) {
  console.log(`${item.amountOfMessages}`);
}
function gotMonsterT(item) {
  console.log(`${item.amountOfMessages} ${amountOfMessages}`);
}


function onError(error) {
  console.log(error);
}

let monster = {
  name: "Kraken",
  tentacles: true,
  eyeCount: 10,
};

let kitten = {
  name: "Moggy",
  tentacles: false,
  eyeCount: 2,
};

browser.storage.local.set({ amountOfMessages }).then(setItem, onError);

browser.storage.local.get("amountOfMessages").then(gotMonster, onError);
///


function notify(message){
  switch(amountOfMessages){
    case 0:
	  for (var i = 0; i < message.length; i++){
		godThread.push({
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
	    godThread[i].threadLink = `https:${message[i].substring(0, message[i].indexOf("#"))}`;
	  }
      amountOfMessages++
	break;
	case 1:
	  for(let i = 0; i < message.length; i++){
		godThread[i].nReplies = message[i];
	  }
	  amountOfMessages++
	break;
	case 2:
	  for(let i = 0; i < message.length; i++){
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
		  filename: "data.js",
		  saveAs: false,
		  conflictAction: "overwrite"
	  })}, 5000)
	break;
	default:
	  if (message.length != amountOfThreads){
		amountOfMessages = 0;
	  }
	  else {
		amountOfMessages++
	  }
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
