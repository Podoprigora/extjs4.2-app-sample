Ext.define("App.view.main.slider.ItemContainer", {
    extend : "Ext.container.Container",
    alias : "widget.MainSliderItemContainer",
    
    /*data : {
        text : 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает мешает композиции читаемый текст',
        title : 'Текст сообщения',
        image : 'http://iposm.localhost.dev/upload_files/test/slider.png'
    },*/
    
    initComponent : function(){
        
        this.tpl = this.buildTpl();
        
        this.callParent(arguments);
    },
    
    buildTpl : function(){
        return [
            '<div class="slide-item">',
                '<div class="text">{text}</div>',
                '<img src="{image_path}">',
            '</div>'
        ];
    }
});