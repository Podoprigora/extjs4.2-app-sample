Ext.define('App.ux.form.field.ColorField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.uxColorField',    
    requires: ['Ext.form.field.VTypes', 'Ext.layout.component.field.Text'],

    lengthText: "Значение должно быть 3 или 6 символов",
    blankText: "",
    
    regex: /^[0-9a-f]{3,6}$/i,
    
    validateValue : function(value){
        if(!this.getEl()) {
            return true;
        }
        if(value.length!=3 && value.length!=6) {
            this.markInvalid(Ext.String.format(this.lengthText, value));
            return false;
        }
        
        if((value.length < 1 && !this.allowBlank) || !this.regex.test(value)) {
            this.markInvalid(Ext.String.format(this.blankText, value));
            return false;
        }
        
        this.markInvalid();
        this.setColor(value);
        return true;
    },

    markInvalid : function( msg ) {
        App.ux.form.field.ColorField.superclass.markInvalid.call(this, msg);
        this.inputEl.setStyle({
            'background-image': 'url(resources/images/grid/invalid_line.gif)'
        });
    },
    
    setValue : function(hex){
        App.ux.form.field.ColorField.superclass.setValue.call(this, hex);
        this.setColor(hex);
    },
    
    setColor : function(hex) {
        App.ux.form.field.ColorField.superclass.setFieldStyle.call(this, {
            'background-color': '#' + hex,
            'background-image': 'none'
        });
    },
    
    reset : function() {
        this.setValue('');
        this.setColor('FFF');
        this.clearInvalid();
    },

    menuListeners : {
        select: function(m, d){
            this.setValue(d);
        },
        show : function(){
            this.onFocus();
        },
        hide : function(){
            this.focus();
            var ml = this.menuListeners;
            this.menu.un("select", ml.select,  this);
            this.menu.un("show", ml.show,  this);
            this.menu.un("hide", ml.hide,  this);
        }
    },
    
    onTriggerClick : function(e){
        if(this.disabled){
            return;
        }
        
        this.menu = new Ext.menu.ColorPicker({
            shadow: true,
            autoShow : true,
            colors : ['efa093', 'ffd6a2', 'fce8b3', '89d3b2', 'a0eac9', 'a4c2f4', 'd0bcf1', 'fbc8d9',
                      'e66550', 'ffbc6b', 'fcda83', '44b984', '68dfa9', '6d9eeb', 'b694e8', 'f7a7c0',
                      'cc3a21', 'eaa041', 'f2c960', '149e60', '3dc789', '3c78d8', '8e63ce', 'e07798',
                      'ac2b16', 'cf8933', 'd5ae49', '0b804b', '2a9c68', '285bac', '653e9b', 'b65775',
                      '822111', 'a46a21', 'aa8831', '076239', '1a764d', '1c4587', '41236d', '83334c']
        });
        this.menu.alignTo(this.inputEl, 'tl-bl?');
        this.menu.doLayout();
        
        this.menu.on(Ext.apply({}, this.menuListeners, {
            scope:this
        }));
        
        this.menu.show(this.inputEl);
    }
});