/*
message.js jQuery/Twitter Bootstrap notification/error message plugin

Creates a simple Boostrap alert displaying notifications and messages in any 
element you designate.  

This plugin was designed for use with jQuery 1.7.2 and Twitter Bootstrap 2.0.4
Author: Zach Nietling 6/2012, you may use this plugin however you wish.
message@zacharynietling.com

Simplest implementation:
$('html').message('First Name may not contain less than 4 characters!');

This will cause an alert to slide down from the nav bar containing the message text
Note that in this implementation, the plugin captures the "html" selector and attaches 
the message to the first container div after the nav bar. If you aren't using the
nav bar/container setup, simply specify the proper element in place of "html" or change 
the default in the plugin on line 69.

Specific element implementation:
$('.login-form').message('First Name may not contain less than 4 characters!');

Array of messages:
$('.login-form').message({
error_content: ['First Name may not contain less than 4 characters!', 'First Name may only contain alpha-numeric characters!']
});

All options w/ descriptions
$('.login-form').message({
error_content: ['First Name may not contain less than 4 characters!', 'First Name may only contain alpha-numeric characters!'], //Content, may be a string or an array for multiple errors
error_type: ['info', 'error'], //Bootstrap alert type, changes color. Default is "error" (red), options are "info", "warning", "error" and "success". May be a string or an array for multiple errors. If error_content has more values than error_type, the last color specified is kept.
error_duration: 2000, //Delay until message self-dismisses. Set to 0 or don't include at all to have messages never self-dismiss.
error_window_type: 'main', //Specifies width of alert, options are "main" (600 pixels of width), "modal" (400 pixels of width), or any number. Default is "main" 
error_displacement: 1, //Specifies if message should move content below it, or overlap. Default is overlap (1). 
error_title: ['Error!'] //Places a bold title in the message on its own line. May be a string or an array for multiple errors. If error_content has more values than error_title, the last title is kept for extra messages. 
});
*/
(function( $ ) {
    
    $.fn.message = function(options){
        
            //for each function
        if (!Array.prototype.forEach)
        {
          Array.prototype.forEach = function(data /*, thisp*/)
          {
            var len = this.length;
            if (typeof data != "function")
              throw new TypeError();
        
            var thisp = arguments[1];
            for (var i = 0; i < len; i++)
            {
              if (i in this)
                data.call(thisp, this[i], i, this);
            }
          };
        }
        
        if (options == "hide")
        {
            $(this).find('.message_error_container').hide("slide", {
                direction: "up"
            }, 500);
        }else{
            
            
            var parameter_error = {};
            if($(this).is('html'))
            {
                var window_width = $('body').children(".container").width();
            }else{
                var window_width = $(this).width();
                
            }
            //content
            if(typeof options === "string")
            {
                var error_content = options;
            }else{
                if(typeof options.error_content === "undefined")
                {
                    parameter_error = "Message content can not be empty.";
                }else{
                    var error_content = options.error_content;
                }
            }//type
            if(typeof options.error_type === "undefined")
            {
                var error_type = 'error';
            }else if(typeof options.error_type === "string"){
                if (options.error_type == 'error' || options.error_type == 'info' || options.error_type == 'warning' || options.error_type == 'success')
                {
                    var error_type = options.error_type;
                }else{
                    parameter_error = "Invalid message type. See Documentation.";
                }
            }else{
                var error_type = options.error_type;
            }
            //duration
            if(typeof options.error_duration === "undefined")
            {
                var error_duration = 0;
            }else if(!isNaN(parseFloat(options.error_duration)) && isFinite(options.error_duration)){
                var error_duration = parseInt(options.error_duration);
            }else{
                parameter_error = "Invalid message duration. See Documentation.";
            }//window type
            if(typeof options.error_window_type === "undefined")
            {
                var error_window_type = 'main';
            }else{
                var error_window_type = options.error_window_type;
            }
            if (error_window_type == 'main')
            {
                error_window_type = 600;
            }else if(error_window_type == 'modal'){
                error_window_type = 400;
            }
            if(!isNaN(parseFloat(error_window_type)) && isFinite(error_window_type))
            {
                //good to go
            }else{
                parameter_error = "Invalid message window size. See Documentation.";
            }//displacement  
            if(typeof options.error_displacement === "undefined" || options.error_displacement != 0)
            {
                var error_displacement = 1;
            }else{
                var error_displacement = options.error_displacement; 
            }//title
            if(typeof options.error_title === "undefined")
            {
                var error_title = "";
            }else{
                var error_title = options.error_title;
                
            }
            if (typeof parameter_error[0] !== 'undefined' && parameter_error[0] !== null)
            {
                error_content = parameter_error;
            }
                //done with validation of parameters CHECK ERROR ARRAY
                
                //insert container div, append to body
                var div = $("<div class='message_error_container' style='display:block'>").html('&nbsp');
                $("body").append(div);
                
                var message_error_container_margin = (window_width - error_window_type) - 10;
                if(message_error_container_margin < 0)
                {
                    message_error_container_margin = 0;
                }
                
                var id_row = 0;
                
                if(typeof error_content === 'string' || typeof error_content[1] === 'undefined')
                {
                    if (typeof error_content !== 'string')
                    {
                        var error_content = error_content[0];
                    }
                    if(typeof error_type !== 'string')
                    {
                        var error_type = error_type[0];
                    }   
                    if(typeof error_title !== 'string')
                    {
                        var error_title = error_title[0];
                    }    
                    var html_content = '\
                        <div class="message_error" id="message_error_0" style="position: absolute;">\
                            <div class="alert alert-'+ error_type +'" style="margin-bottom: 0;">\
                                <a href="#" class="close">&times</a>';
                    if(typeof error_title !== "undefined") //bit of a redundant check, left the other one up top for other types of validation as need be
                    {
                        html_content += '\
                                    <h4 class="alert-heading">'+ error_title +'</h4>\
                                        ';
                    }    
                    html_content += '\
                                '+ error_content +'\
                            </div>\
                        </div>';   
                    id_row++;
                    
                    $('body').on('click', '.close', function(event){
                        event.stopPropagation();
                        event.preventDefault();
                        $(this).parent().parent().parent().hide("slide", {
                            direction: "up"
                        }, 500);
                        return false;
                    });
                    
                }else{
                    var html_content = "";
                    function html_generate(value, index, array)
                    {
                        html_content += '\
                            <div class="message_error" id="message_error_'+ id_row +'" style="position: absolute;">';

                        if(typeof error_type === 'string') //check for array of types
                        {
                            html_content += '\
                                <div class="alert alert-'+ error_type +'" style="margin-bottom: 0;">\
                                    <a href="#" class="close">&times</a>\
                                            ';
                        }else if(typeof error_type === 'object' && typeof error_type[id_row] !== "undefined" && error_type[id_row] != " "  && error_type[id_row] !== null){
                            html_content += '\
                                <div class="alert alert-'+ error_type[id_row] +'" style="margin-bottom: 0;">\
                                    <a href="#" class="close">&times</a>\
                                            ';
                            
                        }else{
                            var new_row = parseInt(id_row) - 1;
                            error_type = error_type[new_row];
                            html_content += '\
                                <div class="alert alert-'+ error_type +'" style="margin-bottom: 0;">\
                                    <a href="#" class="close">&times</a>\
                                            ';
                        }
                        if(typeof error_title === 'string') //check for array of titles
                        {
                            html_content += '\
                                        <h4 class="alert-heading">'+ error_title +'</h4>\
                                            ';
                        }else if(typeof error_title === 'object' && typeof error_title[id_row] !== "undefined" && error_title[id_row] != " "  && error_title[id_row] !== null){
                            html_content += '\
                                        <h4 class="alert-heading">'+ error_title[id_row] +'</h4>\
                                            ';                            
                        }else{
                            var last_row = parseInt(id_row) - 1;
                            error_title = error_title[last_row];
                            html_content += '\
                                        <h4 class="alert-heading">'+ error_title +'</h4>\
                                            ';
                        }
                        html_content += '\
                                    '+ value +'\
                                </div>\
                            </div>';
                        id_row++;
                    }
                    error_content.forEach(html_generate);
                    
                    $('body').on('click', '.close', function(event){
                        event.stopPropagation();
                        var current_elem = $(this).parent().parent().attr("id");
                        current_elem = current_elem.substr(current_elem.indexOf("ror_") + 4);
                        if (current_elem == (id_row - 1))
                        {
                            $(this).parent().parent().parent().hide("slide", {
                                direction: "up"
                            }, 500);
                        }
                        current_elem = 'message_error_' + (parseInt(current_elem) + 1);
                        $(this).parent().parent().hide("slide", {
                            direction: "up"
                        }, 500);
                        $("#" +current_elem+ "").show("slide", {
                            direction: "down"
                        }, 500);
                        var error_window_height = $("#" +current_elem+ "").height();
                        div.css("height", error_window_height);
                        return false;
                    });
                    
                }
                
                div.html(html_content);
                div.hide();
                div.children('div[id^="message_error_"]').hide();
                div.css("width", error_window_type);
                div.children('div[id^="message_error_"]').css("width", error_window_type);
                div.children('div[id^="message_error_"]').css("margin-bottom", "3px");
                
                if (error_displacement == 1)
                {  
                    div.css({'z-index': '50', 'position': 'absolute', 'margin-top':'3px'});
                    div.css("margin-left", message_error_container_margin + "px");
                }else{
                    div.css({'background': 'white', 'padding-top': '3px', 'padding-bottom': '3px'});
                    div.css("padding-left", message_error_container_margin + "px");
                }
        
                if($(this).is('html'))
                {
                    target = $('.navbar').parent().children('.container').children('.row').children(':first-child');
                    target.prepend(div);
                }else{
                    $(this).prepend(div);
                    
                }
                
                div.show();
                div.children('#message_error_0').show("slide", {
                    direction: "up"
                }, 500);
                var error_window_height = div.children('#message_error_0').height();
                div.css("height", error_window_height);
                
                var x_interval = -1;
                
                if(error_duration > 0)
                {
                    shift_message();
                }
                
                function shift_message()
                {
                    var x_button = 'message_error_' + x_interval;
                    
                    div.children('#' +x_button).children().children('.close').click();
                    x_interval++;
                    if (x_interval < id_row) {
                        setTimeout(shift_message, error_duration);
                    }else{
                        div.hide("slide", {
                            direction: "up"
                        }, 500);
                    }
                }            
            
            
        }    
    }
    
})( jQuery );