Ext.define("App.view.main.catalog.GridPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.MainCatalogGridPanel",
    
    config: {
        view: null,
        store: null
    },
    
    height : 365,
    bodyPadding : '5 5 10 5',
    
    overflowY: 'hidden',
    overflowX : 'scroll',
    containerScroll : true,
    
    initComponent: function () {
        this.store = Ext.create("App.store.main.CatalogLocalStore");
        this.view = this.buildView();
        this.items = this.view;
        this.cls = this.cls + " x-view-images";
        
        this.callParent(arguments);
        
        this.getStore().on('add', this.onDataChanged, this);
        this.relayEvents(this.view, ['itemclick']);
    },
    
    afterRender : function(){
        this.mon(this.getEl(), 'mousewheel', this.onMousewheel, this);
        
        this.callParent(arguments);
    },
    
    buildView : function() {
        var me = this;
        return Ext.create("Ext.view.View", {
            store : this.store,
            multiSelect : false,
            trackOver : true,
            overItemCls : "x-item-over",
            itemSelector : "div.thumb-wrap",
            tpl : [
                '<tpl for=".">',
                    '<div class="thumb-wrap" id="{id}" style="width: 200px; height: 300px;">',
                        '<div class="thumb-image" style="height: 200px;">',
                            '<img src="{[values.getImage()]}">',   
                        '</div>',
                        '<div class="thumb-name">{[values.getName()]}</div>',
                        '<div class="thumb-text">{[values.getDescription()]}</div>',
                    "</div>", 
                "</tpl>"
            ],
            prepareData : function(data){
                Ext.apply(data, {
                    getImage : function(){
                        return Ext.String.format("{0}?image={1}&w={2}&h={3}", Settings.urls.getUrl('catalog.materials.preview_image'), data.first_image, 190, 190);    
                    },
                    getName : function(){
                        return Ext.String.ellipsis(data.name, 50);
                    },
                    getDescription : function(){
                        return Ext.String.ellipsis(data.short_description, 45);
                    }
                });
                return data;
            }
        }, this);
    },
    
    onDataChanged: function (store) {
        var length = store.getCount();
        this.getView().setWidth(length*200+length*5);
        this.getView().refresh();
    },
    
    onMousewheel : function(e){
        var movement = e.getWheelDeltas();
            body = this.body;
            
        if (movement.y < 0 && this.getWidth()+body.getScroll().left < body.dom.scrollWidth) {
            e.preventDefault();
            body.scrollTo('left', (body.getScroll().left + 20));
        } else if (movement.y > 0 && body.getScroll().left > 0) {
            e.preventDefault();
            body.scrollTo('left', (body.getScroll().left - 20));
        }
    }
});