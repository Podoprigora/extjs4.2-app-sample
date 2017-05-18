Ext.define("App.view.plan.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.PlanContentPanel",
    
    layout : 'fit',
    
    bodyCls : 'x-container-body',
    bodyPadding : 5,
    border : false,
    
    
    initComponent : function(){
        
        this.items = this.buildItems();
        this.lbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents('menubtnclick', 'importmenubtnclick');
    },
    
    buildItems : function() {
        return [
            {
                xtype : 'uxTabPanel'
            }
        ];
    },
    
    buildTbar : function() {
        return {
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            width : 145,
            cls : 'vertical-menu-large',
            padding : 0,
            defaults : {
                scale : 'large',
                iconAlign : 'left'
            },
            items : [
                {
                    xtype : 'label',
                    text : 'Отчеты'
                },
                {
                    text : 'Обзор OOS',
                    iconCls : 'icon24-gray-files',
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'PlanReportLackOfGoodsGridPanel', btn.text, 'icon-files');
                    }
                },
                {
                    text : 'Обзор точек',
                    iconCls : 'icon24-gray-files',
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'PlanReportShopsGridPanel', btn.text, 'icon-files');
                    }
                },
                {
                    text: 'Проблемные <br /> позиции',
                    iconCls : 'icon24-gray-files-alert',
                    cls : 'x-btn-font-size-11-5',
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'PlanReportGoodsViewPanel', 'Проблемные позиции', 'icon-document-thumbnail');    
                    }
                },
                {
                    text : 'Входящие <br /> данные',
                    iconCls : 'icon24-gray-files',
                    cls : 'x-btn-font-size-11-5',
                    hidden : App.Identity.getRecord().hasPermit('oos', 'read'),
                    scope : this,
                    handler : function() {
                        this.fireEvent('menubtnclick', this, 'PlanSmsLogGridPanel', 'Входящие данные', 'icon-files');
                    }
                },
                {
                    text : 'Синхронизация <br /> данных',
                    iconCls : 'icon24-gray-refresh',
                    cls : 'x-btn-font-size-11-5',
                    hidden : App.Identity.getRecord().hasPermit('oos', 'read'),
                    scope : this,
                    handler : function() {
                        this.fireEvent('importmenubtnclick', this);
                    }
                },
                {
                    xtype : 'label',
                    text : 'Справочники',
                    hidden : App.Identity.getRecord().hasPermit('oos', 'read')
                },
                {
                    text : 'Товары',
                    iconCls : 'icon24-gray-list',
                    hidden : App.Identity.getRecord().hasPermit('oos', 'read'),
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'PlanGoodsViewPanel', btn.text, 'icon-app-table');
                    }
                },
                {
                    text : 'Оборудование',
                    iconCls : 'icon24-gray-list',
                    cls : 'x-btn-font-size-11-5',
                    hidden : App.Identity.getRecord().hasPermit('oos', 'read'),
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'PlanEquipmentsGridPanel', btn.text, 'icon-app-table');
                    }
                },
                {
                    text : 'Выкладки',
                    iconCls : 'icon24-gray-list',
                    hidden : App.Identity.getRecord().hasPermit('oos', 'read'),
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'PlanogramsGridPanel', btn.text, 'icon-app-table');
                    }
                },
                {
                    text : 'Скрипты',
                    iconCls : 'icon24-gray-list',
                    hidden : App.Identity.getRecord().hasPermit('oos', 'read'),
                    scope : this,
                    handler : function(btn){
                        this.fireEvent('menubtnclick', this, 'PlanScriptsGridPanel', btn.text, 'icon-app-table');
                    }
                },
                {
                    text : 'Торговые  <br /> точки',
                    itemId : 'btnMenuShops',
                    iconCls : 'icon24-gray-list',
                    hidden : App.Identity.getRecord().hasPermit('oos', 'read'),
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'PlanShopsGridPanel', 'Торговые точки', 'icon-app-table');
                    }
                }
            ]
        };
    }
});