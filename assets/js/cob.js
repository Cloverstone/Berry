//		CoblerJS 0.2.0
//		(c) 2011-2016 Adam Smallcomb
//		Licensed under the MIT license.
//		For all details and documentation:
//		https://github.com/Cloverstone/Cobler

function Cobler(options){
	function collection(target, items, cob){
		var active;
		var myBerry;
		target.addEventListener('click', instanceManager);
		Sortable.create(target, {
			group: 'sortableGroup',
			animation: 150,
			onAdd: function (evt){
				var A = evt.item; // the current dragged HTMLElement
				//handle if dragged over target and put back in original
				if(A.parentNode === target) {
				 	var a = A.parentNode.replaceChild(renderItem(Cobler.types[A.dataset.type].default), A);
				}
				items.splice(evt.newIndex, 0 , Cobler.types[A.dataset.type].default);
			}, onEnd: function (evt) {
				items.splice(evt.newIndex, 0 , items.splice(evt.oldIndex, 1)[0]);
			}
		});
		load(items);
		function reset(items) {
			target.innerHTML = "";
			items = items || [];
		}
		function instanceManager(e) {
			var referenceNode = e.target.parentElement.parentElement;
			var container = referenceNode.parentElement;
			var classList = e.target.className.split(' ');

			if(classList.indexOf('remove-item') >= 0){
				items.splice(getNodeIndex(referenceNode), 1);
				container.removeChild(referenceNode);
			 	cob.publish('change')
			}else if(classList.indexOf('duplicate-item') >= 0){
				deactivate();
				container.insertBefore(referenceNode.cloneNode(true), referenceNode.nextSibling);
				//neds to be extended -currently references same item
				items.splice(getNodeIndex(referenceNode) + 1, 0 , items[getNodeIndex(referenceNode)] );
			 	cob.publish('change')
			}else if(e.target.tagName === 'LI') {
				activate(e.target);
			}
		}
		function activate(targetEL){
			deactivate();
			targetEL.className += ' widget_active';
			active = getNodeIndex(targetEL);
			activeEl = targetEL;
			cob.publish('activate');
			myBerry = new Berry({renderer: 'tabs', actions: false, attributes: items[active], fields: Cobler.types[items[active].widgetType].fields}, $(document.getElementById('form'))).on('change', function(){
				//needs to be more comprehensive
				var widgetType = items[active].widgetType;
				items[active] = this.toJSON();
				items[active].widgetType = widgetType;
				var temp = renderItem(items[active]);
				temp.className += ' widget_active';
			 	var a = activeEl.parentNode.replaceChild(temp, activeEl);
			 	activeEl = temp;
			 	cob.publish('change')
			});
		}
		function deactivate(){
			if(typeof myBerry !== 'undefined'){
				myBerry.destroy();
				myBerry = undefined;
			}
			active = null;
			activeEl = null;
			var elems = target.getElementsByClassName('widget_active');
			[].forEach.call(elems, function(el) {
			    el.className = el.className.replace('widget_active', '');
			});
		}
		function load(obj){
			reset(obj);
			items = obj;
			for(var i in obj){
				target.appendChild(renderItem(obj[i]));
			}
		}
		function addItem(widgetType){
			var renderedItem = renderItem(Cobler.types[widgetType].default);
			target.appendChild(renderedItem);
			items.splice(items.length, 0, Cobler.types[widgetType].default);
			activate(renderedItem);
			cob.publish('change')
		}
		function toJSON(){
			return items;
		}
		function toHTML(){
			var temp = "";
			for(var i in items){
				temp += Cobler.types[items[i].widgetType].render(items[i]);
			}
			return temp;
		}
		return {
			addItem: addItem,
			toJSON: toJSON,
			toHTML: toHTML,
			deactivate: deactivate,
			clear: reset,
			load: load
		}
	}


	function renderItem(item){
		var LI = document.createElement('LI');
		LI.dataset.type = item.widgetType;
		LI.innerHTML = templates.itemContainer.render();
		LI.getElementsByClassName('cobler-li-content')[0].innerHTML = Cobler.types[item.widgetType].render(item);//templates['berry_' + item.widgetType].render(item, templates);
		return LI;
	}
	function getNodeIndex(node) {
	  var index = 0;
	  while ( (node = node.previousSibling) ) {
	    if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
	      index++;
	    }
	  }
	  return index;
	}
	function addCollection(target, item){
		c.push(new collection(target, item, this));
	}
	function addSource(element){
		Sortable.create(element, {group: {name: 'sortableGroup', pull: 'clone', put: false}, sort: false });
	}
	function applyToEach(func){
		return function(){
			var temp = [];
			for(var i in c) {
				temp.push(c[i][func]());
			}
			this.publish(func);
			return temp;
		}.bind(this)
	}
  this.topics = {};

  this.subscribe = function(topic, listener) {
    // create the topic if not yet created
    if(!this.topics[topic]) this.topics[topic] = [];

    // add the listener
    this.topics[topic].push(listener);
  }

  this.publish = function(topic, data) {
    // return if the topic doesn't exist, or there are no listeners
    if(!this.topics[topic] || this.topics[topic].length < 1) return;

    // send the event to all listeners
    this.topics[topic].forEach(function(listener) {
      listener(data || {});
    });
  }

	var c = [];
	for(var i in options.targets){
		addCollection.call(this, options.targets[i], options.items[i]);
	}
	return {
		collections: c,
		addCollection: addCollection,
		addSource: addSource,
		toJSON: applyToEach.call(this,'toJSON'),
		toHTML: applyToEach.call(this,'toHTML'),
		clear: applyToEach.call(this,'clear'),
		deactivate: applyToEach.call(this, 'deactivate'),
		on: this.subscribe.bind(this)//,
		// trigger: this.publish.bind(this)
	};
}



Cobler.types={};


