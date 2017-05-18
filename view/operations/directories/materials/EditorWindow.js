Ext.define("App.view.operations.directories.materials.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.DirectoryMaterialEditorWindow",
    id : 'DirectoryMaterialEditorWindow',
    
    title : 'Добавить материал',
    width : 500,
    height : 410,
    
    initComponent : function(){
        
        this.items = this.buildFormPanel();
        
        this.callParent(arguments);
        
        this.addEvents('savebtnclick');
        
        this.on('beforehide', this.onBeforeHideWindow, this);
        this.on('show', this.onShowWindow, this);
    },
    
    buildFormPanel : function() {
        return [
            {
                xtype : 'form',
                bodyPadding : 15,
                bodyCls : 'x-container-body',
                items : [
                    {
                        xtype : 'textfield',
                        fieldLabel : 'Код',
                        name : 'code',
                        allowBlank : false,
                        width : 250
                    },
                    {
                        xtype : 'textarea',
                        fieldLabel : 'Наименование',
                        name : 'name',
                        allowBlank : false,
                        height : 40,
                        anchor : '100%'
                    },
                    {
                        xtype : 'numberfield',
                        fieldLabel : 'Цена',
                        name : 'price',
                        width : 250
                    },
                    {
                        xtype : 'fieldset',
                        title : 'Характеристики',
                        defaults : {
                            xtype : 'numberfield',
                            width : 300,
                            labelWidth : 200
                        },
                        items : [
                            {
                                fieldLabel : 'Кол-во в упаковке, шт.',
                                name : 'amount_in_packaging'
                            },
                            {
                                fieldLabel : 'Длинна упаковки, мм',
                                name : 'package_length'
                            },
                            {
                                fieldLabel : 'Ширина упаковки, мм',
                                name : 'package_width'
                            },
                            {
                                fieldLabel : 'Высота упаковки, мм',
                                name : 'package_height'
                            },
                            {
                                fieldLabel : 'Вес упаковки, кг',
                                name : 'package_weight'
                            },
                            {
                                fieldLabel : 'Кол-во коробов  в одной стопке',
                                name : 'number_of_boxes_in_stack'
                            }
                        ]
                    }
                ],
                buttons : [
                    {
                        text : 'Сохранить и создать',
                        iconCls : 'icon-save',
                        scope : this,
                        handler : function() {
                            this.fireEvent('savebtnclick', this);
                        }
                    },
                    {
                        text : 'Сохранить и закрыть',
                        iconCls : 'icon-save-close',
                        scope : this,
                        handler : function() {
                            this.fireEvent('savebtnclick', this, 'close');
                        }
                    },
                    {
                        text : 'Отмена',
                        scope : this,
                        handler : this.onCancelBtnClick
                    }
                ]
            }
        ];
    },
    
    onCancelBtnClick : function() {
        this.hide();   
    },
    
    onBeforeHideWindow : function(win) {
        win.down('form').getForm().reset();
    },
    
    onShowWindow : function(win) {
        win.down('form').getForm().findField('code').focus(false, 200);   
    }
});