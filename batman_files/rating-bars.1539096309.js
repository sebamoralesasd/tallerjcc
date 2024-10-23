var RatingBars = function(canvas, values)
{
    var canvas = $(canvas)[0];
    var values = values;

    var FPS = 25;
    var originColors = new Array(values.length);
    var finalColors = new Array(values.length);
    var tempWidths = new Array(values.length);
    var tempColors = new Array(values.length);

    var growingSteps = 0;
    var growingTimer = 600;

    var CHANGE_UP = 1;
    var CHANGE_DOWN = 2;
    var colorTimer = 600;
    var colorSteps = Math.round((colorTimer * FPS) / 1000);
    var colorStep = 1;
    var colorInterval = null;


////////////////////////////////////////////////////////////////////////

    generateOriginColors();
    generateFinalColors();

    growingGraph(values, growingTimer);

    $(canvas).mouseenter(function()
    {
        clearInterval(colorInterval);

        changeColors(values, colorTimer, CHANGE_UP);

    }).mouseleave(function()
    {
        clearInterval(colorInterval);

        changeColors(values, colorTimer, CHANGE_DOWN);
    });


////////////////////////////////////////////////////////////////////////

    function generateOriginColors()
    {
        for(var i = originColors.length; i > 0; i--)
        {
            originColors[i-1] = 0x003366;
        }
        tempColors = originColors;
    }


    function generateFinalColors()
    {
        var maxElements = finalColors.length;
        for(var i = finalColors.length; i > 0; i--)
        {
            finalColors[maxElements-i] = getRatingColor(i);
        }
    }




    /* Función que genera el intervalo de la gráfica de cambio colores
     * @values: array con los tamaños totales finales de las barras
     * @timer: tiempo que debe durar la animación
     */
    function changeColors(values, time, type)
    {
        colorInterval = setInterval(function()
        {
            tempColors = calculateColors(colorStep/colorSteps);

            drawBars(tempWidths, tempColors);

            if(type == CHANGE_UP)
            {
                if(colorStep >= colorSteps)
                {
                    clearInterval(colorInterval);
                }
                else
                {
                    colorStep++;
                }
            }
            else
            {
                if(colorStep <= 0)
                {
                    clearInterval(colorInterval);
                }
                else
                {
                    colorStep--;
                }
            }

        }, time / colorSteps);

    }


    /* Función que genera el intervalo de la gráfica de barras crecientes
     * @values: array con los tamaños totales finales de las barras
     * @timer: tiempo que debe durar la animación
     */
    function growingGraph(values, time)
    {
        growingSteps = Math.round((time * FPS)/1000);

        var step = 1;


        var interval = setInterval(function()
        {
            tempWidths = calculateWidths(values, step);

            drawBars(tempWidths, tempColors);

            if(step == growingSteps)
            {
                clearInterval(interval);
            }
            else
            {
                step++;
            }

        }, time / growingSteps);

    }



    /* Función que pinta las gráficas
     * @canvas: elemento canvas sobre el que se quiere pintar.
     * @widths: array con el tamaño de las barras
     * @colors: array con los colores de cada barra
     */
    function drawBars(widths, colors)
    {
        var vCount = widths.length;

        var barHeight = Math.floor((canvas.height - 1) / vCount);

        var ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);


        ctx.font = (barHeight+1) + "px serif";

        var testText = vCount.toString();
        var textWidth = ctx.measureText(testText).width;

        var barWidth = canvas.width - textWidth - 7;

        var padding = 3;

        for(var i = 0; i < vCount; i++)
        {
            ctx.fillStyle = "#111111";
            ctx.textBaseline = "baseline";
            ctx.textAlign = "right";
            ctx.fillText(vCount-i, textWidth, (i + 1) * barHeight - 1);


            var grd = ctx.createLinearGradient(0, 0, Math.floor(widths[i] * barWidth / 100), 0);
            grd.addColorStop(0, "#f8f8f8");
            grd.addColorStop(1, int2color(colors[i]));

            ctx.fillStyle = grd;

            ctx.fillRect(padding + textWidth + .5, i * barHeight + .5, Math.floor(widths[i] * barWidth / 100), barHeight);

            ctx.strokeStyle = int2color(colors[i]);
            ctx.strokeRect(padding + textWidth + .5, i * barHeight + .5, Math.floor(widths[i] * barWidth / 100), barHeight);


        }
    }


    /* Función que calcula los tamaños de las barras en función del momento en el que estemos de la animación
     * @originalValues: array con los tamaños totales finales que tienen las barras
     * @step: paso en el que nos encontramos del crecimiento.
     */
    function calculateWidths(originalValues, step)
    {
        var widths = new Array(originalValues.length);

        for(var i = 0; i < widths.length; i++)
        {
            widths[i] = originalValues[i] * (step/growingSteps);
        }

        return widths;
    }



    function calculateColors(step)
    {
        var colors = new Array(originColors.length);

        for(var i = 0; i < colors.length; i++)
        {
            colors[i] = color2color(step, originColors[i], finalColors[i]);
        }

        return colors;
    }


    function getRatingColor(rating)
    {
        var rating = (rating - 1) / 9;

        cBlue = 0x10;
        cBlue = cBlue;

        cGreen = 0xd0;
        cGreen = cGreen * (rating >= .5 ? 1 : rating * 2);
        cGreen = Math.floor(cGreen);

        cRed = 0xd0;
        cRed = cRed * (rating <= .5 ? 1 : 1 - (rating - .5) * 2);
        cRed = Math.floor(cRed);

        color = cRed * 0x10000 + cGreen * 0x100 + cBlue;

        return color;

    }


    function color2color(pos, color1, color2)
    {
        c1blue = color1 & 0xff;
        c1green = (color1 & 0xff00) / 0x100;
        c1red = (color1 & 0xff0000) / 0x10000;

        c2blue = color2 & 0xff;
        c2green = (color2 & 0xff00) / 0x100;
        c2red = (color2 & 0xff0000) / 0x10000;

        blue = c1blue + Math.floor((c2blue - c1blue) * pos);
        green = c1green + Math.floor((c2green - c1green) * pos);
        red = c1red + Math.floor((c2red - c1red) * pos);

        color = red * 0x10000 + green * 0x100 + blue;

        return color;
    }


    function int2color(intColor)
    {
        color = intColor.toString(16);
        while(color.length < 6)
            color = "0" + color;

        color = "#" + color;

        return color;
    }

////////////////////////////////////////////////////////////////////////

}