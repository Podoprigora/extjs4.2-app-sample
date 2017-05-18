Ext.define("App.view.bids.directories.shops.ImportEditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.BidsDirectoryShopsImportEditorWindow",
    id : 'BidsDirectoryShopsImportEditorWindow',
    
    title : 'Импорт торговых точек',
    width : 400,
    height : 455,
    
    initComponent : function(){
        
        this.items = this.buildForm();
        
        this.callParent(arguments);
        
        this.addEvents('importbtnclick');
        
        this.on('beforehide', this.onBeforeHide, this);
    },
    
    buildForm : function() {
        return {
            xtype : 'form',
            bodyPadding : 15,
            defaults : {
                anchor : '100%'
            },
            items : [
                {
                    xtype : 'filefield',
                    fieldLabel : 'Файл',
                    name : 'upload_file',
                    emptyText : 'Выберите файл',
                    allowBlank : false,
                    margin : '0 0 8 0',
                    buttonConfig : {
                        text : 'Выбрать',
                        padding : 2
                    }
                },
                {
                    xtype : 'numberfield',
                    fieldLabel : 'Начальная строка импорта',
                    name : 'start_row_index',
                    labelWidth : 160,
                    width : 220,
                    anchor : false,
                    allowBlank : false,
                    minValue : 1,
                    value : 1
                },
                {
                    xtype : 'fieldset',
                    title : 'Задайте соответствие столбцов в файле',
                    defaults : {
                        xtype : 'textfield',
                        emptyText : 'A-Z',
                        maskRe : /[A-Z]{1}/,
                        maxLength : 1,
                        width : 160
                    },
                    items : [
                        {
                            fieldLabel : 'Код',
                            name : 'columns[code]',
                            allowBlank : false
                        },
                        {
                            fieldLabel : 'Код территории',
                            name : 'columns[area_code]'
                        },
                        {
                            fieldLabel : 'Наименование',
                            name : 'columns[name]'
                        },
                        {
                            fieldLabel : 'Юр. лицо',
                            name : 'columns[legal_name]'
                        },
                        {
                            fieldLabel : 'Город',
                            name : 'columns[city]'
                        },
                        {
                            fieldLabel : 'Адрес',
                            name : 'columns[address1]'
                        },
                        {
                            fieldLabel : 'Адрес 2',
                            name : 'columns[address2]'
                        },
                        {
                            fieldLabel : 'Канал сбыта',
                            name : 'columns[rka]'
                        },
                        {
                            fieldLabel : 'GPS',
                            name : 'columns[gps]'
                        }
                    ]
                    
                }
            ],
            buttons : [
                {
                    text : 'Импорт',
                    iconCls : 'icon-table-import',
                    scope : this,
                    handler : function() {
                        this.fireEvent('importbtnclick', this);
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
    
    onBeforeHide : function(win) {
        win.down('form').getForm().reset();
    }
});