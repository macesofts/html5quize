var _width = 50;
var _height = 50;
var _blue = "#08088A";
var _orrange = "#FF8000";
var _stroke1 = "#003399";
var _stroke2 = "#00e9ff";
var _yellow = "#faff00";
var _silver = "#f2f2ea";
var _gold = "#ffc700";
var _noOfRect = 100;
var _cols = 10;
var _rows = 10;
var _rectCollection = [];
var _x = 1;
var _y = 1;
var stage;
var layer;
var group;
var period = 2000;
var sec = 1;
var minutes = 1;
var hours = 1;
var secStr = "";
var minStr = "";
var hrStr = "";
var imageList = new Array();
var userAns = "";
var images = [];
var clear;
var gameState = true;
var soundState = false;
var imgs = new Array();
var questionCount = 9;
var _squareCount = 1;
var points = 1;
var _space = 1.08;
var pointer;
var trans;
var rowCount = 0;
var currentPosition = 9;
var currentQuestion = 1;
var serverQuestionNo = 1;
var totQuestion = 100;
var gameCompleted = false;
var preloader;
var totalloaded = 0;
var manifest = [];
var ptr;
var serverhost = {};
var selectedchoice = 1;
var sessionid = 3544101;
var tempQuestionNo = 0;
var _countdown = 60;
var _clearCountdown;
//default game ID
var _gameID = 101;
var soundTracks = {
	"bg" : "bgm",
	"next" : "nextmove",
	"prev" : "prev",
	"correct" : "correct",
	"wrong" : "wrong"
};
var radios = [];
//server IP config
var serverIP = "http://107.23.11.198/adc/mcq/game/";
//server host AJAX request
serverhost = {
	"loadGame" : serverIP + "load_game.jsp",
	"getImage" : serverIP + "get_all_images.jsp",
	"getQuestion" : serverIP + "get_question.jsp",
	"getPoint" : serverIP + "select_choice.jsp",
	"getLeaderBoard" : serverIP + "leaderboard.jsp"
}
//get all image path from the server
var getAllImages = function() {
	$("#preloadercontainer").show();
	$("#progressVal").html("Please wait loading sources!");
	var host = serverhost.getImage;
	if ($.browser.msie && window.XDomainRequest) {
		$("#log_text ul").append("<li><span class='req'>Rrequest sent:</span>" + host + '?game_sessionid=' + sessionid + "</li>");
		var xdr = new XDomainRequest();
		xdr.open("get", host + "?game_sessionid=" + sessionid);
		xdr.onprogress = function() {
		};
		xdr.ontimeout = function() {
		};
		xdr.onerror = function() {
		};
		xdr.onload = function() {
			var JSON = $.parseJSON(xdr.responseText);
			if (JSON == null || typeof (JSON) == 'undefined') {
				JSON = $.parseJSON(data.firstChild.textContent);
			}
			processImageData(JSON);
		};
		setTimeout(function() {
			xdr.send();
		}, 0);
	} else {
		$("#log_text ul").append("<li><span class='req'>Rrequest sent:</span>" + host + '?game_sessionid=' + sessionid + "</li>");
		$.ajax({
			type : 'GET',
			url : host,
			processData : true,
			data : {
				'game_sessionid' : sessionid
			},
			dataType : "json",
			cache : false,
			success : function(data) {
				processImageData(data);
			},
			error : function(jqXHR, status, error) {

				alert('Error on Images Loading' + "XHR:" + jqXHR + "status" + status + "Error:" + error);

			}
		});
	}
}
//creating manifest JSON for preloading images
var processImageData = function(data) {
	$("#log_text ul").append("<li><span class='res'>Response received:</span>" + data.result + "</li>");
	$.each(data.result, function(key, value) {
		manifest.push({
			id : value[0],
			src : value[1]
		});
		imageList.push(value[1]);
	});
	preloadInit();
}
//initalising preloader
var preloadInit = function() {
	preloader = new createjs.LoadQueue(false);
	preloader.addEventListener("fileload", fileLoaded);
	preloader.addEventListener("progress", progressHandler);
	preloader.addEventListener("complete", completeHandler);
	preloader.loadManifest(manifest);
}
//each file loaded push image into images array redarwing later
//@param event is current event while loading files
var fileLoaded = function(event) {
	switch(event.item.type) {
		case "image":
			//imageList.push(event.item.src);
			var img = new Image();
			img.onload = function() {

			}
			img.src = event.item.src;
			images.push({
				"image" : img,
				"id" : event.item.id
			});
			console.log("loading image" + event.item.src + "image id" + event.item.id);
			break;

		case "sound":
			//sound loaded
			//completeHandler();
			break;
	}
}
//All images are loaded complete handler render the game
var completeHandler = function() {
	$("#preloadercontainer").hide();
	gameRender();
	//questionGenerate();
	getQuestionWindow();

}
//showing progress while loading images
//@param event current event while loading files
var progressHandler = function(event) {
	$("#preloadercontainer").show();
	var _wid = Math.floor(event.loaded * 100);
	$("#progbar").width(_wid + "%");
	$("#progressVal").html(_wid + "% Loading...");
}

