Ext.define('App.ux.Util', {
    statics : {
        
        docUrl : function() {
            return document.location.href.replace(/(\/)$/, ""); 
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
        
        isValidAuth : function(response) {
            if (response.success == false && Ext.isEmpty(response.auth) == false && response.auth == false) {
                //window.location.href = App.ux.Util.docUrl();
                App.ux.Msg.alert("Недостаточно прав, для выполнения данного действия!");
                return false;
            }
            return true;
        },
        
        isValidResponse : function(response, need_decode){
            if (Ext.isEmpty(need_decode) || need_decode) {
                var response = Ext.decode(response.responseText);    
            }
            
            if (App.ux.Util.isValidAuth(response)) {
                if (response.success == false) {
                
                    if (response.msg.length > 0) {
                        App.ux.Msg.alert(response.msg); 
                    } 
                    return false;
                }
                return response;
            }
            return false;
            
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
        },
        
        getNodePath : function(node, idField, sep) {
            field = idField || node.idProperty;
            separator = sep || '/';
        
            var path = [node.get(field)],
                parent = node.parentNode;
        
            while (parent && ! parent.isRoot()) {
                path.push(parent.get(field));
                parent = parent.parentNode;
            }
            return path.join(separator);
        },
        
        hoursFormat : function(times, is_decimal) {
            if (Ext.isEmpty(is_decimal) || ! is_decimal) {
                if (times < 0) {
                    hours_decimal = ((24*3600000) + times) / 3600000; 
                } else {
                    hours_decimal = times / 3600000;    
                }
            } else {
                hours_decimal = times;    
            }
            hours = Math.floor(hours_decimal),
            minutes = ((hours_decimal - hours) > 0) ? ((hours_decimal - hours)*60) : "00";
            
            return hours + ":" + minutes;
        }
    }
});
