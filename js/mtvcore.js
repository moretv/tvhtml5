var mtv = mtv || {
    frw : function(){
    }
};
var frw = new mtv.frw();
/**
 * 全局获取元素方法，只支持根据元素id或class查找。
 * 根据元素id查找时，需在元素id前加#字符，eg：frw.$('#elemId')，返回该dom元素；
 * 根据元素class查找时，多个class名字需用空格分开，eg：frw.$('elemClassName1 elemClassName2 ...')，返回所有class包含selectorStr的元素集合；
 * @param selectorStr
 * @return {*}
 */
mtv.frw.prototype.$ = function(selectorStr){
    if(selectorStr && selectorStr != ''){
        selectorStr = selectorStr.toString();
        if(selectorStr.charAt(0) == '#'){
            return document.getElementById(selectorStr.slice(1));
        } else{
            return frw.getElementsByClassName(selectorStr);
        }
    } else{
        return null;
    }
};
mtv.frw.prototype.console = true; // 控制台输出日志开关，默认输出，false不输出
mtv.frw.allPageIds = [];// 应用所有Page Id数组集合
mtv.frw.Page = function(){
    this.allZoneIds = [];// 每一个Page所有的Zone Id数组集合
};
mtv.frw.Page.prototype.id = '';// 每一个Page的Id，全局唯一
mtv.frw.Page.prototype.currentZoneId = '';// Page的当前Zone Id
mtv.frw.Page.prototype.Zone = null;// Page Zone对象，默认为null

mtv.frw.Page.Zone = function(){
    this.allItemIds = [];// 每一个Zone所有的Item Id数组集合
    this.items = [];// 每一个Zone所有的Item数组集合
};
mtv.frw.Page.Zone.prototype.id = ''; // Zone Id
mtv.frw.Page.Zone.prototype.up = '';// Zone切换时上一Zone Id
mtv.frw.Page.Zone.prototype.down = '';// Zone切换时下一Zone Id
mtv.frw.Page.Zone.prototype.left = '';// Zone切换时左一Zone Id
mtv.frw.Page.Zone.prototype.right = '';// Zone切换时右一Zone Id
mtv.frw.Page.Zone.prototype.item = 0;// Zone当前焦点item索引
mtv.frw.Page.Zone.prototype.prevZone = null;// Zone改变后的上一个Zone Id
mtv.frw.Page.Zone.prototype.prevItem = 0;// item改变后的上一item索引
mtv.frw.Page.Zone.prototype.row = 0;// Zone的item总行数
mtv.frw.Page.Zone.prototype.crow = 0;// Zone的当前行
mtv.frw.Page.Zone.prototype.column = 0;// Zone的item总列数
mtv.frw.Page.Zone.prototype.items = null;// Zone的所有item数组集合
mtv.frw.Page.Zone.prototype.values = [];// Zone的所有values的数组集合
mtv.frw.Page.Zone.prototype.defaultBehavior = true;// Zone的item改变时的默认行为是否执行，默认执行，false不执行，即切换item的defaultClassName和hoverClassName
mtv.frw.Page.Zone.prototype.scrollFunc = null;// Zone的滚动执行方法
mtv.frw.Page.Zone.prototype.scrollObj = null;// Zone的滚动对象
mtv.frw.Page.Zone.Item = function(){};// Zone的item对象
mtv.frw.Page.Zone.Item.prototype.id = '';// item的id
mtv.frw.Page.Zone.Item.prototype.itemName = '';// item的名字（class属性）
mtv.frw.Page.Zone.Item.prototype.defaultClassName = null;// item非聚焦时的class name
mtv.frw.Page.Zone.Item.prototype.hoverClassName = null;// item聚焦时的class name
mtv.frw.Page.Zone.Item.prototype.defaultFunc = null;// item非聚焦时执行的方法
mtv.frw.Page.Zone.Item.prototype.hoverFunc = null;// item聚焦时执行的方法
mtv.frw.Page.Zone.Item.prototype.scrollFunc = null;// item滚动时执行的方法
mtv.frw.Page.Zone.Item.prototype.mouseSupport = true;// 是否支持鼠标onmousedown onmouseover方法
mtv.frw.Page.Zone.Item.prototype.value = null;// item的value对象
/**
 * 创建Page
 * @param createPageParams Page参数对象，必须包含id属性
 * @return {*} 被创建的Page对象
 */
