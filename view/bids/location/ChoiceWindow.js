Ext.define("App.view.bids.location.ChoiceWindow", {
    extend : "Ext.window.Window",
    alias : "widget.BidLocationChoiceWindow",
    id : 'BidLocationChoiceWindow',
    
    config : {
        ownerForm : null,
        userId : null,
        coords : ''
    },
    
    title : 'Выбрать местоположение',
   
    shadow : 'frame',
    shadowOffset : 25,
    modal : true,
    resizable : true,
    maximizable : true,
    maximized : true,
    layout : 'fit',
    
    width : 800,
    height : 600,
    
    bodyCls : 'x-container-body',
    bodyPadding : 2,
    
    initComponent : function(){
        
        this.dockedItems = [{
            xtype : 'panel',
            dock : 'top',
            border : false,
            bodyPadding : 5,
            bodyCls : 'x-container-body',
            html : '<p class="x-panel-note">Укажите местоположение кликнув по карте или переместите существующую метку.</p>'
            
        }];
        
        this.buttons = [
            {
                text : '<b>Подтвердить</b>',
                scope : this,
                handler : function(){
                    this.fireEvent('acceptbtnclick', this);
                }
            },
            {
                text : 'Отмена',
                scope : this,
                handler : function() {
                    this.close();
                }
            }
        ];
        
        this.callParent(arguments);
        
        this.addEvents('acceptbtnclick');
        
        this.on('show', this.createMap, this);
    },
    
    createMap : function(){
        this.add({
            xtype : "component",
            autoEl : {
                tag : "iframe",
                frameborder: '0',
                src : Ext.String.format("{0}?user_id={1}&coords='{2}'", Settings.urls.bids.receive_shop_location, this.getUserId(), this.getCoords()) 
            }
        }); 
    }
});