const threadWatch = document.getElementById("watchList");
 threadWatch.style.background = "#000020"

const tCount = threadWatch.querySelectorAll('li').length;
let to = threadWatch.querySelectorAll('li');
console.log("aa") // prints on site

let lBoards = []
let lNreplies = []
let lPostsLinks = []


let threads = [tCount];

 for (let avdul = 0; avdul < tCount; avdul++){
  lBoards[avdul] = `/${to[avdul].querySelector("span").getAttribute("data-board")}/`

  lNreplies[avdul] = (
	  to[avdul].querySelector("a").className.includes('hasNewReplies') ?
	  to[avdul].querySelector("a").innerText.slice(0, 
	  to[avdul].querySelector("a").innerText.indexOf(' ') 
	  ) : "");

  lPostsLinks[avdul] = to[avdul].querySelector("a").getAttribute("href");
} 

// console.log(`c ${to[4].querySelector("a").className} c`);

browser.runtime.sendMessage(lPostsLinks);
browser.runtime.sendMessage(lNreplies);
browser.runtime.sendMessage(lBoards);

// i could possibly get if someone replied to me by checking the class of a elements too
