
Ext.define('App.ux.util.Form', {
    statics : {
        
        setResponseErrors : function(form, operation) {
            var basicForm = form.getForm(),
                response = operation.request.scope.reader;
            form.el.unmask();

            if(Ext.isEmpty(response.jsonData) == false) {
                basicForm.markInvalid(response.jsonData['errors']);
            }    
        },
        
        comboRenderer : function(combo, rendererFn){
            var fn = rendererFn;
            return function(value, p, records){
                var record = combo.findRecord(combo.valueField, value);
                var v = record ? record.get(combo.displayField) : value;
                if (Ext.isDefined(fn))
                    return fn(v, p, records);
                else
                    return v;       
            };
        },
        
        setComboValue : function(combobox, val) {
            var store = combobox.store;
            if((! store.isLoaded || combobox.refreshIfUpdate) && combobox.queryMode == 'remote') {
                store.load(function () {
                    store.isLoaded = true;
                    combobox.setValue(val);
                }); 
            } else {
                combobox.setValue(val);   
            }
        }
        
    }
});