$(document).ready(function() {
	//$( "#resultWindow" ).animate({ opacity: "hide","top":+200},1000, function() {	});
	$("#preloadercontainer").hide();
	$("#welcomeMsg").animate({
		opacity : "show",
		"top" : +200
	}, 500, function() {

	});
	$('#devmode').click(function() {
		$("#debugWindow").toggle(this.checked);
	});

	$("#start").click(function() {
		var host = serverhost.loadGame;
		var _userName = $("#userName").val();
		$("#username").html(_userName);
		if (String(_userName).length > 0) {

			$("#username").html(_userName);
			if ($.browser.msie && window.XDomainRequest) {

				var xdr = new XDomainRequest();
				xdr.open("get", host + "?username=" + _userName + "&gameid=" + _gameID);
				$("#log_text ul").append("<li><span class='req'>Request sent:</span>" + host + "?username=" + _userName + "&gameid=" + _gameID + "</li>");
				xdr.onprogress = function() {
				};
				xdr.ontimeout = function() {
				};
				xdr.onerror = function() {
				};
				xdr.onload = function() {
					var JSON = $.parseJSON(xdr.responseText);
					if (JSON == null || typeof (JSON) == 'undefined') {
						JSON = $.parseJSON(data.firstChild.textContent);
					}
					_loadGame(JSON);
				};

				setTimeout(function() {
					xdr.send();
				}, 0);

				//xdr.send();
			} else {
				$("#log_text ul").append("<li><span class='req'>Request sent:</span>" + host + "?username=" + _userName + "&gameid=" + _gameID + "</li>");

				$.ajax({
					type : 'GET',
					url : host,
					processData : true,
					data : {
						'username' : _userName,
						'gameid' : _gameID
					},
					dataType : "json",
					cache : false,
					success : function(data) {
						_loadGame(data);
					},
					error : function(jqXHR, status, error) {

						alert('Error on Loading game' + "XHR:" + jqXHR + "status" + status + "Error:" + error);

					}
				});
			}
		} else {
			return;
		}
		if (gameState) {
			$("#welcomeMsg").animate({
				opacity : "hide",
				"top" : -75
			}, 1000, function() {

			});
		}
	});
	
	

	$("#restart").click(function() {
		$("#resultWindow").animate({
			opacity : "hide",
			"top" : -200
		}, 1000, function() {
		});
		window.location.href = window.location.href;
	});

	$("#user").click(function() {

	});

	$("#home").click(function() {

	});

	$("#sound").click(function() {
		soundState = !soundState;
		var bgplayer = document.getElementById('bgmplayer');
		if (soundState) {
			$("#soundStateMode").html(">");
			bgplayer.play();
		} else {
			$("#soundStateMode").html("II");
			bgplayer.pause();
		}
	});

	$("#help").click(function() {
		$("#helpWindow").animate({
			opacity : "show",
			"top" : +200
		}, 500, function() {
		});
	});

	$("#points").click(function() {
		getLeaderBoardData();
		$("#resultWindow").animate({
			opacity : "show",
			"top" : +200
		}, 500, function() {
		});
	});

	$("#clock").click(function() {

	});

	$(".closeBtn").click(function() {
		$(this).parent().parent().animate({
			opacity : "hide",
			"top" : -100
		}, 500, function() {
		});
	});

	//processQuestionData();

});
//load game for purticular session id which is get from server
var _loadGame = function(data) {
		sessionid = data.result.gamesessionid;
		gameState = true;
		$("#log_text ul").append("<li><span class='res'>Response received:</span>" + data.result.gamesessionid + "</li>");
		getAllImages();

	}
