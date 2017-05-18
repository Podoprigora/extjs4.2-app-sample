Ext.define("App.view.bids.comments.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.BidCommentsContentPanel",
    
    layout : 'border',
    
    border : false,
    defaults : {
        border : false
    },
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.addEvents('sendbtnclick');
    },
    
    buildItems : function() {
        return [
            {
                region : 'center',
                layout : 'card',
                defaults : {
                    border : false
                },
                activeItem : 0,
                items : [
                    {
                        xtype : 'BidCommentsGridPanel',
                        listeners : {
                            scope : this,
                            loadrecords : function(grid) {
                                var total = grid.getStore().getTotalCount();
                                this.setTitle("Сообщения " + ((total > 0) ? ("(" + total + ")") : ""));
                            }
                        }
                    }
                ]
            },
            {   
                region : 'north',
                xtype  :'form',
                itemId : 'addCommentForm',
                bodyCls : 'x-container-body',
                split : true,
                height : 80,
                bodyPadding : '5 5 0 5',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype  : 'textarea',
                        name : 'message',
                        emptyText : 'Введите текст сообщения',
                        allowBlank : false,
                        msgTarget : 'under',
                        flex : 1
                    },
                    {
                        xtype  :'button',
                        //scale : 'large',
                        //cls : 'x-btn-stretch',
                        //iconCls : 'icon32-comment',
                        text : 'Отправить',
                        width : 80,
                        margin : '0 0 0 5',
                        scope : this,
                        handler : function() {
                            this.fireEvent('sendbtnclick', this);
                        }
                    }
                ]
            }
        ];
    }
});