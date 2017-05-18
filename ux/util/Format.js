Ext.define('App.ux.util.Format', {
    statics : {
        PropertyToLabel : function(v) {
            v = v.replace("_", " ");
            return Ext.String.capitalize(v); 
        },
        
        priceRenderer : function(currency_row_name, emptyVal) {
            return function(v, meta, rec) {
                if ((Ext.isEmpty(v) || ! v) && Ext.isEmpty(emptyVal) == false) {
                    return emptyVal;
                }
                return App.ux.util.Format.price(v, rec, currency_row_name);
            }
        },
        
        price : function(v, rec, currency_row_name) {
            currency_row_name =  currency_row_name || 'currency';
            if (Ext.isEmpty(v) == false) {
                v = App.ux.util.Format.formatPrice(v, rec.get(currency_row_name));
            }
            return v;
        },
        
        formatPrice : function(price, currency) {
            price = Ext.util.Format.number(price, "0,0.00");
            if (Ext.isEmpty(currency) == false) {
                if (currency == 'USD') {
                    price = "$ " + price;
                } else if (currency == 'EUR'){
                    price = "€ " + price;
                } else {
                    price += (" " + currency);
                }
            }
            return price;
        },
        
        percent : function(v, div_price, rec) {
            per = 0;
            if (Ext.isEmpty(v)) {
                v = 0;
            } else if(Ext.isEmpty(div_price) == false && div_price > 0) {
                per = v/div_price*100;
                per = Ext.util.Format.round(per, 2);
            }  
            return App.ux.util.Format.price(v, rec) + " " + (per ? ("<span class='x-cell-green'>(" + per + "%)</span>") : "");
        },
        
        stringToBoolean: function(string){
            switch(string.toLowerCase()){
                case "true": case "yes": case "1": return true;
                case "false": case "no": case "0": case null: return false;
                default: return Boolean(string);
            }
        },
        
        storeColumnRenderer : function(st, fn, grid) {            
            return function(v, metaData, record) {
                if (! st.getCount() && ! st.isLoading() && Ext.isEmpty(st.loaded)) {
                    st.load({
                        callback : function() {
                            if (Ext.isEmpty(grid) == false) {
                                grid.getView().refresh();   
                            }   
                        }
                    });
                    st.loaded = true;
                    return v;
                } else {
                    var rec = st.getById(v);
                    if (fn) {
                        return fn(rec);
                    }
                    if (Ext.isEmpty(rec) == false) {
                        return rec.get('name');
                    }
                    return null;  
                }
            }
        },

        upgradeRenderer : function(formatType) {
        
            return function(v, meta, rec) {
                if (Ext.isEmpty(v) == false) {
                    meta.style = "white-space: normal;";
                }
                
                res = v;
                if (Ext.isObject(v) && Ext.Object.getSize(v)) {
                    
                    if (Ext.isEmpty(formatType) == false) {
                        if (formatType == 'price') {
                            v.old_val = App.ux.util.Format.price(v.old_val, rec);
                            v.new_val = App.ux.util.Format.price(v.new_val, rec);
                        } else if (formatType == 'date') {
                            v.old_val = (Ext.isEmpty(Ext.Date.parse(v.old_val, "Y-m-d")) == false) ? Ext.util.Format.date(v.old_val, 'd.m.Y') : v.old_val;
                            v.new_val = (Ext.isEmpty(Ext.Date.parse(v.new_val, "Y-m-d")) == false) ? Ext.util.Format.date(v.new_val, 'd.m.Y') : v.new_val; 
                        }                    
                    }
    
                    res = (Ext.isEmpty(v.old_val) == false) ? '<div class="cell-old-val">' + v.old_val + '</div>' : '';
                    res += (Ext.isEmpty(v.new_val) == false) ? '<div class="cell-new-val">' + v.new_val + '</div>' : '';
                } else {
                    if (Ext.isEmpty(formatType) == false) {
                        if (formatType == 'price') {
                            res = App.ux.util.Format.price(res, rec);
                        } else if (formatType == 'date') {
                            res = Ext.util.Format.date(v, 'd.m.Y');   
                        }     
                    }
                    
                }
                return res;
            }
        },
        
        date : function(v, outFormat, inFormat) {
            inFormat = Ext.valueFrom(inFormat, 'Y-m-d H:i:s');
            outFormat = Ext.valueFrom(outFormat, 'd.m.Y H:i'); 

            return Ext.Date.format(Ext.Date.parse(v, inFormat), outFormat);
        },
        
        convertDataToArray : function(data) {
            arr = [];
            if (data.length > 0) {
                for (i in data) {
                    arr.push(data[i].getData());
                }
                return arr;
            }
            return [];
        },
        
        convertRecordsToIdsArray : function(records) {
            var arr = [];
            if (Ext.isEmpty(records) == false && records.length > 0) {
                for (i in records) {
                    arr.push(records[i].getId());
                }
                return arr;
            }
            return [];           
        },
        
        convertDataToString : function(data, field) {
            var arr = [];
            if (Ext.isEmpty(data) == false && data.length > 0) {
                for (i in data) {
                    arr.push(data[i].get(field));
                }
                return Ext.Array.unique(arr).join(",");
            }        
        }
        
    }
});