var getBoxID = function(obj) {
	if (obj != null) {
		var temp = String(obj.getId()).split("_")[1];

		return parseInt(temp);
	}
	return;
}
var questionGenerate = function() {
	currentQuestion = getBoxID(_rectCollection[currentPosition]);
	$("#question-data").html("Loading Question....");
	$("#optionsList").empty();
	//$("#question-info").html("Loading Question....");
	var host = serverhost.getQuestion;
	if ($.browser.msie && window.XDomainRequest) {
		$("#log_text ul").append("<li><span class='req'>Rrequest sent:</span>" + host + "?game_sessionid=" + sessionid + "&question_no=" + currentQuestion + "</li>");
		var xdr = new XDomainRequest();
		xdr.open("get", host + "?game_sessionid=" + sessionid + "&question_no=" + currentQuestion);
		xdr.onprogress = function() {
		};
		xdr.ontimeout = function() {
		};
		xdr.onerror = function() {
		};
		xdr.onload = function() {
			var JSON = $.parseJSON(xdr.responseText);
			if (JSON == null || typeof (JSON) == 'undefined') {
				JSON = $.parseJSON(data.firstChild.textContent);
			}

			processQuestionData(JSON);
		};
		setTimeout(function() {
			xdr.send();
		}, 0);
	} else {
		$("#log_text ul").append("<li><span class='req'>Rrequest sent:</span>" + host + "?game_sessionid=" + sessionid + "&question_no=" + currentQuestion + "</li>");
		$.ajax({
			type : 'GET',
			url : host,
			processData : true,
			data : {
				'game_sessionid' : sessionid,
				'question_no' : currentQuestion
			},
			dataType : "json",
			cache : false,
			success : function(data) {
				processQuestionData(data);
			},
			error : function(jqXHR, status, error) {
				alert("Error on Question Loading XHR :" + jqXHR + "status" + status + "Error:" + error);

			}
		});
	}

}

//validating user answere
var questionValidate = function(e) {
	tempQuestionNo = serverQuestionNo;
	var _checkedStat = false;
	for (var i = 0; i < radios.length; i++) {
		if (document.getElementById(radios[i]).checked)
			_checkedStat = true;
	}

	selectedchoice = encodeURIComponent(userAns);

	/*
	if(selectedchoice.indexOf("=")>=0)
	{
	selectedchoice.replace('=','#');
	//alert(selectedchoice);
	}
	*/
	//alert("seesionid:"+sessionid +"\n" + "question_no:"+serverQuestionNo+ "\n" + "selected choice:"+selectedchoice);
	var host = serverhost.getPoint;
	if (_checkedStat) {
		if ($.browser.msie && window.XDomainRequest) {
			$("#log_text ul").append("<li><span class='req'>Rrequest sent:</span>" + host + '?game_sessionid=' + sessionid + '&question_no=' + serverQuestionNo + '&choice=' + selectedchoice + "</li>");
			var xdr = new XDomainRequest();
			xdr.open("get", host + '?game_sessionid=' + sessionid + '&question_no=' + serverQuestionNo + '&choice=' + selectedchoice);
			xdr.onprogress = function() {
			};
			xdr.ontimeout = function() {
			};
			xdr.onerror = function() {
			};
			xdr.onload = function() {
				var JSON = $.parseJSON(xdr.responseText);
				if (JSON == null || typeof (JSON) == 'undefined') {
					JSON = $.parseJSON(data.firstChild.textContent);
				}
				checkAns(JSON);
			};
			setTimeout(function() {
				xdr.send();
			}, 0);
		} else {
			$("#log_text ul").append("<li><span class='req'>Rrequest sent:</span>" + host + '?game_sessionid=' + sessionid + '&question_no=' + serverQuestionNo + '&choice=' + selectedchoice + "</li>");
			$.ajax({
				type : 'GET',
				url : host,
				processData : true,
				data : {
					'game_sessionid' : sessionid,
					'question_no' : serverQuestionNo,
					'choice' : selectedchoice
				},
				dataType : "json",
				cache : false,
				success : function(data) {
					console.log(data);
					checkAns(data);
				},
				error : function(jqXHR, status, error) {

					alert("Error on Question Loading XHR:" + jqXHR + "status" + status + "Error:" + error);

				}
			});
		}
	} else
		alert("Plase select a option!");
	return;

}
//printing question and options @param data get from the server
var processQuestionData = function(data) {
	$("#log_text ul").append("<li><span class='res'>Response received:</span>" + data.result + "</li>");
	var q_data = data.result;
	//$("#question-info").html("Question No:"+ _squareCount + "&nbsp;/&nbsp;" + imageList.length);
	serverQuestionNo = parseInt(q_data[0][1]);

	//alert("serverQuestionNo:"+serverQuestionNo);
	$("#questioncount").html("Question " + _squareCount + "/" + totQuestion)
	$("#question-data").html(q_data[1][1].toString());
	//var allOptions = [];
	//allOptions = [$("#opt_1"),$("#opt_2"),$("#opt_3"),$("#opt_4")] ;
	var _options = q_data[2][1].split("||");
	radios = [];
	$("#optionsList").empty();
	for (var i = 0; i < _options.length - 1; i++) {
		var rec_text = _options[i].toString().replace(/\[|\]/gi, '');
		$("#optionsList").append('<li><input type="radio" name="iCheck" class="radioLeft" value="' + rec_text + '" id="opt_' + i + '" onclick="getAnswere(event)"/><label for="opt_' + i + '" class="textBlock">' + rec_text + '</label></li>');
		radios.push("opt_" + i);
	}
}
//checking answere and assining points

