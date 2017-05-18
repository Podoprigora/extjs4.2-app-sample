Ext.define("App.view.plan.shops.report.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.PlanShopReportGridPanel",
    
    disableSelection : true,
    readOnly : false,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.plan.ShopReportsLocalStore');
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        
        if (this.readOnly == false) {
            this.tbar = this.buildTbar();
            this.cls += " x-no-dirty";
        }
        
        this.callParent(arguments);
        
        this.addEvents('addbtnclick', 'editbtnclick', 'deletebtnclick');
    },
    
    afterRender : function() {
        this.callParent(arguments);
        
        this.getEl().on('click', function(e, t){
            var el = Ext.fly(t),
                record = this.getStore().findRecord('id', el.dom.attributes.parentid.value);
            
            if (record) {   
                window.open(Settings.urls.getUrl('plan.shops.preview_image') + "?image=" + el.dom.attributes.image.value);
            }
            
        }, this, {delegate : 'div.thumb-wrap'});
    },
    
    buildFeatures : function() {
        return [
            {
                ftype  : 'rowbody',
                getAdditionalData : function(data, rowIndex, record) {
                    var colspan = this.view.headerCt.getColumnCount(),
                        imagesData = record.get('images'),
                        commentStr = record.get('comment').replace(/[\n\t]g/, "<br />"),
                        imagesStr = "";

                    if (imagesData.length) {
                        var imagesTpl = new Ext.XTemplate(
                            '<div class="x-view-images">',
                                '<tpl for=".">',
                                    '<div class="thumb-wrap" image="{image}" parentid="{[this.getParentId()]}" style="width:80px; height:100px;" title="Открыть">',
                                        '<div class="thumb-cell">',
                                            '<img src={[this.getImagePath(values.image)]}>',
                                        "</div>", 
                                    "</div>", 
                                "</tpl>",
                            '</div>',
                            {
                                getParentId : function() {
                                    return record.get('id');
                                },
                                getImagePath : function(image) {
                                    return Ext.String.format("{0}?image={1}&w=80&h=100",Settings.urls.getUrl('plan.shops.preview_image'), image); 
                                }
                            }
                        ); 
                        
                        imagesStr = imagesTpl.apply(imagesData);  
                    }

                    return {
                        rowBody : commentStr + imagesStr,
                        rowBodyCls : 'x-grid-rowbody-text',
                        rowBodyColspan : colspan
                    };
                
                }
            },
            {
                ftype  :'rowwrap'
            }
        ];
    },
    
    buildColumns : function() {
        return [
            {
                xtype: "actioncolumn",
                width: 30,
                align: "center",
                hidden : this.readOnly,
                items: [
                    {
                        iconCls: "icon-delete",
                        tooltip: "Удалить",
                        scope: this,
                        handler: this.onDeleteItemBtnClick
                    }
                ]
            },
            {
                xtype: "actioncolumn",
                width: 30,
                align: "center",
                hidden : this.readOnly,
                items: [
                    {
                        iconCls: "icon-edit",
                        tooltip: "Изменить",
                        scope: this,
                        handler: this.onEditItemBtnClick
                    }
                ]
            },
            {
                header : 'Дата',
                dataIndex : 'created',
                align : 'center',
                width : 120,
                tdCls : 'x-cell-root',
                renderer : Ext.util.Format.dateRenderer('d.m.Y')
            },
            {
                header : 'Пользователь',
                dataIndex : 'user',
                tdCls : 'x-cell-root',
                flex : 1
            }
        ];
    },
    
    buildTbar : function() {
        return [
            {
                text : 'Добавить отчет',
                iconCls : 'icon-create',
                scope : this,
                handler : function() {
                    this.fireEvent('addbtnclick', this);
                }
            }
        ];
    },
    
    onEditItemBtnClick : function(view, rowIndex, colIndex, item, e, record) {
        this.fireEvent("edititembtnclick", this, record);
    },
    
    onDeleteItemBtnClick: function (view, rowIndex, colIndex, item, e, record) {
        this.fireEvent("deleteitembtnclick", this, record);
    }
    
});