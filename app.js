// clock function
//

const hourElement = document.getElementById('clock-hour');
const minuteElement = document.getElementById('clock-minute');
const dayElement = document.getElementById("date-day");
const monthElement = document.getElementById("date-month");
const yearElement = document.getElementById("date-year");
function updateClock() {
	const now = new Date();
	minuteElement.textContent = String(now.getMinutes()).padStart(2, '0');
	hourElement.textContent = String(now.getHours()).padStart(2, '0');
	dayElement.textContent = String(now.getDate()).padStart(2, '0');
	monthElement.textContent = String(now.getMonth() + 1).padStart(2, '0');
	yearElement.textContent = String(now.getFullYear()).padStart(2, '2');
	setTimeout(updateClock, 1000 - (Date.now() % 1000)); 
}
updateClock();

// threads function !!!

//console.log(window.tData);
function notificationOriginColor (origin) {
	switch (origin) {
	  case "Firefox": return "#ff00ff"; break;
	  case "qBittorrent": return "#00ffff"; break;
	  default: return "#ff0000"; break;
	}
}
function notificationImgOrigin (origin) {
	switch (origin) {
	  case "Firefox": return "https://i.ibb.co/vvLQ09pG/flesh.png"; break;
	  case "qBittorrent": return "https://i.ibb.co/Y9Z2bfc/qb.png"; break;
	  default: return "https://i.ibb.co/96hCChP/mrmaid.jpg"; break;
	}
}

for(let i = 0; i < window.nData.length; i++) {
	document.getElementById("notificationsContainer").innerHTML += `<div class="n-row">
	  <div class="n-row-content"><div class="image-contents"><img src="${notificationImgOrigin(window.nData[i].origin)}" class="avatar" alt="avatar" loading="lazy" width="37" height="37"><div class="time">2:19:18</div></div><div class="info"><div class="name"><span class="namecont rank1">${window.nData[i].title}</span><span class="level"><span style="color: ${notificationOriginColor(window.nData[i].origin)};">${window.nData[i].origin}</span></span></div><div class="notification-content"><span class="text">${window.nData[i].content}</span></div></div></div></div>`
}


let yous = [false, false, false ]
// change the extension to get data about getting a (you) in posts

for(let i = 0; i < window.tData.length; i++){
	document.getElementById("threadsContainer").innerHTML += `<div class="n-row-post"><a href="${window.tData[i].threadLink}" target="_blank" class="post-image-container" style="aspect-ratio: 16 / 9;"><img class="posted-image" src="https://${window.tData[i].img}" class="avatar" alt="avatar" loading="lazy" width="37" height="37"></a><div class="n-row-post-content"><span class="threadTitle">${window.tData[i].title}</span><p class="level level-post" ${yous[i] ? 'style="background: #f00; color: black;"' : ""}>${window.tData[i].hour} - <span>${window.tData[i].replies.slice(0, -1)}<span style="background: #f00; color: black;">${window.tData[i].nReplies}</span></span> - <span style="${yous[i] ? 'background: #0f0; color: black; ': 'color: #0f0;'} padding-right: 3px;">${window.tData[i].board}</span></p><p class="n-row-post-text-content">${window.tData[i].tContent}</p></div></div>`

let testRatio = 16;
while (document.getElementsByClassName("level-post")[i].offsetHeight > 13){
  document.getElementsByClassName("post-image-container")[i].style.aspectRatio = `${testRatio} / 9`;
	testRatio--;
  }
}
//focus on making the json file a js file
