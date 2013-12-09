/**
 * Created with IntelliJ IDEA.
 * User: jacky
 * Date: 13-1-22
 * Time: 16:49
 * To change this template use File | Settings | File Templates.
 */
function scrollAnimateZoneItem(zoneId,Arrow){
    testScrollZone();
};
function scrollAnimateZone2Item(zoneId,Arrow){
    testScrollZone2();
};
function testScrollZone(){
    if(CurrentZone.scrollObj){
        Loading = true;
        CurrentZone.scrollObj.horizontalScrollRow(mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].items[CurrentZone.item],function(){Loading = false;});
    }
}
function testScrollZone2(){
    if(CurrentZone.scrollObj){
        Loading = true;
        CurrentZone.scrollObj.verticalScrollRow(mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].items[CurrentZone.item],function(){Loading = false;});
    }

}
