Ext.define("App.view.main.help.PreviewPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.MainHelpPreviewPanel",
    
    overflowX : 'hidden',
    overflowY : 'scroll',
    
    bodyCls : 'x-panel-template-body',
    
    initComponent : function(){
        
        this.tpl = this.buildTpl();
        
        this.callParent(arguments);
    },
    
    buildTpl : function(){
        return [
            '<h3>{title}</h3>',
            '<div class="text-body">{text}</div>'
        ];
    }
});