Ext.define("App.view.files.ImagesEditorPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.ImagesEditorPanel",
    
    config: {
        view: null,
        store: null,
        uploadUrl : null,
        previewUrl : null,        
        
        itemWidth : 160,
        itemHeight : 160,
        readOnly : false,
        fullSizeView : true,
        multiple : true
    },
    border: false,
    bodyCls : 'x-container-body',
    bodyPadding : 5,
    
    initComponent: function () {
        this.store = Ext.create("App.store.files.ImagesLocalStore");
        this.view = this.buildView();
        this.items = this.view;
        if (this.readOnly == false) {
            this.dockedItems = this.buildUploadForm();   
        }
        this.cls = this.cls + " x-view-images";
        
        this.callParent(arguments);
        
        this.addEvents("selectfile", "viewitembtnclick", "deleteitembtnclick");
    },
    
    buildUploadForm: function () {
        return [{
            dock: "top",
            xtype: "form",
            itemId: "uploadForm",
            border: false,
            height: 36,
            bodyCls : 'x-container-body',
            items: [{
                xtype: "filefield",
                name: "upload_file",
                buttonOnly: true,
                buttonConfig: {
                    text: "Добавить изображение"
                },
                listeners: {
                    scope: this,
                    change: this.onSelectFile
                }
            }]
        }];
    },
    
    buildView : function() {
        var me = this;
        return Ext.create("Ext.view.View", {
            store : this.store,
            multiSelect : false,
            trackOver : true,
            overItemCls : "x-item-over",
            itemSelector : "div.thumb-wrap",
            emptyText : '<p class="x-view-empty">Нет данных</p>',
            tpl : [
                '<tpl for=".">',
                    '<div class="thumb-wrap" id="{id}" style="width: {itemWidth}px; height: {itemHeight}px;">',
                        '<div class="thumb-cell">',
                            '<tpl if="fullSizeView">',
                                '<a class="action-btn icon-view" title="Открыть">&nbsp;</a>',
                            '</tpl>',
                            '<tpl if="readOnly == false">',
                                '<a class="action-btn icon-delete" title="Удалить">&nbsp;</a>',
                            '</tpl>',
                            '<img src="{[values.getImage()]}">',
                        "</div>", 
                    "</div>", 
                "</tpl>", 
                '<div class="x-clear"></div>'
            ],
            prepareData : function(data){
                Ext.apply(data, {
                    itemHeight : me.getItemHeight(),
                    itemWidth : me.getItemWidth(),
                    readOnly : me.readOnly,
                    fullSizeView : me.fullSizeView,
                    getImage : function(){
                        var paramName = "image",
                            image = data.image;
                        if (Ext.isEmpty(data.image_from_mobile) == false) {
                            paramName = "image_from_mobile";
                            image = data.image_from_mobile;
                        }
                        return Ext.String.format("{0}?{1}={2}&w={3}&h={4}",me.getPreviewUrl(), paramName, image, me.getItemWidth()-10, me.getItemHeight()-10);    
                    }
                });
                
                return data;
            },
            listeners : {
                scope : this,
                itemclick : this.onViewItemClick
            }
        }, this);
    },
    
    onViewItemClick: function (view, record, item, index, e) {
        if (e.target.className == "action-btn icon-delete") {
            this.fireEvent("deleteitembtnclick", this, record, index);
        } else if (e.target.className == "action-btn icon-view") {
            this.fireEvent("viewitembtnclick", this, record, index);    
        }
    },
    
    onSelectFile: function (field, value) {
        this.fireEvent("selectfile", this, field, value);
    },
    
    onDataChanged: function () {
        this.getView().refresh();
    }
});