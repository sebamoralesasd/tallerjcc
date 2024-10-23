var CRC32 = (function ()
{
    var instance;

    function init() {


        // Private methods and variables
        function crc32_generate(polynomial) {
            var table = new Array()
            var i, j, n

            for (i = 0; i < 256; i++) {
                n = i
                for (j = 8; j > 0; j--) {
                    if ((n & 1) == 1) {
                        n = (n >>> 1) ^ polynomial
                    } else {
                        n = n >>> 1
                    }
                }
                table[i] = n
            }

            return table
        }

        function crc32_initial() {
            return 0xFFFFFFFF
        }

        function crc32_final(crc) {
            crc = ~crc
            return crc < 0 ? 0xFFFFFFFF + crc + 1 : crc
        }

        function crc32_compute_string(polynomial, str) {
            var crc = 0
            var table = crc32_generate(polynomial)
            var i

            crc = crc32_initial()

            for (i = 0; i < str.length; i++)
                crc = (crc >>> 8) ^ table[str.charCodeAt(i) ^ (crc & 0x000000FF)]

            crc = crc32_final(crc)
            return crc
        }

        function crc32_compute_buffer(polynomial, data) {
            var crc = 0
            var dataView = new DataView(data)
            var table = crc32_generate(polynomial)
            var i

            crc = crc32_initial()

            for (i = 0; i < dataView.byteLength; i++)
                crc = (crc >>> 8) ^ table[dataView.getUint8(i) ^ (crc & 0x000000FF)]

            crc = crc32_final(crc)
            return crc
        }

        //añado unas funcioncitas que hacen falta al prototype
        String.prototype.repeat = function(times) {
           return (new Array(times + 1)).join(this);
        }
        Number.prototype.toHex = function(len) {
            if (typeof(len) === 'undefined') len = 8;
            var num = this < 0 ? (0xFFFFFFFF + this + 1) : this
            var hex = num.toString(16).toUpperCase()
            var pad = hex.length < len ? len - hex.length : 0
            return "0".repeat(pad) + hex;
        }


        return {

            // Public methods and variables
            encode: function(data)
            {
                var polynomial = 'EDB88320';

                return crc32_compute_string(parseInt(polynomial, 16), data).toHex();
            }
        };
    };



    return {

        getInstance: function () {

          if ( !instance ) {
            instance = init();
          }

          return instance;
        }

    };

})();
