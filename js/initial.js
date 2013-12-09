/**
 * Created with IntelliJ IDEA.
 * User: jacky
 * Date: 13-1-9
 * Time: 17:12
 * To change this template use File | Settings | File Templates.
 */
/* initial moretv framework */


function initialization(){
     //frw.console = false;// 控制台日志是否输出控制
    /* create page */
    var pageParams = {
        id : 'homePage'
    };
    frw.createPage(pageParams);
    pageParams = {
        id : 'info'
    };
    frw.createPage(pageParams);
    /* create zone for page */
    var zoneParams = {
        id : 'homeZone1',
        row : 2,
        column : 3,
        values : [],
        right : 'homeZone2',
        down : 'homeZone3'
    };
    for(var i=0;i<5;i++){
        zoneParams.values.push({Action:'Page',Page:'info'});
    }
    frw.createZone('homePage',zoneParams);
    zoneParams = {
        id : 'homeZone2',
        row : 2,
        column : 4,
        values : [],
        left : 'homeZone1',
        down : 'homeZone3'
    };
    for(var i=0;i<8;i++){
        zoneParams.values.push({Action:'Function',Function:homeZone2Fun,Value:i});
    }
    frw.createZone('homePage',zoneParams);
    zoneParams = {
        id : 'homeZone3',
        row : 1,
        values : [],
        column : 4,
        up : 'homeZone1',
        down : 'homeZone4'
    };
    for(var i=0;i<4;i++){
        zoneParams.values.push({Action:'Function',Function:homeZone3Fun,Value:i});
    }
    frw.createZone('homePage',zoneParams);
    zoneParams = {
        id : 'homeZone4',
        row : 1,
        values : [],
        column : 4,
        up : 'homeZone3',
        down : 'scrollZone'
    };
    for(var i=0;i<4;i++){
        zoneParams.values.push({Action:'Function',Function:homeZone4Fun,Value:i});
    }
    frw.createZone('homePage',zoneParams);
    zoneParams = {
        id : 'scrollZone',
        row : 1,
        values : [],
        column : 12,
        up : 'homeZone4',
        down : 'scrollZone2',
        scrollObj : new mtv.frw.scrollControl({speed:500,scrollModel:1}),
        scrollFunc : testScrollZone
    };
    for(var i=0;i<12;i++){
        zoneParams.values.push({Action:'Function',Function:animateZoneFun,Value:i});
    }
    frw.createZone('homePage',zoneParams);

    zoneParams = {
        id : 'scrollZone2',
        row : 7,
        values : [],
        column : 2,
        up : 'scrollZone',
        scrollObj : new mtv.frw.scrollControl({speed:500,scrollModel:3}),
        scrollFunc : testScrollZone2
    };
    for(var i=0;i<14;i++){
        zoneParams.values.push({Action:'Function',Function:animateZoneFun2,Value:i});
    }
    frw.createZone('homePage',zoneParams);


    zoneParams = {
        id : 'infoZone1',
        row : 2,
        column : 3,
        values : []
    };
    for(var i=0;i<6;i++){
        zoneParams.values.push({Action:'Function',Function:homeZone2Fun,Value:i});
    }
    frw.createZone('info',zoneParams);
    /* create item for zone on page one by one */
    /*
    for (var i = 0; i < 5; i++) {
        var itemParams = {
            id:'homePage_homeZone1_item_' + i,
            itemName:'item',
            defaultClassName:'defItem',
            hoverClassName:'focItem'
        };
        frw.createItem('homePage','homeZone1',itemParams);
    }
    */
    /* create items for zone on page once */
    var itemParam = {
        idPrefix : 'homePage_homeZone1_item_',
        itemName : 'item',
        defaultClassName:  'defItem',
        hoverClassName:  'focItem',
        mouseSupport : true
    };
    frw.createItems('homePage','homeZone1',itemParam);
    itemParam = {
        idPrefix : 'homePage_homeZone2_item_',
        itemName : 'item',
        defaultClassName:  'defItem',
        hoverClassName:  'focItem',
        mouseSupport : true
    };
    frw.createItems('homePage','homeZone2',itemParam);
    itemParam = {
        idPrefix : 'homePage_homeZone3_item_',
        itemName : 'item',
        defaultClassName:  'defItem',
        hoverClassName:  'focItem',
        mouseSupport : true
    };
    frw.createItems('homePage','homeZone3',itemParam);
    itemParam = {
        idPrefix : 'homePage_homeZone4_item_',
        itemName : 'item',
        defaultClassName:  'defItem',
        hoverClassName:  'focItem',
        mouseSupport : true
    };
    frw.createItems('homePage','homeZone4',itemParam);
    itemParam = {
        idPrefix : 'homePage_scrollZone_item_',
        itemName : 'item',
        defaultClassName:  'defItem',
        hoverClassName:  'focItem',
        mouseSupport : true
    };
    frw.createItems('homePage','scrollZone',itemParam);
    itemParam = {
        idPrefix : 'homePage_scrollZone2_item_',
        itemName : 'item',
        defaultClassName:  'defItem',
        hoverClassName:  'focItem',
        mouseSupport : true
    };
    frw.createItems('homePage','scrollZone2',itemParam);


    itemParam = {
        idPrefix : 'info_infoZone1_item_',
        itemName : 'item',
        defaultClassName:  'defItem',
        hoverClassName:  'focItem',
        mouseSupport : true
    };
    frw.createItems('info','infoZone1',itemParam);


    mtv.frw.Page['homePage'].currentZoneId = 'homeZone3';
    CurrentPage = mtv.frw.Page['homePage'];
    CurrentZone = mtv.frw.Page['homePage'].Zone['homeZone3'];
    frw.css(frw.$('#homePage'),'display','block');



}
var homeZone1Fun = function(i){
    alert('homeZone1: ' + i);
};
var homeZone2Fun = function(i){
    alert('homeZone2: ' + i);
};
var homeZone3Fun = function(i){
    alert('homeZone3: ' + i);
};
var homeZone4Fun = function(i){
    alert('homeZone4: ' + i);
};
var animateZoneFun = function(i){
    alert('scrollZone: ' + i);
};
var animateZoneFun2 = function(i){
    alert('scrollZone2: ' + i);
};





