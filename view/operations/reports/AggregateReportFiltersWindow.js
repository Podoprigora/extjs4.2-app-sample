Ext.define("App.view.operations.reports.AggregateReportFiltersWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.OperationAggregateReportFiltersWindow",
    id : 'OperationAggregateReportFiltersWindow',
    
    title : 'Агрегированный отчет',
    width : 350,
    height : 445,
    
    initComponent : function(){
        
        this.items = this.buildForm();
        
        this.callParent(arguments);
        
        this.on('show', this.onShowWindow, this);
        this.on('hide', this.onHideWindow, this);
    },
    
    buildForm : function() {
        return {
            xtype  :'form',
            bodyPadding : 15,
            bodyCls : 'x-container-body',
            defaults : {
                anchor : '100%'
            },
            items : [
                {
                    xtype : 'fieldcontainer',
                    fieldLabel : 'Период',
                    labelAlign : 'top',
                    layout : 'hbox',
                    defaults : {
                        flex : 1,
                        allowBlank : false
                    },
                    items : [
                        {
                            xtype : 'datefield',
                            name : 'begin_date',
                            emptyText : 'c'
                        },
                        {
                            xtype : 'datefield',
                            name : 'end_date',
                            emptyText : 'по',
                            margin : '0 0 0 5'
                        }
                    ]
                },
                {
                    xtype : 'LocationsFilterPanel',
                    bodyPadding : '10 0 0 0',
                    margin : 0
                },
                {
                    xtype : 'uxFilterField',
                    name : 'code',
                    fieldLabel : 'Код',
                    emptyText : 'Введите код материала',
                    labelAlign : 'top',
                    editable : true
                },
                {
                    xtype : 'uxFilterField',
                    name : 'batch',
                    fieldLabel : 'Партия',
                    emptyText : 'Введите код партии',
                    labelAlign : 'top',
                    editable : true,
                    multiSelect : true,
                    enableReset : true
                },
                {
                    xtype : 'uxFilterField',
                    name : 'material_name',
                    fieldLabel : 'Наименование',
                    emptyText : 'Введите наименование товара',
                    labelAlign : 'top',
                    editable : true
                }
            ],
            buttons : [
                {
                    text : 'Выгрузить',
                    iconCls : 'icon-table-export',
                    scope : this,
                    handler : function() {
                        this.fireEvent('makebtnclick', this);   
                    }
                },
                { 
                    text : 'Отмена',
                    scope : this,
                    handler : function() {
                        this.hide();
                    }
                }
            ]
        };
    },
    
    onShowWindow : function() {
        this.down('datefield[name=begin_date]').focus(false, 50);  
    },
    
    onHideWindow : function() {
        this.down('form').getForm().reset();
    }
    
});