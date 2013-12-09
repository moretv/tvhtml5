/**
 * Created with IntelliJ IDEA.
 * User: jacky
 * Date: 13-1-8
 * Time: 上午9:58
 * To change this template use File | Settings | File Templates.
 */
var Loading = false;
var CurrentPage;
var CurrentZone;
var PrevPage;
var PrevZone;
mtv.frw.keyController = function(){};
var keyController = new mtv.frw.keyController();
/**
 * 遥控器事件侦听
 */
$(document).keydown(function(evt){
    var KeyName = {
        19:'KeyUp',
        38:'KeyUp', //Keyboard
        20:'KeyDown',
        40:'KeyDown', //Keyboard
        21:'KeyLeft',
        37:'KeyLeft', //Keyboard
        22:'KeyRight',
        39:'KeyRight', //Keyboard
        23:'KeyEnter',
        13:'KeyEnter', //Keyboard
        4:'KeyAlt',
        18:'KeyAlt', //Keyboard Alt键
        27:'KeyAlt', //Keyboard ESC
        24:'KeyAlt', //Keyboard ESC
        66:'KeyEnter',
        111:'KeyAlt'

    };
    evt = evt || window.event;
    var KeyCode = evt.which || evt.keyCode;
    keyController.keyPress(KeyName[KeyCode]);
    return true;
});
/**
 * 遥控器事件分发
 * @param KeyName
 * @return {Boolean}
 */
mtv.frw.keyController.prototype.keyPress = function(KeyName){
    var keyController = this;
    //当处于Loading状态，仅返回键生效
    if (Loading) {
        if ('KeyAlt' === KeyName) {
            keyController.evtAlt();
        };
        return false;
    };
    //根据按键，调用相应函数
    switch (KeyName) {
        case 'KeyUp':
            keyController.evtArrow('up');
            break;
        case 'KeyDown':
            keyController.evtArrow('down');
            break;
        case 'KeyLeft':
            keyController.evtArrow('left');
            break;
        case 'KeyRight':
            keyController.evtArrow('right');
            break;
        case 'KeyEnter':
            keyController.evtEnter();
            break;
        case 'KeyAlt':
            keyController.evtAlt();
            break;
    };
};
/**
 * 遥控器方向键事件响应
 * @param Arrow
 */
mtv.frw.keyController.prototype.evtArrow = function(Arrow,skipItem){
    var keyController = this;
    frw.consoleLog('Key Arrow: '+Arrow);
    var item = CurrentZone.item || 0;
    var steps = CurrentZone.row * CurrentZone.column;
    var Row = Math.floor(item/CurrentZone.column);
    mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].StepSeq = mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].StepSeq || 0;
    //执行用户定义函数
    if(keyController.onArrowItem(Arrow)){
        return;
    }
    var Border = CurrentZone[Arrow];
    var cRow = CurrentZone.crow;
    if(!skipItem){
        mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].prevItem = item;
    }
    switch(Arrow){
        case 'left':
            item -= 1;
            if (Math.floor(item / CurrentZone.column) != Row) {
                item = item - steps;
            }
            break;
        case 'right':
            item += 1;
            if (Math.floor(item / CurrentZone.column) != Row) {
                item = item + steps;
            }
            break;
        case 'up':
            item -= CurrentZone.column;
            mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].crow = cRow - 1;
            break;
        case 'down':
            item += CurrentZone.column;
            mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].crow = cRow + 1;
            break;
    };

    if(item >=0 && item <= steps-1){
        if (item+mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].StepSeq*steps+1 > CurrentZone.values.length) {
            item = CurrentZone.values.length-mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].StepSeq*steps-1;
        }
        mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].item = item;
        keyController.defaultChangeItem(CurrentPage,CurrentZone,CurrentPage,CurrentZone);
        //执行用户定义函数
        keyController.onChangeItem(Arrow);
    } else{
        mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].crow = cRow;
        OverBorder();
    };
    function OverBorder(){
        if(Border){
            if(Border === CurrentZone.id){
                ScrollItem();
            }else{
                ChangeZone();
            }
        } ;
        function ScrollItem(){
            switch (Arrow){
                case 'up':
                    item = CurrentZone.item + CurrentZone.column*(CurrentZone.row-1);
                    mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].crow = mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].row-1;
                    break
                case 'down':
                    item = CurrentZone.item - CurrentZone.column*(CurrentZone.row-1);
                    mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].crow = 0;
                    break
                case 'left':
                    item = (Row+1)*CurrentZone.column - 1;
                    break
                case 'right':
                    item = Row*CurrentZone.column;
                    break
            };
            //当前焦点区域对应的数值的个数超过一屏的显示个数，产生翻页效果
            if (CurrentZone.values.length > steps) {
                mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].StepSeq = mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].StepSeq || 0;
                var MaxSeq = Math.ceil(CurrentZone.values.length/steps)-1;
                if ((Arrow === 'left') || (Arrow === 'up')){
                    //左键或者上键，往前翻
                    mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].StepSeq = (mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].StepSeq>0)?mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].StepSeq-1:MaxSeq;
                } else if ((Arrow === 'right') || (Arrow === 'down')) {
                    //右键或者下键，往后翻
                    mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].StepSeq = (mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].StepSeq<MaxSeq)?mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].StepSeq+1:0;
                };
            };
            //数值个数不够时，光标定位在第一个上面
            if (item+mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].StepSeq*steps+1 > CurrentZone.values.length) {
                item = 0;
            }
            mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].item = item;
            //执行用户定义函数
            keyController.onScrollItem(Arrow);
        };
        function ChangeZone(){
            PrevPage = CurrentPage;
            PrevZone = CurrentZone;
            CurrentZone = CurrentPage.Zone[Border];
            mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].item = mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].item || 0;
            mtv.frw.Page[CurrentPage.id].currentZoneId = CurrentZone.id;
            keyController.defaultChangeItem(PrevPage,PrevZone,CurrentPage,CurrentZone);
            //执行用户定义函数
            keyController.onChangeZone(Arrow);
        };

    };

};

