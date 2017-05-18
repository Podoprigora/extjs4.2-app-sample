Ext.define('App.model.plan.ShopModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields: [
        {name : "id", type : "int"},
        {name : 'area_code_id', type : 'int'},
        {name : 'area_code', type : 'string'},
        {name : 'code', type : 'string'},
        {name : 'region_id', type : 'int', useNull : true},
        {name : "name", type : "string"},
        {name : "address", type : "string"},
        {name: "start_time", type: "date", dateFormat: "H:i:s"},
        {name: "end_time", type: "date", dateFormat: "H:i:s"},
        {name: "comment", type: "string"},
        {name: "updated", type: "date", dateFormat: "Y-m-d H:i:s"},
        {name: "planogram_id", type: "int", persist: false},
        {name: "planogram_name", type: "string", persist: false},
        {name: "report_date", type: "date", dateFormat : 'Y-m-d H:i:s'},
        {name : 'report_comment', type : 'string'},
        {name: "planograms", type: "auto"},
        {name: "reports", type: "auto"},
        {name: "images", type: "auto"},
        {name: "work_time", type: "string", persist: false,
            convert: function (v, record) {
                return Ext.String.format("{0} - {1}", Ext.util.Format.date(record.get("start_time"), "H:i"), Ext.util.Format.date(record.get("end_time"), "H:i"));
            }
        },
        {name : 'is_disabled', type : 'int',
            convert : function(v) {
                return typeof v === 'boolean' ? (v === true ? 1 : 0) : v;
            }
        },
        {name : 'is_disabled_check_balance', type : 'int',
            convert : function(v) {
                return typeof v === 'boolean' ? (v === true ? 1 : 0) : v;
            }
        },
        {name : 'activated', type : 'date', dateFormat : 'Y-m-d H:i:s'},
        {name : 'last_equipment_response', type : 'date', dateFormat : 'Y-m-d H:i:s'},
        {name : 'send_activation_sms', persist : false},
        {name : 'is_low_balance', type : 'int', persist : false},
        {name : 'is_power_off', type : 'int', persist : false},
        {name : 'is_last_equipment_response_alert', type : 'int', persist : false},
        
        {name : 'phone', type : 'string'},
        {name : 'password', type : 'string'},
        {name : 'equipment_service_phone', type : 'string', defaultValue : '+79295854045'},
        {name : 'equipment_type', type : 'int', defaultValue : 1},
        {name : 'equipment_mode', type : 'int'},
        {name : 'equipment_report_periods', type : 'int'},
        {name : 'equipment_host', type : 'string', defaultValue : 'posm.space'},
        {name : 'equipment_gate', type : 'string', defaultValue : '/oosapi'},
        {name : 'equipment_gprs_username', type : 'string', defaultValue : 'gdata'},
        {name : 'equipment_gprs_pass', type : 'string', defaultValue : 'gdata'},
        {name : 'equipment_apn', type : 'string', defaultValue : 'internet'},
        {name : 'equipment_mtu', type : 'string', defaultValue : '1492'},
        {name : 'script_id', type : 'int', useNull : true},
        {name : 'script_name', type : 'string', persist : false}
        
    ],
    
    hasMany: [
        {
            model: "App.model.plan.ShopPlanogramModel",
            name: "getPlanograms",
            associationKey: "planograms"
        },
        {
            model : 'App.model.plan.ShopReportModel',
            name : 'getReports',
            associationKey : 'reports'
        },
        {
            model : 'App.model.files.ImageModel',
            associationKey : 'images',
            name : 'getImages'
        }
    ],
    
    proxy: {
        type: "ajax",
        api: {
            read: Settings.urls.getUrl("plan.shops.read"),
            create: Settings.urls.getUrl("plan.shops.save"),
            update: Settings.urls.getUrl("plan.shops.save"),
            destroy: Settings.urls.getUrl("plan.shops.destroy")
        },
        reader: {
            type: "json"
        },
        writer: {
            type: "json"
        }
    }
    
});