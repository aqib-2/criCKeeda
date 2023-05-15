
/*
2018--'ea775f6a52mshd0837970b316e8dp19c596jsn03822bdfaa41'
581--'d6bfcf982amsh50263c6522159a7p132526jsn5e61884563d7'
82001--'abe8c30a79msh5301023185b9f90p156da9jsn9a30ee495925'
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
        main.innerHTML='<div class="scorecard"><h4>Error From Api</h4></div>'
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

    main.innerHTML='<div class="not-started"><p class="back-not"  onclick="getData()"> < back </p><h2>Match Not Yet Started</h2></div>';

  } else{

  let sDetails=data.miniscore.matchScoreDetails.inningsScoreList;
  let commArr=[];
  let commentaryHtml;
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
    //function to display commentary 
    const comm=()=>{
          let commentary=data.commentaryList;
          for(let i=0;i<commentary.length;i++) {
              let {commText}=commentary[i];
              let regex=/[\\n]\w/g;
              if(commentary[i].overNumber){
                commText=commentary[i].overNumber+" : "+commText;
              }else{
                  commText=commText.bold();
              }
              //to replace the datafomat with actual content
              if(Object.keys(commentary[i].commentaryFormats).length != 0){
                let formatId=commentary[i].commentaryFormats.bold.formatId;
                let formatValue=commentary[i].commentaryFormats.bold.formatValue;
                for (let j = 0; j < formatId.length; j++) {
                  commText=commText.replace(formatId[j],formatValue[j].bold());
                }
              }
              if(commText.match(regex)){
                commText.replace(regex,"<br/>")
              }
              commArr.push(commText);
          }
        commentaryHtml=commArr.map((text)=> `<p>${text}</p>`);
      } 
    comm();
  //Insertion of HTML data dynamically
  const scoredata=document.createElement('div');
  scoredata.classList.add('match-score');
  scoredata.innerHTML=`
      <div class="score-display">
          <p class="back"  onclick="getData()">< back</p>
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

              <div class="comm">
              <h2 class="comm-heading">Commentary</h2>
              ${commentaryHtml.join(" ")}
              </div> 
          </div>`;

  main.appendChild(scoredata)
  }
}

//function to get the news from API
const getNews = () =>{
  fetch('https://cricbuzz-cricket.p.rapidapi.com/news/v1/index', options)
	.then(response => response.json())
	.then(response => showNews(response))
	.catch(err => console.error(err));
}
//function to display the short news 
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
     <p class="news-id">${id}</p>`;
     news.appendChild(newsContent);
     }
    })
}
getNews();

//function to get the news summary by onclick
function testNews(info){
  let newsId=info.lastElementChild.innerHTML;
  fetch(`https://cricbuzz-cricket.p.rapidapi.com/news/v1/detail/${newsId}`, options)
	.then(response => response.json())
	.then(response =>  redirect(response))
	.catch(err => {news.innerHTML='<div class="api-error">Error from API</div>'; console.log(err)});
}

//function to diaplay the news summary
function redirect(data){
  news.innerHTML="";
  const newsPara=data.content;
  //console.log(newsPara);
  let newsElement;
  const newsDiv=[];
  for(let i=0;i<newsPara.length;i++){
      if(newsPara[i].content){
        let newsText=newsPara[i].content.contentValue;
        if(newsPara[i].content['hasFormat']==true){
          let bold=[],italic=[],link=[];
          //function to store the dataformats passed by the api
          function newsPush(str,arr){
            for(let j=0;j<str.length;j++){
              arr.push(str[j])
            }
          }
          let newsFormat=data.format;
          //storing the dataformat into local variables
          for(let j=0;j<newsFormat.length;j++){
            if(newsFormat[j].type=='bold'){
              newsPush(newsFormat[j]['value'],bold);
            }else if(newsFormat[j].type=='italic'){
              newsPush(newsFormat[j]['value'],italic);  
            }else if(newsFormat[j].type=='links'){
              newsPush(newsFormat[j]['value'],link); 
            }
          }
          let regex1=/@I\d{1,2}[$]/g;
          let regex2=/@B\d{1,2}[$]/g;
          let regex3=/@L\d{1,2}[$]/g;
          //replacing the dataformats with actual content
          if(newsText.match(regex1)){
            for(let m=0;m<italic.length;m++){
              newsText=newsText.replace(italic[m]['id'],italic[m]['value'])
            }       
          }if(newsText.match(regex2)){
            for(let m=0;m<bold.length;m++){
              newsText=newsText.replace(bold[m]['id'],(bold[m]['value']).bold())
            }
          }if(newsText.match(regex3)){
            for(let m=0;m<link.length;m++){
              newsText=newsText.replace(link[m]['id'],link[m]['value'])
            }
          }
        }
        newsDiv.push(newsText)
      }
    }
  newsElement=newsDiv.map((text)=> `<p>${text}</p>`)
  const newsInfo =document.createElement('div');
  newsInfo.classList.add('match-score');
  newsInfo.innerHTML=`
  <div class="news-data">
  <p class="back" onclick="getNews()">< back</p>
  <h1 class="comm-heading">News Story</h1>
  <h2>${data.headline}</h2>
  ${newsElement.join(" ")}
  <a href="${data.appIndex.webURL}" target='_blank' class="btn">Read full article here >></a>
  </div> `; 
  news.appendChild(newsInfo);
}
