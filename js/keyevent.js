/**
 * Created with IntelliJ IDEA.
 * User: jacky
 * Date: 13-1-22
 * Time: 16:29
 * To change this template use File | Settings | File Templates.
 */
function OnArrowItem(Arrow){

}
function OnChangeItem(Arrow){
    var zoneId = CurrentZone.id;
    switch (zoneId){
        case 'scrollZone':
            scrollAnimateZoneItem(zoneId,Arrow);
            return false;
            break;
        case 'scrollZone2':
            scrollAnimateZone2Item(zoneId,Arrow);
            return false;
            break;
        case 'z3':
            changeZoneItemStyle(Zone);
            return false;
            break;
    }
}
function OnScrollItem(Arrow){
    var Zone = CurrentZone.id;

}
function OnChangeZone(Arrow){
    var Zone = CurrentZone.id;

}
function OnEvtEnter(){
    var value = mtv.frw.Page[CurrentPage.id].Zone[CurrentZone.id].values[CurrentZone.item];
    if(value){
        switch(value.Action){
            case 'Page':
                var page = value.Page;
                switch(page){
                    case 'info':
                        keyController.showPage('info','down',true,500);
                        CurrentZone = mtv.frw.Page['info'].Zone['infoZone1'];
                        mtv.frw.Page['info'].currentZoneId = CurrentZone.id;
                        keyController.defaultChangeItem(PrevPage,PrevZone,CurrentPage,CurrentZone);
                        break;
                };
                break;
            case 'Function':
                value.Function(value.Value);
                break;
            default:
                break;
        }
    }

}
function OnEvtAlt(){
    keyController.hidePage('down',true,500);
}
