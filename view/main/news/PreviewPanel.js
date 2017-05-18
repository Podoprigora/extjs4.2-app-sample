Ext.define("App.view.main.news.PreviewPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.MainNewsPreviewPanel",
    
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
            '<span class="properties">{[ Ext.util.Format.date(values.date, "d.m.Y") ]}</span>',
            '<br />',
            '<div class="text-body">{text}</div>'
        ];
    }
});