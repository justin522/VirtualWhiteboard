function svg(element, attributes, action){
		var el;
		switch(action){
			case "remove":
				el=element;
				if(el.parentElement)el.parentElement.removeChild(el);
				break;
			case "clear-attributes":
				el=element;
				for(var attr in attributes){
					el.removeAttribute(attr);
				}
				break;
			case "update-attributes":
				el=element;
				for(var attr in attributes){
					if(attr.substr(0,5)==="xlink")alert("sfasf");
					el.setAttribute(attr,attributes[attr]);
				}
				break;
			default:
				el=document.createElementNS("http://www.w3.org/2000/svg", element);
				for(var attr in attributes){
					if(attr.substr(0,5)==="xlink")alert("sfasf");
					el.setAttribute(attr,attributes[attr]);
				}
		}
		return el;
	}