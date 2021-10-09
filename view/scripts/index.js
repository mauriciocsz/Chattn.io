//Placeholder login function
function postLogin(){

    let user = $('#username').val()
    let pwd = $('#pass').val()

    $.ajax({
        url:"/login",
        type:"post",
        data:{
            nome: user,
            senha: pwd
        },
        success:function(result){
            window.location.href = "/chat";
        },error:()=>{
            $("#card").css("padding-top","2%")
            $("#failure").css("display","block");
        }
    })
}

function logout(){
    $.ajax({
        url:"/logout",
        dataType:"json",
        type:"post"
    })
}

function register(){
    let username = $("#username").val()
    let password = $("#pass").val()
    let passwordCheck = $("#passCheck").val()
    $("#success").css("display","none");
    $("#failure").css("display","none");

    $("#card").css("padding-top","5%")
    
    // Only proceeds if all requirements are met
    if(username!="" && password!="" && passwordCheck!="" && password==passwordCheck){
        $.ajax({
            url:"/register",
            type:"post",
            data:{
                nome: username,
                senha: password
            },
            success:() =>{
                $("#card").css("padding-top","2%")
                $("#success").css("display","block");
            },
            error:()=>{
                $("#card").css("padding-top","2%")
                $("#failure").css("display","block");
            }
        })
    }else{
        $("#card").css("padding-top","2%")
        $("#failure").css("display","block");
    }
}

function switchLogin(){
    $("#title").text("Entrar")
    $("#actionButton").text("Entrar")
    
    $("#actionButton").attr("onclick","postLogin()")
    $("#confirmPass").css("display","none")
    $("#switch").css("display", "none")

}