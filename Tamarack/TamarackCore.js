function random(min,max)
{
    min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addParameters(_url,_args,_vals) {
	let url = _url + "?";
	let max = Math.min(_args.length,_vals.length);
	for(var i=0; i<max; i++) {
		url += _args[i] + "=" + _vals[i];
		if (i < max-1) url += "&";
	}

	return url;
}

function getParameterFromURL(_name, _url) 
{
	if (!url) 
	{
		_url = window.location.href;
	}
	_name = _name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + _name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(_url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getParameter(_name) {
	return getParameterFromURL(_name,getUrl());
}
			
function getUrl()
{
	return window.location.href;
}
class tkDocument 
{	
	constructor() 
	{
		this.output = document.body;
	}
		
	// Document
	get title()
	{
		return document.title;
	}


	set title(_title)
	{
		return document.title = _title;
	}

	put(_str)
	{
		var t = document.createTextNode(_str);
		this.output.appendChild(t);
		
		return t;
	}

	putLine(_string)
	{
		if (_string == "undefined" || _string == null)
			_string = "";
		
		var t = document.createTextNode(_string);
		var p = document.createElement("p"); 
		p.appendChild(t);
		this.output.appendChild(p);
			
		return p;
	}

	putLines(_strings)
	{
		for (let str of _strings)
			this.putLine(str);
	}

	putHeader(_string, _header)
	{
		if(["h1","h2","h3","h4","h5","h6"].indexOf(_header.toLowerCase()) != -1)
		{
			var h = document.createElement(_header);
			var t = document.createTextNode(_string);
			h.appendChild(t);
			this.output.appendChild(h);
			
			return h;
		}
	}
}