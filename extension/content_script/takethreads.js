const threadWatch = document.getElementById("watchList");
 threadWatch.style.background = "#000020"

const tCount = threadWatch.querySelectorAll('li').length;
let to = threadWatch.querySelectorAll('li');
console.log("aa") // prints on site

let lBoards = []
let lNreplies = []
let lPostsLinks = []

let threads = [tCount];

for (let i = 0; i < tCount; i++){
  lBoards[i] = `/${to[i].querySelector("span").getAttribute("data-board")}/`

  lNreplies[i] = (
	  to[i].querySelector("a").className.includes('hasNewReplies') ?
	  to[i].querySelector("a").innerText.slice(0, 
	  to[i].querySelector("a").innerText.indexOf(' ') 
	  ) : "");

  lPostsLinks[i] = to[i].querySelector("a").getAttribute("href");
}																																																								// console.log(`c ${to[4].querySelector("a").className} c`);

browser.runtime.sendMessage(lPostsLinks);
browser.runtime.sendMessage(lNreplies);
browser.runtime.sendMessage(lBoards);																																															// i could possibly get if someone replied to me by checking the class of a elements too
