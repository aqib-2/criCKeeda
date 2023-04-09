/*
'ea775f6a52mshd0837970b316e8dp19c596jsn03822bdfaa41'
'd6bfcf982amsh50263c6522159a7p132526jsn5e61884563d7'
'abe8c30a79msh5301023185b9f90p156da9jsn9a30ee495925'
*/

let main=document.getElementById('main');
let news=document.getElementById('news');
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'ea775f6a52mshd0837970b316e8dp19c596jsn03822bdfaa41',
		'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
	}
};

getData();
async function getData(){
    try {
        const URL='https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live';
        const response = await fetch(URL,options);
        let match = await response.json();
        //console.log(match);
        showData(match.typeMatches);
      } catch (error) {
        console.log(error);
      }
}

const showData = (data) =>{
    main.innerHTML="";
    //using foreach loop to display the data 
    data.forEach(scoredata => {
      const sForm=scoredata.seriesMatches[0].seriesAdWrapper;
      const eName=sForm.seriesName;
      const status=sForm.matches[0].matchInfo.status;
      const mId=sForm.matches[0].matchInfo.matchId;
      const scoreEle=document.createElement('div');
      scoreEle.id="scorecard";
      scoreEle.classList.add("scorecard");
      scoreEle.setAttribute("onclick","test(this)");
      scoreEle.innerHTML=`
      <h4>${eName}</h4>
      <h3>${sForm.matches[0].matchInfo.team1.teamName} Vs. ${sForm.matches[0].matchInfo.team2.teamName}</h3>
      <p>${status}</p>
      <span class="match-id">${mId}</span>
      `;
     main.appendChild(scoreEle)
    }
  ); 
}

function test(info){
  const mId=info.lastElementChild.innerHTML;
  //console.log(eID);
  showScore(mId)
}
  

async function showScore(sId){
  const URL = `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${sId}/comm`;
  let response=await fetch(URL,options);
  let data= await response.json();
  //console.log(data);
  
  main.innerHTML="";

  if(!data.miniscore){

    main.innerHTML='<h2 class="not-started">Match Not Yet Started</h2>';

  } else{

  let sDetails=data.miniscore.matchScoreDetails.inningsScoreList;

  //function to check the data received from the api such that we can display the score
  const check = (arr) =>{
    if(arr.length>1){
      let scoreboard=`${score(arr[0])}  <br>
                      <br> ${score(arr[1])}`;
      return scoreboard;
    }else{
        return score(arr[0]);
      }
  }
  
  //function to display the scoreboard based on the data received from api 
  const score = (obj) =>{
      let x =String(obj.overs).slice(-1);
    if(x=='6'){
      obj.overs=Math.ceil(obj.overs);
    }
    let score=`${obj.batTeamName}:${obj.score}/${obj.wickets} (${obj.overs})`
    return score;
  }

  //function to display the required runrate 
  const runRate=()=>{
      if(!data.miniscore.requiredRunRate){
        return "--";
      }else{
        return data.miniscore.requiredRunRate
      }
    }

  //Insertion of HTML data dynamically
  const scoredata=document.createElement('div');
  scoredata.classList.add('match-score');
  scoredata.innerHTML=`
      <div class="score-display">
          <p class="back"  onclick="getData()">x</p>
          <h2 class="match-head">${data.matchHeader.team1.name} <br> Vs <br> ${data.matchHeader.team2.name}</h2>
          <p class="team-score">${check(sDetails)}</p>
          <p class="current-rr">CRR : ${data.miniscore.currentRunRate}</p>
          <p class="required-rr">Required RR : ${runRate()}</p>
          <p class="status">${data.miniscore.status}</p>
          <p class="recent">Recent : ${data.miniscore.recentOvsStats}</p>

          <table>
                <thead >
                    <tr>
                    <td class="player">Batter</td>
                    <td>R</td>
                    <td>B</td>
                    <td>4s</td>
                    <td>6s</td>
                    <td>SR</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="p-name">${data.miniscore.batsmanStriker.batName}*</td>
                        <td>${data.miniscore.batsmanStriker.batRuns}</td>
                        <td>${data.miniscore.batsmanStriker.batBalls}</td>
                        <td>${data.miniscore.batsmanStriker.batFours}</td>
                        <td>${data.miniscore.batsmanStriker.batSixes}</td>
                        <td>${data.miniscore.batsmanStriker.batStrikeRate}</td>
                    </tr>
                    <tr>
                        <td class="p-name">${data.miniscore.batsmanNonStriker.batName}</td>
                        <td>${data.miniscore.batsmanNonStriker.batRuns}</td>
                        <td>${data.miniscore.batsmanNonStriker.batBalls}</td>
                        <td>${data.miniscore.batsmanNonStriker.batFours}</td>
                        <td>${data.miniscore.batsmanNonStriker.batSixes}</td>
                        <td>${data.miniscore.batsmanNonStriker.batStrikeRate}</td>
                    </tr>
                </tbody>
              </table>

              <table>
                <thead>
                    <td class="player">Bowler</td>
                    <td>O</td>
                    <td>M</td>
                    <td>R</td>
                    <td>W</td>
                    <td class="economy">Eco</td>
                </thead>
                <tr>
                    <td class="p-name">${data.miniscore.bowlerStriker.bowlName}*</td>
                    <td>${data.miniscore.bowlerStriker.bowlOvs}</td>
                    <td>${data.miniscore.bowlerStriker.bowlMaidens}</td>
                    <td>${data.miniscore.bowlerStriker.bowlRuns}</td>
                    <td>${data.miniscore.bowlerStriker.bowlWkts}</td>
                    <td class="economy">${data.miniscore.bowlerStriker.bowlEcon}</td>
                </tr>
                <tr>
                    <td class="p-name">${data.miniscore.bowlerNonStriker.bowlName}</td>
                    <td>${data.miniscore.bowlerNonStriker.bowlOvs}</td>
                    <td>${data.miniscore.bowlerNonStriker.bowlMaidens}</td>
                    <td>${data.miniscore.bowlerNonStriker.bowlRuns}</td>
                    <td>${data.miniscore.bowlerNonStriker.bowlWkts}</td>
                    <td class="economy">${data.miniscore.bowlerNonStriker.bowlEcon}</td>
                </tr>
              </table>
          </div>`;

  main.appendChild(scoredata)
  }
}

const getNews = () =>{
  fetch('https://cricbuzz-cricket.p.rapidapi.com/news/v1/index', options)
	.then(response => response.json())
	.then(response => showNews(response))
	.catch(err => console.error(err));
}

const showNews = (newsinfo) =>{
    let newsdata=newsinfo.storyList
    news.innerHTML="";

    newsdata.forEach((newsData) =>{
     if(newsData.story){
     const {id,hline,intro}=newsData.story;
     const newsContent = document.createElement('div');
     newsContent.classList.add('content');
     newsContent.setAttribute("onclick","testNews(this)");
     newsContent.innerHTML=`
     <h2>${hline}</h2>
     <p>${intro}</p>
     <p class="news-id">${id}</p>
       `;
       news.appendChild(newsContent);
      
     }
    })
}
getNews();

function testNews(info){
  let newsId=info.lastElementChild.innerHTML;
  fetch(`https://cricbuzz-cricket.p.rapidapi.com/news/v1/detail/${newsId}`, options)
	.then(response => response.json())
	.then(response =>  redirect(response))
	.catch(err => console.error(err));
}
const redirect = (data) =>{
   let url=data.appIndex.webURL;
   window.location.href = url;
}