var checkAns = function(point) {
	$("#log_text ul").append("<li><span class='res'>Response received:</span>" + point.result.score + "</li>");
	var _points = parseInt(point.result.score);
	//_points =99;
	if (_points > 0) {
		drawStar(_rectCollection[currentPosition], _gold);
		_squareCount += _points;

		if (_squareCount > 99)
			_squareCount = 100

		points = points + _points;
		questionCount = questionCount - _points
		//playAudio(soundTracks.correct);
		$("#pointset").html(points);

		$("#question").animate({
			opacity : "hide",
			"top" : -100
		}, 500, function() {
			//questionGenerate();
			_transition(_rectCollection[currentPosition]);
		});

	} else {
		drawStar(_rectCollection[currentPosition], _silver);
		_squareCount += _points;
		if (_squareCount < 1)
			_squareCount = 1
		points = points - _points;
		questionCount = questionCount + _points;
		if (points < 0)
			points = 0;
		$("#pointset").html(points);
		//resetAnimation(_rectCollection[questionCount+1])

		$("#question").animate({
			opacity : "hide",
			"top" : -100
		}, 500, function() {
			_transition(_rectCollection[currentPosition]);

		});

	}
	if (currentPosition == images.length - 9) {
		gameCompleted = true;
		$("#resultWindow").animate({
			opacity : "show",
			"top" : +200
		}, 500, function() {
			$("#question").animate({
				opacity : "hide",
				"top" : -200
			}, 500, function() {

			});
		});
	}
	getQuestionWindow();

}
//get leader board data
var getLeaderBoardData = function() {
	var host = serverhost.getLeaderBoard;
	if ($.browser.msie && window.XDomainRequest) {
		$("#log_text ul").append("<li><span class='req'>Rrequest sent:</span>" + host + '?game_sessionid=' + sessionid + "</li>");
		var xdr = new XDomainRequest();
		xdr.open("get", host + '?game_sessionid=' + sessionid);
		xdr.onprogress = function() {
		};
		xdr.ontimeout = function() {
		};
		xdr.onerror = function() {
		};
		xdr.onload = function() {
			var JSON = $.parseJSON(xdr.responseText);
			if (JSON == null || typeof (JSON) == 'undefined') {
				JSON = $.parseJSON(data.firstChild.textContent);
			}
			generateLeaderBoard(JSON);
		};
		setTimeout(function() {
			xdr.send();
		}, 0);
	} else {
		$("#log_text ul").append("<li><span class='req'>Rrequest sent:</span>" + host + '?game_sessionid=' + sessionid + "</li>");
		$.ajax({
			type : 'GET',
			url : host,
			processData : true,
			data : {
				'game_sessionid' : sessionid

			},
			dataType : "json",
			cache : false,
			success : function(data) {
				console.log(data);
				generateLeaderBoard(data);
				//checkAns(data);
			},
			error : function(jqXHR, status, error) {

				alert("Error on LeaderBoard Loading XHR:" + jqXHR + "status" + status + "Error:" + error);

			}
		});
	}

}
//generate leader board
var generateLeaderBoard = function(data) {
	var tbl_body = "";
	$.each(data, function() {
		var tbl_row = "";
		$.each(this, function(k, v) {
			tbl_row += "<td>" + v + "</td>";
		})
		tbl_body += "<tr>" + tbl_row + "</tr>";
		("#leaderBoardtable").html(tbl_body);
	})
}
var getQuestionWindow = function() {
	//sec = minutes = hours = 0;
	if (questionCount > 9) {
		questionCount = 9;
		rowCount--;
		if (rowCount < 0)
			rowCount = 0;
	}
	if (questionCount < 0) {
		questionCount = 9
		rowCount++;
		if (rowCount > 9)
			rowCount = 9;

	}
	var currentRow = rowCount * 10;
	currentPosition = currentRow + questionCount;
	//resetAnimation(_rectCollection[questionCount-1])
	//animate(_rectCollection[questionCount]);
}
//drawing star @param obj = image reference @param fill = color
drawStar = function(obj, fill) {
	var star = new Kinetic.Star({
		x : obj.getX() + 10,
		y : obj.getY() + 10,
		numPoints : 5,
		innerRadius : 15,
		outerRadius : 5,
		fill : fill,
		stroke : 'black',
		startScale : 3,
		rotationDeg : 180,
		strokeWidth : .5,
		shadowColor : '#0099cc',
		shadowBlur : 10,
		shadowOffset : 1,
		shadowOpacity : 1
	});
	layer.add(star);
	layer.draw();
	stage.draw();
}
//rendering game
var gameRender = function() {
	stage = new Kinetic.Stage({
		container : 'canvasContainer',
		width : 560,
		height : 560,
		x : -18,
		y : -18
	});
	layer = new Kinetic.Layer();
	//group = new Kinetic.Group();
	stage.add(layer);
	drawGameBoard();
	drawPointer();
	//playBGM(soundTracks.bg);
	clearInterval(clear);
	clear = setInterval(timer, 1000);
}
//drawing game board
var drawGameBoard = function() {
	var count = 0;
	for (var i = _cols; i > 0; i--) {
		for (var j = _rows; j > 0; j--) {
			_x = +_width * j * _space;
			_y = +_height * i * _space;
			if (i % 2 == 0) {
				if (j % 2 == 0) {
					drawRectangle(_width, _height, _x, _y, _blue, _stroke1, 3, count);

				} else {
					drawRectangle(_width, _height, _x, _y, _orrange, _stroke2, 3, count);

				}
			} else {
				if (j % 2 == 0) {
					drawRectangle(_width, _height, _x, _y, _orrange, _stroke2, 3, count);
				} else {
					drawRectangle(_width, _height, _x, _y, _blue, _stroke1, 3, count);

				}
			}
			count++;
		}

	}
}
//drawing pointer for purticular question image
var drawPointer = function() {
	var img = new Image();
	img.onload = function() {
		var pointer = new Kinetic.Rect({
			x : 0,
			y : 0,
			width : 50,
			height : 50,
			fillPatternImage : img,
			fillPatternOffset : [0, 0],
			fillPatternScale : .5,
			strokeWidth : 0,
			offset : {
				x : 25,
				y : 25
			},
			id : "pointer"
		});
		layer.add(pointer);
		layer.draw();
		_transition(_rectCollection[currentPosition]);
	}
	img.src = "images/pointer.png";

}
//drawing square images
var drawRectangle = function(width, height, x, y, fillcolor, strokecolor, strokewidth, id) {
	if (id < images.length) {

		var rect = new Kinetic.Rect({
			x : x,
			y : y,
			width : width,
			height : height,
			stroke : strokecolor,
			fillPatternImage : images[id].image,
			fillPatternOffset : [-5, -5],
			fillPatternScale : .5,
			offset : [25, 25],
			cornerRadius : 10,
			strokeWidth : strokewidth,
			id : "box_" + images[id].id
		});
		layer.add(rect);
		layer.draw();
		_rectCollection[id] = rect;
	}

	//addEffect(_rectCollection[id],'easing');
}
//pointer moving animation
var _transition = function(obj) {
	ptr = stage.get("#pointer")[0];
	//playAudio(soundTracks.next);
	trans = ptr.transitionTo({
		x : obj.getX(),
		y : obj.getY(),
		scale : {
			x : 1.5,
			y : 1.5
		},
		easing : 'elastic-ease-out',
		duration : 1,
		callback : function() {
			if (!gameCompleted) {
				$("#question").animate({
					opacity : "show",
					"top" : +100
				}, 500, function() {
					//_squareCount = _squareCount+1;
					ptr.setScale(1, 1);
					questionGenerate();
					layer.draw();
					stage.draw();
				});
			}

		}
	});
	//trans.resume();

}
var resetAnimation = function(obj) {
	var anim = new Kinetic.Animation(function(frame) {
		var scale = 1//(Math.sin(frame.time * 2 * Math.PI / period) + 1)
		obj.moveToTop();
		obj.setScale(scale);
	}, layer);
	anim.start();

}
var animate = function(obj) {
	var anim = new Kinetic.Animation(function(frame) {
		var scale = (Math.sin(frame.time * 2 * Math.PI / period) + 1)
		obj.moveToTop();
		obj.setScale(scale);
	}, layer);
	anim.start();
}
//timer
var timer = function() {

	sec = sec + 1;
	if (sec % 2 == 0) {
		$("#clockset").removeClass("greenBg").addClass("redBg");
	} else {
		$("#clockset").removeClass("redBg").addClass("greenBg")
	}
	if (sec > 60) {
		minutes++;
		sec = 0;
	}
	if (minutes > 60) {
		hours++;
		minutes = 0
	}
	if (sec < 10)
		secStr = "0" + String(sec);
	else
		secStr = String(sec);
	if (minutes < 10)
		minStr = "0" + String(minutes);
	else
		minStr = String(minutes);
	if (hours < 10)
		hrStr = "0" + String(hours)
	$("#clockset").html(hrStr + ":" + minStr + ":" + secStr);

}
var addEffect = function(obj, easing) {
	obj.on('mouseover touchstart', function() {
		this.moveToTop();
		this.transitionTo({
			scale : {
				x : 2,
				y : 2
			},
			duration : 0.5,
			easing : easing
		});
	});
	obj.on('mouseout touchend', function() {
		this.transitionTo({
			scale : {
				x : 1,
				y : 1
			},
			duration : 0.5,
			easing : easing
		});
	});
	obj.on('mousedown', function(evt) {
		var shape = evt.shape;
		alert("clikded on" + shape.getId());
	});
}
var getAnswere = function(e) {
	var ele;
	var evt = e ? e : event;
	if (evt.srcElement)
		ele = evt.srcElement;
	else if (evt.target)
		ele = evt.target;
	userAns = String(evt.target.value);
	//disableRadioButton();
	return true;
}

