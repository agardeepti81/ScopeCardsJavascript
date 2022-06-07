var text = {};
text.topics = [];
var Subtext = {};
var score = {};
score.progress = [];
var initScore = {};


var callAPI = (progress)=>{
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify(score);
      //var raw = 'score';
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    // make API call with parameters and use promises to get response

    fetch("https://obm591xrag.execute-api.us-east-2.amazonaws.com/Progress", requestOptions)
    .then(response => response.text())
    .then(result => alert(JSON.parse(result).body))
    .catch(error => console.log('error', error));
}

var callAPIget = ()=>{

    let url = "https://obm591xrag.execute-api.us-east-2.amazonaws.com/Progress";
    $.get( url, function( data ) {
    initScore = data;
    console.log(initScore);
    changeScoreState();
    paintScreen();
    alert( JSON.stringify(initScore) );
    });

}

var callSubjectAPI = ()=>{

    let url = "https://rb3d58q373.execute-api.us-east-2.amazonaws.com/getInformation";
    $.get( url, function( data ) {
    Subtext = data;
    changeSubjectState();
    callAPIget();
    alert( JSON.stringify(Subtext) );
    });

}

function changeSubjectState()
{
    text.subject = Subtext.body.Item.subject;
    text.user = Subtext.body.Item.user;
    text.topics = Subtext.body.Item.topics;
    document.getElementById("scope").innerHTML += `
    <h1 class="course-name" id="MySubject"> 
    ${text.subject} </h1>
    ${text.topics.map(scope_template).join('')} 
    `        
}


function changeScoreState()
{
    score.user = Subtext.body.Item.user;
    score.subject = Subtext.body.Item.subject;
    score.progress = initScore.body.Item.Progress;
}

function paintScreen()
{
    let c, topic, id;
    let i,j,k,z;
    let x = initScore.body.Item.Progress.length;
    //initScore.body.Item.Progress[i].selected.length
    for(i=0; i<x; i++)
    {
        topic = initScore.body.Item.Progress[i].name;
        z = initScore.body.Item.Progress[i].selected.length;
        for(j=0, k=i; j<z; j++)
        {
            c = initScore.body.Item.Progress[k].selected[j].code;
            id = topic+c;
            document. getElementById(id). disabled = true;
            document. getElementById(id). checked = true;
            let pr =0;
            pr = initScore.body.Item.Progress[k].selected.length/initScore.body.Item.Progress[k].count*100;
            display(pr,topic);
        }
    }
    allQuestions = text.topics.map(getTotal);
    x = sumobject(allQuestions);
    allSelected = initScore.body.Item.Progress.map(getTotalSel);
    y = sumobject(allSelected);
    let allPer = 0;
    allPer = (y/x)*100;
    display(allPer, "MySubject");
}

function scope_template(tname)
{
    let topicProgress = {};
    topicProgress.name = tname.name;
    topicProgress.count = tname.questions.length;
    topicProgress.selected = [];
    score.progress.push(topicProgress);
    totalq = tname.questions.length;
        return `
        <h2 class="topic-name" id='${tname.name}'>${tname.name}</h2>
        <h4 class="question">
            ${tname.questions ? display_question(tname.name, tname.questions) : ''}   
        </h4>
        `
}

function display_question(topic, qcount)
{
    let findElement   
    return `
    <ul class="qlist">
        ${qcount.map(function(qlist){
           
            return ` 
            <li><input type="checkbox" id='${topic+qlist.code}' onclick="validate(this,'${topic}','${qlist.code}')">${qlist.text}</li>
            ` 
        }).join('')}
    </ul>    
    
    `
}


function validate(count, topic, c)
{
    let choice= {};
    // identify the elment which has the same topic name
    for(let i=0; i<score.progress.length; i++)
    {
        if(count.checked ==1 && topic == score.progress[i].name)
        {   
                choice.code =c;
                score.progress[i].selected.push(choice);
                document. getElementById(topic+c). disabled = true; 
                let pr =0;
                pr = score.progress[i].selected.length/text.topics[i].questions.length*100;
                display(pr,topic);
        }
    }
    callAPI();
    allQuestions = text.topics.map(getTotal);
    x = sumobject(allQuestions);
    allSelected = score.progress.map(getTotalSel);
    y = sumobject(allSelected);
    let allPer = 0;
    allPer = (y/x)*100;
    display(allPer, "MySubject");
}


function getTotal(tname)
{
    return tname.questions.length;
}

function getTotalSel(sname)
{
    return sname.selected.length;
}

function sumobject(myobj)
{
    var sum = 0;
    for(let i=0; i<myobj.length; i++)
        sum += myobj[i];
    return sum;
}

function display(percentdone,topic)
{
    if(percentdone>0 && percentdone<=25)
    document.getElementById(topic).style.background = "pink";
    else if(percentdone>25 && percentdone<=50)
    document.getElementById(topic).style.background = "yellow";
    else if(percentdone>50 && percentdone<=75)
    document.getElementById(topic).style.background = "orange";
    else if(percentdone>75 && percentdone<=100)
    document.getElementById(topic).style.background = "lightgreen";

}

document.addEventListener("DOMContentLoaded", function(){
    //dom is fully loaded, but maybe waiting on images & css files
    callSubjectAPI();
    //callAPIget();
   
});
