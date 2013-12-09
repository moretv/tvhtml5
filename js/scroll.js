var scroller;
mtv.frw.scrollControl = function(createScrollParams){
    this.params_ = createScrollParams;
};
mtv.frw.scrollControl.prototype.params_ = null;
mtv.frw.scrollControl.prototype.scrollModel = {
    oneByOne : 1,
    screenByScreen : 2,
    rowByRow : 3
};
mtv.frw.scrollControl.prototype.animating = false;
/**
 * 垂直方向滚动
 */
mtv.frw.scrollControl.prototype.verticalScrollRow = function(item,finishedAction){
    var scrollController = this;
    if(scrollController.animating){
        return;
    }
    var params_ = this.params_;
    var scrollSpeed = params_.speed || 200;
    var scrollModel = params_.scrollModel || 3;
    scrollModel = parseInt(scrollModel,10);
    var ids = item.id.toString().split('_');
    var pageId = ids[0];
    var zoneId = ids[1];
    var itemHeight = frw.$('#'+item.id).offsetHeight;
    var margins = 0;
    try{
        margins = parseInt(frw.css(frw.$('#'+item.id),'margin-top'),10) + parseInt(frw.css(frw.$('#'+item.id),'margin-bottom'),10);
    }catch(e){};
    var rowContainer = frw.$('#'+zoneId);
    var rowContainerHeight = rowContainer.offsetHeight;
    var screenRowCount = Math.floor(rowContainerHeight/(itemHeight + margins));
    var totalRowCount = mtv.frw.Page[pageId].Zone[zoneId].row;
    var scrollPosition = rowContainer.scrollTop;
    var cRow = mtv.frw.Page[pageId].Zone[zoneId].crow;
    var upEdge = 0;
    var downEdge = (totalRowCount-screenRowCount) * ( itemHeight + margins );
    switch(scrollModel){
        case this.scrollModel.rowByRow:
            if(cRow >= scrollPosition/(itemHeight+margins) && cRow <= scrollPosition/(itemHeight+margins)+screenRowCount-1){
                if(finishedAction)finishedAction();
                return;
            }else{
                this.animating = true;
                if(cRow == scrollPosition/(itemHeight+margins) -1){
                    scrollPosition -= (itemHeight+margins);
                }else{
                    scrollPosition += (itemHeight+margins);
                }
                if(scrollPosition < upEdge ){
                    scrollPosition = upEdge;
                }
                if(scrollPosition > downEdge){
                    scrollPosition = downEdge;
                }
                manimate(zoneId).animate({
                        scrollTop: scrollPosition
                    },scrollSpeed, function(){
                        scrollController.animating = false;
                        if(finishedAction)finishedAction();}
                    );
            }
            break;
        case this.scrollModel.screenByScreen:
            var totalScreenCount = Math.ceil(totalRowCount / screenRowCount);
            downEdge = (totalScreenCount - 1) * screenRowCount * (itemHeight + margins);
            if (cRow % screenRowCount == 0 || ((cRow + 1) % screenRowCount == 0)) {
                this.animating = true;
                if(cRow % screenRowCount == 0){
                    scrollPosition = (cRow / screenRowCount) * screenRowCount * (itemHeight + margins);
                }
                if((cRow + 1) % screenRowCount == 0){
                    scrollPosition = ((cRow + 1) / screenRowCount-1) * screenRowCount * (itemHeight + margins);
                }
                if (scrollPosition < upEdge) {
                    scrollPosition = upEdge;
                }
                if (scrollPosition > downEdge) {
                    scrollPosition = downEdge;
                }
                manimate(zoneId).animate({
                        scrollTop:scrollPosition
                    }, scrollSpeed, function(){
                        scrollController.animating = false;
                        if(finishedAction)finishedAction();}
                );
            } else {
                if(finishedAction)finishedAction();
                return;
            }
            break;
        default :
            break;
    }

};
/**
 *  水平方向滚动
 */
mtv.frw.scrollControl.prototype.horizontalScrollRow = function(item,finishedAction){
    var scrollController = this;
    if(scrollController.animating){
        return;
    }
    var params_ = this.params_;
    var scrollSpeed = params_.speed || 200;
    var scrollModel = params_.scrollModel || 1;
    scrollModel = parseInt(scrollModel,10);
    var ids = item.id.toString().split('_');
    var pageId = ids[0];
    var zoneId = ids[1];
    var itemIndex = parseInt(ids[3],10);
    var itemWidth = frw.$('#'+item.id).offsetWidth;
    var margins = 0;
    try{
        margins = parseInt(frw.css(frw.$('#'+item.id),'margin-left'),10) + parseInt(frw.css(frw.$('#'+item.id),'margin-right'),10);
    }catch(e){};
    var rowContainer = frw.$('#'+zoneId);
    var rowContainerWidth = rowContainer.offsetWidth;
    var screenItemCount = Math.floor(rowContainerWidth/(itemWidth + margins));
    var totalItemCount = mtv.frw.Page[pageId].Zone[zoneId].allItemIds.length;
    var scrollPosition = rowContainer.scrollLeft;
    var leftEdge = 0;
    var rightEdge = (totalItemCount-screenItemCount) * ( itemWidth + margins );
    switch(scrollModel){
        case this.scrollModel.oneByOne:
            if((itemIndex <= 0 && scrollPosition == leftEdge) || (itemIndex >= (totalItemCount - screenItemCount) && scrollPosition >= rightEdge)){
                if(finishedAction)finishedAction();
                return;
            }else{
                this.animating = true;
                scrollPosition = itemIndex * (itemWidth + margins );
                if(scrollPosition < leftEdge ){
                    scrollPosition = leftEdge;
                }
                if(scrollPosition > rightEdge){
                    scrollPosition = rightEdge;
                }
                manimate(zoneId).animate({
                        scrollLeft: scrollPosition
                    },scrollSpeed, function(){
                        scrollController.animating = false;
                        if(finishedAction)finishedAction();}
                );
            }
            break;
        case this.scrollModel.screenByScreen:
            var totalScreenCount = Math.ceil(totalItemCount / screenItemCount);
            rightEdge = (totalScreenCount - 1) * screenItemCount * (itemWidth + margins);
            if (itemIndex % screenItemCount == 0 || ((itemIndex + 1) % screenItemCount == 0)) {
                if ((scrollPosition <= 0 && itemIndex < screenItemCount) || (scrollPosition >= rightEdge && itemIndex >= (totalScreenCount - 1) * screenItemCount)) {
                    if(finishedAction)finishedAction();
                    return;
                } else {
                    this.animating = true;
                    scrollPosition = Math.floor(itemIndex / screenItemCount) * screenItemCount * (itemWidth + margins);
                    if (scrollPosition < leftEdge) {
                        scrollPosition = leftEdge;
                    }
                    if (scrollPosition > rightEdge) {
                        scrollPosition = rightEdge;
                    }
                    manimate(zoneId).animate({
                            scrollLeft:scrollPosition
                        }, scrollSpeed, function(){
                            scrollController.animating = false;
                            if(finishedAction)finishedAction();}
                    );
                }
            } else {
                if(finishedAction)finishedAction();
                return;
            }
            break;
        default:
            break;
    }
};
