Ext.define('App.model.settings.users.UserModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields: [
        {
            name: "id",
            type: "int"
        },
        {
            name: "region_id",
            type: "int"
        },
        {
            name: "region",
            type: "string",
            persist : false
        },
        {
            name: "first_name",
            type: "string"
        },
        {
            name: "last_name",
            type: "string"
        },
        {
            name: "patronymic",
            type: "string"
        },
        {
            name: "fio",
            type: "string",
            persist: false,
            convert: function (b, a) {
                return [a.get("last_name"), a.get("first_name"), a.get("patronymic")].join(" ");
            }
        },
        {
            name: "role_id",
            type: "int"
        },
        {
            name: "role",
            type: "string",
            persist : false
        },
        {
            name: "login",
            type: "string"
        },
        {
            name: "password",
            type: "string"
        },
        {
            name: "outer_id",
            type: "string"
        },
        {
            name: "phone1",
            type: "string"
        },
        {
            name: "phone2",
            type: "string"
        },
        {
            name: "phones",
            type: "string",
            persist: false,
            convert: function (b, a) {
                var c = new Array();
                if (Ext.isEmpty(a.get("phone1")) == false) {
                    c.push(a.get("phone1"));
                }
                if (Ext.isEmpty(a.get("phone2")) == false) {
                    c.push(a.get("phone2"));
                }
                return c.join(", ")
            }
        },
        {
            name: "email",
            type: "string"
        },
        {
            name: "pass_code",
            type: "string"
        },
        {
            name: "pass_series",
            type: "string"
        },
        {
            name: "pass_date",
            type: "date",
            dateFormat: "Y-m-d"
        },
        {
            name: "address",
            type: "string"
        },
        {
            name: "login_ip",
            type: "string",
            persist : false
        },
        {
            name: "login_date",
            type: "date",
            dateFormat: "Y-m-d H:i:s",
            persist : false
        },
        {
            name: "is_active",
            type: "int",
            defaultValue: 1
        },
        {
            name : 'access_areas'
        },
        {
            name : 'area_codes'
        }
    ],
    
    /*isRole : function(value) {
        return this.get('role') == value;
    },*/
    
    hasMany : [
        {
            model : 'App.model.settings.users.AccessAreaModel',
            name : 'getAccessAreas',
            associationKey : 'access_areas'
        },
        {
            model : 'App.model.settings.users.AreaCodeModel',
            name : 'getAreaCodes',
            associationKey : 'area_codes'
        }
    ],
    
    proxy: {
        type: "ajax",
        api: {
            create: Settings.urls.getUrl("settings.users.save"),
            read: Settings.urls.getUrl("settings.users.read"),
            update: Settings.urls.getUrl("settings.users.save"),
            destroy: Settings.urls.getUrl("settings.users.destroy")
        },
        reader: {
            type: "json"
        },
        writer: {
            type: "json"
        }
    }
    
});