Ext.define('App.ux.form.plugins.PreserveScrollPosition', {
    extend: 'Ext.AbstractPlugin',
    alias : 'plugin.preservescroll',
    
    scrollPosition : 0,

    init : function(form){
        form.on('afterrender', this.onAfterRender, form);
    },
    
    onAfterRender : function() {
        this.getTargetEl().on('scroll', function(e, t){
            if (t.scrollTop > 0) {
                this.scrollPreservedPos = t.scrollTop;
            } else if (this.scrollPreservedPos - t.scrollTop > 120) {
                if (Ext.isIE8m) {
                    Ext.defer(function(){
                        this.getTargetEl().scroll('top', this.scrollPreservedPos, false);
                    }, 50, this);
                } else {
                    this.getTargetEl().scroll('top', this.scrollPreservedPos, false);   
                } 
            }
        }, this);
    }
    
});