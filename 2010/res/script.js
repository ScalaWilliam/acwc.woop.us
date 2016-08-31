function pFlags(flag,reg) 
{
	var clas = flag.getAttribute('class');
	var m = reg.exec(clas);
	if ( m != null ) 
	{
		addFlag(flag,m[1],m[2].toLowerCase());
	};
};
var setFlags = function()
{
	var a = document.getElementsByTagName('a');
	var b = document.getElementsByTagName('span');
	var reg = new RegExp('(ipl|pl)_([A-Z][A-Z])');

	for ( var i = 0; i < a.length; i++ )
	{
		pFlags(a[i],reg);
	};
	for ( var i = 0; i < b.length; i++ )
	{
		pFlags(b[i],reg);
	};
	
	var tt = document.getElementsByTagName('tr');
	for ( var i = 0; i < tt.length; i++)
	{
		if (tt[i].getAttribute('class') == 'tzl') { tt[i].setAttribute('onclick','disall(this,true);');
		tt[i].setAttribute('onmouseover',"this.setAttribute('style','background-color:silver');");
		tt[i].setAttribute('onmouseout',"this.setAttribute('style','');");
		 }
	}
};
function disall(x,st) { 
	x.setAttribute("style","");
	x.setAttribute('onclick','disall(this,false)');
	var tt = document.getElementsByTagName('tr');
	for ( var i = 0; i < tt.length; i++)
	{
		if (tt[i].getAttribute('class') == 'tzl') { tt[i].setAttribute('style',st == true ? 'display:none;' : ''); }
	}
}
function addFlag(element, xclass, flag)
{
	element.setAttribute('class',xclass);
	element.setAttribute('style','background-image:url(/2010/res/flags/png/'+flag+'.png);');
}
function ajaxFunction() {if (window.XMLHttpRequest) { return new XMLHttpRequest(); } else if (window.ActiveXObject) { return new ActiveXObject("Microsoft.XMLHTTP"); } else { return false;  } };
window.onload = function() { setFlags(); uTime(); };
var uTime = function()
{
	var xhr = ajaxFunction();
	xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
			var re = new RegExp('^([^ ]+) ([^ ]+)$');
			var m = re.exec(xhr.responseText);
			if (typeof m == "null" || typeof m == "undefined") { alert("Time matching failed!"); return false; }
			lshift = parseInt(m[1]);
			tshift = parseInt(m[2]);
		makeUpdate();
	}
	};
	var now = new Date();
	xhr.open('GET', '/2010/unixtime.do?time='+
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
			};
				el.innerHTML = "<span class='st'>"+ifZero(hour)+":00 UTC+0000</span>, <span class='lt'>"+ifZero((hour +24+lshift) % 24)+":00 "+((hour+lshift) < 0?"(previous day) ":((hour+lshift) > 23 ? "(next day) " :""))+"local</span>";
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