mtv.frw.prototype.createPage = function(createPageParams){
    if (createPageParams && createPageParams.id && createPageParams.id != '') {
        var page = new mtv.frw.Page();
        page.id = createPageParams.id || '';
        page.Zone = createPageParams.Zone || [];
        mtv.frw.Page[page.id] = page;
        mtv.frw.allPageIds.push(page.id);
        return mtv.frw.Page[page.id];
    } else{
        return null;
    }
};
/**
 * 为指定Page创建Zone，
 * @param pageId Zone所属Page
 * @param createZoneParams Zone参数对象，必须包含id属性
 * @return {*} 被创建的Zone对象
 */
mtv.frw.prototype.createZone = function(pageId,createZoneParams){
    if (pageId && pageId != '' && createZoneParams && createZoneParams.id && createZoneParams.id != '') {
        if (mtv.frw.Page[pageId]) {
            var zone = new mtv.frw.Page.Zone();
            zone.id = createZoneParams.id || '';
            zone.up = createZoneParams.up || null;
            zone.down = createZoneParams.down || null;
            zone.left = createZoneParams.left || null;
            zone.right = createZoneParams.right || null;
            zone.items = createZoneParams.items || [];
            zone.item = createZoneParams.item || 0;
            zone.prevItem = createZoneParams.prevItem || -1;
            zone.prevZone = createZoneParams.prevZone || null;
            zone.row = createZoneParams.row || 0;
            zone.crow = createZoneParams.crow || 0;
            zone.column = createZoneParams.column || 0;
            zone.values = createZoneParams.values || [];
            zone.defaultBehavior = typeof createZoneParams.defaultBehavior == 'undefined' ? true : createZoneParams.defaultBehavior;
            zone.scrollFunc = createZoneParams.scrollFunc || null;
            zone.scrollObj = createZoneParams.scrollObj || null;
            mtv.frw.Page[pageId].allZoneIds.push(zone.id);
            mtv.frw.Page[pageId].Zone[zone.id] = zone;
            return mtv.frw.Page[pageId].Zone[zone.id];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
/**
 * 为指定Page的指定Zone创建item
 * @param pageId item所属Page
 * @param zoneId item所属Zone
 * @param createItemParams 参数对象，必须包含id属性
 * @return {*} 被创建的Item对象
 */
mtv.frw.prototype.createItem = function(pageId,zoneId,createItemParams){
    if (pageId && pageId != '' && zoneId && zoneId != '' && createItemParams && createItemParams.id && createItemParams.id != '') {
        if (mtv.frw.Page[pageId].Zone[zoneId]) {
            var item = new mtv.frw.Page.Zone.Item();
            item.id = createItemParams.id || '';
            item.itemName = createItemParams.itemName || '';
            item.defaultClassName = createItemParams.defaultClassName || null;
            item.hoverClassName = createItemParams.hoverClassName || null;
            item.value = createItemParams.value || null;
            item.defaultFunc = createItemParams.defaultFunc || null;
            item.hoverFunc = createItemParams.hoverFunc || null;
            item.scrollFunc = mtv.frw.Page[pageId].Zone[zoneId].scrollFunc || null;
            this.addEventsToItem(pageId,zoneId,item);
            mtv.frw.Page[pageId].Zone[zoneId].allItemIds.push(item.id);
            mtv.frw.Page[pageId].Zone[zoneId].items.push(item);
            return item;
        }else{
            return null;
        }
    } else {
        return null;
    }
};
/**
 * 为指定Page的指定Zone创建item
 * @param pageId item所属Page
 * @param zoneId item所属Zone
 * @param createItemParams 参数对象，必须包含id属性
 * @return {*} 被创建的Item对象
 */
mtv.frw.prototype.createItems = function(pageId,zoneId,createItemParams){
    if (pageId && pageId != '' && zoneId && zoneId != '' && createItemParams && createItemParams.idPrefix && createItemParams.idPrefix != '') {
        if (mtv.frw.Page[pageId].Zone[zoneId]) {
            var itemSize = mtv.frw.Page[pageId].Zone[zoneId].values.length;
            for(var i=0; i<itemSize;i++){
                var item = new mtv.frw.Page.Zone.Item();
                item.id = createItemParams.idPrefix+i || i;
                item.itemName = createItemParams.itemName || '';
                item.defaultClassName = createItemParams.defaultClassName || null;
                item.hoverClassName = createItemParams.hoverClassName || null;
                item.value = createItemParams.value || null;
                item.defaultFunc = createItemParams.defaultFunc || null;
                item.hoverFunc = createItemParams.hoverFunc || null;
                item.scrollFunc = mtv.frw.Page[pageId].Zone[zoneId].scrollFunc || null;
                mtv.frw.Page[pageId].Zone[zoneId].allItemIds.push(item.id);
                mtv.frw.Page[pageId].Zone[zoneId].items.push(item);
                if(typeof createItemParams.mouseSupport != 'undefined' && !createItemParams.mouseSupport){

                }else{
                    this.addEventsToItem(pageId,zoneId,item);
                }
            }
            return  mtv.frw.Page[pageId].Zone[zoneId].items;
        }else{
            return null;
        }
    } else {
        return null;
    }
};
/**
 * 为item添加鼠标移动和点击事件
 * @param pageId item所属Page
 * @param zoneId item所属Zone
 * @param item item对象
 */
mtv.frw.prototype.addEventsToItem = function (pageId,zoneId,item){
    var idsArr = item.id.toString().split('_');
    var overPageId = idsArr[0];
    var overZoneId = idsArr[1];
    var overZoneItem = parseInt(idsArr[idsArr.length-1],10);
    frw.$('#'+item.id).setAttribute('onmouseover','javascript:mtv.frw.prototype.onMouseOver(\''+overPageId+'\',\''+overZoneId+'\','+overZoneItem+');');
    frw.$('#'+item.id).setAttribute('onmousedown','javascript:mtv.frw.prototype.onMouseDown();');
};
mtv.frw.prototype.onMouseOver =  function (overPageId,overZoneId,overZoneItem){
    mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].prevItem = mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].item;
    PrevPage = CurrentPage;
    PrevZone = CurrentZone;
    mtv.frw.Page[overPageId].Zone[overZoneId].item = overZoneItem;
    mtv.frw.Page[overPageId].Zone[overZoneId].crow = Math.floor(overZoneItem / CurrentZone.column);
    CurrentPage = mtv.frw.Page[overPageId];
    CurrentZone = mtv.frw.Page[overPageId].Zone[overZoneId];
    keyController.defaultChangeItem(PrevPage,PrevZone,CurrentPage,CurrentZone);
    if(mtv.frw.Page[overPageId].Zone[overZoneId].items[overZoneItem].hoverFunc){
        mtv.frw.Page[overPageId].Zone[overZoneId].items[overZoneItem].hoverFunc();
    }
    if(mtv.frw.Page[overPageId].Zone[overZoneId].items[overZoneItem].scrollFunc){
        mtv.frw.Page[overPageId].Zone[overZoneId].items[overZoneItem].scrollFunc();
    }
};
mtv.frw.prototype.onMouseDown =  function (){
    keyController.evtEnter();
};
/**
 * 根据pageId查找Page，返回Page对象
 * @param pageId
 * @return {*} Page对象
 */
mtv.frw.prototype.findPageById = function(pageId){
    return mtv.frw.Page[pageId];
};
/**
 * 根据pageId删除Page
 * @param pageId
 * @return {*} 被删除Page对象
 */
mtv.frw.prototype.deletePageById = function(pageId){
    if(mtv.frw.Page[pageId]){
        var temp = mtv.frw.Page[pageId];
        delete mtv.frw.Page[pageId];
        return temp;
    }
};
/**
 * 根据zoneId查找Zone
 * @param zoneId
 * @return {*} Zone对象
 */
mtv.frw.Page.prototype.findZoneById = function(zoneId){
    return this.Zone[zoneId];
};
/**
 * 根据zoneId删除Zone
 * @param zoneId
 * @return {*} 被删除的Zone对象
 */
mtv.frw.Page.prototype.deleteZoneById = function(zoneId){
    if(this.Zone[zoneId]){
        var temp = this.Zone[zoneId];
        delete this.Zone[zoneId];
        var tempArr = [];
        for(var k in this.allZoneIds){
            if(this.allZoneIds[k] != zoneId){
                tempArr.push(this.allZoneIds[k]);
            }
        }
        this.allZoneIds = tempArr;
        return temp;
    }
};
/**
 * 根据itemId查找Item
 * @param itemId
 * @return {*} Item对象
 */
mtv.frw.Page.Zone.prototype.findItemById = function(itemId){
    return this.items[itemId];
};
/**
 * 根据itemId删除Item
 * @param itemId
 * @return {*} 被删除的Item对象
 */
mtv.frw.Page.Zone.prototype.deleteItemById = function(itemId){
    if(this.items[itemId]){
        var temp = this.items[itemId];
        delete this.items[itemId];
        var tempArr = [];
        for(var k in this.allItemIds){
            if(this.allItemIds[k] != itemId){
                tempArr.push(this.allItemIds[k]);
            }
        }
        this.allItemIds = tempArr;
        return temp;
    }
};
/**
 * 全局控制台输出日志方法
 * @param logStr
 * @return {*}
 */
mtv.frw.prototype.consoleLog = function(logStr){
    var date = new Date().format('yyyy-MM-dd HH:mm:ss:l');
    if(this.console){
        console.log('[' + date + ']  ' + logStr);
    }
};
/**
 * 全局css设置或获取方法
 * @param elem dom元素
 * @param styleObj
 * @param styleValue
 * @return {*}
 */
mtv.frw.prototype.css = function(elem,styleObj,styleValue){
    if (elem) {
        if (typeof styleObj != 'undefined') {
            if (typeof styleObj == 'string') {
                if (styleValue) {
                    elem.style[styleObj] = styleValue;
                    return;
                }else{
                    return this.getStyles(elem)[styleObj];
                }
            }
            if (typeof styleObj == 'object') {
                for(var name in styleObj){
                    elem.style[name] = styleObj[name];
                }
            }
        }
    }
};
/**
 * 获取参数元素当前所有应用样式
 * @param elem
 * @return {*}
 */
mtv.frw.prototype.getStyles = function(elem){
    if(window.getComputedStyle){
        return window.getComputedStyle( elem, null );
    } else if ( document.documentElement.currentStyle ) {
        return elem.currentStyle;
    }
};
/*
 * 根据元素clsssName得到元素集合
 * @param fatherId 父元素的ID，默认为document
 * @tagName 子元素的标签名
 * @className 用空格分开的className字符串
 */
mtv.frw.prototype.getElementsByClassName = function(fatherId,tagName,className){
    frw.consoleLog(arguments.length);
    if(arguments.length == 1){
        className = arguments[0];
    }
    var node = fatherId && document.getElementById(fatherId) || document;
    tagName = tagName || "*";
    className = className.split(" ");
    var classNameLength = className.length;
    for(var i=0,j=classNameLength;i<j;i++){
        //创建匹配类名的正则
        className[i]= new RegExp("(^|\\s)" + className[i].replace(/\-/g, "\\-") + "(\\s|$)");
    }
    var elements = node.getElementsByTagName(tagName);
    var result = [];
    for(var i=0,j=elements.length,k=0;i<j;i++){//缓存length属性
        var element = elements[i];
        while(className[k++].test(element.className)){//优化循环
            if(k === classNameLength){
                result[result.length] = element;
                break;
            }
        }
        k = 0;
    }
    return result;
};
var
/* This is the object, that holds the cached values */
    _storage = {},
/* Actual browser storage (localStorage or globalStorage['domain']) */
    _ttl_timeout;
/**
 * Removes expired keys
 */
function _handleTTL() {
    var curtime, i, TTL, nextExpire = Infinity;
    clearTimeout(_ttl_timeout);
    if (!_storage || typeof _storage.TTL != "object") {
        // nothing to do here
        return;
    }
    curtime = +new Date();
    TTL = _storage.TTL;
    for (i in TTL) {
        if (TTL.hasOwnProperty(i)) {
            if (TTL[i] <= curtime) {
                delete TTL[i];
                delete _storage[i];
                frw.consoleLog(('item ['+ i +'] expired, delete successfully.'));
            } else if (TTL[i] < nextExpire) {
                nextExpire = TTL[i];
            }
        }
    }

    // set next check
    if (nextExpire != Infinity) {
        _ttl_timeout = setTimeout(_handleTTL, nextExpire - curtime);
    }
};
function _checkKey(key) {
    if (!key || (typeof key != "string" && typeof key != "number")) {
        throw new TypeError('Key name must be string or numeric');
    }
    if (key == "_storage") {
        throw new TypeError('Reserved key name');
    }
    return true;
};
mtv.frw.mStorage = {

    setStorageType : function(storageType){
        switch(storageType){
            case 'localStorage':
                _storage = localStorage;
                break;
            case 'sessionStorage':
                _storage = sessionStorage;
                break;
            default :
                break;
        }
    },
    set: function(key, value, options){
        options = options || {};
        // undefined values are deleted automatically
        if(typeof value == "undefined"){
            this.deleteKey(key);
            return value;
        }
        if(value && typeof value == "object"){
            // clone the object before saving to _storage tree
            value = JSON.parse(JSON.stringify(value));
        }
        _storage[key] = value;
        this.setTTL(key, options.TTL || 0); // also handles saving and _publishChange
        return value;
    },
    /**
     * Looks up a key in cache
     *
     * @param {String} key - Key to look up.
     * @param {mixed} def - Default value to return, if key didn't exist.
     * @return {Mixed} the key value, default value or null
     */
    get: function(key, def){
        _checkKey(key);
        if(key in _storage){
            if(_storage[key]){
                return _storage[key];
            }
        }
        return typeof(def) == 'undefined' ? null : def;
    },
    /**
     * Deletes a key from cache.
     *
     * @param {String} key - Key to delete.
     * @return {Boolean} true if key existed or false if it didn't
     */
    deleteKey: function(key){
        _checkKey(key);
        if(key in _storage){
            delete _storage[key];
            // remove from TTL list
            if(typeof _storage.TTL == "object" &&
                key in _storage.TTL){
                delete _storage.TTL[key];
            }
            return true;
        }
        return false;
    },

    /**
     * Sets a TTL for a key, or remove it if ttl value is 0 or below
     *
     * @param {String} key - key to set the TTL for
     * @param {Number} ttl - TTL timeout in milliseconds
     * @return {Boolean} true if key existed or false if it didn't
     */
    setTTL: function(key, ttl){
        var curtime = +new Date();
        _checkKey(key);
        ttl = Number(ttl) || 0;
        if(key in _storage){
            if(!_storage.TTL){
                _storage.TTL = {};
            }
            // Set TTL value for the key
            if(ttl>0){
                _storage.TTL[key] = curtime + ttl;
            }else{
                delete _storage.TTL[key];
            }
            _handleTTL();
            return true;
        }
        return false;
    },

    /**
     * Gets remaining TTL (in milliseconds) for a key or 0 when no TTL has been set
     *
     * @param {String} key Key to check
     * @return {Number} Remaining TTL in milliseconds
     */
    getTTL: function(key){
        var curtime = +new Date(), ttl;
        _checkKey(key);
        if(key in _storage && _storage.TTL && _storage.TTL[key]){
            ttl = _storage.TTL[key] - curtime;
            return ttl || 0;
        }
        return 0;
    },
    /**
     * Returns a read-only copy of _storage
     *
     * @return {Object} Read-only copy of _storage
     */
    storageObj: function(){
        function F() {}
        F.prototype = _storage;
        return new F();
    },

    /**
     * Returns an index of all used keys as an array
     * ['key1', 'key2',..'keyN']
     *
     * @return {Array} Used keys
     */
    index: function(){
        var index = [], i;
        for(i in _storage){
            if(_storage.hasOwnProperty(i) && i != "_storage"){
                index.push(i);
            }
        }
        return index;
    }

};
mtv.frw.ajaxTimeoutFlag = true;// Ajax异步请求超时标志，默认为超时，false为非超时
/**
 * Ajax异步请求，支持跨域，支持超时,url无需加callback
 * 使用示例：
 * mtv.frw.Ajax({
 *  url:'http://vod.moretv.com.cn/Service/Program?sid='+sid,,
 *  // 请求成功执行回调函数
 *  success:function (data) {
 *      // 超时判定,此处需用户手动判断，待改进
 *      if(!mtv.frw.ajaxTimeoutFlag){
 *          console.log((+new Date()) + data);
 *      }
 *  },
 *  timeout:100, //超时时间设定(ms),默认1000
 *  // 超时执行函数,不设置将不进行超时处理
 *  timeoutfun:function () {
 *      console.log((+new Date()) + 'time out');
 *  }
 * });
 * @param param
 * @constructor
 */
mtv.frw.Ajax = function(param) {
    mtv.frw.ajaxTimeoutFlag = false;
    var requestTimer = null;
    clearTimeout(requestTimer);
    var requestTimeoutFlag = true;
    var stateArr = [];
    var jsonp_str = 'jsonp_' + (+new Date());
    eval(jsonp_str + ' = ' + param.success + ',' + param.timeoutfun  + ';');
    if(param.url.indexOf('?') != -1){
        param.url += '&callback=' + jsonp_str;
    } else{
        param.url += '?callback=' + jsonp_str;
    }
    for(var i in param.data) {
        param.url += '&' + i + '=' + param.data[i];
    }
    var doc_head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.setAttribute("type","text/javascript");
    script.setAttribute("language","javascript");
    script.setAttribute("src",param.url);
    if(param.timeoutfun){
        requestTimer = setTimeout(function(){
            if(requestTimeoutFlag) {
                mtv.frw.ajaxTimeoutFlag = true;
                param.timeoutfun();
            }
        },(param.timeout || 1000));
    }
    script.onload = script.onreadystatechange = function () {
        if (typeof this.readyState == 'undefined') {  // for chrome,firefox
            mtv.frw.ajaxTimeoutFlag = false;
            requestTimeoutFlag = false;
            clearTimeout(requestTimer);
            doc_head.removeChild(script);
            script = null;
        } else if (this.readyState == 'loaded' || this.readyState == 'complete') { // for ie
            stateArr.push(this.readyState);
            if(stateArr.length>2){
                mtv.frw.ajaxTimeoutFlag = false;
                requestTimeoutFlag = false;
                clearTimeout(requestTimer);
            }
            doc_head.removeChild(script);
            script = null;
        }
    };
    doc_head.appendChild(script);
};











