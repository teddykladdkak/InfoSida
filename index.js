const express = require('express');
const app = express();
const fs = require('fs');
var bodyParser = require('body-parser');

var param = {
	"port": 7755,
	"text": {
		"installningar": {
			"sv": "Inställningar"
		},
		"telefon": {
			"sv": "Telefon: "
		},
		"shortklocka": {
			"sv": "Kl"
		}
	},
	"installningar": [{
		"id": "highcontrast",
		"click": "changecontrast",
		"text": {
			"sv": "Hög kontrast"
		}
	},{
		"id": "dyslexi",
		"click": "changedyslexi",
		"text": {
			"sv": "Dyslexi"
		}
	},{
		"id": "voice",
		"click": "addvoice",
		"text": {
			"sv": "Text till tal"
		}
	},{
		"id": "showall",
		"click": "showall",
		"text": {
			"sv": "Visa allt"
		}
	}],
	"voice": {
		"sv": "Swedish Female"
	}
}
// Gör att man kan läsa svar från klient med json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function makeid(namn){return namn.replace(/\s/g,'').replace( /\W/g , '').toLowerCase();};
function makestyle(info, options){
	var code = '';
	for (var i = 0; i < info.data.length; i++){
		var buttonid = makeid(info.data[i].knapp.text[options.sprak]);
		code = code + ' #' + buttonid + 'button { background-image: url(assets/' + options.ward + '/img/' + info.data[i].knapp.img.deaktiv + '); }';
	};
	return code;
};

app.get('*/manifest.json', function (req, res) {
	res.jsonp(makemanifest(req));
})

