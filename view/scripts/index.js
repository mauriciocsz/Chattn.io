
//Creates a new message in the chat
function newMsg(user, msg){
    let type=""
    switch(user){
        case 0:
            type="messageServer"
            break;
        case 1:
            type="messageClient"
            break;
        default:
            return;
    }
    var text = $("<div class='"+type+"'><div>");
    var lbl = $("<label class='lblText'></label>");
    lbl.text(msg)
    text.append(lbl);

    $(".messagesDiv").append(text);
}

//Placeholder login function
function postLogin(){
    $.ajax({
        url:"/login",
        dataType:"json",
        type:"post",
        data:{
            nome: "nome",
            senha: "senha"
        },
        success:function(result){

        },
        complete:function(result){
            console.log(result)
        }
    })
}
