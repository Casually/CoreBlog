/*====================================================
  TABLE OF CONTENT
  1. function declearetion
  2. Initialization
====================================================*/

/*===========================
 1. function declearetion
 ==========================*/
window.app = {
  backToTop: function () {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $('#back-to-top').fadeIn();
      } else {
        $('#back-to-top').fadeOut();
      }
    });
    $('#back-to-top').on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({scrollTop: 0}, 1000);
      return false;
    });
  },
  favoriteComment: function () {
    $(".favorite").click(function () {
      var that = $(this);
      var id = $(this).data('id');
      if (is_login == false) {
        return app.loginTips();
      }
      if ($(this).hasClass('favorited')) {
        swal("您已经点赞过了哦");
        return false;
      }
      axios({
        method: 'post',
        url: '/favorites/comment/' + id,
      }).then(function (response) {
        if (response.data.code == 0) {
          $(that).find(".num").html(response.data.count);
          swal("点赞成功", "", "success");
        } else {
          swal(response.data.msg);
        }
      });
    });
  },
  reply: function () {
    $(".reply").click(function () {
      if (is_login == false) {
        return app.loginTips();
      }
      var content = $("#reply_content").val() + '@' + $(this).data('name') + ' ';
      $("#reply_content").val(content).focus();
      $('html,body').animate({scrollTop: $("#reply").offset().top}, 500);
    });
  },
  deleteComment: function () {
    $(".delete").click(function () {
      var id = $(this).data('id');
      if (is_login == false) {
        return app.loginTips();
      }
      swal({
        title: "确定要删除吗?",
        text: "一旦删除无法恢复!",
        icon: "warning",
        buttons: ['取消操作', '确定删除'],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios({
            method: 'delete',
            url: '/comment/' + id,
          }).then(function (response) {
            if (response.data.code == 0) {
              swal(response.data.msg, "", "success").then(() => {
                document.location.reload();
              });
            } else {
              swal(response.data.msg);
            }
          });
        }
      });
    });
  },
  loginTips: function () {
    swal({
      title: "",
      text: "您需要登录以后才能操作！",
      icon: "warning",
      buttons: ["算了", "前往登录"],
      dangerMode: true,
    }).then((choose) => {
      if (choose) {
        location.href = '/login';
      }
    });
    return false;
  },
  subscribe: function () {
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if (reg.test($("#subscribe_email").val())) {
      $.ajax({
        url: '/subscribe',
        type: 'post',
        data: {
          email: $("#subscribe_email").val()
        },
        success: function (data) {
          swal({
            title: "操作成功",
            icon: "success",
            text: data.msg,
            button: "好的",
          });
        },
        error: function () {
          swal({
            title: "操作失败",
            icon: "error",
            text: '服务器出了点故障~',
            button: "好的",
          });
        }
      });

    } else {
      swal({
        title: "提示",
        icon: "error",
        text: "请正确填写您的邮箱地址",
        button: "好的"
      });
    }
    //{{ route('subscribe') }}
  },
  init: function () {
    //设置Jq CSRF令牌
    let token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
      $.ajaxSetup({
        headers: {'X-CSRF-TOKEN': token.content}
      });
    }
    //启用bootstarp冒泡插件
    $('[data-toggle="tooltip"]').tooltip();
    //防止复制
    // document.oncontextmenu = new Function('event.returnValue=false;');
    // document.onselectstart = new Function('event.returnValue=false;');
    app.backToTop();
    app.favoriteComment();
    app.reply();
    app.deleteComment();
  },
};

/*===========================
2. Initialization
==========================*/
$(document).ready(function () {
  app.init();
});