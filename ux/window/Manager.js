Ext.define('App.ux.window.Manager', {
    statics : {
        create : function(id) {
            var win = Ext.WindowManager.get(id);
            
            if (Ext.isDefined(win) && win.isVisible() && !win.staticMode)  {
                win.hide();
                win.destroy();
                win = Ext.widget(id);
            } else if (! win) {
                win = Ext.widget(id);
            }
            return win;
        }
    }
});