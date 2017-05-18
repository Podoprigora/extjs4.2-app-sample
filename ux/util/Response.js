Ext.define('App.ux.util.Response', {
    statics : {
        
        validateStatus : function(conn, response, options, eOpts) {
            var response = Ext.decode(response.responseText, true);
            if (Ext.isEmpty(response) == false &&
                Ext.isEmpty(response.status) == false) {
                
                var errorLabel = "";
                if (response.status == 400) {
                    errorLabel = "Некорректный запрос:";
                } else if (response.status == 401) {
                    errorLabel = "Неавторизованный доступ!";
                } else if (response.status == 403) {
                    errorLabel = "Доступ запрещен!";
                } else if (response.status == 404) {
                    errorLabel = "Данные не найдены!";
                } else if (response.status == 500) {
                    errorLabel = "Внутренняя ошибка сервера!";
                } else if (response.status == 600) {
                    window.location.href = "";
                    return false;
                }
                  
                if (response.status != 200) {
                    var msg = Ext.String.format("<b>{0}</b><p>{1}</p>", errorLabel, (Ext.isEmpty(response.message) == false ? response.message : ""));
                    
                    if (Ext.isEmpty(response.errors) == false && Ext.Object.getSize(response.errors)) {
                        msg += "<ul>";
                        for (field in response.errors) {
                            if (Ext.isEmpty(response.errors[field])) {
                                msg += "<li>" + field + "</li>"; 
                            } else {
                                msg += "<li>" + field + ": " + response.errors[field] + "</li>";     
                            }
                        }
                        msg += "</ul>";
                    }
                    App.ux.Msg.alert(msg);
                } 
            }  
        },
        
        isValidStatus : function(response) {
            var response = Ext.decode(response.responseText, true);
            return (response.status == 200) ? true : false;
        }
    }
});