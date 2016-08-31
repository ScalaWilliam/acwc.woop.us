function ajaxFunction() {if (window.XMLHttpRequest) { return XMLHttpRequest(); } else if (window.ActiveXObject) { return new ActiveXObject("Microsoft.XMLHTTP"); } else { return false;  } };
var pages = new Array('info','teams','tree','data');
function makePaged()
{
	return true;
	var dzl = document.getElementsByTagName('a');
	for ( var i = 0; i <dzl.length; i++)
	{
		if (dzl[i].getAttribute('href') == undefined)
		{
			dzl[i].setAttribute('style','position:absolute; top:0px;');
			dzl[i].setAttribute('name', '_'+dzl[i].getAttribute('name'));
		}
		else 
		{
			var sl = dzl[i].getAttribute('href');
			if ( sl.length  > 3 )
			{
				var sl2 = sl.substring(1);
				//alert(sl2);
				var xmatch = undefined;
				for (var k= 0; k<pages.length;k++)
				{
					if (pages[k] == sl2.substr(0,pages[k].length))
					{
						xmatch = pages[k];
					}
				}
				if (xmatch != undefined)
				{
					dzl[i].setAttribute('onclick','showPage("'+xmatch+'");return true;');
				}
			}
		}
	};
	/*
	for (var i = 0; i < pages.length; i++)
	{
		var page = pages[i];
		document.getElementById('ln_'+page).setAttribute('onclick','showPage("'+page+'");return true;');
	}*/
	//document.getElementById('kk').innerHTML = '<ul id="menu"><li><a href="#main">Main information</a></li><li><a href="#line-up">Line-ups</a></li><li><a href="#contact" onclick="">Contact</a></li></ul>'+document.getElementById('kk').innerHTML;
};
function showPage(name)
{
	return true;
	for (var i = 0; i < pages.length; i++)
	{
		var page = pages[i];
		if (page == name)
		{
			document.getElementById('pg_'+page).setAttribute('style','display:block');
		}
		else
		{
			document.getElementById('pg_'+page).setAttribute('style','display:none');
		}
	}
};
window.onload = function()
{
	/*var ix = false;
	var ss = self.document.location.hash.substring(1);
	for ( var i = 0; i < pages.length; i++)
	{
		if ( ss.substr(0,pages[i].length) == pages[i] ) { ix = true;ss=pages[i]; }
	};
	if ( ix == true ) {
		showPage(ss);
	}
	else
	{
		showPage('info');
	}*/
	var xhr = ajaxFunction();
	xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
			var re = new RegExp('^([^ ]+) ([^ ]+)$');
			var m = re.exec(xhr.responseText);
			
			lshift = parseInt(m[1]);
			tshift = parseInt(m[2]);
		makeUpdate();
	}
	};
	//setTimeout('self.document.location=self.document.location+"";',100);
	var now = new Date();
	xhr.open('GET', '/acwc0709/unixtime.php?time='+
			escape(now.getFullYear()+"/"+(1+now.getMonth())+"/"+now.getDate()+" "+
				now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()), true);
	xhr.send(null);
};
var lshift;
var tshift;
var utcd;
function makeUpdate()
{
	if (lshift == 0 ) { utcd="+0000"; }
	else if (lshift > 0 && lshift <10 ) { utcd="+0"+lshift+"00"; }
	else if ( lshift < 0 && lshift > -10 ) { utcd = "-0"+(0-lshift)+"00"; }
	else if ( lshift <0  ) { utcd = lshift+"00"; }
	else { utcd = "+"+lshift+"00"; }
	var dels = document.body.getElementsByTagName('span');
	var re = new RegExp('([^\:]+)\:00');
	for ( var i = 0; i < dels.length; i++)
	{
		var el = dels[i];
		if ( el.getAttribute('class') == "dc" )
		{
			
			var sr = re.exec(el.innerHTML);
			if ( sr != null )
			{
				if (sr[1].substr(0,1) == 0 ) {
					var hour = parseInt(sr[1].substr(1))
				}
				else
				{
				var hour = parseInt(sr[1]);
			}
				el.innerHTML = "<span class='st'>"+ifZero(hour)+":00 UTC+0000</span>, <span class='lt'>"+ifZero((hour +24+lshift) % 24)+":00 local</span>";
			}
		}
	};
	upTime();
	setInterval('upTime();',1000);
};
function makeUpdatex()
{
localdate = new Date();
serverdate = new Date(d);
setInterval('upTime();',1000);

if (localdate < serverdate) { servershift = new Date(serverdate.valueOf()-localdate.valueOf());neg=-1; }
else { servershift = new Date(localdate.valueOf()-serverdate.valueOf());neg=1; }
//alert(servershift.valueOf());
fservershift=servershift;
if ( navigator.userAgent.indexOf("Firefox")!=-1 && navigator.userAgent.indexOf("Firefox/3.5") ==-1)
{
servershift = new Date(Math.round(servershift.valueOf()/3600000)*3600000+localdate.getTimezoneOffset()*60*1000);
}else if (navigator.userAgent.indexOf('Firefox/3.5') != -1 )
{
	//alert(servershift);
	servershift = new Date(Math.round(servershift.valueOf()/3600000)*3600000+localdate.getTimezoneOffset()*60*1000);
}
else
{
servershift = new Date(Math.round(servershift.valueOf()/3600000)*3600000);
}
if ( localdate < serverdate ) { utctime = -servershift.getHours();utcd = "-"+ifZero(-utctime)+"00"; }
else { utctime = servershift.getHours(); utcd = "+"+ifZero(utctime)+"00";}
var dels = document.body.getElementsByTagName('span');
var re = new RegExp('([^\:]+)\:00');
for ( var i = 0; i < dels.length; i++)
{
	var el = dels[i];
	if ( el.getAttribute('class') == "dc" )
	{
		
		var sr = re.exec(el.innerHTML);
		if ( sr != null )
		{
			if (sr[1].substr(0,1) == 0 ) {
				var hour = parseInt(sr[1].substr(1))
			}
			else
			{
			var hour = parseInt(sr[1]);
		}
			el.innerHTML = "<span class='st'>"+ifZero(hour)+":00 UTC+0000</span>, <span class='lt'>"+ifZero((hour +24+utctime) % 24)+":00 local</span>";
		}
	}
};
upTime();
setInterval('upTime();',1000);
};
function ifZero(v)

{
	if ( v < 10 ) { return "0" + v; } 
	return v;
}
function renderTime(t)
{
	return ifZero(t.getHours())+":"+ifZero(t.getMinutes())+":"+ifZero(t.getSeconds());
};
function upTime()
{
	serverdate = new Date((new Date()).valueOf()-tshift*1000);
	document.getElementById('localtime').innerHTML = renderTime(new Date())+" UTC"+utcd;
	document.getElementById('servertime').innerHTML = renderTime(serverdate)+" UTC+0000";
}
