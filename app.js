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

let yous = [true, false, false, true, true, false, false, false, true]

// change the extension to get data about getting a (you) in posts

for(let i = 0; i < window.tData.length; i++){
	document.getElementById("threadsContainer").innerHTML += `<div class="n-row-post"><a href="${window.tData[i].threadLink}" target="_blank" class="post-image-container" style="aspect-ratio: 16 / 9;"><img class="posted-image" src="https://${window.tData[i].img}" class="avatar" alt="avatar" loading="lazy" width="37" height="37"></a><div class="n-row-post-content">${window.tData[i].title}<p class="level level-post" ${yous[i] ? 'style="background: #f00; color: black;"' : ""}>${window.tData[i].hour} - <span>${window.tData[i].replies.slice(0, -1)}<span style="background: #f00; color: black;">${window.tData[i].nReplies}</span></span> - <span style="${yous[i] ? 'background: #0f0; color: black; ': 'color: #0f0;'} padding-right: 3px;">${window.tData[i].board}</span></p><p class="n-row-post-text-content">${window.tData[i].tContent}</p></div></div>`

let testRatio = 16;
while (document.getElementsByClassName("level-post")[i].offsetHeight > 13){
  document.getElementsByClassName("post-image-container")[i].style.aspectRatio = `${testRatio} / 9`;
	testRatio--;
}
}


//focus on making the json file a js file
