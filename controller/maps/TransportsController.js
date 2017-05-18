Ext.define('App.controller.maps.TransportsController', {
    extend : 'Ext.app.Controller',
    
    models : [
    
    ],
    
    stores : [
    
    ],
    
    views : [
        'maps.transports.GridPanel',
        'maps.transports.ContentPanel'    
    ],
    
    init : function() {
        
        this.control({
            'MapsTransportsContentPanel' : {
                afterrender : this.onInitContentPanel
            },
            'MapsTransportsGridPanel' : {
                selectionchange : this.onGridSelectionChange
            }
        });
        
        this.addEvents('createmap');
        
        this.on('createmap', this.onCreateMap, this, {buffer : 500});
        
    },
    
    onInitContentPanel : function(panel){
        var grid = panel.down("#transportsGrid"),
            me = this;

        grid.getStore().on('load', function(store){
            me.fireEvent('createmap', grid, store.getRange());
        }, this);
        
        grid.getStore().load();
    },
    
    onGridSelectionChange : function(sm, records){
        var grid = sm.view.ownerCt,
            records = (records.length) ? records : grid.getStore().getRange();
        this.fireEvent('createmap', grid, records);
    },
    
    onCreateMap : function(grid, records) {
        var mapPanel = grid.nextSibling('#mapPanel');
        if (records && records.length) {
            var geoObjects = new Array();
            Ext.Array.forEach(records, function(record){
                var type = (record.get('type') == 1) ? 'truck' : 'auto';
                geoObjects.push(Ext.String.format("[{0};;{1};{2};{3};{4}]", type, record.get('login'), record.get('password'), record.get('name'), record.get('driver')));
            });
            
            if (geoObjects.length) {
                mapPanel.removeAll();
                mapPanel.add({
                    xtype : "component",
                    autoEl : {
                        tag : "iframe",
                        frameborder: '0',
                        src : Ext.String.format("{0}?update=50000&zoom=12&geoObjects={1}", Settings.urls.maps.transports.build_map, geoObjects.join(""))
                    }
                });    
            }
        }       
    }
    
});