//Mall kod
app.engine('html', function (filePath, options, callback) {
	//console.log(options);
	var info = JSON.parse(fs.readFileSync('public/assets/' + options.ward + '/info.json', 'utf8'));
	var installningararray = [];for (var i = param.installningar.length - 1; i >= 0; i--) {installningararray.push(param.installningar[i].id);};
	fs.readFile(filePath, function (err, content) {
		var rendered = content.toString()
			.replace(/#titel#/g, info.avdinfo.titel)
			.replace(/#assetlink#/g, 'assets/' + options.ward)
			.replace(/#information#/g, info.avdinfo.info)
			.replace('#style#', makestyle(info, options))
			.replace('#content#', buildsite(info, options))
			.replace('#installningar#', '"' + installningararray.join('", "') + '"')
			.replace('#voice#', param.voice[options.sprak])
		return callback(null, rendered)
	})
}).set('views', './views').set('view engine', 'html').use(express.static('public'))

app.get(['/', '/index.html'], function (req, res) {
	res.render('index', {"ward": "default", "sprak": "sv"})
})

function makemanifest(req){
	var ward = req.originalUrl.replace('/manifest.json', '').replace('/', '');
	var info = JSON.parse(fs.readFileSync('public/' + ward + '/info.json', 'utf8'));
	var code = {
		"name": info.avdinfo.titel,
		"short_name": info.avdinfo.titelkort,
		"background_color": "#035988",
		"description": info.avdinfo.info,
		"icons": [{
			"src": ward + "/ico/icon36x36.png",
			"sizes": "36x36",
			"type": "image/png",
			"density": 0.75
		},{
			"src": ward + "/ico/icon48x48.png",
			"sizes": "48x48",
			"type": "image/png",
			"density": 1.0
		},{
			"src": ward + "ico/icon72x72.png",
			"sizes": "72x72",
			"type": "image/png",
			"density": 1.5
		},{
			"src": ward + "ico/icon96x96.png",
			"sizes": "96x96",
			"type": "image/png",
			"density": 2.0
		},{
			"src": ward + "ico/icon144x144.png",
			"sizes": "144x144",
			"type": "image/png",
			"density": 3.0
		},{
			"src": ward + "ico/icon192x192.png",
			"sizes": "192x192",
			"type": "image/png",
			"density": 4.0
		}],
		"display": "standalone",
		"orientation": "portrait",
		"theme_color": "#035988"
	};
	return code;
};
function buildsite(info, options){
	var sprak = options.sprak;
	var code = '';
	for (var i = 0; i < info.data.length; i++){
		var buttonid = makeid(info.data[i].knapp.text[sprak]);
		if(i == 0){
			var buttonshow = ' show';
			var wrappershow = ' class="visible"';
		}else{
			var buttonshow = '';
			var wrappershow = ' class="hidden"';
		}
		code = code + '<div class="button' + buttonshow + '" id="' + buttonid + 'button" onmouseover="makecolour(this);" onmouseout="removecolour(this);" data-deactive="assets/' + options.ward + '/img/' + info.data[i].knapp.img.deaktiv + '" data-aktiv="assets/' + options.ward + '/img/' + info.data[i].knapp.img.aktiv + '" onclick="showhide(\'' + buttonid + '\');"><p>' + info.data[i].knapp.text[sprak] + '</p></div>';
		code = code + '<div id="' + buttonid + '"' + wrappershow + '><svg aria-hidden="true" class="closebutton" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" onclick="showhide(\'' + buttonid + '\');"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path></svg>';
		for (var a = 0; a < info.data[i].innehall.length; a++){
			if(info.data[i].innehall[a].type == 'rubrik'){
				code = code + '<h1>' + info.data[i].innehall[a][sprak] + '</h1>';
			}else if(info.data[i].innehall[a].type == 'normal'){
				code = code + '<p>' + info.data[i].innehall[a][sprak].join('<br/>') + '</p>';
			}else if(info.data[i].innehall[a].type == 'installningar'){
				code = code + '<h2>' + param.text.installningar[sprak] + '</h2>';
				for (var b = 0; b < param.installningar.length; b++){
					code = code + '<p><input type="checkbox" id="' + param.installningar[b].id + '" onclick="' + param.installningar[b].click + '(this);"> ' + param.installningar[b].text[sprak] + '</p>';
				};
			}else if(info.data[i].innehall[a].type == 'bubbla'){
				code = code + '<div class="bubbla">';
				for (var b = 0; b < info.data[i].innehall[a].text.length; b++){
					if(info.data[i].innehall[a].text[b].type == 'rubrik'){
						code = code + '<h2>' + info.data[i].innehall[a].text[b][sprak] + '</h2>';
					}else if(info.data[i].innehall[a].text[b].type == 'normal'){
						code = code + '<p>' + info.data[i].innehall[a].text[b][sprak].join('</p><p>') + '</p>';
					};
				};
				code = code + '</div>';
			}else if(info.data[i].innehall[a].type == 'lista'){
				code = code + '<ul><li><p>' + info.data[i].innehall[a][sprak].join('</p></li><li><p>') + '</p></li></ul>';
			}else if(info.data[i].innehall[a].type == 'rutor'){
				code = code + '<div class="table">';
				for (var b = 0; b < info.data[i].innehall[a].rutor.length; b++){
					code = code + '<div class="tr">'
					code = code + '<div class="td"><h2>' + info.data[i].innehall[a].rutor[b].rubrik[sprak] + '</h2><p>' + info.data[i].innehall[a].rutor[b].plats[sprak] + '</p>';
					if(info.data[i].innehall[a].rutor[b].telefon == ''){}else{
						code = code + '<p>' + param.text.telefon[sprak] + ' <a href="tel:' + info.data[i].innehall[a].rutor[b].telefon.replace(/ /g, '').replace(/-/g, '') + '">' + info.data[i].innehall[a].rutor[b].telefon + '</a></p>';
					};
					code = code + '<p>' + info.data[i].innehall[a].rutor[b].oppet[sprak].join('<br/>') + '</p></div>';
					code = code + '<div class="td"><h2>' + info.data[i].innehall[a].rutor[b + 1].rubrik[sprak] + '</h2><p>' + info.data[i].innehall[a].rutor[b + 1].plats[sprak] + '</p>';
					if(info.data[i].innehall[a].rutor[b].telefon == ''){}else{
						code = code + '<p>' + param.text.telefon[sprak] + ' <a href="tel:' + info.data[i].innehall[a].rutor[b + 1].telefon.replace(/ /g, '').replace(/-/g, '') + '">' + info.data[i].innehall[a].rutor[b + 1].telefon + '</a></p>';
					};
					code = code + '<p>' + info.data[i].innehall[a].rutor[b + 1].oppet[sprak].join('<br/>') + '</p></div>';
					code = code + '</div>';
					++b;
				};
				code = code + '</div>';
			}else if(info.data[i].innehall[a].type == 'karta'){
				code = code + '<div class="imgwrapper"><img src="assets/' + options.ward + '/img/karta2.png" class="karta"></div>';
			}else if(info.data[i].innehall[a].type == 'time'){
				var hour = 0;
				code = code + '<div class="colourmarking"><table style="width: 100%; border-collapse: collapse;">';
				var firstrow = '<tr>';
				var secondrow = '<tr style="height: 30px;">';
				for (var b = 0; b < 12; b++){
					var tider = [addzero(hour) + '00', addzero(hour) + '30', addzero((hour + 1)) + '00', addzero((hour + 1)) + '30'];
					var background = checktimes(info.data[i].innehall[a].times, tider);
					firstrow = firstrow + '<td colspan="4" style="border-left: solid 1px #000;">' + addzero(hour) + '</td>';
					secondrow = secondrow + '<td style="width: 2%; border-left: solid 1px #000; border-top: solid 1px #000; border-bottom: solid 1px #000;' + background[0] + '" data-time="' + tider[0] + '"></td>';
					secondrow = secondrow + '<td style="width: 2%; border-top: solid 1px #000; border-bottom: solid 1px #000;' + background[1] + '" data-time="' + tider[1] + '"></td>';
					secondrow = secondrow + '<td style="width: 2%; border-left: solid 1px #000; border-top: solid 1px #000; border-bottom: solid 1px #000;' + background[2] + '" data-time="' + tider[2] + '"></td>';
					if(b == 11){
						secondrow = secondrow + '<td style="width: 2%; border-right: solid 1px #000; border-top: solid 1px #000; border-bottom: solid 1px #000;' + background[3] + '" data-time="' + tider[3] + '"></td>';
					}else{
						secondrow = secondrow + '<td style="width: 2%; border-top: solid 1px #000; border-bottom: solid 1px #000;' + background[3] + '" data-time="' + tider[3] + '30"></td>';
					};
					hour = hour + 2;
				};
				var tablecode = '';
				for (var b = 0; b < info.data[i].innehall[a].times.length; b++){
					tablecode = tablecode + '<div class="tr"><div class="td">' + param.text.shortklocka[sprak] + ' ' + info.data[i].innehall[a].times[b].start + '-' + info.data[i].innehall[a].times[b].end + '</div><div class="td">' + info.data[i].innehall[a].times[b][sprak] + '</div></div>';
				};
				code = code + firstrow + '</tr>' + secondrow + '</tr></table><div class="table">' + tablecode + '</div>';
				code = code + '</div>';
			};
		};
		code = code + '</div>';
	};
	return code;
};
function checktimes(data, tider){
	var toreturn = ['', '', '', ''];
	for (var a = 0; a < tider.length; a++){
		var holder = '';
		for (var b = 0; b < data.length; b++){
			if(parseInt(data[b].start.replace(':', '')) <= parseInt(tider[a]) && parseInt(tider[a]) < parseInt(data[b].end.replace(':', ''))){
				toreturn[a] = ' background-color: ' + data[b].colour + ';'
			};
		};
	};
	return toreturn;
};
function addzero(hour){
	if(hour <= 9){
		hour = '0' + hour;
	};
	return hour;
};

app.listen(param.port, () => console.log('Lyssnar på port ' + param.port + '!'))