
var joke;

window.onload = function() {
	var button = document.getElementById("previewButton");
	button.onclick = previewHandler;
	document.addEventListener("deviceready",init,false);
	init();
}

function previewHandler() {
	var canvas = document.getElementById("tshirtCanvas");
	var context = canvas.getContext("2d");

	fillBackgroundColor(canvas, context);

	var selectObj = document.getElementById("shape");
	var index = selectObj.selectedIndex;
	var shape = selectObj[index].value;

	if (shape == "squares") {
		for (var squares = 0; squares < 20; squares++) {
			drawSquare(canvas, context);
		}
	}
	else if (shape == "circles") {
		for (var circles = 0; circles < 20; circles++) {
			drawCircle(canvas, context);
		}
	}
    drawText(canvas, context);
    drawBird(canvas, context);
}
function drawSquare(canvas, context) {
	var w = Math.floor(Math.random() * 40);    
	var x = Math.floor(Math.random() * canvas.width);
	var y = Math.floor(Math.random() * canvas.height);

	context.fillStyle = "lightblue";
	context.fillRect(x, y, w, w);
}


function fillBackgroundColor(canvas, context) {
	var selectObj = document.getElementById("backgroundColor");
	var index = selectObj.selectedIndex;
	var bgColor = selectObj[index].value;

	context.fillStyle = bgColor;
	context.fillRect(0, 0, canvas.width, canvas.height);

}

function degreesToRadians(degrees){
    return (degrees * Math.PI)/180;
}
function drawCircle(canvas, context) {
	var radius = Math.floor(Math.random() * 40);
	var x = Math.floor(Math.random() * canvas.width);
	var y = Math.floor(Math.random() * canvas.height);

	context.beginPath();
	context.arc(x, y, radius, 0, degreesToRadians(360), true);


	context.fillStyle = "lightblue";
	context.fill();
}

function updateTweets(tweets) {
	var tweetsSelection = document.getElementById("tweets");

	for (var i = 0; i < tweets.length; i++) {
		tweet = tweets[i];
		var option = document.createElement("option");
		option.text = tweet.text;
		option.value = tweet.text.replace("\"", "'");

		tweetsSelection.options.add(option);
    }

	tweetsSelection.selectedIndex = 0;
}

function drawText(canvas, context) {
	var selectObj = document.getElementById("foregroundColor");
	var index = selectObj.selectedIndex;
	var fgColor = selectObj[index].value;

	context.fillStyle = fgColor;
	context.font = "bold 1em sans-serif";
	context.textAlign = "left";
	context.fillText("I saw this tweet", 20, 40);


	var joke = document.getElementById('jokes').innerHTML;
    context.font = "italic 1.0em serif";

    if (joke.length > 60) {
		var jokeLines = splitIntoLines(context, joke, 540);
		for (var i = 0; i < jokeLines.length; i++) {
			context.fillText(jokeLines[i], 30, 70+(i*25));
		}
	}
	else {
        context.fillText(joke, 30, 100);
	}

	context.font = "bold 1em sans-serif";
	context.textAlign = "right";
	context.fillText("and all I got was this lousy t-shirt!", 
		canvas.width-20, canvas.height-40);
}

function drawBird(canvas, context) {
	var twitterBird = new Image();
	twitterBird.src = "twitterBird.png";
	twitterBird.onload = function() {
		context.drawImage(twitterBird, 20, 120, 70, 70);
	};

}
var xmlhttp;

function init() {
    document.getElementById('previewButton').addEventListener('click', getJoke, false);
    xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = receiveJoke;
	
}

function getJoke() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;

    var jokeURL = 'http://api.icndb.com/jokes/random?firstName=';
    
    jokeURL += firstName;
    jokeURL += '&lastName=';
    jokeURL += lastName;
    
    xmlhttp.open('GET',jokeURL,true);
    xmlhttp.send();
}

function receiveJoke() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        var json = jQuery.parseJSON(xmlhttp.responseText);
        document.getElementById('jokes').innerHTML = json.value.joke;
    }
}

function splitIntoLines(context, text, maxWidth) {
    var words = text.split(' '),
        lines = [],
        line = "";
    if (context.measureText(text).width < maxWidth) {
        return [text];
    }
    while (words.length > 0) {
        while (context.measureText(words[0]).width >= maxWidth) {
            var tmp = words[0];
            words[0] = tmp.slice(0, -1);
            if (words.length > 1) {
                words[1] = tmp.slice(-1) + words[1];
            } else {
                words.push(tmp.slice(-1));
            }
        }
        if (context.measureText(line + words[0]).width < maxWidth) {
            line += words.shift() + " ";
        } else {
            lines.push(line);
            line = "";
        }
        if (words.length === 0) {
            lines.push(line);
        }
    }
    return lines;
}


