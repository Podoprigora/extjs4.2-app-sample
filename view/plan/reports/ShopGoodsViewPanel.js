Ext.define("App.view.plan.reports.ShopGoodsViewPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.PlanReportShopGoodsViewPanel",
    
    mixins : {
        basePanel : 'App.view.plan.planograms.EquipmentEditorViewPanel'
    },
    
    trackOver: false,
    overItemCls: null,
    selectedItemCls: null,
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.PlanogramGoodsLocalStore");
        this.equipmentRecord = Ext.create('App.model.plan.PlanogramEquipmentModel');
        
        this.callParent(arguments);
        
        this.addEvents('selectreportdate', 'reloadbtnclick', 'showshopbtnclick');
        
        this.on('show', this.mixins.basePanel.showAdTitle, this, {single : true});
    },
    
    buildTpl: function () {
        return [
            '<div class="x-ad-wrap">ВСТАВКА</div>',
            '<tpl for=".">', 
                '<tpl if="xindex === 1">', 
                    ' <div class="x-row"> ', 
                "</tpl>", 
                '<div class="x-column <tpl if=\"pusher == -1\">x-column-ad</tpl>','<tpl if="minutes === 0">'," x-column-disabled","<tpl else>"," x-column-red","</tpl>", '">', 
                '<div class="x-column-wrap-fixed">', 
                    '<tpl if="pusher != -1">',
                        '<div class="label-top" data-qtip="PUSH #{[this.indexRenderer(values.pusher)]}">#{[this.indexRenderer(values.pusher)]} ', 
                        '<tpl if="minutes &gt; 0">', 
                            '<div class="label-top-counter">{[this.formatMinutes(values.minutes)]}</div>', 
                        "</tpl>", 
                        "</div>", 
                        '<img src="{goods_image}" data-qtip="{goods_name}">',
                    '</tpl>', 
                "</div>", 
                "</div>", 
                '<tpl if="xindex % this.columnsLength === 0">', 
                    " </div> ", 
                "</tpl>", 
                '<tpl if="xindex % this.columnsLength === 0 && xindex <= xcount">', 
                    ' <div class="x-row"> ', 
                "</tpl>", 
            "</tpl>", 
            '<div class="x-clear"></div>', {
            formatMinutes: function (value) {
                return value ? value : ""
            }
        }];
    },
    
    buildTbar: function () {
        return [
            {
                xtype: "datefield",
                itemId: "dateFilterField",
                fieldLabel: "Дата отчета",
                labelAlign: "right",
                width: 200,
                labelWidth: 80,
                allowBlank: false,
                format: "d.m.Y",
                padding: 2,
                listeners: {
                    scope: this,
                    select: function (field, record) {
                        this.fireEvent("selectreportdate", this, record);
                    }
                }
            },
            
            {
                xtype : 'hidden',
                itemId: "labelLackMinutes"
            },
            
            {
                xtype: "textfield",
                itemId: "labelLackCounts",
                fieldLabel: "Кол-во отсутствуещего товара",
                labelAlign: "right",
                fieldBodyCls: "x-form-field-bold",
                readOnly: true,
                labelWidth: 190,
                width: 250
            },
            {
                tooltip : 'Обновить',
                iconCls : 'icon-refresh',
                margin : '0 0 0 10',
                scope : this,
                handler : function(){
                    this.fireEvent('reloadbtnclick', this);
                }
            },
            {
                text : 'Данные торговой точки',
                iconCls : 'icon-view',
                margin : '0 0 0 10',
                scope : this,
                handler : function(){
                    this.fireEvent('showshopbtnclick', this);
                }
            }
            
        ];
    }
    
});