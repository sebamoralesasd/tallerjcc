var TranslateContext = (function ()
{
    var instances = new Array();



    function init(context) {

        // Private methods and variables
        var crc32 = CRC32.getInstance();
        var translations = context;


        //añadimos un 'sprintf' al objeto String
        if (!String.format) {
          String.format = function(format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function(match, number) {
              return typeof args[number] != 'undefined'
                ? args[number]
                : match
              ;
            });
          };
        }


        return {

            // Public methods and variables
            t: function(text)
            {
                var translation = text;

                if(translations[crc32.encode(text)] != undefined)
                {
                    translation = translations[crc32.encode(text)];
                }

                arguments[0] = translation;

                return String.format.apply(this, arguments);
            }
        };
    };



    return {

        getInstance: function (context, contextName) {

            cName = 'commonTexts';
            if(typeof contextName != undefined)
            {
                cName = contextName;
            }

            if( instances[cName] == undefined )
            {
                instances[cName] = init(context);
            }

            return instances[cName];
        }

    };

})();
