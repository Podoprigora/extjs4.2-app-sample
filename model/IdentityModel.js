Ext.define('App.model.IdentityModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'region_id', type : 'int'},
        {name : 'current_warehouse_id', type : 'int'},
        {name : 'role', type : 'string'},
        {name : 'role_group', type : 'string'},
        {name : 'first_name', type : 'string'},
        {name : 'last_name', type : 'string'},
        {name : 'patronymic', type : 'string'},
        {name : 'fio', type : 'string', persist : false, convert : function(v, record){
            var fn = record.get('first_name').substr(0, 1) + ".",
                pn = record.get('patronymic').substr(0, 1) + ".";
            return [record.get('last_name'), fn].join(" ");
        }},
        {name : 'fio_full', type : 'string', persist : false, convert : function(v, record){
            return [record.get('last_name'), record.get('first_name'), record.get('patronymic')].join(" ");
        }},
        {name : 'access'},
        {name : 'role_modules'},
        {name : 'area_codes'},
        {name : 'region_cover_image'}
    ],
    
    isActiveMenu : function(name) {
        var modules = this.get('role_modules');
        if (modules.length) {
            for (var i in modules) {
                if (modules[i].name == name) {
                    return (modules[i].active_menu == 1); 
                }
            }
        }
        return false;
    },
    
    hasPermit : function(name, access){
        var modules = this.get('role_modules');
        if (modules.length) {
            for (var i in modules) {
                if (modules[i].name == name) {
                    return (modules[i].access == access); 
                }
            }
        }
        return (access == 'deny') ? true : false;
    },
    
    isAllowed : function(module) {
        return this.hasPermit(module, 'deny') == false;   
    },
    
    isDeny : function(module) {
        return this.hasPermit(module, 'deny');   
    },
    
    isPerformer : function() {
        return (this.get('role_group') == 'PR');
    },

    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('identity.read')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});