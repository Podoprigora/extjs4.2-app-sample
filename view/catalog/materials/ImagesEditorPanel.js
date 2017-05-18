Ext.define("App.view.catalog.materials.ImagesEditorPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.CatalogMaterialImagesEditorPanel",
    
    config: {
        view: null,
        store: null
    },
    border: false,
    
    initComponent: function () {
        this.store = Ext.create("App.store.catalog.MaterialImagesLocalStore");
        this.view = this.buildView();
        this.items = this.view;
        this.dockedItems = this.buildUploadForm();
        
        this.callParent(arguments);
        
        this.addEvents("selectfile", "deleteitembtnclick");
        this.getStore().on("datachanged", this.onDataChanged, this, {
            buffer: 500
        });
    },
    
    buildUploadForm: function () {
        return [{
            dock: "top",
            xtype: "form",
            itemId: "uploadForm",
            border: false,
            height: 36,
            items: [{
                xtype: "filefield",
                name: "upload_file",
                buttonOnly: true,
                buttonConfig: {
                    text: "Выберите изображение"
                },
                listeners: {
                    scope: this,
                    change: this.onSelectFile
                }
            }]
        }]
    },
    
    buildView: function () {
        return Ext.create("Ext.view.View", {
            itemId: "dataView",
            store: this.getStore(),
            border: false,
            trackOver: true,
            overItemCls: "x-column-over",
            selectedItemCls: "x-column-selected",
            itemSelector: ".x-column",
            cls: "x-block-items-view",
            tpl: [
                '<tpl for=".">', 
                    '<div class="x-column">', 
                    '<div class="x-column-wrap" style="min-height:160px;">', 
                        '<a class="x-btn-action icon-delete" title="Удалить"></a>', 
                        '<img src="{path}">', 
                    "</div>", 
                    "</div>", 
                "</tpl>", 
                '<div class="x-clear"></div>'
            ],
            listeners: {
                scope: this,
                itemclick: this.onViewItemClick
            }
        }, this);
    },
    
    onViewItemClick: function (view, record, item, index, e) {
        if (e.target.className == "x-btn-action icon-delete") {
            this.fireEvent("deleteitembtnclick", this, record, index);
        }
    },
    
    onSelectFile: function (field, value) {
        this.fireEvent("selectfile", this, field, value);
    },
    
    onDataChanged: function () {
        this.getView().refresh();
    }
});