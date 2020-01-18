$(() => {
    socket.on('addUser', user => {
        adduser(user, true);
    });
    socket.on('deleteUser', id => {
        deleteuser(id, true);
    });
    $(window).resize(function () {
        $('#result-list').width($('#user-search').width());
    });
    $('#result-list').width($('#user-search').width());
    $('.nav-item').click(async function () {
        try {
            $('.nav-item').removeClass('active');
            $(this).addClass('active');
        }
        catch (err) { console.log(err); }
    });

    $('.add-group>.btn').click(() => {
        if ($('.add-group>.btn').hasClass('clicked')) {
            $('.add-group>input').hide();
            $('.add-group>.btn').attr('class', 'btn btn-info clicked');
            $('.add-group').submit();
        } else {
            $('.add-group>input').show().focus().blur(() => {
                setTimeout(() => {
                    $('.add-group>input').hide();
                    $('.add-group>.btn').attr('class', 'btn btn-info clicked');
                    $('.add-group>.btn').toggleClass('clicked');
                }, 200);
            });
            $('.add-group>.btn').attr('class', 'btn btn-success');
        }
        $('.add-group>.btn').toggleClass('clicked');
    });
    $('#user-search').on('keyup', () => {

        var val = $('#user-search').val().toLowerCase();
        if (val == "") {
            $("#result-list").hide();
            $("#user-list").hide();
            $("#group-list").hide();
            $("#user-list").find("tbody").empty();
            $("#group-list").find("tbody").empty();
            $('#users').find('.list-item').show();
        }
        else {
            var found = false;
            $('#users').find('.list-item').each((index, value) => {
                var form = $(value).find('p');
                if ($(form).text().toLowerCase().startsWith(val)) {
                    $(value).show();
                    found = true;
                }
                else {
                    $(value).hide();
                }
            }
            );
            if (!found) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", `/search/?keyword=${val}`);
                xhr.onload = () => {
                    $("#user-list").find("tbody").empty();
                    $("#group-list").find("tbody").empty();
                    var results = JSON.parse(xhr.responseText);
                    $("#result-list").show();
                    if (results.users.length > 0) {
                        results.users.sort();
                        results.users.forEach(result => {
                            var list = $("#user-list").find("tbody");
                            var item = $(
                                `<tr>
                            <td>${result.firstname}</td>
                            <td>${result.lastname}</td>
                            <td>${result.position}</td>
                            </tr>`
                            ).appendTo(list);
                            $(item).click(() => {
                                adduser(result, false);
                            });
                        });
                        $("#user-list").show();
                    }
                    else {
                        $("#user-list").hide();
                    }
                    if (results.groups.length > 0) {
                        results.groups.forEach(result => {
                            var list = $("#group-list").find("tbody");
                            var item = $(
                                `<tr>
                            <td>${result.name}</td>
                            <td></td>
                            <td></td>
                            </tr>`
                            ).appendTo(list);
                            $(item).click(() => {
                                for (user of result.user) {
                                    adduser(user, false);
                                }
                            });
                        });
                        $("#group-list").show();
                        $('#user-list').css('border-radius', "0")
                    }
                    else {
                        $('#user-list').css('border-radius', "20px")
                        $("#group-list").hide();
                    }
                };
                xhr.send();
            }
        }

    });
    $('#group-search').keyup(() => {
        var val = $('#group-search').val().toLowerCase();
        if (val == "") {
            $('.list-group').find('.list-item').show();
        }
        else {
            $('.list-group').find('.list-item').each((index, value) => {
                var form = $(value).find('a');
                if ($(form).text().toLowerCase().startsWith(val)) {
                    $(value).show();
                }
                else {
                    $(value).hide();
                }
            });
        }
    });
}
)

function deleteGroup(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", `/group/${id}`);
    xhr.onload = () => {
        window.location = "/group_editor";
    };
    xhr.send();
}

function adduser(user, io) {
    var users = [];
    $("#result-list").hide();
    $("#user-search").val("");
    $('#users').find('.list-item').show();
    $('.user-item').each((index, value) => {
        users.push($(value).attr("data-id"));
    });
    if (!users.includes(user._id)) {
        $(`<div class="flip-in-hor-bottom list-item list-group-item list-group-item-hover user-item" data-id="${user._id}" >
       <div class="cropper">
       <img src="${user.image}" alt="">
       </div>
       <p>${user.firstname} ${user.lastname}</p>
       <button class="btn btn-danger" onclick="deleteuser('${user._id}',false)"><i class="fa fa-trash"aria-hidden="true"></i></button>
       </div>`).appendTo('#users');
        var action = $('.add-user').attr('action');
        action += 'type=add';
        if (!io) {
            var formData = new FormData();
            formData.append("id", user._id);
            var xhr = new XMLHttpRequest()
            xhr.open("POST", action);
            xhr.onload = () => {
                socket.emit('addUser', user);
                var msg = new message(`${user.firstname} ${user.lastname} ถูกเพิ่มเข้ากลุ่มแล้ว`, "success");
                msg = $(msg.create()).appendTo('.messages');
                setTimeout(() => {
                    $(msg).remove();
                }, 2000);
            };
            xhr.send(formData);
        }
        else {
            var msg = new message(`${user.firstname} ${user.lastname} ถูกเพิ่มเข้ากลุ่มแล้ว`, "success");
            msg = $(msg.create()).appendTo('.messages');
            setTimeout(() => {
                $(msg).remove();
            }, 2000);
        }
    }
    else {
        var msg = new message(`${user.firstname} ${user.lastname} อยู่ในกลุ่มอยู่แล้ว`, "warning");
        msg = $(msg.create()).appendTo('.messages');
        setTimeout(() => {
            $(msg).remove();
        }, 2000);
    }
}

function deleteuser(id, io) {
    var name;
    $('.user-item').each((index, value) => {
        if ($(value).attr('data-id') == id) {
            name = $(value).find("p").text();
            $(value).remove();
        }
    });
    if (!io) {
        var formData = new FormData();
        formData.append('id', id);
        var action = $('.add-user').attr('action');
        action += 'type=delete';
        var xhr = new XMLHttpRequest()
        xhr.open("POST", action);
        xhr.onload = () => {
            socket.emit('deleteUser', id);
            var msg = new message(`${name} ถูกลบออกจากกลุ่มแล้ว`, "success");
            msg = $(msg.create()).appendTo('.messages');
            setTimeout(() => {
                $(msg).remove();
            }, 2000);
        };
        xhr.send(formData);
    }
    else {
        var msg = new message(`${name} ถูกลบออกจากกลุ่มแล้ว`, "success");
        msg = $(msg.create()).appendTo('.messages');
        setTimeout(() => {
            $(msg).remove();
        }, 2000);
    }

}

function showqr(name) {
    $('.qr').css('display', 'flex').find('img').attr('src', generateqr(name));
    $('#users').hide();
}

function showeditor() {
    $('.qr').hide();
    $('#users').show();
}
