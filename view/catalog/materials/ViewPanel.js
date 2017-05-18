Ext.define("App.view.catalog.materials.ViewPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.CatalogMaterialViewPanel",
    
    overflowX : 'hidden',
    overflowY : 'auto',
    
    bodyPadding : 5,
    bodyCls : 'x-container-body',
    
    layout : {
        type : 'vbox',
        align : 'stretch'
    },
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
    },
    
    buildItems : function(){
        return [
            {
                itemId : 'headerPanel',
                ui : 'in-form',
                tpl : [
                    '<div class="x-template-column">' +
                        '<div class="column-title">{name}</div>' +
                        '<div><i>{group_name}</i></div>' +
                        '<div class="column-text">{short_description}</div>' +
                    '</div>'
                ],
                minHeight : 0,
                autoHeight : true
            },
            {
                itemId : 'descriptionPanel',
                title : 'Полное описание',
                ui : 'in-form',
                iconCls : 'icon-file-desc',
                minHeight : 80,
                margin : '5 0 0 0',
                tpl : [
                    '<div class="x-panel-template-body">{description:this.format}</div>',
                    {
                        format : function(v){
                            return (v.length) ? v : '--';
                        }
                    }
                ]
            },
            {
                xtype: "ImagesEditorPanel",
                title : 'Изображения',
                itemId: "imagesPanel",
                iconCls : 'icon-file-image',
                uploadUrl : Settings.urls.getUrl('catalog.materials.upload_image'),
                previewUrl : Settings.urls.getUrl('catalog.materials.preview_image'),
                itemWidth : 200,
                itemHeight : 200,
                fullSizeView : true,
                ui: "in-form",
                margin : '5 0 0 0',
                autoHeight: true,
                minHeight : 100,
                readOnly : true
            },
            {
                xtype : 'CatalogMaterialFilesGridPanel',
                itemId : 'filesGrid',
                title : 'Материалы',
                iconCls : 'icon-file',
                ui : 'in-form',
                margin : '5 0 0 0',
                autoHeight: true,
                minHeight : 80
            },
            {
                xtype : 'CatalogMaterialVideosGridPanel',
                itemId : 'videosGrid',
                title : 'Видео',
                iconCls : 'icon-file-video',
                ui : 'in-form',
                margin : '5 0 5 0',
                autoHeight: true,
                minHeight : 80
            }
        ];   
    }
});