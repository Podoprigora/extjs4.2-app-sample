Ext.define('App.store.operations.RemainsReportStore', {
     extend : 'Ext.data.Store',
     model : 'App.model.operations.RemainsReportModel',
     
     autoLoad : false,
     buffered : true,
     
     pageSize : 80,
     leadingBufferZone : 25,
     
     remoteSort : true,
     remoteFilter : true,
     
     sorters : [
        {
            property : 'updated',
            direction : 'DESC'
        }
     ],
     
     proxy : {
         type : 'ajax',
         url : Settings.urls.getUrl('operations.reports.remains_list'),
         simpleSortMode : false,
         actionMethods : {
             read : 'POST'
         },
         reader : {
             type : 'json'
         }
     }
     
 });