var resetGame = function(){
	var confirm = window.confirm("Are you sure to reset the game!");
		questionCount = 9;
		_squareCount = 1;
		points = 1;
		_space = 1.08;
		pointer;
		trans;
		rowCount = 0;
		currentPosition = 9;
		currentQuestion = 1;
		serverQuestionNo = 1;
		totQuestion = 100;
		gameCompleted = false;
		preloader;
		selectedchoice = 1;
		tempQuestionNo = 0;
		_countdown = 60;
		_rectCollection = [];
		_x = 1;
		_y = 1;
		_cols = 10;
		_rows = 10;
		_width = 50;
		_height = 50;
		var sec = 1;
		minutes = 1;
		hours = 1;
		secStr = "";
		minStr = "";
		hrStr = "";
		
	if(confirm==true)
	{
		stage.destroy();
		layer.clear();
		gameRender();
	}
	
	else{
		return;
	}
		
}

var postQuestionToFbWall = function() {
	FB.ui({
		method : 'feed',
		name : 'Facebook Dialogs',
		link : 'https://developers.facebook.com/docs/reference/dialogs/',
		picture : '',
		caption : 'College Lab Quize',
		description : $("#question-data").html() + "\n" + $("#optionsList").html()
	}, function(response) {
		if (response && response.post_id) {
			alert('Post was published.');
		} else {
			alert('Post was not published.');
		}
	});
}
 