/**
 * 遥控器确认键事件响应
 */
mtv.frw.keyController.prototype.evtEnter = function(){
    this.onEvtEnter();
};
/**
 * 遥控器返回键事件响应
 */
mtv.frw.keyController.prototype.evtAlt = function(){
    this.onEvtAlt();
};
/**
 * 光标移动默认事件处理，将上一item置为默认样式，当前item置为焦点样式，只改变className属性
 * @param PrevPage
 * @param PrevZone
 * @param CurPage
 * @param CurZone
 */
mtv.frw.keyController.prototype.defaultChangeItem = function(PrevPage,PrevZone,CurPage,CurZone,part){
    if(!part){
        part = 'both';
    }
    if(part == 'front' || part == 'both'){
    var prevItem = mtv.frw.Page[PrevPage.id].Zone[PrevZone.id].prevItem;
    if (mtv.frw.Page[PrevPage.id].Zone[PrevZone.id].defaultBehavior) {
        if (mtv.frw.Page[PrevPage.id].Zone[PrevZone.id].items[prevItem]) {
            try {
                frw.$('#' + mtv.frw.Page[PrevPage.id].Zone[PrevZone.id].items[prevItem].id).className = mtv.frw.Page[PrevPage.id].Zone[PrevZone.id].items[prevItem].itemName + ' ' + mtv.frw.Page[PrevPage.id].Zone[PrevZone.id].items[prevItem].defaultClassName;
            } catch (e) {
                frw.consoleLog('Page: ' + PrevPage.id + ' Zone: ' + PrevZone.id + 'items[' + PrevZone.item + '] is undefined.');
            }
            ;
        }
    }
    }
    if(part == 'back' || part == 'both'){
    if (mtv.frw.Page[CurPage.id].Zone[CurZone.id].defaultBehavior) {
        try {
            frw.$('#' + mtv.frw.Page[CurPage.id].Zone[CurZone.id].items[CurZone.item].id).className = mtv.frw.Page[CurPage.id].Zone[CurZone.id].items[CurZone.item].itemName + ' ' + mtv.frw.Page[CurPage.id].Zone[CurZone.id].items[CurZone.item].hoverClassName;
        } catch (e) {
            frw.consoleLog('Page: ' + CurPage.id + ' Zone: ' + CurZone.id + 'items[' + CurZone.item + '] is undefined.');
        }
        ;
    }
    }
};
mtv.frw.keyController.prototype.returnPage = [];

