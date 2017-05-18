Ext.define("App.view.operations.directories.materials.ImportEditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.DirectoryMaterialsImportEditorWindow",
    id : 'DirectoryMaterialsImportEditorWindow',
    
    title : 'Импорт материалов',
    width : 400,
    height : 475,
    
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
                    value : 1,
                    minValue : 1
                },
                {
                    xtype : 'fieldset',
                    title : 'Задайте соответствие столбцов в файле',
                    margin : '10 0 10 0',
                    defaults : {
                        xtype : 'textfield',
                        emptyText : 'A-Z',
                        maskRe : /[A-Z]{1}/,
                        maxLength : 1,
                        labelWidth : 160,
                        width : 220
                    },
                    items : [
                        {
                            fieldLabel : 'Код',
                            name : 'columns[code]',
                            allowBlank : false
                        },
                        {
                            fieldLabel : 'Наименование',
                            name : 'columns[name]'
                        },
                        {
                            fieldLabel : 'Цена',
                            name : 'columns[price]'
                        },
                        {
                            fieldLabel : 'Кол-во в упаковке:',
                            name : 'columns[amount_in_packaging]'
                        },
                        {
                            fieldLabel : 'Длинна упаковки:',
                            name : 'columns[package_length]'
                        },
                        {
                            fieldLabel : 'Ширина упаковки:',
                            name : 'columns[package_width]'
                        },
                        {
                            fieldLabel : 'Высота упаковки',
                            name : 'columns[package_height]'
                        },
                        {
                            fieldLabel : 'Вес упаковки',
                            name : 'columns[package_weight]'
                        },
                        {
                            fieldLabel : 'Кол-во коробов  в одной стопке',
                            name : 'columns[number_of_boxes_in_stack]'
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