(function($){
  $.fn.extend({
    //初始化
    loadStep: function(params){
      
      //基础框架
      var baseHtml =  "<div class='ystep-container ystep-lg ystep-blue'>"+
                        "<ul class='ystep-container-steps'></ul>"+
                        "<div class='ystep-progress'>"+
                          "<p class='ystep-progress-bar'><span class='ystep-progress-highlight' style='width:0%'></span></p>"+
                        "</div>"+
                       
                      "</div>";
      //步骤框架
      var stepHtml = "<li class='ystep-step ystep-step-undone'></li>";
      var stepButtonHtml = "<div class='step-button'><button type='button' class='btn btn-default prevBtn' id='prevBtn'>上一步</button>"+
                        "<button type='button' class='btn btn-default nextBtn' id='nextBtn'>下一步</button></div>";

      //支持填充多个步骤容器
      $(this).each(function(i,n){
        var $baseHtml = $(baseHtml),
        $stepHtml = $(stepHtml),
        $ystepContainerSteps = $baseHtml.find(".ystep-container-steps"),
        arrayLength = 0,
        $n = $(n),
        i=0;
        
        //步骤
        arrayLength = params.steps.length;
        for(i=0;i<arrayLength;i++){
          var _s = params.steps[i];
          //构造步骤html
          $stepHtml.text(_s);
          //将步骤插入到步骤列表中
          $ystepContainerSteps.append($stepHtml);
          //重置步骤
          $stepHtml = $(stepHtml);
        }

        var $stepButtonHtml = $(stepButtonHtml); 
        $ystepContainerSteps.append($stepButtonHtml);

        //插入到容器中
        $n.append($baseHtml);

        //绑定两个按钮
        $("#prevBtn").click(function(){
          var index = $n.getStep();
          $n.prevStep();
          params.afterChange(index-1,index);
        });

        $("#nextBtn").click(function(){
          var index = $n.getStep();
          if(!params.beforeChange(index,index+1)){
            return;
          }
          $n.nextStep();
          params.afterChange(index+1,index);
        });

        //默认执行第一个步骤
        $n.setStep(1);
      });
    },
    //跳转到指定步骤
    setStep: function(step) {
      $(this).each(function(i,n){
        //获取当前容器下所有的步骤
        var $steps = $(n).find(".ystep-container").find("li");
        var $progress =$(n).find(".ystep-container").find(".ystep-progress-highlight");
        //判断当前步骤是否在范围内
        if(1<=step && step<=$steps.length){
          //更新进度
          var scale = "%";
          scale = Math.round((step-1)*100/($steps.length-1))+scale;
          $progress.animate({
            width: scale
          },{
            speed: 1000,
            done: function() {
              //移动节点
              $steps.each(function(j,m){
                var _$m = $(m);
                var _j = j+1;
                if(_j < step){
                  _$m.attr("class","ystep-step-done");
                }else if(_j === step){
                  _$m.attr("class","ystep-step-active");
                }else if(_j > step){
                  _$m.attr("class","ystep-step-undone");
                }
              });
            }
          });
        }else{
          return false;
        }
      });
    },
    //获取当前步骤
    getStep: function() {
      var result = [];
      
      $(this)._searchStep(function(i,j,n,m){
        result.push(j+1);
      });
      
      if(result.length == 1) {
        return result[0];
      }else{
        return result;
      }
    },
    //下一个步骤
    nextStep: function() {
      $(this)._searchStep(function(i,j,n,m){
        $(n).setStep(j+2);
      });
    },
    //上一个步骤
    prevStep: function() {
      $(this)._searchStep(function(i,j,n,m){
        $(n).setStep(j);
      });
    },
    //通用节点查找
    _searchStep: function (callback) {
      $(this).each(function(i,n){
        var $steps = $(n).find(".ystep-container").find("li");
        $steps.each(function(j,m){
          //判断是否为活动步骤
          if($(m).attr("class") === "ystep-step-active"){
            if(callback){
              callback(i,j,n,m);
            }
            return false;
          }
        });
      });
    }
  });
})(jQuery);