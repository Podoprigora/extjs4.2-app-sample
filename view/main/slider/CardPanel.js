Ext.define("App.view.main.slider.CardPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.MainSliderPanel",
    
    layout : {
        type : 'card'
    },
    cardSwitchAnimation: 'fade',
    activeItem : 0,
    buttonAlign : 'center',
    height : 280,
    cls : 'slider-panel',
    
    initComponent : function(){
        this.callParent(arguments);
    },
    
    initTimer : function(){
        var fbar = this.getDockedItems('toolbar[dock="bottom"]')[0];
        
        Ext.defer(function(){
            Ext.TaskManager.start({
                scope : this,
                interval : 10000,
                run : function(){
                    var activeItem = this.getLayout().getActiveItem(),
                        index = this.items.indexOf(activeItem);
                    
                    if (index == this.items.length-1) {
                        index = 0;    
                    } else {
                        index++;
                    }
                    this.switchItem(index);
                    fbar.down(Ext.String.format('button[itemIndex={0}]', index)).toggle(true); 
                }
            });
        }, 10000, this);
    },
    
    addItems : function(items) {
        if (items.length) {
            Ext.Array.forEach(items, function(item){
                this.add({
                    xtype : 'MainSliderItemContainer',
                    data : item
                });    
            }, this);
            
            this.addDocked(this.buildFbar(items.length));
            this.initTimer();
        }
    },
    
    buildFbar : function(itemsQty){
        var items = [];
        
        items.push({ xtype : 'tbspacer', flex : 1 });
        
        for (var i=0; i<itemsQty; i++){
            items.push({itemIndex: i, pressed : (i==0)});
        }
        
        items.push({ xtype : 'tbspacer', flex : 1 });
        
        return {
            xtype : 'toolbar',
            dock : 'bottom',
            layout : 'hbox',
            defaults : {
                enableToggle : true,
                toggleGroup : 'sliderBtns',
                ui : 'plain',
                iconCls : 'icon-card-item',
                listeners : {
                    scope : this,
                    click : this.onBtnClick
                }
            },
            items : items
        };
    },
    
    onBtnClick : function(btn) {
        if(! btn.pressed){
            btn.toggle(true);
        } else {
            this.switchItem(btn.itemIndex); 
        }
    },
    
    switchItem : function(index){
        var layout = this.getLayout(),
            activePanel = layout.getActiveItem(),
            newPanel = this.getComponent(index);
        
        activePanel.getEl().fadeOut({
            opacity: 0.6, 
            duration: 250,
            callback: function() {
                layout.setActiveItem(newPanel);
                newPanel.getEl().dom.style.opacity = 0.6;
                newPanel.getEl().fadeIn({duration: 250});
            }
        });    
    }
});