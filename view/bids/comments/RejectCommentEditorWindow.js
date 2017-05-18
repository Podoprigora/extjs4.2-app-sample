Ext.define("App.view.bids.comments.RejectCommentEditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.BidRejectCommentEditorWindow",
    id : 'BidRejectCommentEditorWindow',
    
    title : 'Отклонить заявку',
    
    width : 600,
    height : 300,
    resizable : true,
    
    config : {
        bidIds : null,
        masterGrid : null
    },
    
    initComponent : function(){
        
        this.items = this.buildItems();
        this.buttons = this.buildButtons();
        
        this.callParent(arguments);
        
        this.addEvents('rejectbtnclick');
        
        this.on('beforehide', this.onBeforeHide, this);
    },
    
    buildItems : function() {
        return [
            {
                xtype : 'form',
                bodyPadding : 15,
                border : true,
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'textarea',
                        name : 'comment',
                        allowBlank : false,
                        emptyText : 'Введите причину оклонения заявки',
                        msgTarget : 'under',
                        flex : 1
                    }
                ]
            }
        ]
    },
    
    buildButtons : function(){
        return [
            {
                text : 'Отклонить заявку',
                iconCls : 'icon-reject',
                scope : this,
                handler : function(){
                    this.fireEvent('rejectbtnclick', this);
                }
            },
            {
                text : 'Отмена',
                scope : this,
                handler : this.onCancelBtnClick
            }
        ];   
    },
    
    onCancelBtnClick : function(){
        this.down('form').getForm().reset();
        this.hide();    
    },
    
    onBeforeHide : function() {
        this.down('form').getForm().reset();    
    }
});