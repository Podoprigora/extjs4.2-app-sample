
Ext.define('App.ux.form.Panel', {
    extend : 'Ext.form.Panel',
    alias : 'widget.uxFormPanel',
    
    requires : [
        'App.ux.form.FieldContainer',
        'App.ux.form.field.Trigger',
        'App.ux.form.field.Search',
        'App.ux.form.field.Combo',
        'App.ux.form.field.ColorField'
    ],
    
    border : true,
    autoScroll : false,
    bodyCls : 'x-form-plain-body',
    useMask : true,
    tmpBtnAction : null,
    standartSubmit : false,
    
    initComponent : function() {
        
        this.callParent(arguments);
        
        this.addEvents('formSaved', 'saveOnly', 'save', 'saveAndClose', 'saveAndCreate', 'itemsSaved');
    },
    
    
    onSubmit : function(config) {
        var form = this.getForm();
        var url  = config.url;
        var loadingText = (Ext.isEmpty(config.loadingText) == false) ? config.loadingText : 'Сохранение ...';
        
        if (! Ext.isDefined(url)) {
            alert('Не задан URL!');
            return false;  
        } 
        
        if (form.isValid()) {
            if (this.useMask == true)
                this.el.mask(loadingText);
            if (this.standartSubmit) {
                form.submit({
                    url : url,
                    scope : this,
                    success: function(form, action) {
                        var response = action.result;
                        this.onSuccessTrueOrFalse(response);
                    },
                    failure : this.onFailure 
                });
            } else {
                
                var params = form.getFieldValues();
                if (Ext.isEmpty(config.baseParams) == false) {
                    params = Ext.apply(params, config.baseParams);
                }
                
                Ext.Ajax.request({
                    url : url,
                    params : params,
                    scope : this,
                    success : function(response){
                        var response = Ext.decode(response.responseText);
                        this.onSuccessTrueOrFalse(response);
                        if (response.success == true && Ext.isEmpty(config.success) == false)
                           config.success(response);
                    },
                    failure : this.onFailure 
                });
            }
        } 
    },
    
    onLoad : function(config) {
        var form = this.getForm();
        var url  = config.url;
        var params = config.params;
        
        if (! Ext.isDefined(url)) {
            alert('Не задан URL!');
            return false;  
        } 
        if (this.useMask == true)
            this.el.mask('Загрузка ...');

        form.load({
            url : url,
            params : params,
            scope : this,
            success : function(form, action){                
                var response = action.result;
                this.el.unmask();
                App.ux.Util.isValidResponse(response);
                if (response.success == true) {
                    if (Ext.isFunction(config.success)) {
                        config.success(response);
                    }
                } else {
                    if (response.msg.length)
                        App.ux.Msg.alert(response.msg);
                }
            },
            failure : this.onFailure
        }, this)
    },
    
    onSuccessTrueOrFalse : function(response) {
        this.el.unmask();
        App.ux.Util.isValidResponse(response);
        if (response.success == true) {
            if (Ext.isEmpty(response.data) == false) {
                this.getForm().setValues(response.data);
            }
            this.fireEvent('formSaved', this, response);
        } else {
            if (response.errors) {
                this.focus();
                this.getForm().markInvalid(response.errors);
            }
            if (response.msg.length)
                App.ux.Msg.alert(response.msg);
        } 
    },
    
    onFailure : function(form, action){                
        var response = action.result;
        App.ux.Util.isValidResponse(response);
    }
    
});