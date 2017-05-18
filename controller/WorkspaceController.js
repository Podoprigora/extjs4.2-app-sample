Ext.define('App.controller.WorkspaceController', {
    extend : 'Ext.app.Controller',
    
    views : [
        'workspace.ContentPanel'   
    ],
    
    refs : [
        {
            selector : 'WorkspaceContentPanel',
            ref : 'ContentPanel'
        }
    ],
    
    init : function() {
        this.control({
            'WorkspaceContentPanel' : {
                afterrender : this.onInitContentPanel,
                logoutbtnclick : this.onLogout
            }
        });
    },

    onInitContentPanel : function(panel) {
        this.initProperties();
        this.initDefaultModule(panel);
    },
    
    initDefaultModule : function(panel) {
        var mainMenu = panel.down('#mainMenu');
            pressedBtn = mainMenu.down("button[pressed=true]");
        if (Ext.isEmpty(pressedBtn) == false) {
            panel.down('#mainCardPanel').onSwitchPanel(pressedBtn.moduleXType);
        }
    },
    
    initProperties : function(){
         var bodyWidth = Ext.getBody().getViewSize().width,
            minWidth = bodyWidth > 1100 ? 950 : 850;
        
        App.Properties.set('minViewWidth', minWidth);
        
        if ('localStorage' in window){
            localStorage.setItem('region-cover-image', App.Identity.getRecord().get('region_cover_image'));
        }
    },
    
    onLogout : function() {
        
        App.ux.Msg.confirm("Вы действительно хотите выйти из системы?", function(btn){
            if (btn == 'yes'){
                App.ux.Msg.wait('Выход из системы ...');
                Ext.Ajax.request({
                    url : Settings.urls.getUrl('account.logout'),
                    success : function(response) {
                        if (App.ux.util.Response.isValidStatus(response)) {
                            window.location.href = "";    
                        }      
                    }
                });    
            }
        });
    }
    
});