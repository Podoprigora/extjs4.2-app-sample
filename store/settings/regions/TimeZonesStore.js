Ext.define('App.store.settings.regions.TimeZonesStore', {
    extend : 'Ext.data.Store',
    model: "App.model.settings.regions.TimeZoneModel",
    
    data: [
        {
            id: "2",
            name: "Калининградское время (EET, Eastern Europe Time) - UTC+2"
        },
        {
            id: "3",
            name: "Московское время (MSK, Moscow Standard Time) - UTC+3"
        },
        {
            id: "4",
            name: "Самарское время (SAMT, Samara Time) - UTC+4"
        },
        {
            id: "5",
            name: "Екатеринбургское время (YEKT, Yekaterinburg Time) - UTC+5"
        },
        {
            id: "6",
            name: "Омское время (OMST, Omsk Standard Time) - UTC+6"
        },
        {
            id: "7",
            name: "Красноярское время (KRAT, Krasnoyarsk Time) - UTC+7"
        },
        {
            id: "8",
            name: "Иркутское время (IRKT, Irkutsk Time) - UTC+8"
        },
        {
            id: "9",
            name: "Якутское время время (YAKT, Yakutsk Time) - UTC+9"
        },
        {
            id: "10",
            name: "Владивостокское время время (VLAT, Vladivostok Time) - UTC+10"
        },
        {
            id: "11",
            name: "Магаданское время время (MAGT, Magadan Island Time) - UTC+11"
        },
        {
            id: "12",
            name: "Камчатское время время (PETT, Petropavlovsk Time) - UTC+12"
        }
    ],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});