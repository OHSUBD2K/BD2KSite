var fs = function ($){
    var loc = 'module_size.php';
    var localVar;
    var methods = {
            'init': function (localVar){
                $.ajax({
                            url: loc,
                            type: "GET",
                            dataType: "JSON",
                            success: function (data) {
                                localVar = data;
                                console.log(localVar);
                            }
                })
            },
            'set_Loc':function (newPlace){
                loc=newPlace;
            }
                    
        };
        
    return {
        init:function (){
            methods.init(localVar);
        },
        setLocation:function(place){
            methods.set_Loc(place);
        },
        getData:function(){
            return localVar;
        }
        
    };
}