mtv.frw.keyController.prototype.showPage = function(pageId, direction, animate, speed, fun){
    var Width = parseInt(frw.css(frw.$("#" + pageId),'width'));
    var Height = parseInt(frw.css(frw.$("#" + pageId),'height'));
    var BodyWidth = document.body.offsetWidth;
    var BodyHeight = document.body.offsetHeight;
    var Top = 0;
    var Left = 0;
    switch (direction) {
        case 'up':
            frw.css(frw.$('#'+pageId),{'top':BodyHeight+'px','left':0+'px'});
            break;
        case 'down':
            frw.css(frw.$('#'+pageId),{'top':(-1*Height)+'px','left':0+'px'});
            break;
        case 'left':
            frw.css(frw.$('#'+pageId),{'top':0+'px','left':BodyWidth+'px'});
            break;
        case 'right':
            frw.css(frw.$('#'+pageId),{'top':0+'px','left':(-1*Width)+'px'});
            break;
    }
    frw.css(frw.$('#'+pageId),'display','block');
    if (animate) {
        speed = speed ? speed : '500';
        $('#'+pageId).animate({'top':Top+'px','left':Left+'px'},speed,function(){
            if(fun)fun();
        });
    } else{
        frw.css(frw.$('#'+pageId),{'top':Top+'px','left':Left+'px'});
    }
    keyController.returnPage.push({'Page':CurrentPage});
    CurrentPage = mtv.frw.Page[pageId];
};
mtv.frw.keyController.prototype.hidePage = function(direction, animate, speed, fun){
    var pages = keyController.returnPage;
    if(pages.length>0){
        var pageId = CurrentPage.id;
        var Width = parseInt(frw.css(frw.$("#" + pageId),'width'));
        var Height = parseInt(frw.css(frw.$("#" + pageId),'height'));
        var BodyWidth = document.body.offsetWidth;
        var BodyHeight = document.body.offsetHeight;
        var Top = BodyHeight - Height;
        var Left = 0;
        switch (direction) {
            case 'down':
                Top = BodyHeight;
                Left = 0;
                break;
            case 'up':
                Top = (-1 * Height);
                Left = 0;
                break;
            case 'right':
                Top = (BodyHeight - Height);
                Left = BodyWidth;
                break;
            case 'left':
                Top = (BodyHeight - Height);
                Left = (-1 * Width);
                break;
        }
        if (animate) {
            speed = speed ? speed : '500';
            $('#'+pageId).animate({'top':Top+'px','left':Left+'px'},speed,function(){
                frw.css(frw.$('#'+pageId),'display','none');
                if(fun)fun();
            });
        } else{
            frw.css(frw.$('#'+pageId),{'top':Top+'px','left':Left+'px'});
        }
        PrevPage = CurrentPage;
        PrevZone = CurrentZone;
        mtv.frw.Page[PrevPage.id].currentZoneId = PrevZone.id;
        CurrentPage = pages.pop().Page;
        CurrentZone = mtv.frw.Page[CurrentPage.id].Zone[CurrentPage.currentZoneId];
        keyController.defaultChangeItem(PrevPage,PrevZone,CurrentPage,CurrentZone);
    }

};
/**
 * 执行用户自定义光标移动方法
 * @param Arrow
 */
mtv.frw.keyController.prototype.onArrowItem = function(Arrow){
    OnArrowItem(Arrow);
};
/**
 * 执行用户自定义item改变方法
 * @param Arrow
 */
mtv.frw.keyController.prototype.onChangeItem = function(Arrow){
    OnChangeItem(Arrow);
};
/**
 * 执行用户自定义item自身滚动方法
 * @param Arrow
 */
mtv.frw.keyController.prototype.onScrollItem = function(Arrow){
    OnScrollItem(Arrow);
};
/**
 * 执行用户自定义change zone方法
 * @param Arrow
 */
mtv.frw.keyController.prototype.onChangeZone = function(Arrow){
    OnChangeZone(Arrow);
};
/**
 * 执行用户自定义确认事件方法
 * @param Arrow
 */
mtv.frw.keyController.prototype.onEvtEnter = function(){
    OnEvtEnter();
};
/**
 * 执行用户自定义返回键方法
 * @param Arrow
 */
mtv.frw.keyController.prototype.onEvtAlt = function(){
    OnEvtAlt();
};


