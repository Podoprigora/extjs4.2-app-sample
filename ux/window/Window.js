
Ext.define('App.ux.window.Window', {
    extend : 'Ext.window.Window',
    
    shadow : 'frame',
    shadowOffset : Ext.isIE8m ? 5 : 15,
    modal : true,
    
    constrain : true,
    resizable : true,
    maximizable : true,
    closeAction : 'hide',
    layout : 'fit',
    staticMode : false,
    //plain : true,
    border : false,
    focusOnToFront : true,
    
    config : {
        ownerPanel : null,
        masterGrid : null,
        masterTree : null,
        extraParams : null
    },
    
    initComponent : function() {     
        if (this.xitems) {
            this.addListener('show', this.addContent);
        }

        this.callParent(arguments);
        
        this.addEvents('contentrendered');
    },
    
    addContent : function() {
        if (! this.items.getCount()) {
            this.addCls('win-items-hidden');
            Ext.Function.defer(function(){
                this.add(this.xitems);
                this.removeCls('win-items-hidden');
                this.fireEvent('contentrendered', this);    
            }, 50, this);
        } else {
            this.fireEvent('contentrendered', this); 
        }
    },
    
    snapCenter : function() {
        if (Ext.isDefined(this.t_width) && Ext.isDefined(this.t_height)) {
            win_w = this.t_width,
            win_h = this.t_height;
            
            var bodyWidth = Ext.getBody().getWidth(true);
            var bodyHeight = Ext.getBody().getHeight(true);
    
            this.setWidth(win_w);
            this.setHeight(win_h)
            this.setPosition(((bodyWidth - win_w) / 2), ((bodyHeight - win_h) / 2));
        }   
    },
    
    snapRight : function(parentWin, autoWidth) {
        
        var bodyWidth = Ext.getBody().getWidth(true);
            bodyHeight = Ext.getBody().getHeight(true),
            xPos = 0;
        
        if (Ext.isEmpty(autoWidth) == false && autoWidth == true) {
            this.setWidth(bodyWidth/2);    
        } 
            
        this.setPosition(bodyWidth - this.getWidth(), 0);
        this.setHeight(bodyHeight);
        
        if (Ext.isEmpty(parentWin) == false) {
            var win = Ext.WindowManager.get(parentWin),
                curPos = win.getPosition(),
                sumWindowsWidth = parseFloat(this.getWidth()) + parseFloat(win.getWidth());
            if (sumWindowsWidth <= bodyWidth)
                xPos = bodyWidth - sumWindowsWidth;
            win.setPosition(xPos, curPos[2]);   
        }  
    },
    
    snapPanel : function(panel) {
        var size = panel.getSize(),
            pos = panel.getPosition(true);
        this.setHeight(size.height);
        this.setWidth(size.width);
        this.setPosition(panel.el.getXY());
    }
    
});


